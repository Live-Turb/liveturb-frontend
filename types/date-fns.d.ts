/**
 * Declaração de tipos personalizada para date-fns v4.1.0
 * 
 * Esta declaração resolve incompatibilidades com react-day-picker que depende de date-fns v2.x ou v3.x
 * sem precisar fazer downgrade da versão em uso
 */

declare module 'date-fns' {
  export function format(date: Date | number, format: string, options?: { locale?: Locale }): string;
  export function addDays(date: Date | number, amount: number): Date;
  export function startOfWeek(date: Date | number, options?: { locale?: Locale }): Date;
  export function endOfWeek(date: Date | number, options?: { locale?: Locale }): Date;
  export function startOfMonth(date: Date | number): Date;
  export function endOfMonth(date: Date | number): Date;
  export function isValid(date: any): boolean;
  export function parse(dateString: string, formatString: string, backupDate: Date, options?: { locale?: Locale }): Date;
  export function isSameDay(dateLeft: Date | number, dateRight: Date | number): boolean;
  export function isSameMonth(dateLeft: Date | number, dateRight: Date | number): boolean;
  export function setMonth(date: Date | number, month: number): Date;
  export function setYear(date: Date | number, year: number): Date;
  export function differenceInCalendarDays(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInCalendarMonths(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInCalendarYears(dateLeft: Date | number, dateRight: Date | number): number;
  export function getDay(date: Date | number): number;
  export function getMonth(date: Date | number): number;
  export function getYear(date: Date | number): number;
  export function getDate(date: Date | number): number;
  export function getWeek(date: Date | number, options?: { locale?: Locale }): number;
  export function compareAsc(dateLeft: Date | number, dateRight: Date | number): number;
  export function formatISO(date: Date | number): string;
  export function parseISO(dateString: string): Date;

  export interface Locale {
    code?: string;
    formatLong?: any;
    formatRelative?: any;
    localize?: any;
    match?: any;
    options?: any;
  }

  export const ptBR: Locale;
}

declare module 'date-fns/locale' {
  import { Locale } from 'date-fns';
  export const ptBR: Locale;
}

declare module 'date-fns/esm' {
  export * from 'date-fns';
}

declare module 'date-fns/esm/locale' {
  export * from 'date-fns/locale';
}
