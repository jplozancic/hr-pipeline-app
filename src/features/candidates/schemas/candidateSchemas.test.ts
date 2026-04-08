import { describe, it, expect } from "vitest";
import { NoteFormSchema, FollowUpSchema } from "./candidateSchemas";

/**
 * Test suite for candidate note validation.
 * Ensures character limits and presence validation.
 */
describe("NoteFormSchema", () => {
  it("should validate a correct note", () => {
    const result = NoteFormSchema.safeParse({
      text: "This is a valid note.",
      isInternal: true,
    });
    expect(result.success).toBe(true);
  });

  it("should fail when text is empty", () => {
    const result = NoteFormSchema.safeParse({
      text: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Note cannot be empty");
    }
  });

  it("should fail when text exceeds 500 characters", () => {
    const result = NoteFormSchema.safeParse({
      text: "a".repeat(501),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Maximum 500 characters");
    }
  });
});

/**
 * Test suite for candidate follow-up validation.
 * Ensures past dates are rejected and required fields are present.
 */
describe("FollowUpSchema", () => {
  it("should validate a correct follow-up with today's date", () => {
    const result = FollowUpSchema.safeParse({
      title: "Call candidate",
      date: new Date(),
      assignedRecruiterId: "rec_1",
    });
    expect(result.success).toBe(true);
  });

  it("should fail when title is empty", () => {
    const result = FollowUpSchema.safeParse({
      title: "",
      date: new Date(),
      assignedRecruiterId: "rec_1",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when date is in the past", () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const result = FollowUpSchema.safeParse({
      title: "Call candidate",
      date: pastDate,
      assignedRecruiterId: "rec_1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Date cannot be in the past.");
    }
  });

  it("should fail when recruiter is missing", () => {
    const result = FollowUpSchema.safeParse({
      title: "Call candidate",
      date: new Date(),
      assignedRecruiterId: "",
    });
    expect(result.success).toBe(false);
  });
});
