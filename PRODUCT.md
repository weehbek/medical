# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Stack

React Native + Expo (SDK 58, must run in Expo Go via QR on Android and iPhone), TypeScript, Expo Router, react-native-safe-area-context, @expo/vector-icons, AsyncStorage. No libraries that require a custom dev build.

## Users

Patients who want to find a dermatologist and book an appointment from their phone. Interface language: Russian.

## Product Purpose

DermaCare — demo mobile app for dermatology care: browse specialists by category, search doctors, view a doctor's profile, book a date/time, manage appointments, chat with a doctor, receive notifications, manage a profile and settings.

Success: all 22 screens exist, are connected by working navigation, and behave as a real app on demo data.

## Capabilities and Constraints

- Demo mode only: sign-in / sign-up are local, no real medical services, no payments, no real medical data requested.
- Persistence via AsyncStorage: session, appointments, chat messages, notifications read-state, profile, settings.
- 22 screens: Splash, Onboarding ×3, Welcome, Sign In, Sign Up, Forgot Password, OTP, Home, Categories, Doctors List, Search, Doctor Details, Book Appointment, Booking Confirmation, My Appointments, Appointment Details, Messages, Doctor Chat, Notifications, My Profile.
- Visual reference: Figma community kit "Medical Health Mobile App – Dermatology App UI Kit". Not readable via Figma MCP (no access); the user will provide screenshots. Until then the build is stylistically consistent, not a claimed exact copy.

## Brand Commitments

- Name: DermaCare (demo name chosen by the user).

## Evidence on Hand

- No real doctors, reviews, ratings or clinics. All doctor names, ratings and reviews are demo data and must be presented as such (no claims of real practitioners).

## Product Principles

1. It must feel like a working app, not a static UI kit: every button goes somewhere or does something.
2. Booking is the core job; the path Home → Doctor → Book → Confirm is short and obvious.
3. Calm and trustworthy medical tone; never alarming, never asks for real health data.
4. Readable on small phones: no clipped or overlapping text, keyboard never hides inputs.
