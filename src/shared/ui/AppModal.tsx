"use client";

import { Modal } from "@heroui/react";
import type { ReactNode } from "react";

interface AppModalProps {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  footer?: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "cover" | "full";
}

export function AppModal({
  title,
  children,
  isOpen,
  onOpenChange,
  footer,
  size = "md",
}: AppModalProps) {
  if (!isOpen) return null;

  return (
    <Modal isOpen onOpenChange={onOpenChange}>
      <Modal.Backdrop>
        <Modal.Container size={size}>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>{title}</Modal.Heading>
            </Modal.Header>
            <Modal.Body className={size === "cover" || size === "full" ? "min-h-0 p-2" : undefined}>
              {children}
            </Modal.Body>
            {footer ? <Modal.Footer>{footer}</Modal.Footer> : null}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
