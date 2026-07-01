"use client";

import { useFormStatus } from "react-dom";
import { Trash2 } from "lucide-react";
import { deleteAccount, deleteLegacy } from "./actions";

function Pending({ label, busy }: { label: string; busy: string }) {
  const { pending } = useFormStatus();
  return <>{pending ? busy : label}</>;
}

export function DeleteLegacyButton({
  legacyId,
  name,
}: {
  legacyId: string;
  name: string;
}) {
  return (
    <form
      action={deleteLegacy}
      onSubmit={(e) => {
        if (
          !window.confirm(
            `Weet je zeker dat je de nalatenschap van ${name} definitief wilt verwijderen? Alle herinneringen, foto's en opnames gaan verloren. Dit kan niet ongedaan worden gemaakt.`,
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="legacyId" value={legacyId} />
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full border border-danger/40 px-4 py-2 font-meta text-xs uppercase tracking-[0.12em] text-danger transition-colors hover:bg-danger/10"
      >
        <Trash2 className="size-3.5" />
        <Pending label="Verwijderen" busy="Bezig…" />
      </button>
    </form>
  );
}

export function DeleteAccountButton() {
  return (
    <form
      action={deleteAccount}
      onSubmit={(e) => {
        const ok =
          window.confirm(
            "Weet je het zeker? Je account en ALLE nalatenschappen, herinneringen, foto's en opnames worden definitief verwijderd.",
          ) &&
          window.confirm(
            "Dit is onomkeerbaar. Typ niets — klik nogmaals OK om je account definitief te verwijderen.",
          );
        if (!ok) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-danger px-6 font-meta text-xs uppercase tracking-[0.14em] text-cream transition-all hover:brightness-105"
      >
        <Trash2 className="size-4" />
        <Pending label="Verwijder mijn account" busy="Verwijderen…" />
      </button>
    </form>
  );
}
