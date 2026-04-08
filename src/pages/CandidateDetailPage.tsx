import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCandidate } from "@/features/candidates/api/candidateQueries";
import { useUnsavedChanges } from "@/features/candidates/hooks/useUnsavedChanges";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { CandidateHeader } from "@/features/candidates/components/details/CandidateHeader";
import { SkillTags } from "@/features/candidates/components/details/SkillTags";
import { StatusManager } from "@/features/candidates/components/details/StatusManager";
import { Timeline } from "@/features/candidates/components/details/Timeline";
import { NotesSection } from "@/features/candidates/components/details/NotesSection";
import { FollowUpSection } from "@/features/candidates/components/details/FollowUpSection";

import db from "@/mocks/db.json";

/**
 * Top-level route page component representing a specific candidate's comprehensive profile.
 * Fetches the specific candidate using the `id` URL param.
 * Orchestrates layout and passes domain data down to specific detail sub-components.
 * Handles the "unsaved changes" navigation blocking modal logic.
 */
export function CandidateDetailPage() {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  
  // Fetch the full candidate details including all relations (notes, skills, timeline)
  const { data: candidate, isLoading, isError } = useCandidate(id!);

  // Track dirty states from our forms
  const [isNotesDirty, setIsNotesDirty] = useState(false);
  const [isFollowUpDirty, setIsFollowUpDirty] = useState(false);
  
  const hasUnsavedChanges = isNotesDirty || isFollowUpDirty;

  // Call the navigation guard hook
  const blocker = useUnsavedChanges(hasUnsavedChanges);

  if (isLoading) {
    return (
      <div className="flex h-[90vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading candidate profile...</p>
      </div>
    );
  }

  if (isError || !candidate) {
    return (
      <div className="flex min-h-[90vh] items-center justify-center p-4">
        <Card className="w-full max-w-lg border-muted shadow-sm">
          <CardHeader className="pt-2 pb-4 border-b">
            <CardTitle className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Candidate not found
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pb-4">
            <p className="text-base leading-relaxed text-muted-foreground">
              We couldn't find the candidate you're looking for. The link you followed might 
              be broken, or the page may have been removed. Please check the URL or 
              return to the candidates list.
            </p>
          </CardContent>

          <CardFooter>
            <Button asChild>
              <Link to="/candidates">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Candidates
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-350 mx-auto">
      
      {/* Navigation Guard Modal */}
      <AlertDialog 
        open={blocker.state === "blocked"} 
        onOpenChange={(open) => {
          if (!open && blocker.state === "blocked") blocker.reset();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You have unsaved changes</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave? Any text you've entered in the notes or follow-up forms will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => blocker.state === "blocked" && blocker.reset()}>
              Stay on Page
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => blocker.state === "blocked" && blocker.proceed()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Integrated Page Header / Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center font-medium hover:text-foreground transition-colors py-1 pr-2 rounded cursor-pointer"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Candidates
          </button>
          <span>/</span>
          <span className="font-medium text-foreground">{candidate.name}</span>
        </div>
      </div>

      {/* Main Content Grid: 2 columns on large screens, 1 on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main Content): Takes up 2/3 of the screen */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <CandidateHeader candidate={candidate} />
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="font-semibold text-lg border-b pb-4">Professional Summary</h3>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {candidate.summary}
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <SkillTags skills={candidate.skills} />
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            {/* onDirtyChange tracking here */}
            <NotesSection 
              candidateId={candidate.id} 
              notes={candidate.notes} 
              onDirtyChange={setIsNotesDirty}
            />
          </div>
        </div>

        {/* Right Column (Sidebar): Takes up 1/3 of the screen */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-primary/20 bg-card p-6 shadow-sm shadow-primary/5">
            <StatusManager candidate={candidate} />
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            {/* onDirtyChange tracking here */}
            <FollowUpSection 
              candidateId={candidate.id} 
              followUps={candidate.followUps} 
              recruiters={db.recruiters} 
              onDirtyChange={setIsFollowUpDirty}
            />
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <Timeline events={candidate.timelineEvents} />
          </div>
        </div>

      </div>
    </div>
  );
}