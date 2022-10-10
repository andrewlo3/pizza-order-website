import jwt_decode from 'jwt-decode';

export const getToken = async () => {
  let token = JSON.parse(localStorage.getItem('jwt') ?? '');
  if (!token)
    throw new Error(
      'The auth token could not be found in local memory. Please refresh to login again.'
    );
  const decoded: any = jwt_decode(token);
  const nowUnix = +new Date().getTime().toString().slice(0, -3);
  const expireUnix = decoded.exp;
  if (decoded.exp < nowUnix)
    throw new Error(
      'The auth token has expired. Please refresh to login again.'
    );

  return token;
};
