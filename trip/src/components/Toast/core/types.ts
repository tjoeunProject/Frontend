export type ToastType = "default" | "success" | "warning" | "info" | "error";

export interface IToast {
  id: string;
  title: string;
  link?: string;
  linkText?: string;
  type?: ToastType;
  duration?: number;
  message: string;
  isExiting: boolean;
}
