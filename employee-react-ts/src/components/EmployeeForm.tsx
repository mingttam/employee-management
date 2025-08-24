import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Input, Button, Select, DatePicker, Card, Row, Col, Typography, Space } from "antd";
import dayjs from "dayjs";
import { employeeSchema, type EmployeeFormData, genderOptions } from "../schemas/employee.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEmployee } from "../services/employee.service";
import type { CreateEmployeeRequest } from "../types/employee";

const { Title } = Typography;
const { Option } = Select;

interface EmployeeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ onSuccess, onCancel }) => {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      fullName: "",
      email: "",
      dateOfBirth: "",
      gender: undefined,
      phoneNumber: "",
      password: "",
    },
  });

  // Create employee mutation
  const createEmployeeMutation = useMutation({
    mutationFn: (data: CreateEmployeeRequest) => createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      reset();
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Error creating employee:", error);
    },
  });

  const onSubmit = (data: EmployeeFormData) => {
    const employeeData: CreateEmployeeRequest = {
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      phoneNumber: data.phoneNumber.trim(),
      password: data.password,
    };

    createEmployeeMutation.mutate(employeeData);
  };

  return (
    <Card>
      <Title level={3}>Add New Employee</Title>

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Row gutter={[16, 0]}>
          {/* Full Name */}
          <Col span={24}>
            <Form.Item
              label="Full Name"
              validateStatus={errors.fullName ? "error" : ""}
              help={errors.fullName?.message}
              required
            >
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter full name (4-160 characters)"
                    status={errors.fullName ? "error" : ""}
                  />
                )}
              />
            </Form.Item>
          </Col>

          {/* Email */}
          <Col span={24}>
            <Form.Item
              label="Email"
              validateStatus={errors.email ? "error" : ""}
              help={errors.email?.message}
              required
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter email address"
                    status={errors.email ? "error" : ""}
                  />
                )}
              />
            </Form.Item>
          </Col>

          {/* Date of Birth */}
          <Col span={12}>
            <Form.Item
              label="Date of Birth"
              validateStatus={errors.dateOfBirth ? "error" : ""}
              help={errors.dateOfBirth?.message}
              required
            >
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => {
                      field.onChange(date ? date.format("YYYY-MM-DD") : "");
                    }}
                    placeholder="Select date of birth"
                    style={{ width: "100%" }}
                    status={errors.dateOfBirth ? "error" : ""}
                  />
                )}
              />
            </Form.Item>
          </Col>

          {/* Gender */}
          <Col span={12}>
            <Form.Item
              label="Gender"
              validateStatus={errors.gender ? "error" : ""}
              help={errors.gender?.message}
              required
            >
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select gender"
                    status={errors.gender ? "error" : ""}
                  >
                    {genderOptions.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                )}
              />
            </Form.Item>
          </Col>

          {/* Phone Number */}
          <Col span={12}>
            <Form.Item
              label="Phone Number"
              validateStatus={errors.phoneNumber ? "error" : ""}
              help={errors.phoneNumber?.message}
              required
            >
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter phone number (10 digits)"
                    maxLength={10}
                    status={errors.phoneNumber ? "error" : ""}
                  />
                )}
              />
            </Form.Item>
          </Col>

          {/* Password */}
          <Col span={12}>
            <Form.Item
              label="Password"
              validateStatus={errors.password ? "error" : ""}
              help={errors.password?.message}
              required
            >
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    placeholder="Enter password (minimum 6 characters)"
                    status={errors.password ? "error" : ""}
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Action Buttons */}
        <Form.Item style={{ marginTop: "24px" }}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={createEmployeeMutation.isPending}
              size="large"
            >
              Create Employee
            </Button>
            <Button onClick={onCancel} size="large">
              Cancel
            </Button>
            <Button onClick={() => reset()} size="large">
              Reset
            </Button>
          </Space>
        </Form.Item>

        {/* Error Message */}
        {createEmployeeMutation.isError && (
          <div
            style={{
              color: "red",
              marginTop: "16px",
              padding: "12px",
              backgroundColor: "#fff2f0",
              border: "1px solid #ffccc7",
              borderRadius: "4px",
            }}
          >
            <strong>Error creating employee:</strong>
            <br />
            {createEmployeeMutation.error?.message || "An unknown error occurred"}
          </div>
        )}

        {/* Success Message */}
        {createEmployeeMutation.isSuccess && (
          <div
            style={{
              color: "green",
              marginTop: "16px",
              padding: "12px",
              backgroundColor: "#f6ffed",
              border: "1px solid #b7eb8f",
              borderRadius: "4px",
            }}
          >
            <strong>✅ Employee created successfully!</strong>
          </div>
        )}
      </Form>
    </Card>
  );
};

export default EmployeeForm;
