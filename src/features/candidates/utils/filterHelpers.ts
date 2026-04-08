import type { CandidateListItem } from '../types';

/**
 * Filters a list of candidates based on provided multi-conditional search and select criteria.
 * Supports partial matching for names and exact matching for dropdowns.
 * 
 * @param candidates - The primary array of candidate objects.
 * @param filters - The payload containing the 'search' text and select overrides.
 * @returns A new array containing the filtered candidates.
 */
export function filterCandidates(
  candidates: CandidateListItem[],
  filters: { search: string; status: string; seniority: string; recruiterId: string }
): CandidateListItem[] {
  return candidates.filter((candidate) => {
    // 1. Search by Name or Email
    const searchLower = filters.search.toLowerCase();
    const matchesSearch = !filters.search || 
      candidate.name.toLowerCase().includes(searchLower) ||
      candidate.email.toLowerCase().includes(searchLower);

    // 2. Exact match filters
    const matchesStatus = filters.status === 'all' || candidate.status === filters.status;
    const matchesSeniority = filters.seniority === 'all' || candidate.seniority === filters.seniority;
    const matchesRecruiter = filters.recruiterId === 'all' || candidate.recruiter.id === filters.recruiterId;

    return matchesSearch && matchesStatus && matchesSeniority && matchesRecruiter;
  });
}

/**
 * Sorts array of candidates based on a specific key (score or lastActivity) and direction.
 * 
 * @param candidates - The array of candidate objects to sort.
 * @param sortBy - The specific key string to sort the collection by.
 * @param sortOrder - 'asc' for ascending, 'desc' for descending.
 * @returns A newly sorted array to preserve purity.
 */
export function sortCandidates(
  candidates: CandidateListItem[],
  sortBy: string,
  sortOrder: string
): CandidateListItem[] {
  return [...candidates].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'score') {
      comparison = a.score - b.score;
    } else if (sortBy === 'lastActivityAt') {
      comparison = new Date(a.lastActivityAt).getTime() - new Date(b.lastActivityAt).getTime();
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });
}