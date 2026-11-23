import type { Category } from '@/types';

export const CATEGORIES: Category[] = [
  { id: 'acne', name: 'Акне', description: 'Лечение акне и постакне', icon: 'water-outline' },
  { id: 'pigment', name: 'Пигментация', description: 'Пятна, мелазма, тон кожи', icon: 'sunny-outline' },
  { id: 'moles', name: 'Родинки', description: 'Осмотр и дерматоскопия', icon: 'scan-outline' },
  { id: 'eczema', name: 'Экзема', description: 'Сухость, зуд, раздражение', icon: 'leaf-outline' },
  { id: 'psoriasis', name: 'Псориаз', description: 'Хронические заболевания', icon: 'pulse-outline' },
  { id: 'hair', name: 'Волосы', description: 'Трихология и выпадение', icon: 'cut-outline' },
  { id: 'nails', name: 'Ногти', description: 'Здоровье ногтевой пластины', icon: 'hand-left-outline' },
  { id: 'allergy', name: 'Аллергия', description: 'Кожные аллергические реакции', icon: 'flower-outline' },
  { id: 'cosmetology', name: 'Косметология', description: 'Уход и процедуры', icon: 'sparkles-outline' },
  { id: 'kids', name: 'Детская', description: 'Дерматология для детей', icon: 'happy-outline' },
];

export const getCategory = (id: string) => CATEGORIES.find((c) => c.id === id);
