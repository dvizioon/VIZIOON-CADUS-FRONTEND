"use client";

import { AppButton, AppIcon, AppModal, AppSheet, type AppSectionNavItem } from "@/shared/ui";
import { useA11yNav } from "@/shared/layout/ShellContext";
import { usePeopleDirectory } from "../hooks/usePeople";
import { FORM_SECTIONS, PeopleForm } from "./PeopleForm";
import { PeopleTable } from "./PeopleTable";
import { PhotoPreview } from "./PhotoPreview";
import { SearchFilters } from "./SearchFilters";

const PAGE_SECTIONS: AppSectionNavItem[] = [
  { id: "inicio", label: "Início", icon: "lucide:home" },
  { id: "pesquisar", label: "Pesquisar cadastros", icon: "lucide:search" },
  { id: "resultados", label: "Resultados da pesquisa", icon: "lucide:table" },
  { id: "cadastro", label: "Novo cadastro", icon: "lucide:user-plus" },
  ...FORM_SECTIONS,
];

export function PeoplePage() {
  const directory = usePeopleDirectory();
  useA11yNav(PAGE_SECTIONS);

  return (
    <div className="scroll-mt-8 space-y-4" id="secao-inicio">
      <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="flex h-full min-h-0 flex-col gap-4">
          <div className="scroll-mt-8" id="secao-pesquisar">
            <SearchFilters
              value={directory.draftFilters}
              onChange={directory.setDraftFilters}
              onSearch={directory.search}
            />
          </div>
          <div className="scroll-mt-8 min-h-0 flex-1" id="secao-resultados">
            <PeopleTable
              isError={directory.isError}
              isPending={directory.isPending}
              people={directory.people}
              onCreate={directory.startCreate}
              onDelete={directory.askDelete}
              onEdit={directory.startEdit}
              onRetry={() => {
                void directory.refetch();
              }}
              onToggle={directory.toggle}
              onViewPhoto={(person) => directory.selectPerson(person.id)}
              isResending={directory.isResending}
              onResend={(person) => {
                void directory.resendConfirmation(person);
              }}
            />
          </div>
        </div>
        <PhotoPreview person={directory.selectedPerson} />
      </div>

      <div className="scroll-mt-8" id="secao-cadastro">
        <PeopleForm
          key={directory.editingId ?? "create"}
          isSaving={directory.isSaving}
          values={directory.formValues}
          onCancel={directory.cancelForm}
          onSubmit={directory.save}
        />
      </div>

      <AppModal
        footer={
          <div className="flex justify-end gap-2">
            <AppButton
              variant="outline"
              onPress={() => directory.askDelete(null)}
            >
              Cancelar
            </AppButton>
            <AppButton
              isPending={directory.isDeleting}
              variant="danger"
              onPress={directory.confirmDelete}
            >
              Excluir
            </AppButton>
          </div>
        }
        isOpen={directory.personToDelete !== null}
        title="Excluir cadastro"
        onOpenChange={(open) => {
          if (!open) directory.askDelete(null);
        }}
      >
        <p>
          Excluir o cadastro de{" "}
          <strong>{directory.personToDelete?.name ?? "esta pessoa"}</strong>?
        </p>
      </AppModal>

      <AppSheet
        footer={
          <AppButton onPress={directory.closeMailNotice}>Entendi</AppButton>
        }
        isOpen={directory.mailNotice !== null}
        title="Confirmação de e-mail"
        onOpenChange={(open) => {
          if (!open) directory.closeMailNotice();
        }}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <AppIcon
            className={
              directory.mailNotice === "error"
                ? "size-12 text-red-500"
                : "size-12 text-emerald-500"
            }
            icon={directory.mailNotice === "error" ? "lucide:circle-x" : "lucide:circle-check"}
          />
          <p className="text-sm text-slate-600">
            {directory.mailNotice === "error"
              ? "Não foi possível enviar o e-mail agora. Tente de novo em instantes."
              : "Cadastro salvo. O e-mail de confirmação segue em segundo plano. Se este endereço existir, a mensagem chega em instantes. A ativação depende do clique nesse e-mail."}
          </p>
        </div>
      </AppSheet>
    </div>
  );
}
