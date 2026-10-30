"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { appToast } from "@/shared/ui";
import {
  EMPTY_FILTERS,
  EMPTY_PERSON_FORM,
  peopleApi,
  personToFormValues,
} from "../services/people.api";
import type { PeopleFilters, Person, PersonFormValues } from "../types/person.types";

export const personKeys = {
  all: ["people"] as const,
  list: (filters: PeopleFilters) => [...personKeys.all, "list", filters] as const,
  cargos: ["people", "cargos"] as const,
};

export function usePeopleDirectory() {
  const queryClient = useQueryClient();
  const [draftFilters, setDraftFilters] = useState<PeopleFilters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<PeopleFilters>(EMPTY_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<PersonFormValues>(EMPTY_PERSON_FORM);
  const [personToDelete, setPersonToDelete] = useState<Person | null>(null);
  const [mailNotice, setMailNotice] = useState<"ok" | "error" | null>(null);

  const listQuery = useQuery({
    queryKey: personKeys.list(appliedFilters),
    queryFn: () => peopleApi.list(appliedFilters),
  });

  const people = useMemo(() => listQuery.data ?? [], [listQuery.data]);
  const selectedPerson = useMemo(
    () => people.find((person) => person.id === selectedId) ?? null,
    [people, selectedId],
  );

  const invalidate = (): void => {
    void queryClient.invalidateQueries({ queryKey: personKeys.all });
  };

  const createMutation = useMutation({
    mutationFn: peopleApi.create,
    onSuccess: (person) => {
      invalidate();
      setSelectedId(person.id);
      setEditingId(person.id);
      setFormValues(personToFormValues(person));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: PersonFormValues }) =>
      peopleApi.update(id, values),
    onSuccess: (person) => {
      invalidate();
      setSelectedId(person.id);
      setFormValues(personToFormValues(person));
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      peopleApi.toggle(id, isActive),
    onMutate: async ({ id, isActive }) => {
      await queryClient.cancelQueries({ queryKey: personKeys.all });
      const snapshots = queryClient.getQueriesData<Person[]>({
        queryKey: personKeys.all,
      });

      queryClient.setQueriesData<Person[]>(
        { queryKey: personKeys.all },
        (current) =>
          current?.map((person) =>
            person.id === id
              ? {
                  ...person,
                  isActive,
                  status: isActive ? "active" : "inactive",
                }
              : person,
          ),
      );

      return { snapshots };
    },
    onError: (_error, _variables, context) => {
      context?.snapshots.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSuccess: (person) => {
      queryClient.setQueriesData<Person[]>(
        { queryKey: personKeys.all },
        (current) =>
          current?.map((item) => (item.id === person.id ? person : item)),
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: peopleApi.remove,
    onSuccess: (_, id) => {
      invalidate();
      setPersonToDelete(null);
      if (selectedId === id) setSelectedId(null);
      if (editingId === id) {
        setEditingId(null);
        setFormValues(EMPTY_PERSON_FORM);
      }
    },
  });

  const search = (): void => {
    setAppliedFilters(draftFilters);
  };

  const startCreate = (): void => {
    setEditingId(null);
    setFormValues(EMPTY_PERSON_FORM);
  };

  const startEdit = (person: Person): void => {
    setEditingId(person.id);
    setSelectedId(person.id);
    setFormValues(personToFormValues(person));
  };

  const resendMutation = useMutation({
    mutationFn: peopleApi.resendConfirmation,
  });

  const save = async (values: PersonFormValues): Promise<void> => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, values });
        appToast.success("Cadastro atualizado");
        return;
      }
      await createMutation.mutateAsync(values);
      appToast.success("Cadastro salvo");
    } catch (error) {
      appToast.danger(
        "Não foi possível salvar",
        error instanceof Error ? error.message : undefined,
      );
    }
  };

  const resendConfirmation = async (person: Person): Promise<void> => {
    if (person.emailConfirmed) return;
    try {
      await resendMutation.mutateAsync(person.id);
      setMailNotice("ok");
    } catch {
      setMailNotice("error");
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return {
    draftFilters,
    setDraftFilters,
    search,
    people,
    isPending: listQuery.isPending,
    isError: listQuery.isError,
    refetch: listQuery.refetch,
    selectedPerson,
    selectPerson: setSelectedId,
    clearSelected: () => setSelectedId(null),
    formValues,
    editingId,
    startCreate,
    startEdit,
    save,
    isSaving,
    mailNotice,
    closeMailNotice: () => setMailNotice(null),
    resendConfirmation,
    isResending: resendMutation.isPending,
    toggle: (id: string, isActive: boolean) => {
      toggleMutation.mutate({ id, isActive });
    },
    personToDelete,
    askDelete: setPersonToDelete,
    confirmDelete: () => {
      if (!personToDelete) return;
      deleteMutation.mutate(personToDelete.id);
    },
    isDeleting: deleteMutation.isPending,
    cancelForm: () => {
      setEditingId(null);
      setFormValues(EMPTY_PERSON_FORM);
    },
  };
}
