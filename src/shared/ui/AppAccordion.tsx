"use client";

import { Accordion } from "@heroui/react";
import type { ComponentProps, ReactNode } from "react";
import { AppIcon } from "./AppIcon";
import { AppTypography } from "./AppTypography";

type AppAccordionProps = ComponentProps<typeof Accordion>;

export function AppAccordion(props: AppAccordionProps) {
  return <Accordion {...props} />;
}

interface AppAccordionSectionProps {
  id: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function AppAccordionSection({
  id,
  title,
  icon,
  children,
}: AppAccordionSectionProps) {
  return (
    <Accordion.Item
      className="overflow-hidden rounded-md border border-slate-200 bg-white"
      data-section={`secao-${id}`}
      id={id}
    >
      <Accordion.Heading className="scroll-mt-8" id={`secao-${id}`}>
        <Accordion.Trigger
          aria-label={title}
          className="gap-2 bg-[#e8eef5] px-3 py-3 text-slate-800 hover:bg-[#dfe7f1]"
          data-section={`secao-${id}`}
        >
          {icon}
          <AppTypography
            as="span"
            className="flex-1 text-left text-slate-800"
            type="body"
            weight="semibold"
          >
            {title}
          </AppTypography>
          <Accordion.Indicator>
            <AppIcon className="size-5 text-slate-600" icon="lucide:chevron-down" />
          </Accordion.Indicator>
        </Accordion.Trigger>
      </Accordion.Heading>
      <Accordion.Panel>
        <Accordion.Body className="bg-white px-3 pb-3 pt-3">{children}</Accordion.Body>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
