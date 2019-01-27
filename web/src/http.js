import axios from 'axios';

const apiUrl = 'http://dailyadvisor.eu:8080';

export const http = axios.create({
    baseURL: apiUrl,
    withCredentials: false,
    headers: {},
});
