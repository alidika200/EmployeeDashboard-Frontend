import type {
  Employee,
  Department,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from "../types/index";
import { mockEmployees, mockDepartments } from "../mock/mockData";

// In-memory data for mock operations
let employees = [...mockEmployees];
let departments = [...mockDepartments];
let nextEmployeeId = employees.length + 1;
let nextDepartmentId = departments.length + 1;

// Employee API functions with mock implementation
export const employeeApi = {
  getAll: (): Promise<Employee[]> => {
    return Promise.resolve([...employees]);
  },

  getById: (id: number): Promise<Employee> => {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) {
      return Promise.reject(new Error("Employee not found"));
    }
    return Promise.resolve({...employee});
  },

  create: (employee: CreateEmployeeRequest): Promise<Employee> => {
    const department = departments.find(dept => dept.id === employee.departmentId);
    const newEmployee: Employee = {
      id: nextEmployeeId++,
      ...employee,
      department,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    employees.push(newEmployee);
    return Promise.resolve({...newEmployee});
  },

  update: (id: number, employeeData: UpdateEmployeeRequest): Promise<Employee> => {
    const index = employees.findIndex(emp => emp.id === id);
    if (index === -1) {
      return Promise.reject(new Error("Employee not found"));
    }

    const department = departments.find(dept => dept.id === employeeData.departmentId);
    const updatedEmployee: Employee = {
      ...employees[index],
      ...employeeData,
      department,
      updatedAt: new Date().toISOString(),
    };
    
    employees[index] = updatedEmployee;
    return Promise.resolve({...updatedEmployee});
  },

  delete: (id: number): Promise<void> => {
    const index = employees.findIndex(emp => emp.id === id);
    if (index === -1) {
      return Promise.reject(new Error("Employee not found"));
    }
    employees.splice(index, 1);
    return Promise.resolve();
  },
};

// Department API functions with mock implementation
export const departmentApi = {
  getAll: (): Promise<Department[]> => {
    return Promise.resolve([...departments]);
  },

  getById: (id: number): Promise<Department> => {
    const department = departments.find(dept => dept.id === id);
    if (!department) {
      return Promise.reject(new Error("Department not found"));
    }
    return Promise.resolve({...department});
  },

  create: (departmentData: CreateDepartmentRequest): Promise<Department> => {
    const newDepartment: Department = {
      id: nextDepartmentId++,
      ...departmentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    departments.push(newDepartment);
    return Promise.resolve({...newDepartment});
  },

  update: (id: number, departmentData: UpdateDepartmentRequest): Promise<Department> => {
    const index = departments.findIndex(dept => dept.id === id);
    if (index === -1) {
      return Promise.reject(new Error("Department not found"));
    }
    
    const updatedDepartment: Department = {
      ...departments[index],
      ...departmentData,
      updatedAt: new Date().toISOString(),
    };
    
    departments[index] = updatedDepartment;

    // Update department reference in employees
    employees.forEach(emp => {
      if (emp.departmentId === id) {
        emp.department = updatedDepartment;
      }
    });

    return Promise.resolve({...updatedDepartment});
  },

  delete: (id: number): Promise<void> => {
    // Check if department has employees
    const hasEmployees = employees.some(emp => emp.departmentId === id);
    if (hasEmployees) {
      return Promise.reject(new Error("Cannot delete department with existing employees"));
    }

    const index = departments.findIndex(dept => dept.id === id);
    if (index === -1) {
      return Promise.reject(new Error("Department not found"));
    }
    
    departments.splice(index, 1);
    return Promise.resolve();
  },
};