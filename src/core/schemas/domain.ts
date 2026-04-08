import { z } from "zod";

/**
 * Core status values representing a candidate's progress through the pipeline.
 */
export const CandidateStatusSchema = z.enum([
  "New", "Screening", "Interview", "Offer", "Hired", "Rejected"
]);

/**
 * Base schema representing a Candidate in the system.
 */
export const CandidateSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  position: z.string(),
  seniority: z.string(),
  status: CandidateStatusSchema,
  lastActivityAt: z.iso.datetime(),
  recruiterId: z.string(),
  score: z.number(),
  summary: z.string(),
  tagIds: z.array(z.string()),
  skillIds: z.array(z.string()),
  expectedSalary: z.number().optional(),
  expectedSalaryCurrency: z.string().optional(),
  rejectionReason: z.string().optional(),
  hiredAt: z.string().optional(),
});

/**
 * Represents an HR Recruiter managing candidates.
 */
export const RecruiterSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
});

/**
 * Represents a tag applied to a candidate for categorization.
 */
export const TagSchema = z.object({ id: z.string(), name: z.string() });

/**
 * Represents a professional skill a candidate possesses.
 */
export const SkillSchema = z.object({ id: z.string(), name: z.string() });

/**
 * Represents an internal or external note attached to a candidate's profile.
 */
export const NoteSchema = z.object({
  id: z.string(),
  candidateId: z.string(),
  text: z.string().min(1, "Note cannot be empty").max(500, "Maximum 500 characters"),
  isInternal: z.boolean(),
  createdAt: z.iso.datetime(),
});

/**
 * Represents a scheduled follow-up task related to a candidate.
 */
export const FollowUpSchema = z.object({
  id: z.string(),
  candidateId: z.string(),
  title: z.string().min(1, "Title is required"),
  date: z.iso.datetime(),
  assignedRecruiterId: z.string(),
  isCompleted: z.boolean(),
});

/**
 * Represents an activity event in the candidate's history timeline (e.g. status changes, notes).
 */
export const TimelineEventSchema = z.object({
  id: z.string(),
  candidateId: z.string(),
  type: z.string(),
  date: z.iso.datetime(),
  note: z.string(),
});