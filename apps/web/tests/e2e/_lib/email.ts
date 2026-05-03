import { randomUUID } from "node:crypto";

export function e2eEmail(): string {
  return `e2e+${randomUUID()}@trendmaplp.test`;
}
