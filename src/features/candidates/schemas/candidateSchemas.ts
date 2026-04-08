import { z } from "zod";

/**
 * Schema for validating note submissions on a candidate's profile.
 */
export const NoteFormSchema = z.object({
  text: z.string().min(1, "Note cannot be empty").max(500, "Maximum 500 characters"),
  isInternal: z.boolean().default(false),
});

export type NoteFormValues = z.infer<typeof NoteFormSchema>;

/**
 * Schema for validating scheduled follow-up tasks for candidates.
 * Enforces business rules such as preventing past dates.
 */
export const FollowUpSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  date: z.date({
    error: "A date is required.",
  }).refine((date) => {
    // Business Rule: Date cannot be in the past
    // We set the time of "today" to 00:00:00 to allow selecting today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, {
    error: "Date cannot be in the past.",
  }),
  assignedRecruiterId: z.string().min(1, "Please assign a recruiter"),
});

export type FollowUpFormValues = z.infer<typeof FollowUpSchema>;