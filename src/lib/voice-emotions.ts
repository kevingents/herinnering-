/** voice_emotion enum → Dutch label. */
export const VOICE_EMOTIONS = [
  "blij",
  "rustig",
  "serieus",
  "verdrietig",
  "grappig",
] as const;

export type VoiceEmotion = (typeof VOICE_EMOTIONS)[number];

export const EMOTION_LABEL: Record<VoiceEmotion, string> = {
  blij: "Blij",
  rustig: "Rustig",
  serieus: "Serieus",
  verdrietig: "Verdrietig",
  grappig: "Grappig",
};

export function emotionLabel(value: string): string {
  return EMOTION_LABEL[value as VoiceEmotion] ?? value;
}
