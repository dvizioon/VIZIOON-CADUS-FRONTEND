export const BRAZIL_STATES = [
  { id: "AC", label: "AC" },
  { id: "AL", label: "AL" },
  { id: "AP", label: "AP" },
  { id: "AM", label: "AM" },
  { id: "BA", label: "BA" },
  { id: "CE", label: "CE" },
  { id: "DF", label: "DF" },
  { id: "ES", label: "ES" },
  { id: "GO", label: "GO" },
  { id: "MA", label: "MA" },
  { id: "MT", label: "MT" },
  { id: "MS", label: "MS" },
  { id: "MG", label: "MG" },
  { id: "PA", label: "PA" },
  { id: "PB", label: "PB" },
  { id: "PR", label: "PR" },
  { id: "PE", label: "PE" },
  { id: "PI", label: "PI" },
  { id: "RJ", label: "RJ" },
  { id: "RN", label: "RN" },
  { id: "RS", label: "RS" },
  { id: "RO", label: "RO" },
  { id: "RR", label: "RR" },
  { id: "SC", label: "SC" },
  { id: "SP", label: "SP" },
  { id: "SE", label: "SE" },
  { id: "TO", label: "TO" },
] as const;

const CITIES_BY_UF: Record<string, Array<{ id: string; label: string }>> = {
  CE: [
    { id: "Fortaleza", label: "Fortaleza" },
    { id: "Caucaia", label: "Caucaia" },
    { id: "Sobral", label: "Sobral" },
  ],
  SP: [
    { id: "São Paulo", label: "São Paulo" },
    { id: "Santos", label: "Santos" },
    { id: "Campinas", label: "Campinas" },
  ],
  RJ: [
    { id: "Rio de Janeiro", label: "Rio de Janeiro" },
    { id: "Niterói", label: "Niterói" },
  ],
  PE: [
    { id: "Recife", label: "Recife" },
    { id: "Olinda", label: "Olinda" },
  ],
};

export function citiesForUf(uf: string): Array<{ id: string; label: string }> {
  return CITIES_BY_UF[uf] ?? [];
}
