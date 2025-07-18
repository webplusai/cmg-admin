import jwtDecode from "jwt-decode";
import moment from "moment";
import constants from "./constants";

export const convertToHeader = (value = '') => {
  return value.replace(/_/g, ' ')
}

export const formatDate = (date, id = "") => {
  const inputDate = id === 'start_date' ? moment(date).add(1, 'day').toDate() : new Date(date);

  const day = String(inputDate.getUTCDate()).padStart(2, '0');
  const month = String(inputDate.getUTCMonth() + 1).padStart(2, '0');
  const year = inputDate.getUTCFullYear();

  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
}

export const parser = (data) => {
  if (data?.updated_at || data?.created_at) {
    return Object.values({ ...data, updated_at: formatDate(data?.updated_at), created_at: formatDate(data?.created_at) })
  } else {
    return Object.values(data)
  }
}

export const downloadCsv = (csvData, name = 'data') => {
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const fileToImage = (file) => {
  const reader = new FileReader();

  return reader.readAsDataURL(file)
}

export const JwtDecoder = (token) => {
  return jwtDecode(token);
}

export const responseParser = (response, id) => {
  if (['created_at', 'updated_at'].includes(id) || id.includes('_date')) {
    return formatDate(response[id], id)
  } else if (id === 'number_of_days') {
    let days = moment(response['end_date']).diff(moment(response['start_date']), 'days')
    return days + 1
  } else if (id === 'user') {
    return `${response['user_id']['first_name']} ${response['user_id']['last_name']}`
  } else if (id === 'name') {
    return `${response['space_id']?.['name'] || response['name']}`
  } else {
    return response[id];
  }
}

export const constructURL = (baseUrl, params) => {
  const urlParams = [];

  for (const key in params) {
    if (params.hasOwnProperty(key) && params[key] !== undefined) {
      urlParams.push(`${key}=${encodeURIComponent(params[key])}`);
    }
  }

  return `${baseUrl}?${urlParams.join('&')}`;
}

export const getDateRange = (data) => {
  return data.map(d => ([standardEndDate(d.start_date), d.end_date, constants.STATUS_COLOR[d.status]]))
}

export const currencyConverter = (value) => {
  switch (value) {
    case 'USD':
      return <span>&#36;</span>
    case 'EUR':
      return <span>&#x20AC;</span>
    case 'GBP':
      return <span>&#163;</span>
    default:
      return value;
  }
}

export const standardEndDate = (endDate) => {
  let hour = moment(endDate).hour();

  if (hour > 22 || hour === 0) {
    return moment(endDate).subtract(1, 'hour');
  }

  return moment(endDate);
}
