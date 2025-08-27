/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
} from "../services/employee.service";
import {
  Table,
  Tag,
  Spin,
  Alert,
  type TableProps,
  Button,
  Modal,
  Descriptions,
  Card,
  Typography,
  Form,
  Input,
  Select,
} from "antd";
import type { Employee } from "../types/employee";
import React from "react";
import EmployeeForm from "../components/EmployeeForm";

const { Title } = Typography;

const EmployeePage = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState<number | null>(null);
  const [openDetailModal, setOpenDetailModal] = React.useState<boolean>(false);
  const [openUpdateModal, setOpenUpdateModal] = React.useState<boolean>(false);

  const [formUpdate] = Form.useForm();

  const queryClient = useQueryClient();

  //! FETCH API-----------------------------------------------
  const fetchAllEmployees = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: getAllEmployees,
  });

  const fetchEmployeeById = useQuery<Employee, Error>({
    queryKey: ["employee", selectedEmployeeId],
    queryFn: () => getEmployeeById(selectedEmployeeId!),
    enabled: !!selectedEmployeeId,
  });

  const updateEmployeeById = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setOpenUpdateModal(false);
    },
    onError: (error) => {
      console.error("Error updating employee:", error);
    },
  });

  const deleteEmployeeById = useMutation<void, Error, number>({
    mutationFn: (id: number) => deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error) => {
      console.error("Error deleting employee:", error);
    },
  });

  //! GET ALL EMPLOYEE-----------------------------------------------
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
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
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

  const renderEmployeeDetail = () => {
    if (!fetchEmployeeById.data) return null;

    //handle loading
    if (fetchEmployeeById.isLoading) {
      return (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
          <div style={{ marginTop: "16px" }}>Loading employee details...</div>
        </div>
      );
    }
    //handle error
    if (fetchEmployeeById.isError) {
      return (
        <div style={{ padding: "20px" }}>
          <Alert
            message="Error"
            description={`Failed to load employee details: ${
              fetchEmployeeById.error?.message || "Unknown error"
            }`}
            type="error"
            showIcon
          />
        </div>
      );
    }

    const employee = fetchEmployeeById.data;

    return (
      <Card
        style={{
          boxShadow: "none",
        }}
      >
        <Descriptions
          title="Employee Information"
          bordered
          column={1}
          size="middle"
          labelStyle={{
            fontWeight: "bold",
            backgroundColor: "#fafafa",
            width: "30%",
          }}
          contentStyle={{
            backgroundColor: "#ffffff",
          }}
        >
          <Descriptions.Item label="ID">
            <Typography.Text code>{employee.id}</Typography.Text>
          </Descriptions.Item>

          <Descriptions.Item label="Full Name">
            <Typography.Text strong>{employee.fullName}</Typography.Text>
          </Descriptions.Item>

          <Descriptions.Item label="Email">
            <Typography.Text copyable>{employee.email}</Typography.Text>
          </Descriptions.Item>

          <Descriptions.Item label="Date of Birth">{employee.dateOfBirth}</Descriptions.Item>

          <Descriptions.Item label="Gender">
            <Tag
              color={
                employee.gender === "MALE"
                  ? "blue"
                  : employee.gender === "FEMALE"
                  ? "pink"
                  : "purple"
              }
              style={{ fontSize: "14px", padding: "4px 12px" }}
            >
              {employee.gender}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Phone Number">
            <Typography.Text copyable>{employee.phoneNumber}</Typography.Text>
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            <Tag
              color={employee.active ? "green" : "volcano"}
              style={{ fontSize: "14px", padding: "4px 12px" }}
            >
              {employee.active ? "Active" : "Inactive"}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  };

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

  const handleClickRow = (record: Employee) => {
    setSelectedEmployeeId(record.id);
  };

  const handleDetailModalClose = () => {
    setOpenDetailModal(false);
    setSelectedEmployeeId(null);
  };

  const handleOkUpdate = async () => {
    //submit Form update
    formUpdate.submit();
  };

  const handleEdit = (id: number | null) => {
    if (id && fetchEmployeeById.data) {
      // Fill form with current employee data
      formUpdate.setFieldsValue({
        id: fetchEmployeeById.data.id,
        fullName: fetchEmployeeById.data.fullName,
        password: "",
        dateOfBirth: fetchEmployeeById.data.dateOfBirth,
        gender: fetchEmployeeById.data.gender,
        phoneNumber: fetchEmployeeById.data.phoneNumber,
        active: fetchEmployeeById.data.active,
      });
      setOpenDetailModal(false);
      setOpenUpdateModal(true);
    }
  };

  const onHandleFinishUpdateEmployee = async () => {
    try {
      const values = await formUpdate.validateFields();
      updateEmployeeById.mutate({
        id: selectedEmployeeId!,
        data: {
          fullName: values.fullName,
          dateOfBirth: values.dateOfBirth,
          ...(values.password && values.password.trim() !== ""
            ? { password: values.password }
            : {}),
          gender: values.gender,
          phoneNumber: values.phoneNumber,
          active: values.active !== undefined ? values.active : true,
        },
      });
      setSelectedEmployeeId(null);
    } catch (error) {
      console.error("Failed to update employee:", error);
    }
  };

  const handleDelete = (id: number) => {
    deleteEmployeeById.mutate(id);
    setOpenDetailModal(false);
  };

  //? -----------------------------------------------------------------------------------------
  return (
    <div style={{ padding: "24px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Card style={{ marginBottom: "24px" }}>
        <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
          Employee Management System
        </Title>
      </Card>

      {/* ADD ---------------------------------------------------------------------------*/}
      <Card style={{ marginBottom: "24px" }}>
        <Button
          type="primary"
          onClick={showCreateForm}
          size="large"
          style={{
            height: "40px",
            fontSize: "16px",
            borderRadius: "6px",
          }}
        >
          + Add New Employee
        </Button>
      </Card>
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

      {/* LIST ---------------------------------------------------------------------------*/}
      <Card>
        <Table<Employee>
          columns={columns}
          dataSource={data}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} employees`,
          }}
          rowKey="id"
          onRow={(record) => ({
            onClick: () => {
              handleClickRow(record);
              setOpenDetailModal(true);
            },
            style: {
              cursor: "pointer",
              transition: "all 0.3s",
            },
          })}
          size="middle"
          scroll={{ x: true }}
          style={{
            borderRadius: "8px",
          }}
        />
      </Card>
      {/* DETAIL ---------------------------------------------------------------------------*/}
      <Modal
        title={
          <div
            style={{
              borderBottom: "1px solid #f0f0f0",
              paddingBottom: "16px",
              marginBottom: "16px",
            }}
          >
            <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
              Employee Details
            </Title>
          </div>
        }
        open={openDetailModal}
        onCancel={handleDetailModalClose}
        footer={
          <div
            style={{ display: "flex", justifyContent: "center", padding: "16px 0", gap: "12px" }}
          >
            <Button key="close" type="default" onClick={handleDetailModalClose} size="large">
              Close
            </Button>
            <Button
              key="edit"
              type="primary"
              onClick={() => handleEdit(selectedEmployeeId)}
              size="large"
            >
              Edit
            </Button>
            <Button
              key="delete"
              type="primary"
              danger
              onClick={() => handleDelete(selectedEmployeeId!)}
              size="large"
            >
              Delete
            </Button>
          </div>
        }
        width={700}
        centered
      >
        {renderEmployeeDetail()}
      </Modal>

      {/* UPDATE ---------------------------------------------------------------------------*/}
      <Modal
        title="Update Employee"
        open={openUpdateModal}
        onOk={handleOkUpdate}
        onCancel={() => setOpenUpdateModal(false)}
        width={600}
        okText="Update"
        cancelText="Cancel"
        confirmLoading={updateEmployeeById.isPending}
      >
        <Form
          form={formUpdate}
          layout="vertical"
          name="update-employee-form"
          onFinish={onHandleFinishUpdateEmployee}
        >
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[
              { required: true, message: "Please input the full name!" },
              { min: 4, message: "Full name must be at least 4 characters" },
              { max: 160, message: "Full name must not exceed 160 characters" },
            ]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { message: "Please input the password!" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input type="password" placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            label="Date of Birth"
            name="dateOfBirth"
            rules={[{ required: true, message: "Please input the date of birth!" }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Please select gender!" }]}
          >
            <Select placeholder="Select gender">
              <Select.Option value="MALE">Male</Select.Option>
              <Select.Option value="FEMALE">Female</Select.Option>
              <Select.Option value="OTHER">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please input the phone number!" },
              { len: 10, message: "Phone number must be exactly 10 digits" },
              { pattern: /^\d{10}$/, message: "Phone number must contain only digits" },
            ]}
          >
            <Input placeholder="Enter phone number" maxLength={10} />
          </Form.Item>
          <Form.Item
            label="Active Status"
            name="active"
            rules={[{ required: true, message: "Please select active status!" }]}
          >
            <Select placeholder="Select active status">
              <Select.Option value={true}>Active</Select.Option>
              <Select.Option value={false}>Inactive</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item hidden name="id">
            <Input hidden />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeePage;
