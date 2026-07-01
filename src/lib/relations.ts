/** Family relations, grouped by generation for the tree layout. */
export const RELATIONS = [
  { key: "grootouder", label: "Grootouder", group: "Grootouders", gen: -2 },
  { key: "ouder", label: "Ouder", group: "Ouders", gen: -1 },
  { key: "broer_zus", label: "Broer / zus", group: "Broers & zussen", gen: 0 },
  { key: "partner", label: "Partner", group: "Partner", gen: 0 },
  { key: "kind", label: "Kind", group: "Kinderen", gen: 1 },
  { key: "kleinkind", label: "Kleinkind", group: "Kleinkinderen", gen: 2 },
  { key: "vriend", label: "Vriend / vriendin", group: "Vrienden", gen: 3 },
  { key: "anders", label: "Anders", group: "Overig", gen: 4 },
] as const;

export type RelationKey = (typeof RELATIONS)[number]["key"];

export function relationLabel(key: string): string {
  return RELATIONS.find((r) => r.key === key)?.label ?? "Anders";
}

export function relationGroup(key: string): string {
  return RELATIONS.find((r) => r.key === key)?.group ?? "Overig";
}
