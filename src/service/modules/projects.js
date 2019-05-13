import fetchWrap from '@/utils/fetch';

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-projects
const getProjects = async () => {
  const res = await fetchWrap({
    url: '/api/v1/projects',
    method: 'GET',
  });
  return res;
};

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-projectsprojectid
const getProjectDetail = async id => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${id}`,
    method: 'GET',
  });
  return res;
};

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#post-projects
const postProject = async body => {
  const res = await fetchWrap({
    url: `/api/v1/projects`,
    method: 'POST',
    body,
  });
  return res;
};

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#put-projectsprojectid
const putProject = async (id, body) => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${id}`,
    method: 'PUT',
    body,
  });
  return res;
};

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#post-projectsprojectidmembers
const postProjectMember = async (id, body) => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${id}/members`,
    method: 'POST',
    body,
  });
  return res;
};

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#post-projectsprojectidmembers
const putProjectMember = async (projectId, body) => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${projectId}/members`,
    method: 'PUT',
    body,
  });
  return res;
};

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-projectsprojectidspecies
const getProjectSpecies = async id => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${id}/species`,
    method: 'GET',
  });
  return res;
};

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#put-projectsprojectidspecies
const putProjectSpecies = async (id, body) => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${id}/species`,
    method: 'PUT',
    body,
  });
  return res;
};

// https://cameratraptw.docs.apiary.io/#/reference/projects/camera-location-abnormality/camera-location-abnormality/200?mc=reference%2Fprojects%2Fcamera-location-abnormality%2Fcamera-location-abnormality%2F200
const postCameraLocationAbnormality = async ({
  projectId,
  cameraLocation,
  abnormalityStartDate,
  abnormalityEndDate,
  abnormalityType,
  note,
}) => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${projectId}/camera-location-abnormality`,
    method: 'POST',
    body: {
      cameraLocation,
      abnormalityStartDate,
      abnormalityEndDate,
      abnormalityType,
      note,
    },
  });
  return res;
};

export {
  getProjects,
  getProjectDetail,
  postProject,
  putProjectMember,
  putProject,
  postProjectMember,
  getProjectSpecies,
  putProjectSpecies,
  postCameraLocationAbnormality,
};
