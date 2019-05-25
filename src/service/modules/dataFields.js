import fetchWrap from '@/utils/fetch';
import queryString from 'query-string';

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-data-fields
const getDataFields = async () => {
  const res = await fetchWrap({
    url: '/api/v1/data-fields',
    method: 'GET',
  });
  return res;
};

const getAllDataFields = async (query, items = []) => {
  const result = await fetchWrap({
    method: 'GET',
    url: `/api/v1/data-fields?${queryString.stringify(query)}`,
  });
  result.items.forEach(x => items.push(x));
  const hasNext = (result.index + 1) * result.size < result.total;
  if (hasNext) {
    await getAllDataFields({ ...query, index: result.index + 1 }, items);
  }
  return { ...result, items };
};

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#post-data-fields
const postDataFields = async body => {
  const res = await fetchWrap({
    url: '/api/v1/data-fields',
    method: 'POST',
    body,
  });
  return res;
};

export { getDataFields, postDataFields, getAllDataFields };
