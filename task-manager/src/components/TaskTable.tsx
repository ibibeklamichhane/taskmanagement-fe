import React, { useState } from "react";
import { Table, Button, Space } from "antd";
import { Task } from "../interfaces/taskInterface";
import dayjs from "dayjs";
import { useDeleteTaskMutation, fetchTasks } from "../api/task";
import { useQuery } from "react-query";

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ onEdit }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { data } = useQuery(
    ["tasks", currentPage, pageSize],
    () => fetchTasks(currentPage, pageSize),
    { keepPreviousData: true }
  );
  const deleteMutation = useDeleteTaskMutation();

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };
  return (
    <Table
      dataSource={data?.tasks || []}
      rowKey="_id"
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: data?.totalCount || 0,
        showSizeChanger: true,
      }}
      onChange={handleTableChange}
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
