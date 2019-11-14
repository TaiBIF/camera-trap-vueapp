import fetchWrap from '@/utils/fetch';

const getProjectTrips = async projectId =>
  await fetchWrap({
    url: `/api/v1/projects/${projectId}/trips`,
    method: 'GET',
  });
const getProjectTripsDateTimeInterval = async (projectId, tripId) =>
  await fetchWrap({
    url: `/api/v1/projects/${projectId}/trips/${tripId}`,
    method: 'GET',
  });

const addProjectTrip = async (projectId, body) =>
  await fetchWrap({
    url: `/api/v1/projects/${projectId}/trips`,
    method: 'POST',
    body,
  });

const editProjectTrip = async (projectId, tripId, body) =>
  await fetchWrap({
    url: `/api/v1/projects/${projectId}/trips/${tripId}`,
    method: 'PUT',
    body,
  });

const deleteProjectTrip = async (projectId, tripId) => {
  const data = await fetchWrap({
    url: `/api/v1/projects/${projectId}/trips/${tripId}`,
    method: 'DELETE',
  });
  return data;
};

export {
  getProjectTrips,
  addProjectTrip,
  editProjectTrip,
  deleteProjectTrip,
  getProjectTripsDateTimeInterval,
};
