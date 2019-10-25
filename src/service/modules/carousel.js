import fetchWrap from '@/utils/fetch';

const getCarousel = async () =>
  await fetchWrap({
    url: `/api/v1/carousel`,
    method: 'GET',
  });

export { getCarousel };
