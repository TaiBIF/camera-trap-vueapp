import fetchWrap from '@/utils/fetch';

export const getForestBoundary = async ({ lat, lng }) => {
  const data = await fetchWrap({
    url: `/api/v1/forest-compartment-boundary?decimalLongitude=${lng}&decimalLatitude=${lat}&size=10`,
    method: 'GET',
  });
  return data;
};
