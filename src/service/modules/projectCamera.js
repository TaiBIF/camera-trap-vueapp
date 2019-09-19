import fetchWrap from '@/utils/fetch';

const getProjectCameras = async projectId => {
  const data = await fetchWrap({
    url: `/api/v1/projects/${projectId}/cameras`,
    method: 'GET',
  });
  return data;
};

export { getProjectCameras };
