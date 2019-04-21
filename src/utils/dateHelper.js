import moment from 'moment';

export const getTodayDate = () => moment(Date.now());

export const plusNYears = (dateTimeString, n = 1) =>
  moment(dateTimeString).add(n, 'years');

export const dateFormatYYYYMMDD = dateTimeString =>
  moment(dateTimeString).format('YYYY-MM-DD');
