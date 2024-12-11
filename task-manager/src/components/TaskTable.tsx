import React from "react";
import { Table, Button, Space } from "antd";
import { Task } from "../interfaces/taskInterface";
import dayjs from "dayjs";
import { useDeleteTaskMutation } from "../api/task";

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onEdit }) => {
  const deleteMutation = useDeleteTaskMutation();

  return (
    <Table
      dataSource={tasks}
      rowKey="_id"
      columns={[
        {
          title: "Title",
          dataIndex: "title",
          key: "title",
        },
        {
          title: "Description",
          dataIndex: "description",
          key: "description",
        },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
          render: (status) => (
            <span>
              {status === "TODO" && "📝 To Do"}
              {status === "IN_PROGRESS" && "🚧 In Progress"}
              {status === "COMPLETED" && "✅ Completed"}
            </span>
          ),
        },
        {
          title: "Due Date",
          dataIndex: "dueDate",
          key: "dueDate",
          render: (date) =>
            date ? dayjs(date).format("YYYY-MM-DD") : "No due date",
        },
        {
          title: "Actions",
          key: "actions",
          render: (_, record: Task) => (
            <Space size="middle">
              <Button type="link" onClick={() => onEdit(record)}>
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
  );
};

export default TaskTable;
