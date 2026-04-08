import dbData from './db.json';

import type {
  Candidate,
  CandidateStatus,
  Note,
  FollowUp
} from '@/core/types';

import type {
  CandidateListItem,
  CandidateDetails
} from '@/features/candidates/types';

// Load JSON into a variable so we can change it in memory during the session
let db = JSON.parse(JSON.stringify(dbData));

// Simulate server latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// HELPER: Automatically bump lastActivityAt and log a timeline event
const logActivity = (candidateId: string, type: string, noteText: string, timestamp: string) => {
  // 1. Bump Candidate lastActivityAt
  const candidateIndex = db.candidates.findIndex((c: any) => c.id === candidateId);
  if (candidateIndex !== -1) {
    db.candidates[candidateIndex].lastActivityAt = timestamp;
  }

  // 2. Create Timeline Event
  db.timelineEvents.push({
    // Add a random string to avoid duplicate IDs if multiple events happen in the same exact millisecond
    id: `t_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    candidateId,
    type,
    date: timestamp,
    note: noteText,
  });
};

/**
 * Simulated database client for the hr-pipeline application.
 * Mocks asynchronous server interaction by adding artificial latency.
 * Interacts directly with in-memory JSON data to persist changes during the active session.
 */
export const mockDb = {
  candidates: {
    async findMany(): Promise<CandidateListItem[]> {
      await delay(500);

      return db.candidates.map((candidate: any) => {
        const recruiter = db.recruiters.find((rec: any) => rec.id === candidate.recruiterId);
        if (!recruiter) throw new Error(`Recruiter missing for candidate ${candidate.id}`);

        const tags = candidate.tagIds
          .map((id: string) => db.tags.find((tag: any) => tag.id === id))
          // Filter out undefined and tell TS this array only contains valid Tags
          .filter((tag: any): tag is NonNullable<typeof tag> => tag !== undefined);

        return {
          ...candidate,
          status: candidate.status as CandidateStatus,
          recruiter,
          tags
        };
      });
    },

    async findById(id: string): Promise<CandidateDetails> {
      await delay(500);

      const candidate = db.candidates.find((c: any) => c.id === id);
      if (!candidate) throw new Error("Candidate not found");

      const recruiter = db.recruiters.find((rec: any) => rec.id === candidate.recruiterId);
      if (!recruiter) throw new Error("Recruiter missing");

      const tags = candidate.tagIds
        .map((tagId: string) => db.tags.find((tag: any) => tag.id === tagId))
        .filter((tag: any): tag is NonNullable<typeof tag> => tag !== undefined);

      const skills = candidate.skillIds
        .map((skillId: string) => db.skills.find((skill: any) => skill.id === skillId))
        .filter((skill: any): skill is NonNullable<typeof skill> => skill !== undefined);

      return {
        ...candidate,
        status: candidate.status as CandidateStatus,
        recruiter,
        tags,
        skills,
        notes: db.notes.filter((n: any) => n.candidateId === id) as Note[],
        timelineEvents: db.timelineEvents.filter((t: any) => t.candidateId === id),
        followUps: db.followUps.filter((f: any) => f.candidateId === id) as FollowUp[],
      };
    },

    async updateStatus(id: string, status: CandidateStatus, payload?: Partial<Candidate>): Promise<Candidate> {
      await delay(500);

      const index = db.candidates.findIndex((c: any) => c.id === id);
      if (index === -1) throw new Error("Candidate not found");

      const now = new Date().toISOString();

      // Mutate the in-memory db so the change persists while the app is running
      const updatedCandidate = {
        ...db.candidates[index],
        status,
        ...payload,
        lastActivityAt: now // Instantly update activity here too just in case
      } as Candidate;

      db.candidates[index] = updatedCandidate as any;

      // Call our helper to log the event!
      logActivity(id, "statuschanged", `Status changed to ${status}`, now);

      return updatedCandidate;
    }
  },

  notes: {
    async create(note: Omit<Note, 'id' | 'createdAt'>): Promise<Note> {
      await delay(500);

      const now = new Date().toISOString();

      const newNote: Note = {
        ...note,
        id: `n_${Date.now()}`,
        createdAt: now
      };

      db.notes.push(newNote as any);

      // Call our helper to bump activity and add a timeline log
      logActivity(
        note.candidateId,
        "noteadded",
        note.isInternal ? "Added an internal note" : "Added a note",
        now
      );

      return newNote;
    }
  },

  followUps: {
    async create(followUp: Omit<FollowUp, 'id' | 'isCompleted'>): Promise<FollowUp> {
      await delay(500);

      const now = new Date().toISOString();

      const newFollowUp: FollowUp = {
        ...followUp,
        id: `f_${Date.now()}`,
        isCompleted: false
      };

      db.followUps.push(newFollowUp as any);

      // Call our helper to bump activity and add a timeline log
      logActivity(
        followUp.candidateId,
        "followupadded",
        `Added follow-up task: ${followUp.title}`,
        now
      );

      return newFollowUp;
    }
  }
};