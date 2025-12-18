
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface ClassDetails {
  id: string;
  name: string;
  room: string;
  teacher: string;
  schedule: DayOfWeek[];
  importantNotes?: string;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  lastModified?: string;
}

export type AttendanceStatus = 'attended' | 'missed' | 'cancelled' | 'holiday';

export interface AttendanceRecord {
  date: string; // ISO format YYYY-MM-DD
  classId: string;
  status: AttendanceStatus;
  note?: string; 
  biometricDone: boolean;
  lastModified?: string;
}

export interface Holiday {
  id: string;
  date: string;
  description: string;
  lastModified?: string;
}

export enum AppView {
  DASHBOARD = 'dashboard',
  CLASSES = 'classes',
  ATTENDANCE_LOG = 'attendance_log',
  HOLIDAYS = 'holidays',
  ANALYTICS = 'analytics',
  SETTINGS = 'settings',
  THANKS = 'thanks'
}

export type AttendanceRange = 'daily' | 'weekly' | 'monthly';

export type AppTheme = 'cosmic' | 'onyx' | 'cloud' | 'aurora';

export interface AppData {
  classes: ClassDetails[];
  attendance: AttendanceRecord[];
  holidays: Holiday[];
  dailyBiometrics?: string[];
  theme?: AppTheme;
}
