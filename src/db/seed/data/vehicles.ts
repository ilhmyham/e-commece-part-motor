// Data kendaraan untuk seed: merek -> model -> varian (rentang tahun).
// CATATAN: tahun produksi dan pembagian varian adalah PERKIRAAN untuk keperluan belajar.
// Silakan koreksi bila menemukan data yang tidak sesuai.
//
// Aturan key varian (dipakai oleh `fits` di products.ts):
//   `${model.slug}-${variant.yearFrom}`   contoh: "honda-vario-125-2018"
// yearTo = null artinya masih diproduksi.

export type MotorType = "matic" | "bebek" | "sport" | "naked" | "trail" | "moped";

export type SeedVariant = {
  name: string;
  yearFrom: number;
  yearTo: number | null;
};

export type SeedModel = {
  name: string;
  slug: string;
  engineCc: number;
  type: MotorType;
  variants: SeedVariant[];
};

export type SeedBrand = {
  name: string;
  slug: string;
  models: SeedModel[];
};

export const vehicles: SeedBrand[] = [
  {
    name: "Honda",
    slug: "honda",
    models: [
      {
        name: "Beat",
        slug: "honda-beat",
        engineCc: 110,
        type: "matic",
        variants: [
          { name: "Karburator", yearFrom: 2008, yearTo: 2011 },
          { name: "FI", yearFrom: 2012, yearTo: 2015 },
          { name: "eSP", yearFrom: 2016, yearTo: 2019 },
          { name: "New Generation", yearFrom: 2020, yearTo: null },
        ],
      },
      {
        name: "Vario 125",
        slug: "honda-vario-125",
        engineCc: 125,
        type: "matic",
        variants: [
          { name: "PGM-FI", yearFrom: 2012, yearTo: 2014 },
          { name: "eSP", yearFrom: 2015, yearTo: 2017 },
          { name: "eSP LED", yearFrom: 2018, yearTo: 2022 },
          { name: "New", yearFrom: 2023, yearTo: null },
        ],
      },
      {
        name: "Vario 160",
        slug: "honda-vario-160",
        engineCc: 160,
        type: "matic",
        variants: [{ name: "CBS & ABS", yearFrom: 2022, yearTo: null }],
      },
      {
        name: "Scoopy",
        slug: "honda-scoopy",
        engineCc: 110,
        type: "matic",
        variants: [
          { name: "FI", yearFrom: 2013, yearTo: 2016 },
          { name: "eSP", yearFrom: 2017, yearTo: 2020 },
          { name: "New eSP", yearFrom: 2021, yearTo: null },
        ],
      },
      {
        name: "PCX 160",
        slug: "honda-pcx-160",
        engineCc: 160,
        type: "matic",
        variants: [{ name: "CBS & ABS", yearFrom: 2021, yearTo: null }],
      },
      {
        name: "Supra X 125",
        slug: "honda-supra-x-125",
        engineCc: 125,
        type: "bebek",
        variants: [
          { name: "Karburator", yearFrom: 2005, yearTo: 2013 },
          { name: "FI", yearFrom: 2014, yearTo: null },
        ],
      },
      {
        name: "CB150R",
        slug: "honda-cb150r",
        engineCc: 150,
        type: "naked",
        variants: [
          { name: "StreetFire Gen 1", yearFrom: 2012, yearTo: 2017 },
          { name: "StreetFire Gen 2", yearFrom: 2018, yearTo: null },
        ],
      },
    ],
  },
  {
    name: "Yamaha",
    slug: "yamaha",
    models: [
      {
        name: "Mio M3 125",
        slug: "yamaha-mio-m3",
        engineCc: 125,
        type: "matic",
        variants: [
          { name: "Blue Core", yearFrom: 2015, yearTo: 2019 },
          { name: "New", yearFrom: 2020, yearTo: null },
        ],
      },
      {
        name: "NMAX 155",
        slug: "yamaha-nmax",
        engineCc: 155,
        type: "matic",
        variants: [
          { name: "Gen 1", yearFrom: 2015, yearTo: 2019 },
          { name: "Gen 2", yearFrom: 2020, yearTo: 2023 },
          { name: "Turbo", yearFrom: 2024, yearTo: null },
        ],
      },
      {
        name: "Aerox 155",
        slug: "yamaha-aerox",
        engineCc: 155,
        type: "matic",
        variants: [
          { name: "VVA", yearFrom: 2017, yearTo: 2020 },
          { name: "Connected", yearFrom: 2021, yearTo: null },
        ],
      },
      {
        name: "Vixion 150",
        slug: "yamaha-vixion",
        engineCc: 150,
        type: "naked",
        variants: [
          { name: "Karburator", yearFrom: 2007, yearTo: 2012 },
          { name: "FI", yearFrom: 2013, yearTo: null },
        ],
      },
      {
        name: "Fino 125",
        slug: "yamaha-fino-125",
        engineCc: 125,
        type: "matic",
        variants: [{ name: "Blue Core", yearFrom: 2016, yearTo: null }],
      },
    ],
  },
  {
    name: "Suzuki",
    slug: "suzuki",
    models: [
      {
        name: "Satria F150",
        slug: "suzuki-satria-f150",
        engineCc: 150,
        type: "bebek",
        variants: [
          { name: "Karburator", yearFrom: 2004, yearTo: 2015 },
          { name: "FI", yearFrom: 2016, yearTo: null },
        ],
      },
      {
        name: "Address",
        slug: "suzuki-address",
        engineCc: 110,
        type: "matic",
        variants: [{ name: "FI", yearFrom: 2016, yearTo: null }],
      },
      {
        name: "Nex II",
        slug: "suzuki-nex-ii",
        engineCc: 115,
        type: "matic",
        variants: [{ name: "Standar", yearFrom: 2015, yearTo: 2020 }],
      },
    ],
  },
  {
    name: "Kawasaki",
    slug: "kawasaki",
    models: [
      {
        name: "Ninja 250",
        slug: "kawasaki-ninja-250",
        engineCc: 250,
        type: "sport",
        variants: [
          { name: "Karburator", yearFrom: 2008, yearTo: 2012 },
          { name: "FI", yearFrom: 2013, yearTo: 2017 },
          { name: "Gen 2", yearFrom: 2018, yearTo: null },
        ],
      },
      {
        name: "KLX 150",
        slug: "kawasaki-klx-150",
        engineCc: 150,
        type: "trail",
        variants: [{ name: "Standar", yearFrom: 2010, yearTo: null }],
      },
      {
        name: "W175",
        slug: "kawasaki-w175",
        engineCc: 177,
        type: "naked",
        variants: [{ name: "Standar", yearFrom: 2017, yearTo: null }],
      },
    ],
  },
];
