import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddNote } from "../api/candidateQueries";
import { NoteFormSchema, type NoteFormValues } from "../schemas/candidateSchemas"; // <-- Imported!

/**
 * Manages form state, character counting, and submission for adding timeline Notes.
 * 
 * @param candidateId - The candidate ID this note applies to.
 */
export function useNotesForm(candidateId: string) {
  const addNoteMutation = useAddNote();

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(NoteFormSchema) as Resolver<NoteFormValues>,
    defaultValues: { text: "", isInternal: false },
  });

  const textValue = form.watch("text");
  const charCount = textValue?.length || 0;

  const onSubmit = form.handleSubmit((data) => {
    addNoteMutation.mutate(
      { candidateId, text: data.text, isInternal: data.isInternal },
      { 
        onSuccess: () => {
          form.reset({
            text: "",
            isInternal: false
          });
        }
       }
    );
  });

  return {
    form,
    charCount,
    isSubmitting: addNoteMutation.isPending,
    isOverLimit: charCount > 500,
    isEmpty: charCount === 0,
    onSubmit,
  };
}