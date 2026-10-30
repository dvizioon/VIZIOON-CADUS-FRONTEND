"use client";

import { AppButton, AppCard, AppDatePicker, AppIcon, AppInput, AppTypography } from "@/shared/ui";
import { maskBrl, maskCpf } from "@/shared/utils/masks";
import type { PeopleFilters } from "../types/person.types";

interface SearchFiltersProps {
  value: PeopleFilters;
  onChange: (value: PeopleFilters) => void;
  onSearch: () => void;
}

export function SearchFilters({ value, onChange, onSearch }: SearchFiltersProps) {
  const patch = (partial: Partial<PeopleFilters>): void => {
    onChange({ ...value, ...partial });
  };

  return (
    <AppCard title="Pesquisar cadastros">
      <div className="grid grid-cols-1 items-end gap-3 xl:grid-cols-[10.5rem_minmax(12rem,1fr)_15rem_minmax(17rem,1fr)_auto]">
        <AppInput
          isRequired
          label="CPF"
          placeholder="000.000.000-00"
          value={value.cpf}
          onChange={(cpf) => patch({ cpf: maskCpf(cpf) })}
        />
        <AppInput
          isRequired
          label="Nome"
          placeholder="Digite o nome da pessoa"
          value={value.name}
          onChange={(name) => patch({ name })}
        />
        <div className="flex min-w-0 flex-col gap-1">
          <AppTypography
            as="span"
            className="flex h-5 items-center text-slate-600"
            type="body-xs"
            weight="medium"
          >
            Faixa salarial
          </AppTypography>
          <div className="flex h-9 items-center gap-2">
            <AppInput
              aria-label="Salário mínimo"
              className="min-w-0"
              label=""
              placeholder="R$ 0,00"
              value={value.salaryMin}
              onChange={(salaryMin) => patch({ salaryMin: maskBrl(salaryMin) })}
            />
            <span className="shrink-0 text-xs text-slate-400">até</span>
            <AppInput
              aria-label="Salário máximo"
              className="min-w-0"
              label=""
              placeholder="R$ 0,00"
              value={value.salaryMax}
              onChange={(salaryMax) => patch({ salaryMax: maskBrl(salaryMax) })}
            />
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <AppTypography
            as="span"
            className="flex h-5 items-center text-slate-600"
            type="body-xs"
            weight="medium"
          >
            Período de contrato
          </AppTypography>
          <div className="grid min-w-0 grid-cols-2 items-center gap-2">
            <AppDatePicker
              aria-label="Início"
              label=""
              value={value.contractStart}
              onChange={(contractStart) => patch({ contractStart })}
            />
            <AppDatePicker
              aria-label="Fim"
              label=""
              value={value.contractEnd}
              onChange={(contractEnd) => patch({ contractEnd })}
            />
          </div>
        </div>
        <AppButton className="h-9 min-h-9 shrink-0" onPress={onSearch}>
          <AppIcon className="size-5" icon="lucide:search" />
          Buscar
        </AppButton>
      </div>
    </AppCard>
  );
}
