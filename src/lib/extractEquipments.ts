const DICT = [
  "gps",
  "apple carplay",
  "android auto",
  "camera de recul",
  "radar",
  "toit ouvrant",
  "sieges chauffants",
  "bluetooth",
  "abs",
  "esp",
];

export const extractEquipments = (desc: string) =>
  DICT.filter((k) => desc.toLowerCase().includes(k));
