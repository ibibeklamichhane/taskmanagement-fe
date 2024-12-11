import React, { useState } from "react";
import { Button, Modal, Form, Input, DatePicker, Select } from "antd";
import { useQuery } from "react-query";
import { fetchTasks } from "../api/task";
import { useCreateTaskMutation, useUpdateTaskMutation } from "../api/task";
import { Task } from "../interfaces/taskInterface";
import TaskTable from "./TaskTable";
import dayjs from "dayjs";

const { Option } = Select;

const TaskList: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form] = Form.useForm<Task>();

  const { data: tasks } = useQuery<Task[]>("tasks", fetchTasks);

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
    <div>
      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ marginBottom: 16 }}
      >
        Create New Task
      </Button>

      <TaskTable tasks={tasks || []} onEdit={showModal} />

      <Modal
        title={editingTask ? "Edit Task" : "Create New Task"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
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
              <Option value="TODO">To Do</Option>
              <Option value="IN_PROGRESS">In Progress</Option>
              <Option value="COMPLETED">Completed</Option>
            </Select>
          </Form.Item>

          <Form.Item name="dueDate" label="Due Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={createMutation.isLoading || updateMutation.isLoading}
            >
              {editingTask ? "Update Task" : "Create Task"}
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskList;
