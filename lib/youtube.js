import axios from 'axios';
// import getConfig from 'next/config';

// const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

// const key = serverRuntimeConfig.mySecret;

export default axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  params: {
    part: 'snippet',
    key: 'AIzaSyD9TZEQX9cK7QO1vcJlZxUPvJTkdi-XUwU',
  },
});
