import { useStore } from "./store";

const useToast = () => {
  const { toasts, register } = useStore();
  return { toasts, register };
};
export default useToast;
