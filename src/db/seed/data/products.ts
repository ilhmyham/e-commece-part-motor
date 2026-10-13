// Data produk untuk seed (113 produk).
// PENTING:
// - Harga (Rupiah), berat, dan KECOCOKAN (fitment) adalah data contoh untuk belajar,
//   BUKAN data katalog resmi. Cek ulang bila ingin dipakai serius.
// - partNumber sengaja dikosongkan di sebagian besar produk. Isi manual dari
//   kemasan/katalog asli untuk menguji fitur pencarian nomor part.
//
// Aturan `fits` (dibaca oleh script seed):
//   - slug model, mis. "honda-beat"            -> cocok untuk SEMUA varian model itu
//   - key varian, mis. "honda-vario-125-2018"  -> cocok hanya untuk varian itu
//     (key varian = `${model.slug}-${variant.yearFrom}`)
//   Produk universal (oli, lampu sein, dll.) diisi dengan daftar model yang relevan.

export type SeedProduct = {
  sku: string;
  name: string;
  slug: string;
  brand: string;
  category: string; // slug kategori anak
  price: number; // Rupiah, integer
  weightGram: number;
  stock: number;
  condition: "new" | "used" | "refurbished";
  partNumber?: string;
  fits: string[];
};

const M = {
  beat: "honda-beat",
  v125: "honda-vario-125",
  v160: "honda-vario-160",
  scoopy: "honda-scoopy",
  pcx: "honda-pcx-160",
  supra: "honda-supra-x-125",
  cb150r: "honda-cb150r",
  mio: "yamaha-mio-m3",
  nmax: "yamaha-nmax",
  aerox: "yamaha-aerox",
  vixion: "yamaha-vixion",
  fino: "yamaha-fino-125",
  satria: "suzuki-satria-f150",
  address: "suzuki-address",
  nex: "suzuki-nex-ii",
  ninja: "kawasaki-ninja-250",
  klx: "kawasaki-klx-150",
  w175: "kawasaki-w175",
} as const;

const MATIC = [M.beat, M.v125, M.v160, M.scoopy, M.pcx, M.mio, M.nmax, M.aerox, M.fino, M.address, M.nex];
const MANUAL = [M.supra, M.cb150r, M.vixion, M.satria, M.ninja, M.klx, M.w175];
const ALL = [...MATIC, ...MANUAL];
const LIQUID = [M.v160, M.pcx, M.nmax, M.aerox, M.cb150r, M.vixion, M.ninja]; // model berpendingin cairan

const YGP = "Yamaha Genuine Parts";
const SGP = "Suzuki Genuine Parts";
const KGP = "Kawasaki Genuine Parts";

type Opts = {
  stock?: number;
  condition?: "new" | "used" | "refurbished";
  partNumber?: string;
};

// [sku, nama, merek, kategori, harga, berat(gram), fits, opsi?]
type Row = [string, string, string, string, number, number, string[], Opts?];

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const rows: Row[] = [
  // ---------- Oli & Cairan ----------
  ["OLI-AHM-MPX2-08", "AHM MPX2 Oli Matic 0.8L", "AHM", "oli-mesin", 58000, 900, MATIC],
  ["OLI-AHM-MPX1-10", "AHM MPX1 Oli Motor Bebek 1L", "AHM", "oli-mesin", 62000, 1000, MANUAL],
  ["OLI-YGP-MATIC-08", "Yamalube Matic 0.8L", YGP, "oli-mesin", 56000, 900, MATIC],
  ["OLI-YGP-SPORT-10", "Yamalube Sport 10W-40 1L", YGP, "oli-mesin", 70000, 1000, MANUAL],
  ["OLI-MOTUL-3000-10", "Motul 3000 Plus 4T 10W-40 1L", "Motul", "oli-mesin", 82000, 1000, ALL],
  ["OLI-SHELL-AX7-08", "Shell Advance AX7 Scooter 10W-40 0.8L", "Shell", "oli-mesin", 69000, 900, MATIC],
  ["OLI-CASTROL-P1-10", "Castrol Power1 4T 10W-40 1L", "Castrol", "oli-mesin", 89000, 1000, MANUAL],
  ["OLI-GARDAN-HON", "Oli Gardan Matic Honda 120ml", "AHM", "oli-gardan", 16000, 150, [M.beat, M.v125, M.v160, M.scoopy, M.pcx]],
  ["OLI-GARDAN-YAM", "Oli Gardan Yamalube 100ml", YGP, "oli-gardan", 15000, 140, [M.mio, M.nmax, M.aerox, M.fino]],
  ["COOL-PRESTONE-1L", "Radiator Coolant Siap Pakai 1L", "Prestone", "coolant", 42000, 1100, LIQUID],
  ["REM-MINYAK-DOT3", "Minyak Rem DOT 3 100ml", "Prestone", "minyak-rem", 20000, 130, ALL],

  // ---------- Filter udara ----------
  ["FUD-AHM-BEAT", "Filter Udara Honda Beat", "AHM", "filter-udara", 38000, 80, [M.beat]],
  ["FUD-AHM-V125", "Filter Udara Honda Vario 125", "AHM", "filter-udara", 42000, 90, [M.v125]],
  ["FUD-AHM-V160", "Filter Udara Honda Vario 160", "AHM", "filter-udara", 65000, 110, [M.v160]],
  ["FUD-AHM-SCOOPY", "Filter Udara Honda Scoopy", "AHM", "filter-udara", 40000, 85, [M.scoopy]],
  ["FUD-YGP-NMAX", "Filter Udara Yamaha NMAX", YGP, "filter-udara", 75000, 100, [M.nmax]],
  ["FUD-YGP-AEROX", "Filter Udara Yamaha Aerox 155", YGP, "filter-udara", 70000, 100, [M.aerox]],
  ["FUD-YGP-MIO", "Filter Udara Yamaha Mio M3", YGP, "filter-udara", 40000, 80, [M.mio]],
  ["FUD-YGP-VIXION", "Filter Udara Yamaha Vixion", YGP, "filter-udara", 58000, 95, [M.vixion]],
  ["FUD-SGP-SATRIA", "Filter Udara Suzuki Satria F150", SGP, "filter-udara", 62000, 100, [M.satria]],
  ["FUD-KGP-NINJA", "Filter Udara Kawasaki Ninja 250", KGP, "filter-udara", 125000, 150, [M.ninja]],

  // ---------- Filter oli ----------
  ["FOL-YGP-155", "Filter Oli Yamaha NMAX & Aerox", YGP, "filter-oli", 45000, 90, [M.nmax, M.aerox]],
  ["FOL-YGP-VIXION", "Filter Oli Yamaha Vixion", YGP, "filter-oli", 40000, 90, [M.vixion]],
  ["FOL-AHM-CB150R", "Filter Oli Honda CB150R", "AHM", "filter-oli", 38000, 90, [M.cb150r]],
  ["FOL-SGP-SATRIA", "Filter Oli Suzuki Satria F150", SGP, "filter-oli", 42000, 90, [M.satria]],
  ["FOL-KGP-NINJA", "Filter Oli Kawasaki Ninja 250", KGP, "filter-oli", 55000, 100, [M.ninja]],

  // ---------- Busi ----------
  ["BUSI-NGK-CPR9EA9", "Busi NGK CPR9EA-9", "NGK", "busi", 28000, 30, [M.beat, M.v125, M.scoopy], { partNumber: "CPR9EA-9" }],
  ["BUSI-NGK-CPR8EA9", "Busi NGK CPR8EA-9", "NGK", "busi", 32000, 30, [M.nmax, M.aerox], { partNumber: "CPR8EA-9", stock: 3 }],
  ["BUSI-AHM-V160", "Busi Standar Honda Vario 160 & PCX 160", "AHM", "busi", 65000, 35, [M.v160, M.pcx]],
  ["BUSI-YGP-MIO", "Busi Standar Yamaha Mio M3 & Fino 125", YGP, "busi", 30000, 30, [M.mio, M.fino]],
  ["BUSI-YGP-VIXION", "Busi Standar Yamaha Vixion", YGP, "busi", 38000, 30, [M.vixion]],
  ["BUSI-AHM-SUPRA", "Busi Standar Honda Supra X 125", "AHM", "busi", 25000, 30, [M.supra]],
  ["BUSI-AHM-CB150R", "Busi Standar Honda CB150R", "AHM", "busi", 55000, 30, [M.cb150r]],
  ["BUSI-SGP-SATRIA", "Busi Standar Suzuki Satria F150", SGP, "busi", 32000, 30, [M.satria]],
  ["BUSI-KGP-NINJA", "Busi Standar Kawasaki Ninja 250", KGP, "busi", 85000, 35, [M.ninja]],

  // ---------- CVT: V-belt ----------
  ["CVT-VBELT-AHM-BEAT", "V-Belt Honda Beat & Scoopy Genuine", "AHM", "v-belt", 135000, 150, [M.beat, M.scoopy]],
  ["CVT-VBELT-AHM-V125", "V-Belt Honda Vario 125 Genuine", "AHM", "v-belt", 165000, 160, [M.v125]],
  ["CVT-VBELT-AHM-V160", "V-Belt Honda Vario 160 & PCX 160 Genuine", "AHM", "v-belt", 245000, 200, [M.v160, M.pcx]],
  ["CVT-VBELT-YGP-NMAX", "V-Belt Yamaha NMAX & Aerox 155 Genuine", YGP, "v-belt", 270000, 210, [M.nmax, M.aerox]],
  ["CVT-VBELT-YGP-MIO", "V-Belt Yamaha Mio M3 & Fino 125 Genuine", YGP, "v-belt", 145000, 160, [M.mio, M.fino]],
  ["CVT-VBELT-SGP-ADDR", "V-Belt Suzuki Address & Nex II Genuine", SGP, "v-belt", 140000, 150, [M.address, M.nex]],
  ["CVT-VBELT-TDR-BEAT", "V-Belt Racing Beat & Scoopy", "TDR", "v-belt", 175000, 150, [M.beat, M.scoopy]],

  // ---------- CVT: roller ----------
  ["CVT-ROLLER-BRT-BEAT", "Roller CVT Racing Beat & Scoopy", "BRT", "roller-cvt", 85000, 120, [M.beat, M.scoopy]],
  ["CVT-ROLLER-BRT-V125", "Roller CVT Racing Vario 125", "BRT", "roller-cvt", 90000, 125, [M.v125]],
  ["CVT-ROLLER-BRT-V160", "Roller CVT Racing Vario 160 & PCX 160", "BRT", "roller-cvt", 115000, 150, [M.v160, M.pcx]],
  ["CVT-ROLLER-BRT-NMAX", "Roller CVT Racing NMAX", "BRT", "roller-cvt", 120000, 150, [M.nmax]],
  ["CVT-ROLLER-BRT-MIO", "Roller CVT Racing Mio M3 & Fino 125", "BRT", "roller-cvt", 80000, 120, [M.mio, M.fino]],

  // ---------- CVT: kampas ganda ----------
  ["CVT-KG-AHM-BEAT", "Kampas Ganda Honda Beat & Scoopy", "AHM", "kampas-ganda", 110000, 200, [M.beat, M.scoopy]],
  // Contoh fitment tingkat varian: hanya eSP (2015) dan eSP LED (2018)
  ["CVT-KG-AHM-V125", "Kampas Ganda Honda Vario 125 eSP (2015-2022)", "AHM", "kampas-ganda", 125000, 210, ["honda-vario-125-2015", "honda-vario-125-2018"]],
  ["CVT-KG-AHM-V160", "Kampas Ganda Honda Vario 160 & PCX 160", "AHM", "kampas-ganda", 155000, 230, [M.v160, M.pcx]],
  ["CVT-KG-YGP-NMAX", "Kampas Ganda Yamaha NMAX & Aerox 155", YGP, "kampas-ganda", 165000, 240, [M.nmax, M.aerox]],
  ["CVT-KG-YGP-MIO", "Kampas Ganda Yamaha Mio M3 & Fino 125", YGP, "kampas-ganda", 105000, 190, [M.mio, M.fino]],

  // ---------- CVT: per ----------
  ["CVT-PER-BRT-BEAT", "Per CVT Racing Beat & Scoopy", "BRT", "per-cvt", 75000, 100, [M.beat, M.scoopy]],
  ["CVT-PER-BRT-V125", "Per CVT Racing Vario 125", "BRT", "per-cvt", 80000, 100, [M.v125]],
  ["CVT-PER-BRT-NMAX", "Per CVT Racing NMAX", "BRT", "per-cvt", 95000, 110, [M.nmax]],

  // ---------- Rem ----------
  ["REM-DEPAN-AHM-BEAT", "Kampas Rem Depan Honda Beat & Scoopy", "AHM", "kampas-rem", 38000, 100, [M.beat, M.scoopy]],
  ["REM-DEPAN-AHM-V125", "Kampas Rem Depan Honda Vario 125", "AHM", "kampas-rem", 65000, 110, [M.v125]],
  ["REM-DEPAN-AHM-V160", "Kampas Rem Depan Honda Vario 160 & PCX 160", "AHM", "kampas-rem", 95000, 120, [M.v160, M.pcx]],
  ["REM-DEPAN-YGP-NMAX", "Kampas Rem Depan Yamaha NMAX", YGP, "kampas-rem", 88000, 115, [M.nmax]],
  ["REM-DEPAN-YGP-AEROX", "Kampas Rem Depan Yamaha Aerox 155", YGP, "kampas-rem", 85000, 115, [M.aerox]],
  ["REM-DEPAN-YGP-MIO", "Kampas Rem Depan Yamaha Mio M3 & Fino 125", YGP, "kampas-rem", 42000, 100, [M.mio, M.fino]],
  ["REM-BLK-BENDIX-NMAX", "Kampas Rem Belakang Bendix NMAX & Aerox", "Bendix", "kampas-rem", 80000, 110, [M.nmax, M.aerox]],
  ["REM-DEPAN-BENDIX-VIXION", "Kampas Rem Depan Bendix Vixion", "Bendix", "kampas-rem", 80000, 110, [M.vixion]],
  ["REM-DEPAN-AHM-CB150R", "Kampas Rem Depan Honda CB150R", "AHM", "kampas-rem", 90000, 115, [M.cb150r]],
  ["REM-DEPAN-KGP-NINJA", "Kampas Rem Depan Kawasaki Ninja 250", KGP, "kampas-rem", 130000, 130, [M.ninja]],
  ["REM-TEROMOL-AHM-SUPRA", "Kampas Rem Teromol Honda Supra X 125", "AHM", "kampas-rem", 32000, 140, [M.supra]],

  // ---------- Rantai & Gear ----------
  ["GEAR-SSS-SUPRA", "Gear Set Honda Supra X 125 (Rantai + Gir)", "SSS", "gear-set", 190000, 900, [M.supra]],
  ["GEAR-SSS-CB150R", "Gear Set Honda CB150R (Rantai + Gir)", "SSS", "gear-set", 330000, 1100, [M.cb150r]],
  ["GEAR-SSS-VIXION", "Gear Set Yamaha Vixion (Rantai + Gir)", "SSS", "gear-set", 320000, 1100, [M.vixion]],
  ["GEAR-SSS-SATRIA", "Gear Set Suzuki Satria F150 (Rantai + Gir)", "SSS", "gear-set", 300000, 1000, [M.satria]],
  ["GEAR-SSS-NINJA", "Gear Set Kawasaki Ninja 250 (Rantai + Gir)", "SSS", "gear-set", 450000, 1300, [M.ninja]],
  ["GEAR-SSS-KLX", "Gear Set Kawasaki KLX 150 (Rantai + Gir)", "SSS", "gear-set", 340000, 1100, [M.klx]],
  ["GEAR-SSS-W175", "Gear Set Kawasaki W175 (Rantai + Gir)", "SSS", "gear-set", 310000, 1000, [M.w175]],

  // ---------- Ban ----------
  ["BAN-FDR-8090-14", "Ban Luar Depan FDR Genzi Pro 80/90-14", "FDR", "ban-luar", 230000, 3000, [M.beat, M.v125, M.scoopy]],
  ["BAN-FDR-9090-14", "Ban Luar Belakang FDR Genzi Pro 90/90-14", "FDR", "ban-luar", 250000, 3300, [M.beat, M.v125, M.scoopy]],
  ["BAN-IRC-8090-14", "Ban Luar Depan IRC 80/90-14", "IRC", "ban-luar", 245000, 3000, [M.beat, M.v125, M.scoopy]],
  ["BAN-IRC-9090-14", "Ban Luar Belakang IRC 90/90-14", "IRC", "ban-luar", 265000, 3300, [M.beat, M.v125, M.scoopy]],
  ["BAN-MICH-11070-13", "Ban Luar Depan Michelin City Grip 110/70-13", "Michelin", "ban-luar", 470000, 3500, [M.nmax]],
  ["BAN-MICH-13070-13", "Ban Luar Belakang Michelin City Grip 130/70-13", "Michelin", "ban-luar", 560000, 4200, [M.nmax]],
  ["BAN-CORSA-11070-17", "Ban Luar Depan Corsa 110/70-17", "Corsa", "ban-luar", 400000, 3800, [M.ninja]],
  ["BAN-CORSA-14070-17", "Ban Luar Belakang Corsa 140/70-17", "Corsa", "ban-luar", 450000, 4500, [M.ninja]],

  // ---------- Kelistrikan ----------
  ["AKI-GS-GTZ5S", "Aki GS Astra GTZ5S 12V 3.5Ah", "GS Astra", "aki", 230000, 1300, [M.beat, M.v125, M.scoopy], { partNumber: "GTZ5S" }],
  ["AKI-GS-GTZ6V", "Aki GS Astra GTZ6V 12V 5Ah", "GS Astra", "aki", 290000, 1700, [M.nmax, M.aerox], { partNumber: "GTZ6V" }],
  ["AKI-GS-GM5Z", "Aki GS Astra GM5Z-3B 12V 5Ah", "GS Astra", "aki", 210000, 1600, [M.supra]],
  ["LMP-SEIN-12V10W", "Bohlam Lampu Sein 12V 10W", "Osram", "lampu", 8000, 10, ALL],
  ["LMP-SEIN-LED-UNIV", "Lampu Sein LED Universal 12V", "Philips", "lampu", 45000, 25, ALL],
  ["LMP-SENJA-T10", "Bohlam Senja T10 LED (Sepasang)", "Philips", "lampu", 25000, 15, ALL],
  ["KIP-AHM-BEAT", "Kiprok Regulator Honda Beat FI", "AHM", "kiprok-koil", 120000, 200, ["honda-beat-2012", "honda-beat-2016"]],
  ["KIP-AHM-V125", "Kiprok Regulator Honda Vario 125", "AHM", "kiprok-koil", 135000, 210, [M.v125]],
  ["KIP-YGP-NMAX", "Kiprok Regulator Yamaha NMAX", YGP, "kiprok-koil", 190000, 220, [M.nmax], { stock: 0 }],
  ["KOIL-YGP-MIO", "Koil Pengapian Yamaha Mio M3", YGP, "kiprok-koil", 120000, 250, [M.mio]],
  // Contoh fitment varian: CDI hanya untuk Supra X 125 karburator
  ["CDI-AHM-SUPRA", "CDI Unit Honda Supra X 125 Karburator", "AHM", "kiprok-koil", 160000, 150, ["honda-supra-x-125-2005"]],
  ["RLY-AHM-STARTER", "Relay Starter Honda Beat, Vario 125 & Scoopy", "AHM", "kiprok-koil", 85000, 80, [M.beat, M.v125, M.scoopy]],

  // ---------- Body & Aksesori ----------
  ["SPION-AHM-BEAT-2020", "Spion Standar Honda Beat New Generation (Sepasang)", "AHM", "spion", 90000, 400, ["honda-beat-2020"]],
  ["SPION-YGP-NMAX-GEN1", "Spion Standar Yamaha NMAX Gen 1 (Sepasang)", YGP, "spion", 130000, 450, ["yamaha-nmax-2015"]],
  ["SPION-USED-NMAX", "Spion Original Yamaha NMAX Bekas (Sepasang)", YGP, "spion", 65000, 450, [M.nmax], { condition: "used", stock: 2 }],
  ["SPION-UNIV-CNC", "Spion Universal Lipat CNC (Sepasang)", "Aspira", "spion", 140000, 350, ALL],
  ["ACC-GRIP-UNIV", "Handgrip Karet Universal", "Domino", "aksesori", 45000, 200, ALL],
  ["ACC-COVER-MATIC-L", "Cover Motor Waterproof Matic Ukuran L", "Aspira", "aksesori", 85000, 700, MATIC],
  ["ACC-HOLDER-HP", "Holder HP Motor Universal Anti Getar", "Aspira", "aksesori", 95000, 300, ALL],

  // ---------- Suspensi ----------
  ["SHK-YSS-BEAT", "Shock Belakang YSS Beat & Scoopy", "YSS", "shock-belakang", 425000, 1400, [M.beat, M.scoopy]],
  ["SHK-YSS-NMAX", "Shock Belakang YSS NMAX", "YSS", "shock-belakang", 780000, 1800, [M.nmax]],
  ["SHK-YSS-VIXION", "Shock Belakang YSS Vixion", "YSS", "shock-belakang", 650000, 1700, [M.vixion]],
  ["SHK-REFURB-NMAX", "Shock Belakang Original NMAX Rekondisi", YGP, "shock-belakang", 350000, 1700, [M.nmax], { condition: "refurbished", stock: 1 }],
  ["SEAL-SHK-AHM-SUPRA", "Seal Shock Depan Honda Supra X 125 (Sepasang)", "AHM", "seal-shock", 45000, 100, [M.supra]],

  // ---------- Piston & Paking ----------
  ["PSTN-AHM-BEAT", "Piston Kit Standar Honda Beat", "AHM", "piston-ring", 175000, 300, [M.beat]],
  ["PSTN-AHM-SUPRA", "Piston Kit Standar Honda Supra X 125", "AHM", "piston-ring", 150000, 300, [M.supra]],
  ["PSTN-YGP-MIO", "Piston Kit Standar Yamaha Mio M3", YGP, "piston-ring", 160000, 300, [M.mio]],
  ["PSTN-YGP-VIXION", "Piston Kit Standar Yamaha Vixion", YGP, "piston-ring", 190000, 320, [M.vixion]],
  ["PKG-AHM-BEAT", "Paking Full Set Honda Beat", "AHM", "paking", 95000, 150, [M.beat]],
  ["PKG-AHM-SUPRA", "Paking Full Set Honda Supra X 125", "AHM", "paking", 85000, 150, [M.supra]],
  ["PKG-YGP-MIO", "Paking Full Set Yamaha Mio M3", YGP, "paking", 90000, 150, [M.mio]],
  ["PKG-YGP-VIXION", "Paking Full Set Yamaha Vixion", YGP, "paking", 110000, 160, [M.vixion]],
];

export const products: SeedProduct[] = rows.map(
  ([sku, name, brand, category, price, weightGram, fits, opts]) => ({
    sku,
    name,
    slug: slugify(name),
    brand,
    category,
    price,
    weightGram,
    stock: opts?.stock ?? 25,
    condition: opts?.condition ?? "new",
    partNumber: opts?.partNumber,
    fits,
  })
);
