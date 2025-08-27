// Employee type definitions for the frontend
export interface Employee {
  id: number;
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  phoneNumber: string;
  active: boolean;
  createdAt: string; 
  updatedAt: string; 
}


export interface CreateEmployeeRequest {
  fullName: string;
  password: string;
  email: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  phoneNumber: string;
}


export interface UpdateEmployeeRequest {
  fullName: string;
  password?: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  phoneNumber: string;
  active: boolean;
}

 
export interface ApiResponse<T> {
  status: "SUCCESS" | "ERROR";
  message: string;
  data: T;
}
