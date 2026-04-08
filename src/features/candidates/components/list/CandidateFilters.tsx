import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useCandidateParams } from "../../hooks/useCandidateParams";
import type { CandidateListItem } from "../../types";
import { useDebounce } from "@/hooks/useDebounce";

/**
 * Props for the CandidateFilters component.
 */
interface CandidateFiltersProps {
  candidates?: CandidateListItem[];
}

/**
 * Renders the search bar and select dropdowns for filtering candidates.
 * Syncs UI state with the encoded URL parameters via `useCandidateParams`.
 * 
 * @param props - Component props containing the raw list of candidates.
 */
export function CandidateFilters({ candidates = [] }: CandidateFiltersProps) {
  const { filters, setFilter } = useCandidateParams();
  
  // 1. Local state for immediate typing feedback
  const [localSearch, setLocalSearch] = useState(filters.search);
  
  // 2. Debounced value that waits 500ms after the user stops typing
  const debouncedSearch = useDebounce(localSearch, 500);

  // 3. Sync the debounced value to the URL only when it changes
  useEffect(() => {
    // Only update if the debounced value is different from what's currently in the URL
    if (debouncedSearch !== filters.search) {
      setFilter('q', debouncedSearch);
    }
  }, [debouncedSearch, filters.search, setFilter]);

  const seniorities = Array.from(new Set(candidates.map(c => c.seniority))).sort();
  const recruitersMap = new Map(candidates.map(c => [c.recruiter.id, c.recruiter.name]));
  const recruiters = Array.from(recruitersMap.entries());

  return (
    <div className="flex flex-col justify-start gap-4">
        <div className="w-full lg:w-1/2">
            <Input 
                placeholder="Search by name or email..." 
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
            />
        </div>
        
        <div className="flex flex-wrap gap-4">
            <div className="flex gap-2">
                <Select value={filters.status} onValueChange={(val) => setFilter('status', val)}>
                    <SelectTrigger className="text-xs min-w-30 max-w-35">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Screening">Screening</SelectItem>
                        <SelectItem value="Interview">Interview</SelectItem>
                        <SelectItem value="Offer">Offer</SelectItem>
                        <SelectItem value="Hired">Hired</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filters.seniority} onValueChange={(val) => setFilter('seniority', val)}>
                    <SelectTrigger className="text-xs min-w-30 max-w-35">
                        <SelectValue placeholder="Seniority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Seniorities</SelectItem>
                        {seniorities.map(seniority => (
                        <SelectItem key={seniority} value={seniority}>{seniority}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={filters.recruiterId} onValueChange={(val) => setFilter('recruiterId', val)}>
                    <SelectTrigger className="text-xs min-w-30 max-w-35">
                        <SelectValue placeholder="Recruiter" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Recruiters</SelectItem>
                        {recruiters.map(([id, name]) => (
                        <SelectItem key={id} value={id}>{name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2 self-end text-sm pl-5 ml-auto">
                <span className="text-muted-foreground">Sort by:</span>
                <Select 
                    value={`${filters.sortBy}-${filters.sortOrder}`} 
                    onValueChange={(val) => {
                        const [by, order] = val.split('-');
                        if (by && order) {
                        setFilter({
                            sortBy: by,
                            sortOrder: order
                        });
                        }
                    }}
                >
                <SelectTrigger className="w-50 h-8 text-xs border-dashed">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="lastActivityAt-desc">Newest Activity First</SelectItem>
                    <SelectItem value="lastActivityAt-asc">Oldest Activity First</SelectItem>
                    <SelectItem value="score-desc">Highest Score First</SelectItem>
                    <SelectItem value="score-asc">Lowest Score First</SelectItem>
                </SelectContent>
                </Select>
            </div>
        </div>
    </div>
  );
}