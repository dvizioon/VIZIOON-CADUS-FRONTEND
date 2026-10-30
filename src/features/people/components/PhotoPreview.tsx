"use client";

import { AppAvatar, AppIcon, AppTypography } from "@/shared/ui";
import { openFancyboxImage } from "@/shared/ui/AppFancybox";
import type { Person } from "../types/person.types";

interface PhotoPreviewProps {
  person: Person | null;
}

export function PhotoPreview({ person }: PhotoPreviewProps) {
  const name = person?.name ?? "";
  const cargo = person?.cargo ?? "";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("");

  return (
    <div className="h-full min-h-0 [perspective:1000px]">
    <article className="group relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-white shadow-[0_12px_28px_rgba(11,35,64,0.18)] transition-transform duration-500 ease-out will-change-transform hover:z-10 hover:shadow-[0_28px_48px_rgba(11,35,64,0.32)] hover:[transform:translateY(-8px)_rotateY(-16deg)_rotateX(6deg)_scale(1.04)]">
      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-br from-white/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="flex justify-center pt-3">
        <span className="h-1.5 w-10 rounded-full bg-slate-300" />
      </div>
      <div className="flex flex-col items-center px-4 pt-3 pb-2">
        <AppIcon className="size-6 text-[#0b2340]" icon="lucide:anchor" />
        <AppTypography className="text-[#2563eb]" type="h6" weight="bold">
          Gestão Portuária
        </AppTypography>
        <AppTypography className="text-[#60a5fa]" type="body-xs">
          Crachá do cadastro
        </AppTypography>
      </div>
      <div className="relative mt-2 flex min-h-0 flex-1 flex-col">
        <svg
          aria-hidden="true"
          className="absolute inset-x-0 top-10 h-10 w-full"
          preserveAspectRatio="none"
          viewBox="0 0 200 40"
        >
          <path d="M0 22 Q50 0 100 18 T200 10 V40 H0 Z" fill="#1e4a8c" />
          <path d="M0 28 Q60 8 120 24 T200 16 V40 H0 Z" fill="#3b82f6" />
        </svg>
        <div className="relative flex justify-center">
          <button
            aria-label={name ? `Ampliar foto de ${name}` : "Ampliar foto"}
            className="size-28 shrink-0 overflow-hidden rounded-sm disabled:cursor-default"
            disabled={!person?.photoUrl}
            type="button"
            onClick={() => openFancyboxImage(person?.photoUrl, name)}
          >
            <AppAvatar
              alt={name ? `Foto de ${name}` : "Foto do crachá"}
              className="size-28 rounded-sm border-4 border-white bg-slate-200 shadow"
              fallback={
                initials || (
                  <AppIcon className="size-10 text-slate-400" icon="lucide:user" />
                )
              }
              size="lg"
              src={person?.photoUrl}
            />
          </button>
        </div>
        <div className="relative flex flex-1 flex-col bg-[#3b82f6] px-4 pt-4 pb-5">
          <AppTypography className="text-white" type="body-xs">
            Nome
          </AppTypography>
          <div className="mt-1 rounded-md border-2 border-white px-2 py-1">
            <AppTypography as="span" className="text-white" type="body-sm" weight="semibold">
              {name || "\u00a0"}
            </AppTypography>
          </div>
          <AppTypography className="mt-3 text-white" type="body-xs">
            Cargo
          </AppTypography>
          <div className="mt-1 rounded-md border-2 border-white px-2 py-1">
            <AppTypography as="span" className="text-white" type="body-sm" weight="semibold">
              {cargo || "\u00a0"}
            </AppTypography>
          </div>
        </div>
      </div>
    </article>
    </div>
  );
}
