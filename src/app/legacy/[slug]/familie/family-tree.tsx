import { relationLabel } from "@/lib/relations";
import type { Person } from "@/lib/data/family";
import { RemovePersonButton } from "./remove-person-button";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function PersonCard({
  person,
  slug,
  canEdit,
}: {
  person: Person;
  slug: string;
  canEdit: boolean;
}) {
  return (
    <div className="flex w-28 flex-col items-center gap-1.5 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-sand to-wheat font-display text-lg text-forest-deep">
        {initials(person.name)}
      </span>
      <span className="font-body text-sm leading-tight text-foreground">
        {person.name}
      </span>
      <span className="text-meta text-foreground-muted">
        {relationLabel(person.relation ?? "anders")}
      </span>
      {person.notes ? (
        <span className="line-clamp-2 font-body text-xs italic leading-snug text-foreground-muted">
          {person.notes}
        </span>
      ) : null}
      {canEdit ? (
        <RemovePersonButton slug={slug} personId={person.id} name={person.name} />
      ) : null}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      {label ? <span className="text-meta">{label}</span> : null}
      <div className="flex flex-wrap items-start justify-center gap-6">
        {children}
      </div>
    </div>
  );
}

function Connector() {
  return <div aria-hidden className="h-6 w-px bg-border" />;
}

export function FamilyTree({
  subjectName,
  people,
  slug,
  canEdit,
}: {
  subjectName: string;
  people: Person[];
  slug: string;
  canEdit: boolean;
}) {
  const by = (key: string) => people.filter((p) => (p.relation ?? "anders") === key);
  const grootouders = by("grootouder");
  const ouders = by("ouder");
  const siblings = by("broer_zus");
  const partners = by("partner");
  const kinderen = by("kind");
  const kleinkinderen = by("kleinkind");
  const vrienden = by("vriend");
  const overig = by("anders");

  const rows: React.ReactNode[] = [];
  const push = (node: React.ReactNode) => {
    if (rows.length > 0) rows.push(<Connector key={`c${rows.length}`} />);
    rows.push(node);
  };

  if (grootouders.length)
    push(
      <Row key="grootouders" label="Grootouders">
        {grootouders.map((p) => (
          <PersonCard key={p.id} person={p} slug={slug} canEdit={canEdit} />
        ))}
      </Row>,
    );

  if (ouders.length)
    push(
      <Row key="ouders" label="Ouders">
        {ouders.map((p) => (
          <PersonCard key={p.id} person={p} slug={slug} canEdit={canEdit} />
        ))}
      </Row>,
    );

  // Center row: siblings · SUBJECT · partner
  push(
    <Row key="subject">
      {siblings.map((p) => (
        <PersonCard key={p.id} person={p} slug={slug} canEdit={canEdit} />
      ))}
      <div className="flex w-40 flex-col items-center gap-2 text-center">
        <span className="flex size-20 items-center justify-center rounded-full border-2 border-forest/50 bg-forest/[0.08] font-display text-2xl text-forest-deep">
          {initials(subjectName)}
        </span>
        <span className="font-display text-lg leading-tight text-forest-deep">
          {subjectName}
        </span>
        <span className="text-meta text-forest">Dit leven</span>
      </div>
      {partners.map((p) => (
        <PersonCard key={p.id} person={p} slug={slug} canEdit={canEdit} />
      ))}
    </Row>,
  );

  if (kinderen.length)
    push(
      <Row key="kinderen" label="Kinderen">
        {kinderen.map((p) => (
          <PersonCard key={p.id} person={p} slug={slug} canEdit={canEdit} />
        ))}
      </Row>,
    );

  if (kleinkinderen.length)
    push(
      <Row key="kleinkinderen" label="Kleinkinderen">
        {kleinkinderen.map((p) => (
          <PersonCard key={p.id} person={p} slug={slug} canEdit={canEdit} />
        ))}
      </Row>,
    );

  if (vrienden.length)
    push(
      <Row key="vrienden" label="Vrienden">
        {vrienden.map((p) => (
          <PersonCard key={p.id} person={p} slug={slug} canEdit={canEdit} />
        ))}
      </Row>,
    );

  if (overig.length)
    push(
      <Row key="overig" label="Overig">
        {overig.map((p) => (
          <PersonCard key={p.id} person={p} slug={slug} canEdit={canEdit} />
        ))}
      </Row>,
    );

  return <div className="flex flex-col items-center">{rows}</div>;
}
