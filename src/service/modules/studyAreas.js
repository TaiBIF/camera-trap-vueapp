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

export {
  getProjectStudyAreas,
  postProjectStudyAreas,
  getProjectCameraLocations,
  postProjectCameraLocations,
};
