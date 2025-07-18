import { createContext, useCallback, useContext, useState } from 'react';
import { useAuthContext } from "./AuthContext";
import RequestHandler from "../services/RequestHandler";
import { useAlertContext } from "./AlertContext";
import { constructURL } from '../utils';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { token } = useAuthContext();
  const { showAlert } = useAlertContext();
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [meta, setMeta] = useState({});
  const userRoles = ["ADMIN", "CUSTOMER"]

  const getAllUsers = useCallback(async ({ page = 1, limit = 10, hideLoader }) => {
    try {
      setIsFetchingUsers(!hideLoader);
      const API = new RequestHandler();
      API.setToken(token);
      const response = await API.request('get', `users?page=${page}&limit=${limit}`);
      setUsers(response.items);
      setMeta(response.meta);
      setIsFetchingUsers(false);
      return response;
    } catch (error) {
      setIsFetchingUsers(false);
      showAlert({
        title: 'Error',
        description: error.message || 'Something went wrong',
        status: 'error',
      });
    }
  }, [token])

  const getUser = (query) => new Promise((resolve, reject) => {
    try {
      const API = new RequestHandler();
      API.setToken(token);
      API.request('get', constructURL('users/find', query))
        .then(response => resolve(response))
        .catch(err => reject(err));
    } catch (error) {
      reject(error)
      showAlert({
        title: 'Error',
        description: error.message || 'Something went wrong',
        status: 'error',
      });
    }
  })

  const getAllUsersWithoutPagination = useCallback(async () => {
    try {
      const API = new RequestHandler();
      API.setToken(token);
      const response = await API.request('get', `users`);
      setAllUsers(response.items);
      return response;
    } catch (error) {
      setIsFetchingUsers(false);
      showAlert({
        title: 'Error',
        description: error.message || 'Something went wrong',
        status: 'error',
      });
    }
  }, [token])

  const addNewUser = useCallback((data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const API = new RequestHandler();
        API.setToken(token);
        const response = await API.request('post', `users`, data);
        await getAllUsers({ hideLoader: true })
        resolve(response)
      } catch (error) {
        showAlert({
          title: 'Error',
          description: error.message || 'Something went wrong',
          status: 'error',
        });
        reject(error);
      }
    })
  }, [token])

  const updateNewUser = useCallback((data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const API = new RequestHandler();
        API.setToken(token);
        const response = await API.request('patch', `users/role-update`, data);
        await getAllUsers({ hideLoader: true })
        resolve(response)
      } catch (error) {
        showAlert({
          title: 'Error',
          description: error.message || 'Something went wrong',
          status: 'error',
        });
        reject(error);
      }
    })
  }, [token])

  const deleteUser = useCallback((id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const API = new RequestHandler();
        API.setToken(token);
        const response = await API.request('delete', `users/${id}`);
        await getAllUsers({ hideLoader: true })
        resolve(response);
      } catch (error) {
        showAlert({
          title: 'Error',
          description: error.message || 'Something went wrong',
          status: 'error',
        });
        reject(error);
      }
    })
  }, [token])

  return (
    <UserContext.Provider value={{ users, allUsers, usersMeta: meta, isFetchingUsers, userRoles, getAllUsersWithoutPagination, getAllUsers, getUser, deleteUser, addNewUser, updateNewUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => {
  return useContext(UserContext);
};