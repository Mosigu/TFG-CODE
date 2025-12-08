import axios from 'axios';

// Mock axios before importing apiClient
jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };
  return {
    create: jest.fn(() => mockAxiosInstance),
    isAxiosError: jest.fn(),
  };
});

describe('apiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
    localStorage.removeItem.mockClear();
  });

  it('should create axios instance with correct config', () => {
    require('../../app/utils/api-client');

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: '/api',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false,
    });
  });

  it('should setup request and response interceptors', () => {
    const apiClient = require('../../app/utils/api-client').default;

    expect(apiClient.interceptors.request.use).toHaveBeenCalled();
    expect(apiClient.interceptors.response.use).toHaveBeenCalled();
  });
});
