import type { 
  Candidate, 
  Recruiter, 
  Tag, 
  Skill, 
  Note, 
  FollowUp, 
  TimelineEvent 
} from "@/core/types";

/**
 * Extended candidate payload used for lists/tables.
 * Includes nested entities relevant for summary cards and rows.
 */
export interface CandidateListItem extends Candidate {
  recruiter: Recruiter;
  tags: Tag[];
}

/**
 * Complete candidate aggregate returned from detail endpoints.
 * Deeply nests all related entities (timeline, notes, skills, etc.) for full-page rendering.
 */
export interface CandidateDetails extends Candidate {
  recruiter: Recruiter;
  tags: Tag[];
  skills: Skill[];
  notes: Note[];
  timelineEvents: TimelineEvent[];
  followUps: FollowUp[];
}