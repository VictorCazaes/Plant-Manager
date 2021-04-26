import axios from 'axios';

const api = axios.create({
    baseURL: 'https://my-json-server.typicode.com/VictorCazaes/Plant-Manager',
});

export default api;