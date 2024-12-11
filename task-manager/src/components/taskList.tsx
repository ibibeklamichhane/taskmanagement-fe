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

export default TaskList; 