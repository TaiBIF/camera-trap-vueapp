import fetchWrap from '@/utils/fetch';
import queryString from 'query-string';

const getCalculateLTD = async query => {
  const res = await fetchWrap({
    url: `/api/v1/calculator/ltd?${queryString.stringify(query)}`,
    method: 'GET',
  });
  return res;
};

const getCalculateOI = async query => {
  const res = await fetchWrap({
    url: `/api/v1/calculator/oi?${queryString.stringify(query)}`,
    method: 'GET',
  });
  return res;
};

export { getCalculateLTD, getCalculateOI };
