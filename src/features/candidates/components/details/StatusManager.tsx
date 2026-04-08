import { useState } from "react";
import { Controller } from "react-hook-form";
import { Lock } from "lucide-react";
import type { CandidateDetails } from "../../types";
import { useStatusManagerForm } from "../../hooks/useStatusManagerForm";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Complex component managing candidate status transitions via a modal popup.
 * Integrates `useStatusManagerForm` hook for handling form logic and dynamic payload assembly.
 * Displays current status and specific details contextual to that status (e.g. rejection reason).
 * 
 * @param props - Component props containing Candidate details.
 */
export function StatusManager({ candidate }: { candidate: CandidateDetails }) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    form,
    selectedStatus,
    isLocked,
    isSubmitting,
    onSubmit,
    resetFormToCandidateState
  } = useStatusManagerForm(candidate, () => setIsOpen(false));

  const { control, register, formState: { errors } } = form;

  const handleOpenClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resetFormToCandidateState(); // Reset the form right before opening
    setIsOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Current Status Display */}
      <div>
        <div className="flex items-center justify-start lg:justify-between border-b pb-4">
          <h3 className="font-semibold text-lg">Current Status</h3>
          <Badge variant={candidate.status.toLowerCase() as any} className="text-md px-3 py-1 ms-3 lg:ms-0">
            {candidate.status}
          </Badge>
        </div>

        <p className="text-muted-foreground my-4 leading-relaxed">
          Manage where this candidate is in the pipeline.
        </p>

        {candidate.status === "Rejected" && candidate.rejectionReason && (
          <div className="mt-2 p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">
            <strong>Reason:</strong> {candidate.rejectionReason}
          </div>
        )}

        {(candidate.status === "Offer" || candidate.status === "Hired") && candidate.expectedSalary && (
          <div className="mt-2 p-3 bg-primary/10 text-primary text-sm rounded-md border border-primary/20">
            <strong>Expected Salary:</strong> {candidate.expectedSalary} {candidate.expectedSalaryCurrency || "EUR"}
          </div>
        )}
      </div>

      <Button
        type="button"
        className="w-full mt-2"
        variant="default"
        disabled={isLocked}
        onClick={handleOpenClick}
      >
        {isLocked ? (
          <><Lock className="mr-2 h-4 w-4" /> Locked (Hired)</>
        ) : (
          <>Change Status</>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Update Candidate Status</DialogTitle>
            <DialogDescription>
              Move {candidate.name} to a new stage in the hiring pipeline.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-4 py-4">
            <FieldGroup>

              {/* STATUS SELECT */}
              <Field>
                <FieldLabel>Pipeline Stage</FieldLabel>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger aria-invalid={!!errors.status}>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Screening">Screening</SelectItem>
                        <SelectItem value="Interview">Interview</SelectItem>
                        <SelectItem value="Offer">Offer</SelectItem>
                        <SelectItem value="Hired">Hired</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && <FieldError>{errors.status.message}</FieldError>}
              </Field>

              {/* CONDITIONAL: REJECTION REASON */}
              {selectedStatus === "Rejected" && (
                <Field>
                  <FieldLabel>
                    Reason for Rejection <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    placeholder="e.g. Lacks necessary TypeScript experience..."
                    aria-invalid={!!errors.rejectionReason}
                    {...register("rejectionReason")}
                  />
                  {errors.rejectionReason && <FieldError>{errors.rejectionReason.message}</FieldError>}
                </Field>
              )}

              {/* CONDITIONAL: EXPECTED SALARY */}
              {selectedStatus === "Offer" && (
                <Field>
                  <FieldLabel>
                    Expected Salary (Annual) <span className="text-destructive">*</span>
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      type="number"
                      placeholder="75000"
                      aria-invalid={!!errors.expectedSalary}
                      {...register("expectedSalary", {
                        setValueAs: (value) => value === "" ? undefined : Number(value),
                      })}
                    />
                    <InputGroupAddon>
                      <InputGroupText>EUR</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.expectedSalary && <FieldError>{errors.expectedSalary.message}</FieldError>}
                </Field>
              )}

            </FieldGroup>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>

        </DialogContent>
      </Dialog>
    </div>
  );
}