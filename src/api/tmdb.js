// src/tmdbApi.js  
import axios from 'axios';  

const API_KEY = 'fafcb2cabdf054ea713c9c383b777658';
const BASE_URL = 'https://api.themoviedb.org/3';  

const tmdbApi = axios.create({  
  baseURL: BASE_URL,  
  params: {  
    api_key: API_KEY,  
    language: 'en-US',
  },  
});  

// ================================================================================== Search Bar

export const searchMovies = async (query) => {  
  const response = await tmdbApi.get('/search/movie', {  
    params: { query },  
  });  
  return response.data.results;  
};

export const searchActors = async (query) => {  
  const response = await tmdbApi.get('/search/person', {  
    params: { query },  
  });  
  return response.data.results;
};

export const searchSeries = async (query) => {  
  const response = await tmdbApi.get('/search/tv', {  
    params: { query },  
  });
  return response.data.results;
};  

// ================================================================================== Movies List

export const fetchPopularMovies = async () => {  
  const response = await tmdbApi.get('/movie/popular');  
  return response.data.results;  
};

export const fetchTopRatedMovies = async () => {  
  const response = await tmdbApi.get(`/movie/top_rated`);
  return response.data;
};

export const fetchNowShowingMovies = async () => {  
  const response = await tmdbApi.get(`/movie/now_playing`);
  return response.data; 
};

// ================================================================================== Movies

export const fetchMovieDetails = async (id) => {  
  const response = await tmdbApi.get(`/movie/${id}`);  
  return response.data;
};  

export const fetchSimilarMovies = async (id) => {  
  const response = await tmdbApi.get(`/movie/${id}/similar`);  
  return response.data;
};  

export const fetchMovieReviews = async (id) => {  
  const response = await tmdbApi.get(`/movie/${id}/reviews`);  
  return response.data;
};

export const fetchMovieVideos = async (id) => {  
  const response = await tmdbApi.get(`/movie/${id}/videos`);
  return response.data.results;
};  

export const fetchMovieCredits = async (id) => {    
  const response = await tmdbApi.get(`/movie/${id}/credits`);    
  return response.data;
};

export const fetchCastMovies = async (id) => {  
    const response = await tmdbApi.get(`/person/${id}/movie_credits`);
    return response.data;
};

// ================================================================================== Series

export const fetchPopularSeries = async () => {  
  const response = await tmdbApi.get(`/tv/popular`)
  return response.data.results;  
};  

export const fetchTopRatedSeries = async () => {  
  const response = await tmdbApi.get(`/tv/top_rated`)
  return response.data;  
};  

export const fetchNowAiringSeries = async () => {  
  const response = await tmdbApi.get(`/tv/on_the_air`)
  return response.data;  
};

export const fetchSeriesDetails = async (id) => {  
  const response = await tmdbApi.get(`/tv/${id}`);  
  return response.data;  
};  

export const fetchSeriesCredits = async (id) => {  
  const response = await tmdbApi.get(`/tv/${id}/credits`); 
  return response.data;  
};  

export const fetchSimilarSeries = async (id) => {  
  const response = await tmdbApi.get(`/tv/${id}/similar`);  
  return response.data;  
};  

export const fetchSeriesReviews = async (id) => {  
  const response = await tmdbApi.get(`/tv/${id}/reviews`);  
  return response.data;  
};  

export const fetchSeriesVideos = async (id) => {  
  const response = await tmdbApi.get(`/tv/${id}/videos`);  
  return response.data.results;  
};  

export const fetchCastSeries = async (id) => {  
  const response = await tmdbApi.get(`/person/${id}/tv_credits`);
  return response.data;
};

// ================================================================================== Cast

export const fetchActorDetails = async (id) => {  
  const response = await tmdbApi.get(`/person/${id}`);
  return response.data;
};

export const fetchPopularActors = async (page = 1) => {  
  const response = await tmdbApi.get(`/person/popular`, {
    params: {
      page: page,
    },
  });
  return response.data;
};  


export const fetchCastDetails = async (castId) => {    
  const response = await tmdbApi.get(`/person/${castId}`);    
  return response.data;    
};  