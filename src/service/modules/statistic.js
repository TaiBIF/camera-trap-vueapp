import fetchWrap from '@/utils/fetch';

const getSstatistics = async () =>
  await fetchWrap({
    url: `/api/v1/statistics`,
    method: 'GET',
  });

const getSstatisticsByCountyName = async countyName =>
  await fetchWrap({
    url: `/api/v1/statistics/county/${countyName}`,
    method: 'GET',
  });

export { getSstatistics, getSstatisticsByCountyName };
