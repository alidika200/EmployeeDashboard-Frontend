export interface Department {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  position: string
  salary: number
  departmentId: string
  department?: Department
  hireDate: string
  createdAt: string
  updatedAt: string
}

export interface CreateEmployeeRequest {
  firstName: string
  lastName: string
  email: string
  phone?: string
  position: string
  salary: number
  departmentId: string
  hireDate: string
}

export interface UpdateEmployeeRequest extends CreateEmployeeRequest {
  id: string
}

export interface CreateDepartmentRequest {
  name: string
  description?: string
}

export interface UpdateDepartmentRequest extends CreateDepartmentRequest {
  id: string
}

// Authentication interfaces
export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  token: string
  user: {
    id: number
    email: string
    firstName: string
    lastName: string
    role: string
  }
}