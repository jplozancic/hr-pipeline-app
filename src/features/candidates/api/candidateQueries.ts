import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { candidateService } from './candidateService';
import type { Candidate, CandidateStatus, Note, FollowUp } from '@/core/types';

/**
 * Query Key Factory: Centralizes all cache keys to prevent typos and make invalidation easier.
 */
export const candidateKeys = {
  all: ['candidates'] as const,
  lists: () => [...candidateKeys.all, 'list'] as const,
  details: () => [...candidateKeys.all, 'detail'] as const,
  detail: (id: string) => [...candidateKeys.details(), id] as const,
};

// --- QUERIES ---

/**
 * Hook to fetch the full list of candidates.
 */

export function useCandidates() {
  return useQuery({
    queryKey: candidateKeys.lists(),
    queryFn: candidateService.getCandidates,
  });
}

/**
 * Hook to fetch deep details for a single candidate by ID.
 * Refrains from executing if no ID is passed.
 * @param id - The ID of the candidate to target.
 */
export function useCandidate(id: string) {
  return useQuery({
    queryKey: candidateKeys.detail(id),
    queryFn: () => candidateService.getCandidateById(id),
    enabled: !!id, // Don't run the query if no ID is provided
  });
}

// --- MUTATIONS ---

/**
 * Hook to update a candidate's status and potentially expected salary or rejection reason.
 * Invalidates both lists and specific detail views to refresh the UI automatically.
 */
export function useUpdateCandidateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, payload }: { id: string; status: CandidateStatus; payload?: Partial<Candidate> }) =>
      candidateService.updateCandidateStatus(id, status, payload),
    onSuccess: (_, variables) => {
      // When a status updates, invalidate the list AND the specific detail view
      // so the UI instantly refetches and shows the fresh data
      queryClient.invalidateQueries({ queryKey: candidateKeys.lists() });
      queryClient.invalidateQueries({ queryKey: candidateKeys.detail(variables.id) });
    },
  });
}

/**
 * Hook to attach a new note to a candidate.
 * Invalidates the candidate's detail view and the list view (to update 'last activity' sorts).
 */
export function useAddNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (note: Omit<Note, 'id' | 'createdAt'>) => 
      candidateService.addCandidateNote(note),
    onSuccess: (_, variables) => {
      // Invalidate just the detail view of the candidate getting the note
      queryClient.invalidateQueries({ queryKey: candidateKeys.detail(variables.candidateId) });
      // Invalidate the list view so the candidate jumps to the top of the "Last Activity" sort
      queryClient.invalidateQueries({ queryKey: candidateKeys.lists() });
    },
  });
}

/**
 * Hook to add a new follow-up task to a candidate.
 * Invalidates cache to immediately reflect the new task in the UI timeline.
 */
export function useAddFollowUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (followUp: Omit<FollowUp, 'id' | 'isCompleted'>) => 
      candidateService.saveFollowUp(followUp),
    onSuccess: (_, variables) => {
      // Invalidate the detail view to update the timeline instantly
      queryClient.invalidateQueries({ queryKey: candidateKeys.detail(variables.candidateId) });
      // Invalidate the list view so the candidate jumps to the top of the "Last Activity" sort
      queryClient.invalidateQueries({ queryKey: candidateKeys.lists() });
    },
  });
}