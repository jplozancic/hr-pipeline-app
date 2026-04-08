import { Mail, Briefcase, Calendar, Trophy } from "lucide-react";
import { format } from "date-fns";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { CandidateDetails } from "../../types";

interface CandidateHeaderProps {
  candidate: CandidateDetails;
}

/**
 * Helper function to extract up to 2 initials from a full name (e.g., "Ana Kovač" -> "AK").
 * Used for the avatar component.
 * 
 * @param name - The full name of the candidate.
 * @returns A string containing the initialized letters.
 */
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Renders the top header block of the Candidate Details page.
 * Displays the avatar, name, role, email, last activity, and the overall score badge.
 * 
 * @param props - Component props containing the candidate data.
 */
export function CandidateHeader({ candidate }: CandidateHeaderProps) {
  // Determine if the score is exceptional (80+) or needs improvement (< 60)
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-500/10 border-emerald-500/20";
    if (score < 60) return "text-rose-600 bg-rose-500/10 border-rose-500/20";
    return "text-blue-600 bg-blue-500/10 border-blue-500/20";
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

      {/* Left Side: Avatar and Info */}
      <div className="flex items-center gap-5">
        <Avatar className="h-20 w-20 border-2 border-muted shadow-sm">
          {/* We use the fallback with a nice background color to generate a modern text avatar */}
          <AvatarFallback className="text-2xl font-semibold bg-primary/5 text-primary">
            {getInitials(candidate.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {candidate.name}
          </h2>

          <div className="flex flex-col items-start gap-x-4 gap-y-2 text-sm text-muted-foreground mt-1">
            <div className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              <span className="font-medium text-foreground/80">
                {candidate.position}
              </span>
              <Separator orientation="vertical" className="h-4 mx-1" />
              <span>{candidate.seniority}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Mail className="h-4 w-4" />
              <a
                href={`mailto:${candidate.email}`}
                className="hover:text-primary hover:underline transition-colors"
              >
                {candidate.email}
              </a>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>
                Last active: {format(new Date(candidate.lastActivityAt), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Score Badge */}
      <div className="shrink-0 flex md:flex-col items-center justify-center md:justify-center gap-4 md:gap-2 bg-muted/70 md:bg-transparent p-4 md:p-0 rounded-lg md:rounded-none">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Overall Score
        </span>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${getScoreColor(candidate.score)}`}>
          <Trophy className="h-5 w-5" />
          <span className="text-2xl font-bold tracking-tight">
            {candidate.score}
            <span className="text-sm font-medium opacity-60 ml-1">/100</span>
          </span>
        </div>
      </div>

    </div>
  );
}