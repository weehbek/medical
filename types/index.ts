import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export type Gender = 'female' | 'male';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  birthDate: string;
  gender: Gender;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: IconName;
}

export interface WorkDay {
  /** 0 = Sunday … 6 = Saturday */
  weekday: number;
  slots: string[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  categoryIds: string[];
  gender: Gender;
  rating: number;
  reviews: number;
  experience: number;
  patients: number;
  fee: number;
  clinic: string;
  address: string;
  about: string;
  schedule: WorkDay[];
  /** Index into the avatar palette */
  tone: number;
}

export interface Review {
  id: string;
  doctorId: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';
export type VisitType = 'clinic' | 'video';

export interface Appointment {
  id: string;
  doctorId: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:mm */
  time: string;
  type: VisitType;
  status: AppointmentStatus;
  note: string;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  doctorId: string;
  from: 'me' | 'doctor';
  text: string;
  createdAt: number;
}

export type NotificationKind = 'appointment' | 'message' | 'reminder' | 'system';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  createdAt: number;
  read: boolean;
}

export interface Settings {
  pushEnabled: boolean;
  remindersEnabled: boolean;
  messageAlerts: boolean;
}
