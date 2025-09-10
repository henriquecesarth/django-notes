import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { jwtDecode } from 'jwt-decode';
import { api, publicApi } from '../../utils/api';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../../constants';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    auth().catch(() => {
      console.log('Error');
      setIsAuthorized(false);
    });
  }, []);

  const refreshSession = async () => {
    try {
      const res = await publicApi.post('/api/session/refresh/');
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        setIsAuthorized(true);
        return;
      }

      setIsAuthorized(false);
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);

    try {
      const res = await api.post('/api/token/refresh/', {
        refresh: refreshToken,
      });

      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      refreshSession();
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }

    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration == null || tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === null) return <div>Loading...</div>;

  return isAuthorized ? children : <Navigate to='/login' />;
};

export default ProtectedRoute;
