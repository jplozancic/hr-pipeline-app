import { useNavigate } from "react-router";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CandidateStatus } from "@/core/types";
import type { CandidateListItem } from "../../types";
import { Loader2 } from "lucide-react";

/**
 * Derives the visual shadcn badge variant based on candidate status.
 * @param status - The current status of the candidate.
 */
function getStatusBadgeVariant(status: CandidateStatus) {
  switch (status) {
    case "Hired": return "hired";
    case "Offer": return "offer";
    case "Rejected": return "rejected";
    case "Screening": return "screening";
    case "Interview": return "interview";
    case "New": return "new";
    default: return "outline";
  }
}

/**
 * Props for the CandidateTable component.
 */
interface CandidateTableProps {
  candidates?: CandidateListItem[];
  isLoading: boolean;
}

/**
 * Main data table for displaying candidate rows.
 * Implements keyboard navigation and accessible row clicking.
 * 
 * @param props - Component props containing filtered candidates and loading state.
 */
export function CandidateTable({ candidates, isLoading }: CandidateTableProps) {
  const navigate = useNavigate();

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/candidate/${id}`);
    }
  };

  return (
    <div className="bg-card w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Recruiter</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Last Activity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">Loading candidates...</p>
                </div>
              </TableCell>
            </TableRow>
          )}

          {!isLoading && candidates?.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                No candidates found.
              </TableCell>
            </TableRow>
          )}

          {candidates?.map((candidate) => (
            <TableRow 
              key={candidate.id} 
              className="h-18 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate(`/candidate/${candidate.id}`)}
              tabIndex={0}
              role="button"
              aria-label={`View details for ${candidate.name}`}
              onKeyDown={(e) => handleKeyDown(e, candidate.id)}
            >
              <TableCell className="font-medium">
                <div>{candidate.name}</div>
                <div className="text-xs text-muted-foreground font-normal">
                  {candidate.email}
                </div>
              </TableCell>
              
              <TableCell>
                <div>{candidate.position}</div>
                <div className="text-xs text-muted-foreground">
                  {candidate.seniority}
                </div>
              </TableCell>
              
              <TableCell>
                <Badge variant={getStatusBadgeVariant(candidate.status)}>
                  {candidate.status}
                </Badge>
              </TableCell>
              
              <TableCell>
                <span className={candidate.score >= 80 ? "text-green-600 font-semibold" : ""}>
                  {candidate.score}/100
                </span>
              </TableCell>

              <TableCell className="text-sm">
                {candidate.recruiter.name}
              </TableCell>

              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-37.5">
                  {candidate.tags.map(tag => (
                    <Badge key={tag.id} variant="outline" className="text-[12px] px-1.5 py-0 font-medium">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              
              <TableCell className="text-right text-muted-foreground whitespace-nowrap">
                {format(new Date(candidate.lastActivityAt), "MMM d, yyyy")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}