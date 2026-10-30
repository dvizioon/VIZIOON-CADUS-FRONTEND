import { onlyDigits } from "@/shared/utils/masks";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export interface CepLookup {
  cep: string;
  address: string;
  district: string;
  city: string;
  uf: string;
}

export async function lookupCep(cep: string): Promise<CepLookup | null> {
  const digits = onlyDigits(cep);
  if (digits.length !== 8) {
    return null;
  }

  const response = await fetch(`${API_URL}/api/cep/${digits}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error("Falha ao consultar CEP");
  }
  return (await response.json()) as CepLookup;
}
