import { useEffect, useState } from "react"
import { Controller } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import type { FollowUp, Recruiter } from "@/core/types";
import { useFollowUpForm } from "../../hooks/useFollowUpForm";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

interface FollowUpSectionProps {
  candidateId: string;
  followUps: FollowUp[];
  recruiters: Recruiter[]; // We pass this in from the Page to populate the dropdown
  onDirtyChange?: (isDirty: boolean) => void;
}

/**
 * Renders follow-up tasks for a candidate.
 * Includes a form to add new follow-ups, assigning them to available recruiters.
 * Exposes a dirty state handler via `onDirtyChange` to integrate with unsaved changes prompts.
 * 
 * @param props - Section properties including candidate ID and task lists.
 */
export function FollowUpSection({ candidateId, followUps, recruiters, onDirtyChange }: FollowUpSectionProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { form, isSubmitting, onSubmit } = useFollowUpForm(candidateId);
  const { register, control, formState: { errors, dirtyFields } } = form;

  // Only consider it dirty if actual fields have been modified
  const hasActualChanges = Object.keys(dirtyFields).length > 0;

  // Report dirtiness to parent
  useEffect(() => {
    onDirtyChange?.(hasActualChanges);
  }, [hasActualChanges, onDirtyChange]);

  // Sort tasks: Incomplete first, then by date closest to today
  const sortedFollowUps = [...followUps].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <h3 className="font-semibold text-lg">Follow-up Tasks</h3>
      </div>

      {/* New Task Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <FieldGroup>
          {/* Title Field */}
          <Field>
            <FieldLabel>Task Description</FieldLabel>
            <Input
              placeholder="e.g. Schedule technical interview..."
              aria-invalid={!!errors.title}
              {...register("title")}
            />
            {errors.title && <FieldError>{errors.title.message}</FieldError>}
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date Picker Field */}
            <Field>
              <FieldLabel>Due Date</FieldLabel>
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "h-9 w-full flex items-center justify-between rounded-3xl cursor-pointer border border-transparent bg-input/50 px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
                          !field.value && "text-muted-foreground",
                          errors.date && "border-destructive ring-destructive/20"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);        // 1. Update the react-hook-form value
                          setIsCalendarOpen(false);    // 2. Close the popover immediately
                        }}
                        // UI Rule: Gray out past dates in the calendar to prevent the user from clicking them
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.date && <FieldError>{errors.date.message}</FieldError>}
            </Field>

            {/* Recruiter Assignee Field */}
            <Field>
              <FieldLabel>Assign To</FieldLabel>
              <Controller
                control={control}
                name="assignedRecruiterId"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger aria-invalid={!!errors.assignedRecruiterId}>
                      <SelectValue placeholder="Select recruiter" />
                    </SelectTrigger>
                    <SelectContent>
                      {recruiters.map((r) => (
                        <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.assignedRecruiterId && <FieldError>{errors.assignedRecruiterId.message}</FieldError>}
            </Field>
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
            {isSubmitting ? "Creating Task..." : "Add Follow-up Task"}
          </Button>
        </FieldGroup>
      </form>

      {/* Task List */}
      <div className="flex flex-col gap-3 mt-2">
        {sortedFollowUps.length > 0 ? (
          sortedFollowUps.map((task) => {
            const assignee = recruiters.find(r => r.id === task.assignedRecruiterId)?.name || "Unknown";
            const isOverdue = new Date(task.date) < new Date(new Date().setHours(0, 0, 0, 0)) && !task.isCompleted;

            return (
              <div
                key={task.id}
                className={`p-3 rounded-lg border text-sm flex flex-col gap-1.5 transition-opacity ${task.isCompleted ? 'opacity-50 bg-muted/30' : 'bg-card'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className={`font-medium ${task.isCompleted ? 'line-through' : ''}`}>
                    {task.title}
                  </p>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0">
                    {assignee}
                  </span>
                </div>

                <div className={`flex items-center gap-1.5 text-xs ${isOverdue ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
                  <Clock className="h-3.5 w-3.5" />
                  {format(new Date(task.date), "MMM d, yyyy")}
                  {isOverdue && " (Overdue)"}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center p-6 border border-dashed rounded-lg text-muted-foreground text-sm">
            No pending tasks for this candidate.
          </div>
        )}
      </div>
    </div>
  );
}