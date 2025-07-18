import axios from 'axios';
import { constructURL } from '../utils';

const token = localStorage.getItem('token');

export const createSpaceService = (data) => new Promise((resolve, reject) => {
  axios.post(`${import.meta.env.VITE_API_URL}/spaces`, data, { headers: { Authorization: `Bearer ${token}` } })
    .then((response) => {
      resolve(response.data)
    })
    .catch((err) => reject(err));
});

export const getSpacesService = (query) => new Promise((resolve, reject) => {
  axios.get(`${constructURL(`${import.meta.env.VITE_API_URL}/spaces`, query)}`, { headers: { Authorization: `Bearer ${token}` } })
    .then((response) => {
      resolve(response.data)
    })
    .catch((err) => reject(err));
});

export const getSpacesExportService = (query) => new Promise((resolve, reject) => {
  axios.get(`${constructURL(`${import.meta.env.VITE_API_URL}/spaces/export-csv`, query)}`, { headers: { Authorization: `Bearer ${token}` } })
    .then((response) => {
      resolve(response.data)
    })
    .catch((err) => reject(err));
});

export const getSpacesNoPaginationService = (query) => new Promise((resolve, reject) => {
  axios.get(`${constructURL(`${import.meta.env.VITE_API_URL}/spaces/all`, query)}`, { headers: { Authorization: `Bearer ${token}` } })
    .then((response) => {
      resolve(response.data)
    })
    .catch((err) => reject(err));
});

export const getSpaceService = (id) => new Promise((resolve, reject) => {
  axios.get(`${import.meta.env.VITE_API_URL}/spaces/${id}`)
    .then((response) => {
      resolve(response.data)
    })
    .catch((err) => reject(err));
});

export const updateSpaceService = (id, data) => new Promise((resolve, reject) => {
  axios.put(`${import.meta.env.VITE_API_URL}/spaces/${id}`, data, { headers: { Authorization: `Bearer ${token}` } })
    .then((response) => {
      resolve(response.data)
    })
    .catch((err) => reject(err));
});

export const deleteSpaceService = (id) => new Promise((resolve, reject) => {
  axios.delete(`${import.meta.env.VITE_API_URL}/spaces/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    .then((response) => {
      resolve(response.data)
    })
    .catch((err) => reject(err));
});

export const deleteImageSpaceService = (data) => new Promise((resolve, reject) => {
  axios.post(`${import.meta.env.VITE_API_URL}/spaces/remove-image`, data, { headers: { Authorization: `Bearer ${token}` } })
    .then((response) => {
      resolve(response.data)
    })
    .catch((err) => reject(err));
});
