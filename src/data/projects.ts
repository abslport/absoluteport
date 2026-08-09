export interface Project {
  title: string;
  description: string;
  category: string[];
  tech: string[];
  github: string;
  demo?: string;
  image: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    title: 'V-Forge',
    description: 'Project pembuatan tool/forge dengan pendekatan modern dan efisien. Dibangun untuk memenuhi kebutuhan industri manufaktur.',
    category: ['Manufacturing', 'Tool', 'Web'],
    tech: ['HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/bayz-dik/V-Forge',
    image: '/vforge.png',
    featured: true,
  },
  {
    title: 'Sistem Inventory Store',
    description: 'Sistem manajemen inventori untuk operasional store, dengan tracking stok real-time dan laporan otomatis.',
    category: ['Retail', 'Management'],
    tech: ['JavaScript', 'React', 'Database'],
    github: 'https://github.com/bayz-dik',
    image: '/inventory.png',
  },
  {
    title: 'Aplikasi Service Advisor',
    description: 'Aplikasi pendukung untuk service advisor dalam mengelola jadwal servis, estimasi biaya, dan riwayat kendaraan pelanggan.',
    category: ['Otomotif', 'Service'],
    tech: ['TypeScript', 'Node.js', 'UI/UX'],
    github: 'https://github.com/bayz-dik',
    image: '/advisor.png',
  },
  {
    title: 'Dashboard Quality Control',
    description: 'Dashboard untuk monitoring kualitas produk stamping press, dengan analisis data dan alert real-time.',
    category: ['Manufaktur', 'Quality'],
    tech: ['Python', 'Data Analytics', 'Dashboard'],
    github: 'https://github.com/bayz-dik',
    image: '/quality.png',
  },
  {
    title: 'Website Company Profile',
    description: 'Company profile website modern dengan desain responsive dan performa tinggi.',
    category: ['Web', 'Marketing'],
    tech: ['Astro', 'Tailwind CSS', 'SEO'],
    github: 'https://github.com/bayz-dik',
    image: '/website.png',
  },
  {
    title: 'Tool Monitoring Mesin',
    description: 'Sistem monitoring operasional mesin press dengan visualisasi data dan prediksi maintenance.',
    category: ['IoT', 'Manufacturing'],
    tech: ['Arduino', 'JavaScript', 'Real-time'],
    github: 'https://github.com/bayz-dik',
    image: '/monitoring.png',
  },
];
