// SEO landing pages — one per target keyword. Rendered statically by
// app/[landing]/page.tsx (generateStaticParams) and listed in the sitemap.
export type Landing = {
  slug: string;
  eyebrow: string;
  title: string; // metadata + template appends "· Sebingkai"
  description: string;
  h1: string;
  h1Accent: string; // trailing phrase rendered in display italic
  lead: string;
  points: { h: string; p: string }[];
};

export const landings: Landing[] = [
  {
    slug: "kamera-sekali-pakai-nikahan",
    eyebrow: "Untuk pernikahan",
    title: "Kamera sekali pakai untuk nikahan",
    description:
      "Ganti kamera sekali pakai di tiap meja dengan satu QR. Tamu memotret nikahanmu lewat kamera film di browser — semua foto jadi satu album yang terungkap setelah acara.",
    h1: "Kamera sekali pakai nikahan,",
    h1Accent: "tanpa beli kamera.",
    lead:
      "Dulu kamu taruh kamera sekali pakai di tiap meja. Sekarang cukup satu QR: setiap tamu dapat kamera film di browser, dan semua jepretan berkumpul jadi satu album.",
    points: [
      {
        h: "Tanpa bagi-bagi kamera",
        p: "Tidak perlu beli, isi, atau kumpulkan belasan kamera. Satu QR di undangan atau meja sudah cukup.",
      },
      {
        h: "Momen dari setiap sudut",
        p: "Candid yang terlewat fotografer utama — tertangkap tamu di sebelahmu, dari pelaminan sampai lantai dansa.",
      },
      {
        h: "Terungkap bersama",
        p: "Foto tersembunyi sampai waktu reveal. Saat tiba, satu album utuh muncul untuk semua yang hadir.",
      },
    ],
  },
  {
    slug: "foto-tamu-qr",
    eyebrow: "Foto tamu · QR",
    title: "Kumpulkan foto tamu lewat QR",
    description:
      "Satu QR untuk mengumpulkan foto dari semua tamu acaramu. Tamu memindai, memotret lewat kamera film di browser, dan semua foto masuk ke satu galeri — tanpa aplikasi.",
    h1: "Kumpulkan foto tamu",
    h1Accent: "lewat satu QR.",
    lead:
      "Tempel satu QR, dan setiap tamu bisa menyumbang foto ke acaramu — tanpa unduh aplikasi, tanpa minta kirim satu per satu di grup chat.",
    points: [
      {
        h: "Pindai, potret, selesai",
        p: "Tamu memindai QR dan kamera langsung terbuka di browser. iPhone, Android, atau desktop — semua bisa.",
      },
      {
        h: "Semua foto di satu tempat",
        p: "Tidak ada lagi foto berserakan di puluhan ponsel. Semua jepretan tamu berkumpul jadi satu galeri.",
      },
      {
        h: "Privat & milikmu",
        p: "Album hanya untuk acaramu. Unduh semua foto resolusi penuh kapan pun kamu mau.",
      },
    ],
  },
  {
    slug: "galeri-foto-acara",
    eyebrow: "Galeri acara",
    title: "Galeri foto acara bersama",
    description:
      "Buat galeri foto acara yang diisi semua tamu. Satu QR, kamera film di browser, dan satu album bersama yang terungkap setelah acara — cocok untuk nikahan, ulang tahun, atau reuni.",
    h1: "Galeri foto acara",
    h1Accent: "yang diisi semua tamu.",
    lead:
      "Bukan cuma satu kamera. Galeri foto acaramu diisi oleh setiap orang yang hadir — satu album, banyak sudut pandang.",
    points: [
      {
        h: "Diisi bersama",
        p: "Setiap tamu jadi fotografer. Galeri tumbuh dari banyak mata, bukan satu lensa.",
      },
      {
        h: "Satu estetika",
        p: "Preset film yang sama untuk semua jepretan, jadi galerinya terasa satu kesatuan — bukan campur aduk.",
      },
      {
        h: "Untuk acara apa pun",
        p: "Nikahan, ulang tahun, pesta, atau perjalanan. Satu QR untuk galeri acara apa pun.",
      },
    ],
  },
];

export function getLanding(slug: string): Landing | undefined {
  return landings.find((l) => l.slug === slug);
}
