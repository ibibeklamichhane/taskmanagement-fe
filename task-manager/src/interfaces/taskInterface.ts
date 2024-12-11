import type { Dayjs } from "dayjs";

export interface Task {
  _id?: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  dueDate?: Dayjs | null | string;
  createdAt?: string;
  updatedAt?: string;
}
