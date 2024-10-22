import { toZonedTime } from 'date-fns-tz';

function getNowByLocale(locale: string = 'Europe/Istanbul') {
  return toZonedTime(new Date(), locale);
}

export { getNowByLocale };
