import axios from 'axios';
import type {
  Employee,
  Department,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  LoginRequest,
  SignupRequest,
  AuthResponse
} from "../types/index";

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: 'https://localhost:44325', 
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to add authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },
  
  signup: async (userData: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },
  
  logout: (): void => {
    localStorage.removeItem('token');
  }
};

// Employee API functions with real API calls
export const employeeApi = {
  getAll: async (): Promise<Employee[]> => {
    const response = await api.get<Employee[]>('/Employee/getAll');
    return response.data;
  },

  getById: async (id: number): Promise<Employee> => {
    const response = await api.get<Employee>(`/Employee/get/${id}`);
    return response.data;
  },

  create: async (employee: CreateEmployeeRequest): Promise<Employee> => {
    const response = await api.post<Employee>('/Employee/create', employee);
    return response.data;
  },

  update: async (id: number, employeeData: UpdateEmployeeRequest): Promise<Employee> => {
    const response = await api.put<Employee>(`/Employee/${id}`, employeeData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/Employee/delete/${id}`);
  },
};

// Department API functions with real API calls
export const departmentApi = {
  getAll: async (): Promise<Department[]> => {
    const response = await api.get<Department[]>('/Department/getAll');
    return response.data;
  },

  getById: async (id: number): Promise<Department> => {
    const response = await api.get<Department>(`/Department/${id}`);
    return response.data;
  },

  create: async (departmentData: CreateDepartmentRequest): Promise<Department> => {
    const response = await api.post<Department>('/Department/create', departmentData);
    return response.data;
  },

  update: async (id: number, departmentData: UpdateDepartmentRequest): Promise<Department> => {
    const response = await api.put<Department>(`/Department/${id}`, departmentData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/Department/delete/${id}`);
  },
};

// Error handling helper
export const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      const message = error.response.data.message || error.response.statusText;
      if (error.response.status === 401) {
        // Handle unauthorized / token expired
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return message;
    } else if (error.request) {
      // The request was made but no response was received
      return 'No response from server. Please check your internet connection.';
    }
  }
  // Default error message
  return error.message || 'An unknown error occurred';
};