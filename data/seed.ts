import type { AppNotification, Appointment, ChatMessage, Settings } from '@/types';
import { addDays, toISODate } from '@/services/date';

const HOUR = 60 * 60 * 1000;

/** Initial demo content created on first launch for a fresh account. */
export const seedAppointments = (): Appointment[] => {
  const now = Date.now();
  return [
    {
      id: 'a-seed-1',
      doctorId: 'd3',
      date: toISODate(addDays(new Date(), -12)),
      time: '10:30',
      type: 'clinic',
      status: 'completed',
      note: 'Сухость кожи на руках',
      createdAt: now - 20 * 24 * HOUR,
    },
  ];
};

export const seedMessages = (): ChatMessage[] => {
  const now = Date.now();
  return [
    {
      id: 'm-seed-1',
      doctorId: 'd3',
      from: 'doctor',
      text: 'Здравствуйте! Как ваша кожа после смены крема?',
      createdAt: now - 26 * HOUR,
    },
    {
      id: 'm-seed-2',
      doctorId: 'd3',
      from: 'me',
      text: 'Добрый день! Стало намного лучше, сухость почти прошла.',
      createdAt: now - 25 * HOUR,
    },
    {
      id: 'm-seed-3',
      doctorId: 'd3',
      from: 'doctor',
      text: 'Отлично. Продолжайте уход ещё две недели, потом обсудим результат.',
      createdAt: now - 24 * HOUR,
    },
    {
      id: 'm-seed-4',
      doctorId: 'd1',
      from: 'doctor',
      text: 'Добро пожаловать в DermaCare! Можете задать вопрос перед записью.',
      createdAt: now - 3 * HOUR,
    },
  ];
};

export const seedNotifications = (): AppNotification[] => {
  const now = Date.now();
  return [
    {
      id: 'n-seed-1',
      kind: 'system',
      title: 'Добро пожаловать в DermaCare',
      body: 'Найдите дерматолога и запишитесь на удобное время за пару минут.',
      createdAt: now - 2 * HOUR,
      read: false,
    },
    {
      id: 'n-seed-2',
      kind: 'message',
      title: 'Новое сообщение',
      body: 'Анна Сергеева: Можете задать вопрос перед записью.',
      createdAt: now - 3 * HOUR,
      read: false,
    },
    {
      id: 'n-seed-3',
      kind: 'reminder',
      title: 'Совет дня',
      body: 'Используйте солнцезащитный крем даже в пасмурную погоду.',
      createdAt: now - 30 * HOUR,
      read: true,
    },
  ];
};

export const DEFAULT_SETTINGS: Settings = {
  pushEnabled: true,
  remindersEnabled: true,
  messageAlerts: true,
};

/** Canned replies for the demo chat. */
export const DOCTOR_REPLIES = [
  'Спасибо, что написали. Уточните, пожалуйста, как давно это беспокоит?',
  'Понимаю. Лучше всего будет посмотреть кожу на приёме — можно записаться на ближайшее свободное время.',
  'Пока не используйте новые средства и избегайте прямого солнца. Обсудим подробнее на консультации.',
  'Хорошо, я отметила это в карте. Если появятся новые симптомы — напишите.',
];
