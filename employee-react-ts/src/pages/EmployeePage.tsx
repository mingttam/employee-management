/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { getAllEmployees } from "../services/employee.service";
import { Table, Tag, Spin, Alert, type TableProps, Button, Modal } from "antd";
import type { Employee } from "../types/employee";
import React from "react";
import EmployeeForm from "../components/EmployeeForm";

const EmployeePage = () => {
  const [open, setOpen] = React.useState<boolean>(false);

  //! GET ALL EMPLOYEE-----------------------------------------------
  const fetchAllEmployees = useQuery({
    queryKey: ["employees"],
    queryFn: getAllEmployees,
  });

  // Handle loading state
  if (fetchAllEmployees.isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <div style={{ marginTop: "16px" }}>Loading employee list...</div>
      </div>
    );
  }

  // Handle error state
  if (fetchAllEmployees.isError) {
    return (
      <div style={{ padding: "20px" }}>
        <Alert
          message="Error"
          description={`Failed to load employee list: ${
            fetchAllEmployees.error?.message || "Unknown error"
          }`}
          type="error"
          showIcon
        />
      </div>
    );
  }

  const columns: TableProps<Employee>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id: number) => <a>{id}</a>,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
    },
    {
      title: "Gender",
      key: "gender",
      dataIndex: "gender",
      render: (_: any, { gender }: Employee) => (
        <>
          <Tag color={gender === "MALE" ? "blue" : gender === "FEMALE" ? "pink" : "purple"}>
            {gender.toUpperCase()}
          </Tag>
        </>
      ),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Status",
      key: "active",
      dataIndex: "active",
      render: (_, { active }) => (
        <>
          <Tag color={active ? "green" : "volcano"}>{active ? "Active" : "Inactive"}</Tag>
        </>
      ),
    },
  ];

  const data: Employee[] = fetchAllEmployees.data || [];
  //! ----------------------------------------------------------------------

  const showCreateForm = () => {
    setOpen(true);
  };

  const handleFormSuccess = () => {
    setOpen(false);
  };

  const handleFormCancel = () => {
    setOpen(false);
  };

  //? -----------------------------------------------------------------------------------------
  return (
    <div style={{ padding: "20px" }}>
      <h1>Employees Management</h1>

      <Button type="primary" onClick={showCreateForm} style={{ marginBottom: "16px" }}>
        Add New Employee
      </Button>

      <Modal
        title="Add New Employee"
        open={open}
        onCancel={handleFormCancel}
        footer={null} // Remove default footer since form has its own buttons
        width={800}
        destroyOnHidden={true} // Reset form when modal closes
      >
        <EmployeeForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
      </Modal>

      <Table<Employee>
        columns={columns}
        dataSource={data}
        pagination={{ defaultPageSize: 3 }}
        rowKey="id"
      />
    </div>
  );
};

export default EmployeePage;
