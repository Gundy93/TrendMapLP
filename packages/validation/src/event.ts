import { z } from "zod";
import { deviceTypeSchema, utmSchema } from "./signup";

export const eventTypeSchema = z.enum([
  "page_view",
  "cta_click",
  "form_submit_attempt",
  "form_submit_success",
]);
export type EventType = z.infer<typeof eventTypeSchema>;

export const eventInputSchema = z.object({
  eventType: eventTypeSchema,
  // 미전송 시 서버(/api/event)가 cookie 기반으로 발급/조회하여 채움.
  visitorId: z.string().min(8).max(64).optional(),
  sessionId: z.string().min(8).max(64).optional(),
  referrer: z.string().max(500).optional(),
  utm: utmSchema.optional(),
  deviceType: deviceTypeSchema.optional(),
});
export type EventInput = z.infer<typeof eventInputSchema>;
