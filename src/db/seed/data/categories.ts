// Kategori produk (2 tingkat). Produk selalu dikaitkan ke kategori anak (leaf).
// Saat filter di UI memilih kategori induk, ambil juga semua kategori anaknya.

export type SeedCategory = {
  slug: string;
  name: string;
  parent?: string; // slug induk; kosong = kategori induk
};

export const categories: SeedCategory[] = [
  // Induk
  { slug: "oli-cairan", name: "Oli & Cairan" },
  { slug: "mesin", name: "Mesin" },
  { slug: "cvt", name: "CVT & Transmisi" },
  { slug: "rem", name: "Rem" },
  { slug: "rantai-gear", name: "Rantai & Gear" },
  { slug: "ban-velg", name: "Ban & Velg" },
  { slug: "kelistrikan", name: "Kelistrikan" },
  { slug: "suspensi", name: "Suspensi & Kaki-kaki" },
  { slug: "body", name: "Body & Aksesori" },

  // Oli & Cairan
  { slug: "oli-mesin", name: "Oli Mesin", parent: "oli-cairan" },
  { slug: "oli-gardan", name: "Oli Gardan", parent: "oli-cairan" },
  { slug: "coolant", name: "Coolant Radiator", parent: "oli-cairan" },
  { slug: "minyak-rem", name: "Minyak Rem", parent: "oli-cairan" },

  // Mesin
  { slug: "filter-udara", name: "Filter Udara", parent: "mesin" },
  { slug: "filter-oli", name: "Filter Oli", parent: "mesin" },
  { slug: "busi", name: "Busi", parent: "mesin" },
  { slug: "piston-ring", name: "Piston & Ring", parent: "mesin" },
  { slug: "paking", name: "Paking & Gasket", parent: "mesin" },

  // CVT & Transmisi
  { slug: "v-belt", name: "V-Belt", parent: "cvt" },
  { slug: "roller-cvt", name: "Roller CVT", parent: "cvt" },
  { slug: "kampas-ganda", name: "Kampas Ganda", parent: "cvt" },
  { slug: "per-cvt", name: "Per CVT", parent: "cvt" },

  // Rem
  { slug: "kampas-rem", name: "Kampas Rem", parent: "rem" },

  // Rantai & Gear
  { slug: "gear-set", name: "Gear Set (Rantai + Gir)", parent: "rantai-gear" },

  // Ban & Velg
  { slug: "ban-luar", name: "Ban Luar", parent: "ban-velg" },

  // Kelistrikan
  { slug: "aki", name: "Aki", parent: "kelistrikan" },
  { slug: "lampu", name: "Lampu", parent: "kelistrikan" },
  { slug: "kiprok-koil", name: "Kiprok, Koil & CDI", parent: "kelistrikan" },

  // Suspensi & Kaki-kaki
  { slug: "shock-belakang", name: "Shock Belakang", parent: "suspensi" },
  { slug: "seal-shock", name: "Seal Shock", parent: "suspensi" },

  // Body & Aksesori
  { slug: "spion", name: "Spion", parent: "body" },
  { slug: "aksesori", name: "Aksesori", parent: "body" },
];
