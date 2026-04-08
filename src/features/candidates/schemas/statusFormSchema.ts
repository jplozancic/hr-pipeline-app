import { z } from "zod";
import { CandidateStatusSchema } from "@/core/schemas/domain";

/**
 * Schema for validating candidate status updates.
 * Implements cross-field business logic via superRefine:
 * - Rejected status must include a rejection reason.
 * - Offer status must include a valid expected salary.
 */
export const StatusUpdateSchema = z.object({
  status: CandidateStatusSchema,
  rejectionReason: z.string().optional(),
  expectedSalary: z.number().optional(),
}).superRefine((data, ctx) => {
  // Business Rule 1: Rejected requires a reason
  if (data.status === "Rejected" && (!data.rejectionReason || data.rejectionReason.trim().length === 0)) {
    ctx.addIssue({
      code: "custom",
      message: "Please provide a reason for rejection.",
      path: ["rejectionReason"],
    });
  }
  
  // Business Rule 2: Offer requires a salary
  if (data.status === "Offer" && (!data.expectedSalary || data.expectedSalary <= 0)) {
    ctx.addIssue({
      code: "custom",
      message: "Please provide a valid expected salary.",
      path: ["expectedSalary"],
    });
  }
});

export type StatusUpdateFormValues = z.infer<typeof StatusUpdateSchema>;