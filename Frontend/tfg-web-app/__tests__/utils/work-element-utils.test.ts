import axios from 'axios';

// Mock apiClient
jest.mock('../../app/utils/api-client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

import apiClient from '../../app/utils/api-client';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  loginUser,
  logoutUser,
  getCurrentUser,
  isAuthenticated,
} from '../../app/utils/work-element-utils';

describe('work-element-utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (localStorage.getItem as jest.Mock).mockClear();
    (localStorage.setItem as jest.Mock).mockClear();
    (localStorage.removeItem as jest.Mock).mockClear();
  });

  describe('getProjects', () => {
    it('should fetch projects successfully', async () => {
      const mockProjects = [{ id: '1', title: 'Project 1' }];
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockProjects });

      const result = await getProjects();

      expect(apiClient.get).toHaveBeenCalledWith('/work-elements/projects');
      expect(result).toEqual(mockProjects);
    });

    it('should throw error on failure', async () => {
      const error = { response: { status: 500, data: 'Server error' } };
      (apiClient.get as jest.Mock).mockRejectedValue(error);
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);

      await expect(getProjects()).rejects.toThrow('Error fetching projects: 500');
    });
  });

  describe('getProjectById', () => {
    it('should fetch project by id successfully', async () => {
      const mockProject = { id: '1', title: 'Project 1' };
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockProject });

      const result = await getProjectById('1');

      expect(apiClient.get).toHaveBeenCalledWith('/work-elements/projects/1');
      expect(result).toEqual(mockProject);
    });
  });

  describe('createProject', () => {
    it('should create project successfully', async () => {
      const newProject = { title: 'New Project' };
      const createdProject = { id: '1', ...newProject };
      (apiClient.post as jest.Mock).mockResolvedValue({ data: createdProject });

      const result = await createProject(newProject);

      expect(apiClient.post).toHaveBeenCalledWith('/work-elements/projects', newProject);
      expect(result).toEqual(createdProject);
    });
  });

  describe('updateProject', () => {
    it('should update project successfully', async () => {
      const updateData = { title: 'Updated Project' };
      const updatedProject = { id: '1', ...updateData };
      (apiClient.patch as jest.Mock).mockResolvedValue({ data: updatedProject });

      const result = await updateProject('1', updateData);

      expect(apiClient.patch).toHaveBeenCalledWith('/work-elements/projects/1', updateData);
      expect(result).toEqual(updatedProject);
    });
  });

  describe('deleteProject', () => {
    it('should delete project successfully', async () => {
      (apiClient.delete as jest.Mock).mockResolvedValue({ data: { success: true } });

      const result = await deleteProject('1');

      expect(apiClient.delete).toHaveBeenCalledWith('/work-elements/projects/1');
      expect(result).toEqual({ success: true });
    });
  });

  describe('getProjectTasks', () => {
    it('should fetch project tasks successfully', async () => {
      const mockTasks = [{ id: '1', title: 'Task 1' }];
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTasks });

      const result = await getProjectTasks('project-1');

      expect(apiClient.get).toHaveBeenCalledWith('/work-elements/tasks?projectId=project-1');
      expect(result).toEqual(mockTasks);
    });
  });

  describe('createTask', () => {
    it('should create task successfully', async () => {
      const newTask = { title: 'New Task', projectId: '1', priority: 'high' };
      const createdTask = { id: '1', ...newTask };
      (apiClient.post as jest.Mock).mockResolvedValue({ data: createdTask });

      const result = await createTask(newTask);

      expect(apiClient.post).toHaveBeenCalledWith('/work-elements/tasks', newTask);
      expect(result).toEqual(createdTask);
    });
  });

  describe('getTaskById', () => {
    it('should fetch task by id successfully', async () => {
      const mockTask = { id: '1', title: 'Task 1' };
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTask });

      const result = await getTaskById('1');

      expect(apiClient.get).toHaveBeenCalledWith('/work-elements/tasks/1');
      expect(result).toEqual(mockTask);
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const updateData = { title: 'Updated Task' };
      const updatedTask = { id: '1', ...updateData };
      (apiClient.patch as jest.Mock).mockResolvedValue({ data: updatedTask });

      const result = await updateTask('1', updateData);

      expect(apiClient.patch).toHaveBeenCalledWith('/work-elements/tasks/1', updateData);
      expect(result).toEqual(updatedTask);
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      (apiClient.delete as jest.Mock).mockResolvedValue({ data: { success: true } });

      const result = await deleteTask('1');

      expect(apiClient.delete).toHaveBeenCalledWith('/work-elements/tasks/1');
      expect(result).toEqual({ success: true });
    });
  });

  describe('loginUser', () => {
    it('should login and store token successfully', async () => {
      const mockResponse = {
        access_token: 'test-token',
        user: { id: '1', email: 'test@example.com' },
      };
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await loginUser('test@example.com', 'password123');

      expect(apiClient.post).toHaveBeenCalledWith('/users/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'test-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('current_user', JSON.stringify(mockResponse.user));
      expect(result).toEqual(mockResponse);
    });
  });

  describe('logoutUser', () => {
    it('should remove token and user from localStorage', () => {
      logoutUser();

      expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('current_user');
    });
  });

  describe('getCurrentUser', () => {
    it('should return parsed user from localStorage', () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(mockUser));

      const result = getCurrentUser();

      expect(localStorage.getItem).toHaveBeenCalledWith('current_user');
      expect(result).toEqual(mockUser);
    });

    it('should return null if no user in localStorage', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);

      const result = getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if token exists', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('test-token');

      const result = isAuthenticated();

      expect(localStorage.getItem).toHaveBeenCalledWith('auth_token');
      expect(result).toBe(true);
    });

    it('should return false if no token', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);

      const result = isAuthenticated();

      expect(result).toBe(false);
    });
  });
});
