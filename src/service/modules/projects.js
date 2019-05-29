import fetchWrap from '@/utils/fetch';
import queryString from 'query-string';

// https://github.com/TaiBIF/camera-trap-api/wiki/API-v1-Document#get-projects
const getProjects = async query => {
  const res = await fetchWrap({
    url: `/api/v1/projects?${queryString.stringify(query)}`,
    method: 'GET',
  });
  return res;
};

const getAllProjects = async (query, items = []) => {
  /*
  Fetch all projects.
  @param query {Object}
    index {Number} Please pass 0 or not for the first call.
    size {Number}
    sort {String}
  @param items {Array<Project>} For recursive
  @returns {Promise<Object>}
   */
  const result = await fetchWrap({
    method: 'GET',
    url: `/api/v1/projects?${queryString.stringify(query)}`,
  });
  result.items.forEach(x => items.push(x));
  const hasNext = (result.index + 1) * result.size < result.total;
  if (hasNext) {
    await getAllProjects({ ...query, index: result.index + 1 }, items);
  }
  return { ...result, items };
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

const getIdentifiedSpecies = async projectId => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${projectId}/image-species-group`,
    method: 'GET',
  });
  return res;
};

// https://cameratraptw.docs.apiary.io/#/reference/metrics/get-retrieval-metrics-by-project/get-retrieval-metrics-by-project/200?mc=reference%2Fmetrics%2Fget-retrieval-metrics-by-project%2Fget-retrieval-metrics-by-project%2F200
const getRetrievalDataByProject = async ({ year, projectId }) => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${projectId}/month-retrieved?year=${year}`,
    method: 'GET',
  });
  return res;
};

const getRetrievalDataByStudyArea = async ({
  year,
  projectId,
  studyAreaId,
}) => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${projectId}/study-areas/${studyAreaId}/month-retrieved?year=${year}`,
    method: 'GET',
  });
  return res;
};

const getRetrievalDataByCameraLocation = async ({
  year,
  projectId,
  cameraLocationId,
}) => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${projectId}/camera-locations/${cameraLocationId}/month-retrieved?year=${year}`,
    method: 'GET',
  });
  return res;
};

export {
  getProjects,
  getAllProjects,
  getProjectDetail,
  postProject,
  putProjectMember,
  putProject,
  postProjectMember,
  getProjectSpecies,
  putProjectSpecies,
  postCameraLocationAbnormality,
  getIdentifiedSpecies,
  getRetrievalDataByProject,
  getRetrievalDataByStudyArea,
  getRetrievalDataByCameraLocation,
};
