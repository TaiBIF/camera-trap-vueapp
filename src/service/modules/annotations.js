import fetchWrap from '@/utils/fetch';
import queryString from 'query-string';

const getAnnotations = async query => {
  const res = await fetchWrap({
    url: `/api/v1/annotations?${queryString.stringify(query)}`,
    method: 'GET',
  });
  return res;
};

const setAnnotations = async (annotationId, body) => {
  const res = await fetchWrap({
    url: `/api/v1/annotations/${annotationId}`,
    method: 'PUT',
    body,
  });
  return res;
};

const deleteAnnotations = async annotationId => {
  const res = await fetchWrap({
    url: `/api/v1/annotations/${annotationId}`,
    method: 'DELETE',
  });
  return res;
};

const getRevision = async annotationId => {
  const res = await fetchWrap({
    url: `/api/v1/annotations/${annotationId}/revisions`,
    method: 'GET',
  });
  return res;
};

const rollbackRevision = async (annotationId, revisionId) => {
  const res = await fetchWrap({
    url: `/api/v1/annotations/${annotationId}/revisions/${revisionId}/_rollback`,
    method: 'POST',
  });
  return res;
};

export {
  getAnnotations,
  setAnnotations,
  deleteAnnotations,
  getRevision,
  rollbackRevision,
};
