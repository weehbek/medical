import type { Doctor, Review, WorkDay } from '@/types';

const weekdaySchedule = (slots: string[], days = [1, 2, 3, 4, 5]): WorkDay[] =>
  days.map((weekday) => ({ weekday, slots }));

const MORNING = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
const DAY = ['12:00', '12:30', '13:30', '14:00', '14:30', '15:00'];
const EVENING = ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30'];

export const DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'Анна Сергеева',
    specialty: 'Дерматолог',
    categoryIds: ['acne', 'pigment', 'cosmetology'],
    gender: 'female',
    rating: 4.9,
    reviews: 128,
    experience: 12,
    patients: 1800,
    fee: 4500,
    clinic: 'Клиника «Чистая кожа»',
    address: 'ул. Садовая, 14',
    about:
      'Специализируется на лечении акне и постакне, подборе домашнего ухода и коррекции пигментации. Работает с подростками и взрослыми, помогает выстроить понятный план лечения.',
    schedule: weekdaySchedule([...MORNING, ...DAY]),
    tone: 0,
  },
  {
    id: 'd2',
    name: 'Максим Орлов',
    specialty: 'Дерматоонколог',
    categoryIds: ['moles'],
    gender: 'male',
    rating: 4.8,
    reviews: 96,
    experience: 15,
    patients: 2400,
    fee: 5200,
    clinic: 'Центр дерматоскопии',
    address: 'пр. Мира, 32',
    about:
      'Проводит осмотр родинок и цифровую дерматоскопию, ведёт динамическое наблюдение за новообразованиями кожи и объясняет результаты простым языком.',
    schedule: weekdaySchedule([...DAY, ...EVENING], [1, 3, 5, 6]),
    tone: 1,
  },
  {
    id: 'd3',
    name: 'Елена Ким',
    specialty: 'Дерматолог-аллерголог',
    categoryIds: ['eczema', 'allergy', 'kids'],
    gender: 'female',
    rating: 4.9,
    reviews: 143,
    experience: 10,
    patients: 1500,
    fee: 4200,
    clinic: 'Клиника «Здоровая семья»',
    address: 'ул. Лесная, 7',
    about:
      'Помогает при атопическом дерматите, экземе и кожных аллергиях. Принимает детей с трёх лет, уделяет внимание подбору щадящего ухода.',
    schedule: weekdaySchedule([...MORNING, ...EVENING], [1, 2, 4, 5]),
    tone: 2,
  },
  {
    id: 'd4',
    name: 'Игорь Белов',
    specialty: 'Трихолог',
    categoryIds: ['hair', 'nails'],
    gender: 'male',
    rating: 4.7,
    reviews: 74,
    experience: 9,
    patients: 1100,
    fee: 3900,
    clinic: 'Студия трихологии',
    address: 'ул. Пушкина, 21',
    about:
      'Занимается проблемами выпадения волос, здоровьем кожи головы и ногтей. Составляет индивидуальные программы ухода и наблюдения.',
    schedule: weekdaySchedule(DAY, [2, 3, 4, 6]),
    tone: 3,
  },
  {
    id: 'd5',
    name: 'Мария Волкова',
    specialty: 'Дерматолог',
    categoryIds: ['psoriasis', 'eczema'],
    gender: 'female',
    rating: 4.8,
    reviews: 110,
    experience: 14,
    patients: 2100,
    fee: 4700,
    clinic: 'Клиника «Чистая кожа»',
    address: 'ул. Садовая, 14',
    about:
      'Ведёт пациентов с псориазом и хроническими дерматозами, помогает добиться длительной ремиссии и подобрать комфортную схему ухода.',
    schedule: weekdaySchedule([...MORNING, ...DAY, ...EVENING]),
    tone: 4,
  },
  {
    id: 'd6',
    name: 'Дмитрий Соколов',
    specialty: 'Косметолог-дерматолог',
    categoryIds: ['cosmetology', 'pigment', 'acne'],
    gender: 'male',
    rating: 4.6,
    reviews: 58,
    experience: 7,
    patients: 900,
    fee: 3600,
    clinic: 'Эстетический центр «Лайт»',
    address: 'наб. Речная, 3',
    about:
      'Подбирает уход и процедуры для ровного тона кожи, работает с постакне и признаками фотостарения.',
    schedule: weekdaySchedule(EVENING, [1, 2, 3, 4, 5, 6]),
    tone: 5,
  },
  {
    id: 'd7',
    name: 'Ольга Никитина',
    specialty: 'Детский дерматолог',
    categoryIds: ['kids', 'allergy', 'moles'],
    gender: 'female',
    rating: 4.9,
    reviews: 87,
    experience: 11,
    patients: 1300,
    fee: 4000,
    clinic: 'Клиника «Здоровая семья»',
    address: 'ул. Лесная, 7',
    about:
      'Принимает детей и подростков: высыпания, аллергические реакции, осмотр родинок. Спокойно объясняет родителям план наблюдения.',
    schedule: weekdaySchedule(MORNING, [1, 2, 3, 4, 5]),
    tone: 0,
  },
  {
    id: 'd8',
    name: 'Артём Лебедев',
    specialty: 'Дерматолог',
    categoryIds: ['nails', 'psoriasis', 'hair'],
    gender: 'male',
    rating: 4.7,
    reviews: 65,
    experience: 8,
    patients: 950,
    fee: 3800,
    clinic: 'Медцентр «Северный»',
    address: 'ул. Северная, 45',
    about:
      'Диагностика заболеваний ногтей и кожи головы, ведение пациентов с псориазом. Предпочитает понятные пошаговые планы лечения.',
    schedule: weekdaySchedule([...DAY, ...EVENING], [2, 4, 6]),
    tone: 1,
  },
];

export const getDoctor = (id: string) => DOCTORS.find((d) => d.id === id);

export const REVIEWS: Review[] = [
  { id: 'r1', doctorId: 'd1', author: 'Наталья', rating: 5, text: 'Подробно объяснила план лечения, через два месяца кожа заметно чище.', date: '12 окт.' },
  { id: 'r2', doctorId: 'd1', author: 'Кирилл', rating: 5, text: 'Внимательный врач, никуда не торопит и отвечает на все вопросы.', date: '3 окт.' },
  { id: 'r3', doctorId: 'd2', author: 'Светлана', rating: 5, text: 'Осмотрел все родинки, показал снимки и спокойно всё рассказал.', date: '28 сент.' },
  { id: 'r4', doctorId: 'd3', author: 'Ирина', rating: 5, text: 'Наконец подобрали уход для ребёнка, высыпания прошли.', date: '15 окт.' },
  { id: 'r5', doctorId: 'd4', author: 'Алексей', rating: 4, text: 'Понятные рекомендации, результат вижу уже через месяц.', date: '9 окт.' },
  { id: 'r6', doctorId: 'd5', author: 'Татьяна', rating: 5, text: 'Лучший врач, к которому я обращалась с псориазом.', date: '1 окт.' },
  { id: 'r7', doctorId: 'd6', author: 'Полина', rating: 4, text: 'Хороший подбор ухода, приятная клиника.', date: '20 сент.' },
  { id: 'r8', doctorId: 'd7', author: 'Марина', rating: 5, text: 'Сын не боялся приёма, врач нашла подход.', date: '18 окт.' },
  { id: 'r9', doctorId: 'd8', author: 'Олег', rating: 5, text: 'Быстро поставил диагноз и назначил лечение.', date: '11 окт.' },
];

export const getReviews = (doctorId: string) => REVIEWS.filter((r) => r.doctorId === doctorId);
