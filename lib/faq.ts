// Single source of truth for FAQ content — consumed by the homepage FAQ
// section (components/Faq.tsx) and the dedicated /faq page (which also emits
// FAQPage JSON-LD from it for SEO).
export type FaqEntry = { q: string; a: string };

export const faqItems: FaqEntry[] = [
  {
    q: "Apakah tamu perlu memasang aplikasi?",
    a: "Tidak. Tamu cukup memindai QR dan kamera film langsung terbuka di browser — tanpa unduh, tanpa akun, dari iPhone, Android, atau desktop.",
  },
  {
    q: "Apa itu preset film?",
    a: "Preset meniru karakter film analog — warna, butiran, dan kontrasnya — supaya tiap jepretan terasa seperti kamera sekali pakai yang sesungguhnya.",
  },
  {
    q: "Kapan foto bisa dilihat?",
    a: "Foto tersembunyi hingga waktu reveal yang kamu atur. Saat tiba, semuanya muncul serentak untuk semua orang pada saat yang bersamaan.",
  },
  {
    q: "Bisakah aku mengunduh fotonya?",
    a: "Bisa. Setelah album terungkap, unduh foto satu per satu atau seluruh album sekaligus dalam resolusi penuh.",
  },
  {
    q: "Apakah benar-benar gratis?",
    a: "Album hingga 5 tamu gratis selamanya. Untuk tamu lebih banyak, cukup bayar sekali per acara — tanpa langganan, tanpa perpanjangan.",
  },
];
