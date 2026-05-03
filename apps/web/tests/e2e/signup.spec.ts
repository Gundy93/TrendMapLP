import { test, expect } from "@playwright/test";
import { cleanupE2ESignups, sb } from "./_lib/db";
import { e2eEmail } from "./_lib/email";

test.describe.configure({ mode: "serial" });

test.beforeAll(cleanupE2ESignups);
test.afterAll(cleanupE2ESignups);

// Hero CTA는 <a> (link role), 신청 폼만 <button> — getByRole("button")이 단일 매치.
const SUBMIT_BUTTON = /사전 신청하기|전송 중/;
const EMAIL_LABEL = "이메일 주소";
const SUCCESS_TEXT = /신청되었습니다/;
const DUPLICATE_TEXT = /이미 등록된 이메일입니다/;

test("빈 입력 → 버튼 비활성", async ({ page }) => {
  await page.goto("/#signup");
  await expect(
    page.getByRole("button", { name: SUBMIT_BUTTON }),
  ).toBeDisabled();
});

test("잘못된 형식 → 버튼 비활성 + 인라인 에러", async ({ page }) => {
  await page.goto("/#signup");
  const input = page.getByLabel(EMAIL_LABEL);
  await input.fill("not-an-email");
  await input.blur();
  await expect(
    page.getByText("올바른 이메일 형식이 아닙니다."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: SUBMIT_BUTTON }),
  ).toBeDisabled();
});

test("정상 이메일 → 성공 메시지 + DB row", async ({ page }) => {
  const email = e2eEmail();
  await page.goto("/#signup");
  // 서버 elapsedMs 가드(>=1500ms) 통과를 결정적으로 보장
  await page.waitForTimeout(1700);

  await page.getByLabel(EMAIL_LABEL).fill(email);
  await page.getByRole("button", { name: SUBMIT_BUTTON }).click();

  await expect(
    page.getByText(SUCCESS_TEXT),
  ).toBeVisible({ timeout: 10_000 });

  const { data, error } = await sb
    .from("signups")
    .select("email")
    .eq("email", email)
    .single();
  expect(error).toBeNull();
  expect(data?.email).toBe(email);
});

test("중복 이메일 → 친절 안내", async ({ page }) => {
  const email = e2eEmail();
  const { error: seedErr } = await sb
    .from("signups")
    .insert({ email, source: "e2e-seed" });
  expect(seedErr).toBeNull();

  await page.goto("/#signup");
  await page.waitForTimeout(1700);

  await page.getByLabel(EMAIL_LABEL).fill(email);
  await page.getByRole("button", { name: SUBMIT_BUTTON }).click();

  await expect(
    page.getByText(DUPLICATE_TEXT),
  ).toBeVisible({ timeout: 10_000 });
});

test("키보드만으로 제출", async ({ page }) => {
  const email = e2eEmail();
  await page.goto("/#signup");
  await page.waitForTimeout(1700);

  await page.getByLabel(EMAIL_LABEL).focus();
  await page.keyboard.type(email);
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: SUBMIT_BUTTON }),
  ).toBeFocused();
  await page.keyboard.press("Enter");

  await expect(
    page.getByText(SUCCESS_TEXT),
  ).toBeVisible({ timeout: 10_000 });
});
