import { z } from "zod";
import { isValidCpf, onlyDigits, parseBrl } from "@/shared/utils/masks";

export const PERSON_STATUS = ["active", "inactive"] as const;

export const peopleFiltersSchema = z.object({
  cpf: z.string(),
  name: z.string(),
  salaryMin: z.string(),
  salaryMax: z.string(),
  contractStart: z.string(),
  contractEnd: z.string(),
});

const attachmentSchema = z.object({
  fileName: z.string().nullable(),
  description: z.string(),
  url: z.string().nullable().optional(),
  dataUrl: z.string().nullable().optional(),
});

export const personSchema = z.object({
  id: z.string(),
  cpf: z.string(),
  name: z.string(),
  cargo: z.string(),
  salary: z.number(),
  contractStart: z.string(),
  contractEnd: z.string(),
  status: z.enum(PERSON_STATUS),
  photoUrl: z.string().nullable(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
  number: z.string(),
  noNumber: z.boolean(),
  uf: z.string(),
  city: z.string(),
  cep: z.string(),
  notes: z.string(),
  isActive: z.boolean(),
  emailConfirmed: z.boolean().default(false),
  attachments: z.object({
    rg: attachmentSchema,
    cpfDoc: attachmentSchema,
    residence: attachmentSchema,
  }),
});

export const personFormSchema = z
  .object({
    cpf: z
      .string()
      .refine((value) => onlyDigits(value).length === 11, "CPF deve ter 11 dígitos")
      .refine(isValidCpf, "CPF inválido"),
    name: z
      .string()
      .trim()
      .min(3, "Informe o nome completo")
      .regex(/^[\p{L}\s'.-]+$/u, "Nome não pode ter número ou símbolo"),
    cargo: z.string().trim().min(1, "Selecione o cargo"),
    address: z.string().trim().min(3, "Informe o endereço"),
    number: z.string(),
    noNumber: z.boolean(),
    uf: z.string().min(2, "Selecione a UF"),
    city: z.string().min(2, "Selecione a cidade"),
    cep: z
      .string()
      .refine((value) => onlyDigits(value).length === 8, "CEP deve ter 8 dígitos"),
    email: z.email("E-mail inválido"),
    phone: z
      .string()
      .refine(
        (value) => value.length === 0 || [10, 11].includes(onlyDigits(value).length),
        "Telefone deve ter 10 ou 11 dígitos",
      ),
    isActive: z.boolean(),
    emailConfirmed: z.boolean().default(false),
    notes: z.string().max(500, "Observação muito longa"),
    salary: z.string().refine((value) => {
      if (!value) return true;
      return parseBrl(value) >= 0;
    }, "Salário não pode ser negativo"),
    contractStart: z.string().min(1, "Informe a data inicial"),
    contractEnd: z.string(),
    indefiniteContract: z.boolean(),
    photoUrl: z.string().nullable(),
    attachments: z.object({
      rg: attachmentSchema,
      cpfDoc: attachmentSchema,
      residence: attachmentSchema,
    }),
  })
  .superRefine((value, ctx) => {
    if (!value.noNumber) {
      if (value.number.trim().length === 0 || !/^\d+$/.test(value.number.trim())) {
        ctx.addIssue({
          code: "custom",
          message: "Informe um número válido",
          path: ["number"],
        });
      }
    }

    if (!value.indefiniteContract) {
      if (!value.contractEnd) {
        ctx.addIssue({
          code: "custom",
          message: "Informe a data final",
          path: ["contractEnd"],
        });
      } else if (value.contractStart && value.contractEnd < value.contractStart) {
        ctx.addIssue({
          code: "custom",
          message: "A data final deve ser igual ou posterior à inicial.",
          path: ["contractEnd"],
        });
      }
    }
  });

export const personListSchema = z.array(personSchema);
