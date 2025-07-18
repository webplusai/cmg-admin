import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import RequestHandler from "../services/RequestHandler";
import { useAlertContext } from "./AlertContext";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const { showAlert } = useAlertContext();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user')
    setToken(token);
    if (user) {
      setUser(JSON.parse(user));
    }
  }, [])

  useEffect(() => {
    if (!token) {
      localStorage.removeItem('token');
    } else {
      localStorage.setItem('token', token);
      getMe().then((response) => {
        localStorage.setItem('user', JSON.stringify(response));
        setUser(response);
      }).catch((error) => {
        if (error.message === 'Unauthorized') {
          logout();
        }
        showAlert({
          title: 'Error',
          description: error.message || 'Something went wrong',
          status: 'error',
        });
      })
    }
  }, [token])

  const isSignedIn = useMemo(() => {
    return !!token;
  }, [token]);

  const login = (data) => new Promise((resolve, reject) => {
    (async () => {
      try {
        const request = new RequestHandler();
        const response = await request.request('post', 'auth/login', data);
        localStorage.setItem('token', response.access_token)
        setToken(response.access_token);
        resolve(response)
      } catch (error) {
        showAlert({
          title: 'Error',
          description: error.message || 'Something went wrong',
          status: 'error',
        });
        reject(error)
      }
    })()
  });


  const register = (data) => new Promise((resolve, reject) => {
    (async () => {
      try {
        const request = new RequestHandler();
        const response = await request.request('post', 'auth/register', data);
        setToken(response.access_token);
        resolve(response)
      } catch (error) {
        showAlert({
          title: 'Error',
          description: error.message || 'Something went wrong',
          status: 'error',
        });
        reject(error)
      }
    })()
  });

  const getMe = () => new Promise((resolve, reject) => {
    (async () => {
      try {
        const request = new RequestHandler();
        request.setToken(token);
        const response = await request.request('get', 'users/me');
        resolve(response)
      } catch (error) {
        showAlert({
          title: 'Error',
          description: error.message || 'Something went wrong',
          status: 'error',
        });
        reject(error)
      }
    })()
  });

  const logout = () => {
    // setToken(null);
    setUser(null);
    localStorage.clear();
    window.open('/', '_self')
  }

  return (
    <AuthContext.Provider value={{ isSignedIn, token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  return useContext(AuthContext);
};