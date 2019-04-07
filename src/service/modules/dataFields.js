import fetchWrap from '@/utils/fetch';

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-data-fields
const getDataFields = async () => {
  const res = await fetchWrap({
    url: '/api/v1/data-fields',
    method: 'GET',
  });
  return res;
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

export { getDataFields, postDataFields };
