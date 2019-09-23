import fetchWrap from '@/utils/fetch';

const getProjectCameras = async projectId => {
  const data = await fetchWrap({
    url: `/api/v1/projects/${projectId}/cameras`,
    method: 'GET',
  });
  return data;
};

const editProjectCamera = async ({ project, id, ...body }) => {
  const data = await fetchWrap({
    url: `/api/v1/projects/${project}/cameras/${id}`,
    method: 'PUT',
    body,
  });
  return data;
};

const deleteProjectCamera = async (projectId, cameraId) => {
  const data = await fetchWrap({
    url: `/api/v1/projects/${projectId}/cameras/${cameraId}`,
    method: 'DELETE',
  });
  return data;
};

export { getProjectCameras, editProjectCamera, deleteProjectCamera };
