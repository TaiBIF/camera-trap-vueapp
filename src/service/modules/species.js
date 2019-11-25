import fetchWrap from '@/utils/fetch';

const fetchSpecies = async () => {
  const res = await fetchWrap({
    url: `/api/v1/species`,
    method: 'GET',
  });
  return res;
};

export { fetchSpecies };
