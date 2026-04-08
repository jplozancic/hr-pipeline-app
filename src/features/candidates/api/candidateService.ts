import { mockDb } from '@/mocks/dbClient';
import type { Candidate, CandidateStatus, Note, FollowUp } from '@/core/types';
import type { CandidateListItem, CandidateDetails } from '../types';

/**
 * Service orchestrator for Candidate operations.
 * Currently bridges directly to the mock database.
 */
export const candidateService = {
  async getCandidates(): Promise<CandidateListItem[]> {
    return await mockDb.candidates.findMany();
  },

  async getCandidateById(id: string): Promise<CandidateDetails> {
    return await mockDb.candidates.findById(id);
  },

  async updateCandidateStatus(
    id: string, 
    status: CandidateStatus, 
    payload?: Partial<Candidate>
  ): Promise<Candidate> {
    return await mockDb.candidates.updateStatus(id, status, payload);
  },

  async addCandidateNote(note: Omit<Note, 'id' | 'createdAt'>): Promise<Note> {
    return await mockDb.notes.create(note);
  },

  async saveFollowUp(followUp: Omit<FollowUp, 'id' | 'isCompleted'>): Promise<FollowUp> {
    return await mockDb.followUps.create(followUp);
  }
};