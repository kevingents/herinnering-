import {
  Baby,
  Briefcase,
  Circle,
  Flag,
  GraduationCap,
  Heart,
  HeartCrack,
  Plane,
  Sparkles,
  Sunset,
  Users,
  type LucideIcon,
} from "lucide-react";

/** life_event_category enum → Dutch label + icon. Order = select order. */
export const LIFE_EVENT_CATEGORIES = [
  "birth",
  "childhood",
  "school",
  "love",
  "work",
  "children",
  "travel",
  "milestone",
  "loss",
  "retirement",
  "other",
] as const;

export type LifeEventCategory = (typeof LIFE_EVENT_CATEGORIES)[number];

export const CATEGORY_LABEL: Record<LifeEventCategory, string> = {
  birth: "Geboorte",
  childhood: "Jeugd",
  school: "School",
  love: "Liefde",
  work: "Werk",
  children: "Kinderen",
  travel: "Reizen",
  milestone: "Mijlpaal",
  loss: "Verlies",
  retirement: "Pensioen",
  other: "Anders",
};

export const CATEGORY_ICON: Record<LifeEventCategory, LucideIcon> = {
  birth: Sparkles,
  childhood: Baby,
  school: GraduationCap,
  love: Heart,
  work: Briefcase,
  children: Users,
  travel: Plane,
  milestone: Flag,
  loss: HeartCrack,
  retirement: Sunset,
  other: Circle,
};

export function categoryLabel(value: string): string {
  return CATEGORY_LABEL[value as LifeEventCategory] ?? "Anders";
}

export function categoryIcon(value: string): LucideIcon {
  return CATEGORY_ICON[value as LifeEventCategory] ?? Circle;
}
