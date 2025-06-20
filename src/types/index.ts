export interface Department {
  id: number
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Employee {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  position: string
  salary: number
  departmentId: number
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
  departmentId: number
  hireDate: string
}

export interface UpdateEmployeeRequest extends CreateEmployeeRequest {
  id: number
}

export interface CreateDepartmentRequest {
  name: string
  description?: string
}

export interface UpdateDepartmentRequest extends CreateDepartmentRequest {
  id: number
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