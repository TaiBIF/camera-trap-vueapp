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

export { getProjects, getProjectDetail, postProject };
