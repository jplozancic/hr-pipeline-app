import { useMemo } from "react";
import { CandidateFilters } from "@/features/candidates/components/list/CandidateFilters";
import { CandidateTable } from "@/features/candidates/components/list/CandidateTable";
import { Pagination } from "@/features/candidates/components/list/Pagination";
import { useCandidates } from "@/features/candidates/api/candidateQueries";
import { useCandidateParams } from "@/features/candidates/hooks/useCandidateParams";
import { filterCandidates, sortCandidates } from "@/features/candidates/utils/filterHelpers";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

const ITEMS_PER_PAGE = 5;

/**
 * Top-level route page component representing the hr-pipeline candidate list view.
 * Integrates filtering, sorting, server-state fetching (via React Query), and local pagination.
 * Acts as the centralized parent component for the list domain.
 */
export function CandidateListPage() {
  const { data: candidates, isLoading, isError } = useCandidates();
  const { filters } = useCandidateParams();

  const { paginatedData, totalFilteredCount } = useMemo(() => {
    if (!candidates) return { paginatedData: [], totalFilteredCount: 0 };
    
    const filtered = filterCandidates(candidates, filters);
    const sorted = sortCandidates(filtered, filters.sortBy, filters.sortOrder);
    
    const startIndex = (filters.page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginated = sorted.slice(startIndex, endIndex);

    return { 
      paginatedData: paginated, 
      totalFilteredCount: sorted.length 
    };
  }, [candidates, filters]);

  if (isError) {
    return (
      <div className="flex h-[90vh] items-center justify-center">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-8 text-center text-destructive max-w-md">
          <h3 className="font-semibold text-lg mb-2">Failed to Load Pipeline</h3>
          <p className="text-sm">There was a problem connecting to the database. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-350 mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
        <p className="text-muted-foreground mt-1">
          Manage your hiring pipeline and track candidate progress.
        </p>
      </div>

      <Card className="shadow-sm border-muted">
        <CardHeader className="bg-muted/20">
          <CandidateFilters candidates={candidates} />
        </CardHeader>
        <CardContent className="p-0 border-t border-muted">
          <div className="border-b border-muted last:border-b-0">
            <CandidateTable candidates={paginatedData} isLoading={isLoading} />
          </div>
          
          {!isLoading && totalFilteredCount > 0 && (
            <div className="bg-muted/10 px-4">
              <Pagination 
                totalItems={totalFilteredCount} 
                itemsPerPage={ITEMS_PER_PAGE} 
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}