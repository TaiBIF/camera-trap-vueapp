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

const getPublicProjects = async query => {
  const res = await fetchWrap({
    url: `/api/v1/projects/public?${queryString.stringify(query)}`,
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

const getProjectOversight = async (id, year) => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${id}/oversight?year=${year}`,
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

const getIdentifiedSpecies = async (projectId, tripId) => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${projectId}/image-species-group?${queryString.stringify(
      { tripId },
    )}`,
    method: 'GET',
  });
  return res;
};

const getIdentifiedStudyAreaSpecies = async (
  projectId,
  studyAreaId,
  tripId,
) => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${projectId}/study-areas/${studyAreaId}/image-species-group?${queryString.stringify(
      { tripId },
    )}`,
    method: 'GET',
  });
  return res;
};

// https://cameratraptw.docs.apiary.io/#/reference/metrics/get-retrieval-metrics-by-project/get-retrieval-metrics-by-project/200?mc=reference%2Fmetrics%2Fget-retrieval-metrics-by-project%2Fget-retrieval-metrics-by-project%2F200
const getRetrievalDataByProject = async ({ projectId, ...query }) => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${projectId}/month-retrieved?${queryString.stringify(
      query,
    )}`,
    method: 'GET',
  });
  return res;
};

const getRetrievalDataByStudyArea = async ({
  projectId,
  studyAreaId,
  ...query
}) => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${projectId}/study-areas/${studyAreaId}/month-retrieved?${queryString.stringify(
      query,
    )}`,
    method: 'GET',
  });
  return res;
};

const getRetrievalDataByCameraLocation = async ({
  projectId,
  cameraLocationId,
  ...query
}) => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${projectId}/camera-locations/${cameraLocationId}/month-retrieved?${queryString.stringify(
      query,
    )}`,
    method: 'GET',
  });
  return res;
};

export {
  getProjects,
  getPublicProjects,
  getAllProjects,
  getProjectDetail,
  getProjectOversight,
  postProject,
  putProjectMember,
  putProject,
  postProjectMember,
  getProjectSpecies,
  putProjectSpecies,
  postCameraLocationAbnormality,
  getIdentifiedSpecies,
  getIdentifiedStudyAreaSpecies,
  getRetrievalDataByProject,
  getRetrievalDataByStudyArea,
  getRetrievalDataByCameraLocation,
};
