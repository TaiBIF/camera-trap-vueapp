import fetchWrap from '@/utils/fetch';

const getProjectTrips = async projectId =>
  await fetchWrap({
    url: `/api/v1/projects/${projectId}/trips`,
    method: 'GET',
  });

const addProjectTrip = async (projectId, body) =>
  await fetchWrap({
    url: `/api/v1/projects/${projectId}/trips`,
    method: 'POST',
    body,
  });

export { getProjectTrips, addProjectTrip };
