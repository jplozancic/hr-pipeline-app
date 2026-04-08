import { z } from "zod";
import * as schemas from "../schemas/domain";

/**
 * Core Domain Types
 * These types are statically inferred from their matching Zod schemas in `../schemas/domain.ts`.
 * This acts as the single source of truth for the base data structures used everywhere in the app.
 */
export type CandidateStatus = z.infer<typeof schemas.CandidateStatusSchema>;
export type Candidate = z.infer<typeof schemas.CandidateSchema>;
export type Recruiter = z.infer<typeof schemas.RecruiterSchema>;
export type Tag = z.infer<typeof schemas.TagSchema>;
export type Skill = z.infer<typeof schemas.SkillSchema>;
export type Note = z.infer<typeof schemas.NoteSchema>;
export type FollowUp = z.infer<typeof schemas.FollowUpSchema>;
export type TimelineEvent = z.infer<typeof schemas.TimelineEventSchema>;