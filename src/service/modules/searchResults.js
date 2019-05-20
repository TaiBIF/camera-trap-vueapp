import fetchWrap from '@/utils/fetch';

const getSearchResults = async () => {
  const res = await fetchWrap({
    url:
      '/api/v1/annotations{?studyArea,cameraLocations,startTime,endTime,index,size,sort}',
    method: 'GET',
  });
  return res;
};

export { getSearchResults };
