import { z } from "zod";


export const employeeSchema = z.object({
  fullName: z
    .string()
    .min(4, "Full name must be at least 4 characters")
    .max(160, "Full name must not exceed 160 characters")
    .nonempty("Full name is required"),
  
  email: z
    .string()
    .email("Invalid email format")
    .nonempty("Email is required"),
  
  dateOfBirth: z
    .string()
    .nonempty("Date of birth is required")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate < today;
    }, "Date of birth must be in the past"),
  
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    message: "Please select a gender",
  }),
  
  phoneNumber: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^\d{10}$/, "Phone number must contain only digits"),
  
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nonempty("Password is required"),
});

// Type inference from schema
export type EmployeeFormData = z.infer<typeof employeeSchema>;

// Gender options for select
export const genderOptions = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
] as const;
