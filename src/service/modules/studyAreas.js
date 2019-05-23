import fetchWrap from '@/utils/fetch';
import queryString from 'query-string';

// GET /projects/{projectId}/study-areas http://bit.ly/2DIvx4f
const getProjectStudyAreas = async id => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${id}/study-areas`,
    method: 'GET',
  });
  return res;
};

// POST /projects/{projectId}/study-areas http://bit.ly/2IVnbu7
const postProjectStudyAreas = async (id, body) => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${id}/study-areas`,
    method: 'POST',
    body,
  });
  return res;
};

// GET /projects/{projectId}/study-areas/{studyAreaId}/camera-locations http://bit.ly/2V8eUK0
const getProjectCameraLocations = async (projectId, StudyAreaId) => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${projectId}/study-areas/${StudyAreaId}/camera-locations`,
    method: 'GET',
  });
  return res;
};

const getAllProjectCameraLocations = async (
  projectId,
  studyAreaId,
  query,
  items = [],
) => {
  /*
  Fetch all camera locations.
  @param projectId {String}
  @param studyAreaId {String}
  @param query {Object}
    index {Number} Please pass 0 or not for the first call.
    size {Number}
    sort {String}
  @param items {Array<CameraLocation>} For recursive
  @returns {Promise<Object>}
   */
  const result = await fetchWrap({
    method: 'GET',
    url: `/api/v1/projects/${projectId}/study-areas/${studyAreaId}/camera-locations?${queryString.stringify(
      query,
    )}`,
  });
  result.items.forEach(x => items.push(x));
  const hasNext = (result.index + 1) * result.size < result.total;
  if (hasNext) {
    await getAllProjectCameraLocations(
      projectId,
      studyAreaId,
      { ...query, index: result.index + 1 },
      items,
    );
  }
  return { ...result, items };
};

// POST /projects/{projectId}/study-areas/{studyAreaId}/camera-locations http://bit.ly/2UXxQGA
const postProjectCameraLocations = async (projectId, StudyAreaId, body) => {
  // @todo temporary manipulation for the mandatory geodeticDatum, frontend selectµion to be implemented.
  body.geodeticDatum = body.geodeticDatum ? body.geodeticDatum : 'WGS84';
  const res = await fetchWrap({
    url: `/api/v1/projects/${projectId}/study-areas/${StudyAreaId}/camera-locations`,
    method: 'POST',
    body,
  });
  return res;
};

// PUT /projects/{projectId}/camera-locations/{cameraLocationId} http://bit.ly/2HoimaO
const putProjectCameraLocations = async (projectId, cameraLocationId, body) => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${projectId}/camera-locations/${cameraLocationId}`,
    method: 'PUT',
    body,
  });
  return res;
};

// DELETE /projects/{projectId}/camera-locations/{camera-locationId} http://bit.ly/2vt6MEK
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

const lockProjectCameraLocations = async (projectId, cameraLocationId) => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${projectId}/camera-locations/${cameraLocationId}/_lock`,
    method: 'POST',
  });
  return res;
};

const unlockProjectCameraLocations = async (projectId, cameraLocationId) => {
  const res = await fetchWrap({
    url: `/api/v1/projects/${projectId}/camera-locations/${cameraLocationId}/_unlock`,
    method: 'POST',
  });
  return res;
};

export {
  getProjectStudyAreas,
  getAllProjectCameraLocations,
  postProjectStudyAreas,
  getProjectCameraLocations,
  postProjectCameraLocations,
  putProjectCameraLocations,
  deleteProjectCameraLocations,
  getProjectCameraLocationsByName,
  lockProjectCameraLocations,
  unlockProjectCameraLocations,
};
