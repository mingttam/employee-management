import axios from "axios";
import type { Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from "../types/employee";

const baseUrl = 'http://localhost:8080/api';


const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Unknown error";
    console.error("API Error:", message);
    return Promise.reject(new Error(message));
  }
);


export const getAllEmployees = async (): Promise<Employee[]> => {
    const response = await api.get("/employees");
    return response.data.data;
};

export const getEmployeeById = async (id: number): Promise<Employee> => {
    const response = await api.get(`/employees/${id}`);
    return response.data.data;
};

export const createEmployee = async (employee: CreateEmployeeRequest): Promise<Employee> => {
    const response = await api.post("/employees", employee);
    return response.data.data;
};

export const updateEmployee = async (id: number, employee: UpdateEmployeeRequest): Promise<Employee> => {
    const response = await api.put(`/employees/${id}`, employee);
    return response.data.data;
};

export const deleteEmployee = async (id: number): Promise<void> => {
    const response = await api.delete(`/employees/${id}`);
    return response.data.message;
};
