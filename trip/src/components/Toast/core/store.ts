import { useReducer } from "react";
import { ToastType } from "./types";
import { IToast } from "./types";

export enum ActionType {
  ADD,
  REMOVE,
  GET
}

type Action =
  | { type: ActionType.ADD; toast: IToast }
  | { type: ActionType.REMOVE; id: string }
  | { type: ActionType.GET };

let memoryState: IToast[] = [];
let id = 0;

export const reducer = (state: IToast[], action: Action): IToast[] => {
  switch (action.type) {
    case ActionType.ADD:
      memoryState = [action.toast, ...state];
      if (memoryState.length > 5) memoryState.pop();
      break;
    case ActionType.REMOVE:
      const idx = state.findIndex(({ id }) => id === action.id);
      state[idx].isExiting = true;
      memoryState = [...state];
      break;
    case ActionType.GET:
  }
  return memoryState;
};

const createToast = (
  type: ToastType,
  title: string,
  message: string,
  link?: string,
  duration?: number
): IToast => ({
  id: (id++).toString(),
  message,
  type,
  title,
  link,
  duration,
  isExiting: false
});

export const toast = (
  dispatch: React.Dispatch<Action>,
  type: ToastType,
  title: string,
  message: string,
  link?: string,
  duration?: number
) => {
  const newToast = createToast(type, title, message, link, duration);

  dispatch({ type: ActionType.ADD, toast: newToast });
  // duration 설정 시 duration 지나면 메세지 삭제
  if (duration !== undefined) {
    setTimeout(
      () => dispatch({ type: ActionType.REMOVE, id: newToast.id }),
      duration
    );
  }
};

export const useStore = () => {
  const [toasts, dispatch] = useReducer(reducer, memoryState);
  const register = toast.bind(null, dispatch);

  return { toasts, register };
};
