import dayjs from "dayjs";
import { Task } from "../interfaces/taskInterface";

export const transformFormData = (values: Task): Partial<Task> => ({
  ...values,
  dueDate: values.dueDate ? dayjs(values.dueDate).format("YYYY-MM-DD") : null,
  status: values.status || "TODO",
});
