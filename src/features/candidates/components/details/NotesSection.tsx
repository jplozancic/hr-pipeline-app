import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { format } from "date-fns";
import { Save } from "lucide-react";
import type { Note } from "@/core/types";
import { useNotesForm } from "../../hooks/useNotesForm";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";

interface NotesSectionProps {
  candidateId: string;
  notes: Note[];
  onDirtyChange?: (isDirty: boolean) => void;
}

/**
 * Renders the chronological list of notes regarding a candidate.
 * Includes a constrained textarea form for adding new notes and a toggle for mapping private/public notes.
 * Exposes a dirty state handler via `onDirtyChange` to integrate with unsaved changes prompts.
 * 
 * @param props - Component props including candidate ID and list of notes.
 */
export function NotesSection({ candidateId, notes, onDirtyChange }: NotesSectionProps) {
  // Use the custom hook to handle all logic
  const { form, charCount, isSubmitting, isOverLimit, isEmpty, onSubmit } = useNotesForm(candidateId);
  const { register, control, formState: { errors, dirtyFields } } = form;

  // Only consider it dirty if actual fields have been modified
  const hasActualChanges = Object.keys(dirtyFields).length > 0;

  // Report dirtiness to parent
  useEffect(() => {
    onDirtyChange?.(hasActualChanges);
  }, [hasActualChanges, onDirtyChange]);

  // Sort notes so the newest appears at the top
  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <h3 className="font-semibold text-lg">Notes</h3>
        <span className="ml-auto text-xs font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
          {notes.length} total
        </span>
      </div>

      {/* New Note Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <FieldGroup>
          <Field>
            <Textarea 
              placeholder="Add a note about this candidate..." 
              className="resize-none min-h-20"
              aria-invalid={!!errors.text}
              {...register("text")} 
            />
            <div className="flex justify-between mt-1 items-start">
              <div className="text-xs text-destructive">
                {errors.text && <FieldError>{errors.text.message}</FieldError>}
              </div>
              <span className={`text-xs transition-colors ${isOverLimit ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                {charCount}/500
              </span>
            </div>
          </Field>

          <div className="flex items-center justify-between">
            <Controller
              control={control}
              name="isInternal"
              render={({ field }) => (
                <Field orientation="horizontal">
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                    id="isInternal-checkbox"
                  />
                  <Label htmlFor="isInternal-checkbox" className="font-normal cursor-pointer m-0 leading-none">
                    Mark as Internal Only
                  </Label>
                </Field>
              )}
            />

            <Button type="submit" size="sm" disabled={isSubmitting || isEmpty || isOverLimit}>
              {isSubmitting ? "Saving..." : <><Save className="mr-2 h-3 w-3" /> Save Note</>}
            </Button>
          </div>
        </FieldGroup>
      </form>

      {/* Notes List */}
      <div className="flex flex-col gap-3 mt-2">
        {sortedNotes.length > 0 ? (
          sortedNotes.map((note) => (
            <div 
              key={note.id} 
              className={`p-4 rounded-lg border text-sm overflow-hidden flex flex-col gap-2 ${note.isInternal ? 'bg-amber-50/50 border-amber-100 dark:bg-amber-950/10 dark:border-amber-900/30' : 'bg-card'}`}
            >
              <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
                <span>{format(new Date(note.createdAt), "MMM d, yyyy • h:mm a")}</span>
                {note.isInternal && (
                  <Badge variant="outline" className="text-[10px] uppercase text-amber-600 border-amber-200 bg-amber-100/50 dark:text-amber-400 dark:border-amber-900/50">
                    Internal
                  </Badge>
                )}
              </div>
              <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
                {note.text}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center p-6 border border-dashed rounded-lg text-muted-foreground text-sm">
            No notes yet. Be the first to add one!
          </div>
        )}
      </div>
    </div>
  );
}