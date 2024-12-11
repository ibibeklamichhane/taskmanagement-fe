import React, { useState } from "react";
import { Button, Modal, Form, Input, DatePicker, Select } from "antd";
//import { useQuery } from "react-query";
//import { fetchTasks } from "../api/task";
import { useCreateTaskMutation, useUpdateTaskMutation } from "../api/task";
import { Task } from "../interfaces/taskInterface";
import TaskTable from "./TaskTable";
import dayjs from "dayjs";

const { Option } = Select;

const TaskList: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form] = Form.useForm<Task>();

 // const { data: tasks } = useQuery<Task[]>("tasks",fetchTasks);

  const createMutation = useCreateTaskMutation();
  const updateMutation = useUpdateTaskMutation();

  const showModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      form.setFieldsValue({
        ...task,
        dueDate: task.dueDate ? dayjs(task.dueDate) : undefined,
      });
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingTask(null);
    form.resetFields();
  };

  const onFinish = (values: Task) => {
    const taskData = {
      ...values,
      dueDate: values.dueDate
        ? dayjs(values.dueDate).format("YYYY-MM-DD")
        : null,
      status: values.status || "TODO",
    };

    if (editingTask && editingTask._id) {
      updateMutation.mutate({
        taskId: editingTask._id,
        task: taskData,
      });
    } else {
      createMutation.mutate(taskData);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-gray-100 shadow-lg rounded-lg">
       <h1 className="text-2xl font-bold mb-6 text-center">Task Management</h1>
       <div className="flex justify-end mb-4">

      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ marginBottom: 16 }}
      >
        Create New Task
      </Button>
      </div>

      <TaskTable  onEdit={showModal} />

      <Modal

        title={
          
editingTask ? "Edit Task" : "Create New Task"
}
        
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="rounded-md"

      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="title"
            label="Title"
            rules={[
              { required: true, message: "Please input the task title!" },
            ]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Enter task description" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select task status!" }]}
          >
            <Select placeholder="Select task status">
              <Option value="completed">Completed</Option>
              <Option value="pending">In Progress</Option>
              <Option value="in-progress">Pending</Option>
            </Select>
          </Form.Item>

          <Form.Item name="dueDate" label="Due Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
          <div className="flex justify-between">

            <Button
              type="primary"
              htmlType="submit"
              loading={createMutation.isLoading || updateMutation.isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {editingTask ? "Update Task" : "Create Task"}
            </Button>
            <Button onClick={handleCancel} className="text-gray-500">
              Cancel
              </Button>
              </div>

          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskList; /*
import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  Select, 
  message 
} from 'antd';
import { 
  useQuery, 
  useMutation, 
  useQueryClient 
} from 'react-query';
import { 
  fetchTasks, 
  createTask, 
  updateTask, 
  deleteTask
   
} from '../api/task';
import { Task } from '../interfaces/taskInterface';
//import moment from 'moment';
//import type { Moment } from 'moment'; // Correct import for Moment type

import dayjs from 'dayjs';

//const { Column } = Table;
const { Option } = Select;

const TaskList: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form] = Form.useForm<Task>();

  // Fetch Tasks
  const { data: tasks, isLoading } = useQuery<Task[]>("tasks", fetchTasks);

  // Create Task Mutation
  const createMutation = useMutation(createTask, {
    onSuccess: () => {
      message.success("Task created successfully");
      queryClient.invalidateQueries("tasks");
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: () => {
      message.error("Failed to create task");
    },
  });

  // Update Task Mutation
  const updateMutation = useMutation(
    ({ taskId, task }: { taskId: string; task: Partial<Task> }) =>
      updateTask(taskId, task),
    {
      onSuccess: () => {
        message.success("Task updated successfully");
        queryClient.invalidateQueries("tasks");
        setIsModalVisible(false);
        setEditingTask(null);
        form.resetFields();
      },
      onError: () => {
        message.error("Failed to update task");
      },
    }
  );
  const deleteMutation = useMutation(deleteTask, {
    onSuccess: () => {
      message.success("Task deleted successfully");
      queryClient.invalidateQueries("tasks");
    },
    onError: () => {
      message.error("Failed to delete task");
    },
  });
  const showModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      form.setFieldsValue({
        ...task,
        dueDate: task.dueDate ? dayjs(task.dueDate) : undefined,
      });
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingTask(null);
    form.resetFields();
  };

  const onFinish = (values: Task) => {
    const taskData = {
      ...values,
      dueDate: values.dueDate 
        ? dayjs(values.dueDate).format('YYYY-MM-DD')
        : null,
      status: values.status || 'TODO',
    };

    if (editingTask && editingTask._id) {
      // Update existing task
      updateMutation.mutate({
        taskId: editingTask._id,
        task: taskData,
      });
    } else {
      // Create new task
      createMutation.mutate(taskData);
    }
  };

  return (
    <div>
      <Button 
        type="primary" 
        onClick={() => showModal()}
        style={{ marginBottom: 16 }}
      >
        Create New Task
      </Button>

      <Table 
        dataSource={tasks} 
        loading={isLoading} 
        rowKey="_id"
        columns={[
          {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
          },
          {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
              <span>
                {status === 'TODO' && '📝 To Do'}
                {status === 'IN_PROGRESS' && '🚧 In Progress'}
                {status === 'COMPLETED' && '✅ Completed'}
              </span>
            ),
          },
          {
            title: 'Due Date',
            dataIndex: 'dueDate',
            key: 'dueDate',
            render: (date) => date ? dayjs(date).format('YYYY-MM-DD') : 'No due date',
          },
          {
            title: 'Actions',
            key: 'actions',
            render: (_, record: Task) => (
              <Space size="middle">
                <Button type="link" onClick={() => showModal(record)}>
                  Edit
                </Button>
                <Button
                  type="link"
                  danger
                  onClick={() => deleteMutation.mutate(record._id!)}
                >
                  Delete
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={editingTask ? "Edit Task" : "Create New Task"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input the task title!' }]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea placeholder="Enter task description" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select task status!' }]}
          >
            <Select placeholder="Select task status">
              <Option value="pending">To Do</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Due Date"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={createMutation.isLoading || updateMutation.isLoading}
              >
                {editingTask ? 'Update Task' : 'Create Task'}
              </Button>
              <Button onClick={handleCancel}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskList;*/
