import fetchWrap from '@/utils/fetch';

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
  postProjectStudyAreas,
  getProjectCameraLocations,
  postProjectCameraLocations,
  putProjectCameraLocations,
  deleteProjectCameraLocations,
  getProjectCameraLocationsByName,
  lockProjectCameraLocations,
  unlockProjectCameraLocations,
};
