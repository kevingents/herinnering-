"use client";

import { useFormStatus } from "react-dom";
import { removePerson } from "./actions";

function Button({ name }: { name: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={`Verwijder ${name}`}
      onClick={(e) => {
        if (!window.confirm(`${name} uit de familie verwijderen?`)) {
          e.preventDefault();
        }
      }}
      className="text-meta text-foreground-muted transition-colors hover:text-danger disabled:opacity-50"
    >
      {pending ? "…" : "verwijder"}
    </button>
  );
}

export function RemovePersonButton({
  slug,
  personId,
  name,
}: {
  slug: string;
  personId: string;
  name: string;
}) {
  return (
    <form action={removePerson}>
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="personId" value={personId} />
      <Button name={name} />
    </form>
  );
}
