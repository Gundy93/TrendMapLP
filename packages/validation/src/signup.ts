import { z } from "zod";

export const deviceTypeSchema = z.enum(["mobile", "tablet", "desktop"]);
export type DeviceType = z.infer<typeof deviceTypeSchema>;

export const utmSchema = z.object({
  source: z.string().max(100).optional(),
  medium: z.string().max(100).optional(),
  campaign: z.string().max(100).optional(),
  content: z.string().max(100).optional(),
});
export type UTM = z.infer<typeof utmSchema>;

export const signupInputSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("올바른 이메일 형식이 아닙니다.")
    .max(254),
  // 봇이 채우면 reject (화면에 안 보이는 honeypot 필드)
  website: z.string().max(0).optional(),
  // 폼 노출 후 경과 ms — 너무 빠른 제출은 봇으로 간주
  elapsedMs: z.coerce.number().int().nonnegative(),
  turnstileToken: z.string().optional(),
  utm: utmSchema.optional(),
});
export type SignupInput = z.infer<typeof signupInputSchema>;
