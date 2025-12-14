import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

export const verifyNews = async (text) => {
  try {
    // Use the fact-check endpoint for proper verification analysis
    const response = await axios.post(`${API_BASE_URL}/news-agent/fact-check`, { 
      newsText: text 
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || 'Failed to verify news');
  }
};

export const searchRecentNews = async (text) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/news-agent/analyze`, { 
      userInput: text 
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || 'Failed to search news');
  }
};

export const getHistory = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/history`);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch history');
  }
};

export const getNews = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/news`);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch news');
  }
};