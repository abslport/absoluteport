export interface Project {
  title: string;
  description: string;
  category: string;
  tech: string[];
  github: string;
  image?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  // ===== V-Forge (Dari GitHub) =====
  {
    title: 'V-Forge',
    description: 'Proyek pengembangan alat industri / manufaktur presisi dengan teknologi modern. Dikembangkan dengan pendekatan engineering yang presisi dan efisien.',
    category: 'Manufacturing',
    tech: ['Engineering', 'Manufacturing', 'Industrial'],
    github: 'https://github.com/bayz-dik/V-Forge',
    featured: true,
  },
  // ===== Proyek sesuai profesi =====
  {
    title: 'Optimasi Layanan Operasional',
    description: 'Proyek peningkatan efisiensi operasional store dengan standarisasi SOP dan digitalisasi proses pelayanan customer.',
    category: 'Store Operation',
    tech: ['SOP', 'Digitalization', 'Customer Service'],
    featured: true,
  },
  {
    title: 'Sistem Konsultasi Servis Kendaraan',
    description: 'Membangun sistem konsultasi servis kendaraan yang efisien untuk meningkatkan kepuasan pelanggan dan akurasi diagnosa.',
    category: 'Service Advisor',
    tech: ['Diagnostics', 'Customer Relations', 'Maintenance Planning'],
    featured: true,
  },
  {
    title: 'Proses Stamping Presisi',
    description: 'Proyek optimasi proses stamping press dengan fokus pada quality control, efisiensi, dan safety di lantai produksi.',
    category: 'Stamping',
    tech: ['Press Machine', 'Quality Control', 'Safety'],
    featured: true,
  },
];
