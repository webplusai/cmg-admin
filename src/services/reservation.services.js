import axios from 'axios';
import { constructURL } from '../utils';

const token = localStorage.getItem('token');

export const createReservationService = (data) => new Promise((resolve, reject) => {
  if (!token) return
  axios.post(`${import.meta.env.VITE_API_URL}/reservations`, data, { headers: { Authorization: `Bearer ${token}` } })
    .then((response) => {
      resolve(response.data)
    })
    .catch((err) => reject(err));
});


export const getReservationService = (query = {}) => new Promise((resolve, reject) => {
  if (!token) return
  axios.get(`${constructURL(`${import.meta.env.VITE_API_URL}/reservations`, query)}`, { headers: { Authorization: `Bearer ${token}` } })
    .then((response) => {
      resolve(response.data)
    })
    .catch((err) => reject(err));
});

export const getReservationsBySpaceIdService = (id) => new Promise((resolve, reject) => {
  if (!token) return
  axios.get(`${constructURL(`${import.meta.env.VITE_API_URL}/reservations/space/${id}`)}`, { headers: { Authorization: `Bearer ${token}` } })
    .then((response) => {
      resolve(response.data)
    })
    .catch((err) => reject(err));
})

export const getYearPerformance = (query = {}) => new Promise((resolve, reject) => {
  if (!token) return
  axios.get(`${constructURL(`${import.meta.env.VITE_API_URL}/reservations/year-changes`, query)}`, { headers: { Authorization: `Bearer ${token}` } })
    .then((response) => {
      resolve(response.data)
    })
    .catch((err) => reject(err));
});

export const getSpacesPerformanceAndChanges = (query = {}) => new Promise((resolve, reject) => {
  if (!token) return
  axios.get(`${constructURL(`${import.meta.env.VITE_API_URL}/reservations/performance-change`, query)}`, { headers: { Authorization: `Bearer ${token}` } })
    .then((response) => {
      resolve(response.data)
    })
    .catch((err) => reject(err));
});

export const getSpacesPerformanceAndChangesTable = (query = {}) => new Promise((resolve, reject) => {
  if (!token) return
  axios.get(`${constructURL(`${import.meta.env.VITE_API_URL}/reservations/performance-change-table`, query)}`, { headers: { Authorization: `Bearer ${token}` } })
    .then((response) => {
      resolve(response.data)
    })
    .catch((err) => reject(err));
});

export const updateReservationService = (id, data) => new Promise((resolve, reject) => {
  if (!token) return
  axios.put(`${import.meta.env.VITE_API_URL}/reservations/${id}`, data, { headers: { Authorization: `Bearer ${token}` } })
    .then((response) => {
      resolve(response.data)
    })
    .catch((err) => reject(err));
});

export const deleteReservationService = (id) => new Promise((resolve, reject) => {
  if (!token) return
  axios.delete(`${import.meta.env.VITE_API_URL}/reservations/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    .then((response) => {
      resolve(response.data)
    })
    .catch((err) => reject(err));
});
