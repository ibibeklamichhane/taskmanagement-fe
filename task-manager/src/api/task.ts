import { Task } from "../interfaces/taskInterface";
import axiosInstance from "./axiosInstance";
import { useMutation, useQueryClient } from "react-query";
import { message } from "antd";

export const createTask = async (task: Task): Promise<Task> => {
  console.log(task);
  const { data } = await axiosInstance.post<Task>("/task", task);
  return data;
};

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(createTask, {
    onSuccess: () => {
      message.success("Task created successfully");
      queryClient.invalidateQueries("tasks");
    },
    onError: () => {
      message.error("Failed to create task");
    },
  });
};

//fetching task with pagination 
export const fetchTasks = async (  page: number,
  pageSize: number
): Promise<{ tasks: Task[]; totalCount: number }> => {
  const { data } = await axiosInstance.get(`/task?page=${page}&pageSize=${pageSize}`); 
  return { tasks: data.tasks, totalCount: data.pagination.totalCount };};

export const updateTask = async (
  taskId: string,
  task: Partial<Task>
): Promise<Task> => {
  const { data } = await axiosInstance.put<Task>(`/task/${taskId}`, task);
  return data;
};

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ taskId, task }: { taskId: string; task: Partial<Task> }) =>
      updateTask(taskId, task),
    {
      onSuccess: () => {
        message.success("Task updated successfully");
        queryClient.invalidateQueries("tasks");
      },
      onError: () => {
        message.error("Failed to update task");
      },
    }
  );
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await axiosInstance.delete(`/task/${taskId}`);
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteTask, {
    onSuccess: () => {
      message.success("Task deleted successfully");
      queryClient.invalidateQueries("tasks");
    },
    onError: () => {
      message.error("Failed to delete task");
    },
  });
};
