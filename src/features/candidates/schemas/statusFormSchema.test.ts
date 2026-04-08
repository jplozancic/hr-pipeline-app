import { describe, it, expect } from "vitest";
import { StatusUpdateSchema } from "./statusFormSchema";

/**
 * Test suite for checking complex candidate status transitions.
 * Ensures the form requires 'rejection reason' for rejects and 'expected salary' for offers.
 */
describe("StatusUpdateSchema", () => {
  it("should validate a simple status change like Screening", () => {
    const result = StatusUpdateSchema.safeParse({
      status: "Screening",
    });
    expect(result.success).toBe(true);
  });

  it("should fail if Rejected status is selected but reason is missing", () => {
    const result = StatusUpdateSchema.safeParse({
      status: "Rejected",
      rejectionReason: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Please provide a reason for rejection.");
      expect(result.error.issues[0].path[0]).toBe("rejectionReason");
    }
  });

  it("should validate if Rejected status is selected and reason is provided", () => {
    const result = StatusUpdateSchema.safeParse({
      status: "Rejected",
      rejectionReason: "Not enough experience",
    });
    expect(result.success).toBe(true);
  });

  it("should fail if Offer status is selected but salary is missing or zero", () => {
    const result1 = StatusUpdateSchema.safeParse({
      status: "Offer",
    });
    expect(result1.success).toBe(false);
    
    const result2 = StatusUpdateSchema.safeParse({
      status: "Offer",
      expectedSalary: 0,
    });
    expect(result2.success).toBe(false);
    if (!result2.success) {
      expect(result2.error.issues[0].message).toBe("Please provide a valid expected salary.");
    }
  });

  it("should validate if Offer status is selected and salary is provided", () => {
    const result = StatusUpdateSchema.safeParse({
      status: "Offer",
      expectedSalary: 80000,
    });
    expect(result.success).toBe(true);
  });
});
