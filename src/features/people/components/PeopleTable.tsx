"use client";

import { useState } from "react";
import {
  AppAvatar,
  AppButton,
  AppCard,
  AppChip,
  AppIcon,
  AppSwitch,
  AppTable,
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/ui";
import { openFancyboxImage } from "@/shared/ui/AppFancybox";
import {
  formatBrl,
  formatDateRange,
  maskBrlPreview,
  maskCpfPreview,
} from "@/shared/utils/masks";
import type { Person } from "../types/person.types";

interface PeopleTableProps {
  people: Person[];
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  onCreate: () => void;
  onEdit: (person: Person) => void;
  onViewPhoto: (person: Person) => void;
  onDelete: (person: Person) => void;
  onToggle: (id: string, isActive: boolean) => void;
  onResend: (person: Person) => void;
  isResending?: boolean;
}

export function PeopleTable({
  people,
  isPending,
  isError,
  onRetry,
  onCreate,
  onEdit,
  onViewPhoto,
  onDelete,
  onToggle,
  onResend,
  isResending = false,
}: PeopleTableProps) {
  const [reveal, setReveal] = useState(false);

  return (
    <AppCard
      className="flex h-full flex-col"
      headerAction={
        <div className="flex items-center gap-2">
          <AppButton
            isIconOnly
            aria-label={reveal ? "Ocultar CPF e salário" : "Mostrar CPF e salário"}
            size="sm"
            className="cursor-pointer"
            variant="ghost"
            onPress={() => setReveal((open) => !open)}
          >
            <AppIcon
              className="size-5 text-slate-600"
              icon={reveal ? "lucide:eye" : "lucide:eye-off"}
            />
          </AppButton>
          <AppButton size="sm" onPress={onCreate}>
            <AppIcon className="size-5" icon="lucide:plus" />
            Incluir novo registro
          </AppButton>
        </div>
      }
      title="Resultados da pesquisa"
    >
      {isPending ? <LoadingState label="Carregando cadastros" /> : null}
      {isError ? (
        <ErrorState
          message="Não foi possível carregar os cadastros."
          onRetry={onRetry}
        />
      ) : null}
      {!isPending && !isError && people.length === 0 ? (
        <EmptyState title="Nenhum cadastro encontrado" />
      ) : null}
      {!isPending && !isError && people.length > 0 ? (
        <AppTable>
          <AppTable.ScrollContainer>
            <AppTable.Content aria-label="Resultados da pesquisa de pessoas">
              <AppTable.Header>
                <AppTable.Column>Foto</AppTable.Column>
                <AppTable.Column isRowHeader>CPF</AppTable.Column>
                <AppTable.Column>Nome</AppTable.Column>
                <AppTable.Column>Salário</AppTable.Column>
                <AppTable.Column>Período de contrato</AppTable.Column>
                <AppTable.Column>Situação</AppTable.Column>
                <AppTable.Column>Ações</AppTable.Column>
                <AppTable.Column>Ativar/desativar</AppTable.Column>
              </AppTable.Header>
              <AppTable.Body>
                {people.map((person) => (
                  <AppTable.Row id={person.id} key={person.id}>
                    <AppTable.Cell>
                      <button
                        aria-label={`Visualizar foto de ${person.name}`}
                        className="size-10 min-h-10 min-w-10 shrink-0 cursor-pointer overflow-hidden rounded-sm p-0"
                        type="button"
                        onClick={() => {
                          onViewPhoto(person);
                          void openFancyboxImage(person.photoUrl, person.name);
                        }}
                      >
                        <AppAvatar
                          alt={`Foto de ${person.name}`}
                          className="size-10 rounded-sm bg-slate-200"
                          fallback={
                            <AppIcon className="size-4 text-slate-400" icon="lucide:user" />
                          }
                          size="sm"
                          src={person.photoUrl}
                        />
                      </button>
                    </AppTable.Cell>
                    <AppTable.Cell>
                      {reveal ? person.cpf : maskCpfPreview(person.cpf)}
                    </AppTable.Cell>
                    <AppTable.Cell>{person.name}</AppTable.Cell>
                    <AppTable.Cell>
                      {reveal ? formatBrl(person.salary) : maskBrlPreview()}
                    </AppTable.Cell>
                    <AppTable.Cell>
                      {formatDateRange(person.contractStart, person.contractEnd)}
                    </AppTable.Cell>
                    <AppTable.Cell>
                      {person.status === "active" ? (
                        <AppChip color="success" label="Ativo" />
                      ) : (
                        <AppChip color="default" label="Inativo" />
                      )}
                    </AppTable.Cell>
                    <AppTable.Cell>
                      <div className="flex items-center gap-1">
                        <AppButton
                          isIconOnly
                          aria-label={`Editar ${person.name}`}
                          size="sm"
                          variant="ghost"
                          onPress={() => onEdit(person)}
                        >
                          <AppIcon className="size-5 text-blue-600" icon="lucide:pencil" />
                        </AppButton>
                        <AppButton
                          isIconOnly
                          aria-label={`Excluir ${person.name}`}
                          size="sm"
                          variant="ghost"
                          onPress={() => onDelete(person)}
                        >
                          <AppIcon className="size-5 text-red-500" icon="lucide:trash-2" />
                        </AppButton>
                        {person.emailConfirmed ? (
                          <span className="inline-flex size-8 items-center justify-center" title="E-mail confirmado">
                            <AppIcon
                              className="size-5 text-emerald-500"
                              icon="lucide:circle-check"
                            />
                          </span>
                        ) : (
                          <AppButton
                            isIconOnly
                            aria-label={`Reenviar e-mail de confirmação para ${person.name}`}
                            isDisabled={isResending}
                            size="sm"
                            variant="ghost"
                            onPress={() => onResend(person)}
                          >
                            <AppIcon className="size-5 text-blue-600" icon="lucide:mail" />
                          </AppButton>
                        )}
                      </div>
                    </AppTable.Cell>
                    <AppTable.Cell>
                      <AppSwitch
                        aria-label={`Ativar ou desativar ${person.name}`}
                        isSelected={person.isActive}
                        onChange={(isActive) => onToggle(person.id, isActive)}
                      />
                    </AppTable.Cell>
                  </AppTable.Row>
                ))}
              </AppTable.Body>
            </AppTable.Content>
          </AppTable.ScrollContainer>
        </AppTable>
      ) : null}
    </AppCard>
  );
}
