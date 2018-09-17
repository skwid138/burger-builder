import axios from 'axios';

const instance = axios.create({
	baseURL: `https://burger-builder-68133.firebaseio.com/`
});

export default instance;