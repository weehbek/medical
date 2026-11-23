import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { getDoctor } from '@/data/doctors';
import { DEFAULT_SETTINGS, DOCTOR_REPLIES, seedAppointments, seedMessages, seedNotifications } from '@/data/seed';
import { appointmentTimestamp, formatDayMonth } from '@/services/date';
import { KEYS, readJSON, removeKey, writeJSON } from '@/services/storage';
import type { AppNotification, Appointment, ChatMessage, NotificationKind, Settings, User } from '@/types';

/** Demo verification code shown on the OTP screen. */
export const DEMO_OTP = '1234';

/** Demo account that always exists, so the app can be tried without signing up. */
const DEMO_USER: User = {
  id: 'u-demo',
  name: 'Алия Нурланова',
  email: 'demo@dermacare.app',
  phone: '+7 700 123 45 67',
  password: 'demo123',
  birthDate: '14.03.1998',
  gender: 'female',
};

type NewUser = Omit<User, 'id'>;
type Result = { error?: string };

interface AppState {
  ready: boolean;
  onboarded: boolean;
  user: User | null;
  pendingSignUp: NewUser | null;
  appointments: Appointment[];
  messages: ChatMessage[];
  notifications: AppNotification[];
  settings: Settings;
  typingDoctorId: string | null;

  completeOnboarding: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<Result>;
  startSignUp: (data: NewUser) => Result;
  confirmSignUp: () => Promise<Result>;
  checkEmailExists: (email: string) => boolean;
  resetPassword: (email: string, password: string) => Promise<Result>;
  signOut: () => Promise<void>;
  updateProfile: (patch: Partial<Omit<User, 'id' | 'password'>>) => Promise<Result>;

  bookAppointment: (data: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => Promise<Appointment>;
  cancelAppointment: (id: string) => Promise<void>;
  isSlotTaken: (doctorId: string, date: string, time: string) => boolean;

  sendMessage: (doctorId: string, text: string) => Promise<void>;
  markChatRead: (doctorId: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;

  updateSettings: (patch: Partial<Settings>) => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
const normalizeEmail = (e: string) => e.trim().toLowerCase();

/** Moves past upcoming visits into «completed». */
const refreshStatuses = (list: Appointment[]) => {
  const now = Date.now();
  return list.map((a) =>
    a.status === 'upcoming' && appointmentTimestamp(a.date, a.time) < now ? { ...a, status: 'completed' as const } : a,
  );
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [users, setUsers] = useState<User[]>([DEMO_USER]);
  const [user, setUser] = useState<User | null>(null);
  const [pendingSignUp, setPendingSignUp] = useState<NewUser | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [typingDoctorId, setTypingDoctorId] = useState<string | null>(null);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep latest values reachable from async callbacks.
  const userRef = useRef(user);
  userRef.current = user;
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const loadUserData = useCallback(async (u: User) => {
    const [appts, msgs, notes, sett] = await Promise.all([
      readJSON<Appointment[] | null>(KEYS.appointments(u.id), null),
      readJSON<ChatMessage[] | null>(KEYS.messages(u.id), null),
      readJSON<AppNotification[] | null>(KEYS.notifications(u.id), null),
      readJSON<Settings | null>(KEYS.settings(u.id), null),
    ]);
    const nextAppts = refreshStatuses(appts ?? seedAppointments());
    const nextMsgs = msgs ?? seedMessages();
    const nextNotes = notes ?? seedNotifications();
    const nextSettings = { ...DEFAULT_SETTINGS, ...(sett ?? {}) };
    setAppointments(nextAppts);
    setMessages(nextMsgs);
    setNotifications(nextNotes);
    setSettings(nextSettings);
    await Promise.all([
      writeJSON(KEYS.appointments(u.id), nextAppts),
      writeJSON(KEYS.messages(u.id), nextMsgs),
      writeJSON(KEYS.notifications(u.id), nextNotes),
      writeJSON(KEYS.settings(u.id), nextSettings),
    ]);
  }, []);

  useEffect(() => {
    (async () => {
      const [ob, stored, sessionId] = await Promise.all([
        readJSON<boolean>(KEYS.onboarded, false),
        readJSON<User[]>(KEYS.users, []),
        readJSON<string | null>(KEYS.session, null),
      ]);
      const all = stored.some((u) => u.id === DEMO_USER.id) ? stored : [DEMO_USER, ...stored];
      setOnboarded(ob);
      setUsers(all);
      const current = sessionId ? all.find((u) => u.id === sessionId) ?? null : null;
      if (current) {
        setUser(current);
        await loadUserData(current);
      }
      setReady(true);
    })();
    return () => {
      if (replyTimer.current) clearTimeout(replyTimer.current);
    };
  }, [loadUserData]);

  const persistUsers = useCallback(async (next: User[]) => {
    setUsers(next);
    await writeJSON(KEYS.users, next);
  }, []);

  const pushNotification = useCallback((kind: NotificationKind, title: string, body: string) => {
    const u = userRef.current;
    if (!u) return;
    const s = settingsRef.current;
    if (!s.pushEnabled) return;
    if (kind === 'message' && !s.messageAlerts) return;
    if (kind === 'reminder' && !s.remindersEnabled) return;
    setNotifications((prev) => {
      const next = [{ id: uid('n'), kind, title, body, createdAt: Date.now(), read: false }, ...prev];
      writeJSON(KEYS.notifications(u.id), next);
      return next;
    });
  }, []);

  const startSession = useCallback(
    async (u: User) => {
      setUser(u);
      await writeJSON(KEYS.session, u.id);
      await loadUserData(u);
    },
    [loadUserData],
  );

  const completeOnboarding = useCallback(async () => {
    setOnboarded(true);
    await writeJSON(KEYS.onboarded, true);
  }, []);

  const checkEmailExists = useCallback(
    (email: string) => users.some((u) => normalizeEmail(u.email) === normalizeEmail(email)),
    [users],
  );

  const signIn = useCallback(
    async (email: string, password: string): Promise<Result> => {
      const found = users.find((u) => normalizeEmail(u.email) === normalizeEmail(email));
      if (!found) return { error: 'Аккаунт с таким email не найден' };
      if (found.password !== password) return { error: 'Неверный пароль' };
      await startSession(found);
      return {};
    },
    [users, startSession],
  );

  const startSignUp = useCallback(
    (data: NewUser): Result => {
      if (checkEmailExists(data.email)) return { error: 'Этот email уже зарегистрирован' };
      setPendingSignUp({ ...data, email: data.email.trim() });
      return {};
    },
    [checkEmailExists],
  );

  const confirmSignUp = useCallback(async (): Promise<Result> => {
    if (!pendingSignUp) return { error: 'Сначала заполните форму регистрации' };
    const created: User = { ...pendingSignUp, id: uid('u') };
    await persistUsers([...users, created]);
    setPendingSignUp(null);
    await startSession(created);
    return {};
  }, [pendingSignUp, users, persistUsers, startSession]);

  const resetPassword = useCallback(
    async (email: string, password: string): Promise<Result> => {
      const idx = users.findIndex((u) => normalizeEmail(u.email) === normalizeEmail(email));
      if (idx < 0) return { error: 'Аккаунт с таким email не найден' };
      const next = [...users];
      next[idx] = { ...next[idx], password };
      await persistUsers(next);
      return {};
    },
    [users, persistUsers],
  );

  const signOut = useCallback(async () => {
    if (replyTimer.current) clearTimeout(replyTimer.current);
    setTypingDoctorId(null);
    setUser(null);
    setAppointments([]);
    setMessages([]);
    setNotifications([]);
    setSettings(DEFAULT_SETTINGS);
    await removeKey(KEYS.session);
  }, []);

  const updateProfile = useCallback(
    async (patch: Partial<Omit<User, 'id' | 'password'>>): Promise<Result> => {
      if (!user) return { error: 'Нет активной сессии' };
      if (patch.email && normalizeEmail(patch.email) !== normalizeEmail(user.email) && checkEmailExists(patch.email)) {
        return { error: 'Этот email уже используется' };
      }
      const updated = { ...user, ...patch };
      setUser(updated);
      await persistUsers(users.map((u) => (u.id === user.id ? updated : u)));
      return {};
    },
    [user, users, persistUsers, checkEmailExists],
  );

  const saveAppointments = useCallback((next: Appointment[]) => {
    const u = userRef.current;
    setAppointments(next);
    if (u) writeJSON(KEYS.appointments(u.id), next);
  }, []);

  const bookAppointment = useCallback(
    async (data: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => {
      const appt: Appointment = { ...data, id: uid('a'), status: 'upcoming', createdAt: Date.now() };
      saveAppointments([appt, ...appointments]);
      const doctor = getDoctor(data.doctorId);
      pushNotification(
        'appointment',
        'Запись подтверждена',
        `${doctor?.name ?? 'Врач'} ждёт вас ${formatDayMonth(data.date)} в ${data.time}.`,
      );
      pushNotification('reminder', 'Напоминание включено', `Мы напомним о приёме за день до ${formatDayMonth(data.date)}.`);
      return appt;
    },
    [appointments, saveAppointments, pushNotification],
  );

  const cancelAppointment = useCallback(
    async (id: string) => {
      const target = appointments.find((a) => a.id === id);
      saveAppointments(appointments.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a)));
      if (target) {
        const doctor = getDoctor(target.doctorId);
        pushNotification(
          'appointment',
          'Запись отменена',
          `Приём у ${doctor?.name ?? 'врача'} ${formatDayMonth(target.date)} в ${target.time} отменён.`,
        );
      }
    },
    [appointments, saveAppointments, pushNotification],
  );

  const isSlotTaken = useCallback(
    (doctorId: string, date: string, time: string) =>
      appointments.some((a) => a.status === 'upcoming' && a.doctorId === doctorId && a.date === date && a.time === time),
    [appointments],
  );

  const appendMessage = useCallback((msg: ChatMessage) => {
    const u = userRef.current;
    setMessages((prev) => {
      const next = [...prev, msg];
      if (u) writeJSON(KEYS.messages(u.id), next);
      return next;
    });
  }, []);

  const sendMessage = useCallback(
    async (doctorId: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      appendMessage({ id: uid('m'), doctorId, from: 'me', text: trimmed, createdAt: Date.now() });
      if (replyTimer.current) clearTimeout(replyTimer.current);
      setTypingDoctorId(doctorId);
      replyTimer.current = setTimeout(() => {
        setTypingDoctorId(null);
        if (!userRef.current) return;
        const reply = DOCTOR_REPLIES[Math.floor(Math.random() * DOCTOR_REPLIES.length)];
        appendMessage({ id: uid('m'), doctorId, from: 'doctor', text: reply, createdAt: Date.now() });
        const doctor = getDoctor(doctorId);
        pushNotification('message', 'Новое сообщение', `${doctor?.name ?? 'Врач'}: ${reply}`);
      }, 1800);
    },
    [appendMessage, pushNotification],
  );

  const markChatRead = useCallback((doctorId: string) => {
    const u = userRef.current;
    const doctor = getDoctor(doctorId);
    if (!doctor) return;
    setNotifications((prev) => {
      let changed = false;
      const next = prev.map((n) => {
        if (!n.read && n.kind === 'message' && n.body.startsWith(doctor.name)) {
          changed = true;
          return { ...n, read: true };
        }
        return n;
      });
      if (changed && u) writeJSON(KEYS.notifications(u.id), next);
      return changed ? next : prev;
    });
  }, []);

  const saveNotifications = useCallback((updater: (prev: AppNotification[]) => AppNotification[]) => {
    const u = userRef.current;
    setNotifications((prev) => {
      const next = updater(prev);
      if (u) writeJSON(KEYS.notifications(u.id), next);
      return next;
    });
  }, []);

  const markNotificationRead = useCallback(
    (id: string) => saveNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n))),
    [saveNotifications],
  );
  const markAllNotificationsRead = useCallback(
    () => saveNotifications((prev) => prev.map((n) => ({ ...n, read: true }))),
    [saveNotifications],
  );
  const clearNotifications = useCallback(() => saveNotifications(() => []), [saveNotifications]);

  const updateSettings = useCallback(async (patch: Partial<Settings>) => {
    const u = userRef.current;
    const next = { ...settingsRef.current, ...patch };
    setSettings(next);
    if (u) await writeJSON(KEYS.settings(u.id), next);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      ready,
      onboarded,
      user,
      pendingSignUp,
      appointments,
      messages,
      notifications,
      settings,
      typingDoctorId,
      completeOnboarding,
      signIn,
      startSignUp,
      confirmSignUp,
      checkEmailExists,
      resetPassword,
      signOut,
      updateProfile,
      bookAppointment,
      cancelAppointment,
      isSlotTaken,
      sendMessage,
      markChatRead,
      markNotificationRead,
      markAllNotificationsRead,
      clearNotifications,
      updateSettings,
    }),
    [
      ready,
      onboarded,
      user,
      pendingSignUp,
      appointments,
      messages,
      notifications,
      settings,
      typingDoctorId,
      completeOnboarding,
      signIn,
      startSignUp,
      confirmSignUp,
      checkEmailExists,
      resetPassword,
      signOut,
      updateProfile,
      bookAppointment,
      cancelAppointment,
      isSlotTaken,
      sendMessage,
      markChatRead,
      markNotificationRead,
      markAllNotificationsRead,
      clearNotifications,
      updateSettings,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}

export const DEMO_CREDENTIALS = { email: DEMO_USER.email, password: DEMO_USER.password };
