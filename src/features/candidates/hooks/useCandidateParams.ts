import { useSearchParams } from 'react-router';

/**
 * Hook to manage URL search parameters for the Candidate List page.
 * Synchronizes filter criteria, sorting rules, and pagination with the browser URL.
 */
export function useCandidateParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('q') || '';
  const status = searchParams.get('status') || 'all';
  const seniority = searchParams.get('seniority') || 'all';
  const recruiterId = searchParams.get('recruiterId') || 'all';
  const sortBy = searchParams.get('sortBy') || 'lastActivityAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  const page = parseInt(searchParams.get('page') || '1', 10);

  /**
   * Updates one or multiple filters in the URL and handles side effects.
   * Modifying any filter (other than 'page') automatically resets pagination to page 1.
   * 
   * @param updates - A string key or an object map of multiple parameters to update.
   * @param value - Required only when `updates` is a string key.
   */
  const setFilter = (updates: string | Record<string, string>, value?: string) => {
    // Pass a callback function to setSearchParams to guarantee we are working with the absolute latest URL state
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);

      let isPaginationUpdate = false;
      
      // Handle the object syntax for batch updates
      if (typeof updates === 'object') {
        Object.entries(updates).forEach(([k, v]) => {
          if (v && v !== 'all') newParams.set(k, v);
          else newParams.delete(k);
        });
      } 

      // Handle the standard string syntax
      else if (typeof updates === 'string') {
        if (updates === 'page') isPaginationUpdate = true;
        
        if (value && value !== 'all') newParams.set(updates, value);
        else newParams.delete(updates);
      }
      
      // If the user changes a FILTER (not the page itself), reset to page 1
      // so they don't get stuck on an empty page 5 if the new search only yields 2 results
      if (!isPaginationUpdate) {
        newParams.delete('page'); 
      }

      return newParams;
    });
  };

  return {
    filters: { search, status, seniority, recruiterId, sortBy, sortOrder, page },
    setFilter,
  };
}