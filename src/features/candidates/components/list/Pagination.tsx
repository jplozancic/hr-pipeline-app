import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useCandidateParams } from "../../hooks/useCandidateParams";

/**
 * Props for the Pagination component.
 */
interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
}

/**
 * Renders pagination controls for the candidate list.
 * Syncs page state with the URL. Automatically hides if there's only 1 page.
 * 
 * @param props - Props defining the total item count and chunk size.
 */
export function Pagination({ totalItems, itemsPerPage }: PaginationProps) {
  const { filters, setFilter } = useCandidateParams();
  const currentPage = filters.page;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // If there are no items or only 1 page of items, don't show pagination UI at all
  if (totalItems === 0 || totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>{" "}
        to{" "}
        <span className="font-medium">
          {Math.min(currentPage * itemsPerPage, totalItems)}
        </span>{" "}
        of <span className="font-medium">{totalItems}</span> candidates
      </div>

      <ShadcnPagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && setFilter("page", (currentPage - 1).toString())}
              // Visual cue to disable button if we are on the first page
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          {/* Render page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                onClick={() => setFilter("page", pageNumber.toString())}
                isActive={pageNumber === currentPage}
                className="cursor-pointer data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => currentPage < totalPages && setFilter("page", (currentPage + 1).toString())}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </ShadcnPagination>
    </div>
  );
}