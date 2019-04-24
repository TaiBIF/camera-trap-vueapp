import fetchWrap from '@/utils/fetch';

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-projectsprojectidstudy-areas
const getProjectStudyAreas = async id => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${id}/study-areas`,
    method: 'GET',
  });
  return res;
};

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#post-projectsprojectidstudy-areas
const postProjectStudyAreas = async (id, body) => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${id}/study-areas`,
    method: 'POST',
    body,
  });
  return res;
};

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-projectsprojectidcamera-locations
const getProjectCameraLocations = async (projectId, StudyAreaId) => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${projectId}/study-areas/${StudyAreaId}/camera-locations`,
    method: 'GET',
  });
  return res;
};

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-projectsprojectidstudy-areasstudyareaidcamera-locations
const postProjectCameraLocations = async (projectId, StudyAreaId, body) => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${projectId}/study-areas/${StudyAreaId}/camera-locations`,
    method: 'POST',
    body,
  });
  return res;
};

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#put-projectsprojectidcamera-locationscameralocationid
const putProjectCameraLocations = async (projectId, cameraLocationId, body) => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${projectId}/camera-locations/${cameraLocationId}`,
    method: 'PUT',
    body,
  });
  return res;
};

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#delete-projectsprojectidcamera-locationscameralocationid
const deleteProjectCameraLocations = async (projectId, cameraLocationId) => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${projectId}/camera-locations/${cameraLocationId}`,
    method: 'DELETE',
  });
  return res;
};

const getProjectCameraLocationsByName = async (
  projectId,
  cameraLocationName,
) => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${projectId}/camera-locations?name=${cameraLocationName}`,
    method: 'GET',
  });
  return res;
};

export {
  getProjectStudyAreas,
  postProjectStudyAreas,
  getProjectCameraLocations,
  postProjectCameraLocations,
  putProjectCameraLocations,
  deleteProjectCameraLocations,
  getProjectCameraLocationsByName,
};
