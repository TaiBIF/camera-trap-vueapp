import fetchWrap from '@/utils/fetch';
import queryString from 'query-string';

const getAnnotations = async query => {
  const res = await fetchWrap({
    url: `/api/v1/annotations?${queryString.stringify(query)}`,
    method: 'GET',
  });
  return res;
};

const setAnnotations = async (annotationId, body) => {
  const res = await fetchWrap({
    url: `/api/v1/annotations/${annotationId}`,
    method: 'PUT',
    body,
  });
  return res;
};

export { getAnnotations, setAnnotations };
