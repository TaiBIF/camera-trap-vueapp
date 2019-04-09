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

export { getProjectStudyAreas, postProjectStudyAreas };
