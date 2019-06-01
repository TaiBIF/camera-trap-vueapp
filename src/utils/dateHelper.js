import moment from 'moment';
import 'moment-timezone';

moment.tz.setDefault('Etc/GMT');

export const getTodayDate = () => moment(Date.now());

export const plusNYears = (dateTimeString, n = 1) =>
  moment(dateTimeString).add(n, 'years');

export const subNYears = (dateTimeString, n = 1) =>
  moment(dateTimeString).subtract(n, 'years');

export const dateFormatYYYYMMDD = dateTimeString =>
  moment(dateTimeString).format('YYYY-MM-DD');

export const dateFormatYYYYMMDDHHmmss = dateTimeString =>
  moment(dateTimeString).format('YYYY-MM-DD HH:mm:ss');

export const dateFormatYYYY = dateTimeString => {
  return moment(dateTimeString).format('YYYY');
};

export const setTwoDigitFormat = num => ('0' + num).slice(-2);
