import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddFollowUp } from "../api/candidateQueries";
import type { FollowUp } from "@/core/types";
import { FollowUpSchema, type FollowUpFormValues } from "../schemas/candidateSchemas";


/**
 * Manages the form state and submission for adding a new Follow-Up task to a candidate.
 * 
 * @param candidateId - The ID of the candidate to attach the follow-up task to.
 */
export function useFollowUpForm(candidateId: string) {
  const addFollowUpMutation = useAddFollowUp();

  const form = useForm<FollowUpFormValues>({
    resolver: zodResolver(FollowUpSchema) as Resolver<FollowUpFormValues>,
    defaultValues: {
      title: "",
      assignedRecruiterId: "",
      date: undefined as unknown as Date, 
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    const newFollowUp: Omit<FollowUp, "id" | "isCompleted"> = {
      candidateId,
      title: data.title,
      // Convert the JS Date object back to an ISO string for the database
      date: data.date.toISOString(), 
      assignedRecruiterId: data.assignedRecruiterId,
    };

    addFollowUpMutation.mutate(newFollowUp, {
      onSuccess: () => {
        form.reset();
      }
    });
  });

  return {
    form,
    isSubmitting: addFollowUpMutation.isPending,
    onSubmit,
  };
}