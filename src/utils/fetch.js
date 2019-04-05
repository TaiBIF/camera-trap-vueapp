const fetchWrap = async ({ url, method, body }) => {
  const res = await fetch(`${process.env.VUE_APP_API_URL}${url}`, {
    method,
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  });
  const contentType = res.headers.get('content-type');
  const data =
    contentType && contentType.indexOf('application/json') !== -1
      ? await res.json()
      : res;
  return data;
};

const fetchUpload = async ({ url, body }) => {
  const res = await fetch(`${process.env.VUE_APP_API_URL}${url}`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    body,
  });
  return await res.json();
};

export default fetchWrap;
export { fetchUpload };
