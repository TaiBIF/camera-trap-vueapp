import moment from 'moment';

export const getTodayDate = () => moment(Date.now());

export const plusNYears = (dateTimeString, n = 1) =>
  moment(dateTimeString).add(n, 'years');

export const subNYears = (dateTimeString, n = 1) =>
  moment(dateTimeString).subtract(n, 'years');

export const dateFormatYYYYMMDD = dateTimeString =>
  moment(dateTimeString).format('YYYY-MM-DD');

export const dateFormatYYYYMMDDHHmmss = dateTimeString =>
  moment(dateTimeString).format('YYYY-MM-DD HH:mm:ss');
