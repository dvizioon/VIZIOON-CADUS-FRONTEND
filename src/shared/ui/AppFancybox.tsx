"use client";

import { Fancybox } from "@fancyapps/ui/dist/fancybox/fancybox.js";

export async function openFancyboxImage(
  src: string | null | undefined,
  caption?: string,
): Promise<void> {
  if (!src) return;

  let url = src;
  let revoke: string | null = null;
  if (!src.startsWith("blob:")) {
    const response = src.startsWith("data:")
      ? await fetch(src)
      : await fetch(src, { cache: "no-store" });
    if (!response.ok) return;
    url = URL.createObjectURL(await response.blob());
    revoke = url;
  }

  Fancybox.show([{ src: url, caption, type: "image" }], {
    on: {
      close: () => {
        if (revoke) URL.revokeObjectURL(revoke);
      },
    },
  });
}
