import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CandidateDetails } from "../types";
import { useUpdateCandidateStatus } from "../api/candidateQueries";
import { StatusUpdateSchema, type StatusUpdateFormValues } from "../schemas/statusFormSchema";

/**
 * Complex hook managing candidate status pipelines.
 * Tracks conditional form fields (salary vs rejection reasons) and handles status locking (Hired).
 * 
 * @param candidate - The complete candidate data used to initialize form state.
 * @param onSuccessCallback - Executed after a successful status mutation (typically to close the modal).
 */
export function useStatusManagerForm(candidate: CandidateDetails, onSuccessCallback: () => void) {
  const updateStatusMutation = useUpdateCandidateStatus();
  const isLocked = candidate.status === "Hired";

  const form = useForm<StatusUpdateFormValues>({
    resolver: zodResolver(StatusUpdateSchema),
    defaultValues: {
      status: candidate.status,
      rejectionReason: candidate.rejectionReason || "",
      expectedSalary: candidate.expectedSalary || undefined,
    },
  });

  const selectedStatus = form.watch("status");

  const resetFormToCandidateState = useCallback(() => {
    form.reset({
      status: candidate.status,
      rejectionReason: candidate.rejectionReason || "",
      expectedSalary: candidate.expectedSalary || undefined,
    });
  }, [candidate.status, candidate.rejectionReason, candidate.expectedSalary, form]);

  const onSubmit = form.handleSubmit((data: StatusUpdateFormValues) => {
    const payload: Partial<CandidateDetails> = {};
    if (data.status === "Rejected") payload.rejectionReason = data.rejectionReason;
    if (data.status === "Offer") payload.expectedSalary = data.expectedSalary;
    if (data.status === "Hired") payload.hiredAt = new Date().toISOString();

    updateStatusMutation.mutate(
      { id: candidate.id, status: data.status, payload },
      { onSuccess: onSuccessCallback }
    );
  });

  return {
    form,
    selectedStatus,
    isLocked,
    isSubmitting: updateStatusMutation.isPending,
    onSubmit,
    resetFormToCandidateState,
  };
}