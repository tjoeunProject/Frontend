import Toaster from "./components/Toast";
import useToast from "./components/Toast/core/useToast";
import "./styles.css";

export default function App() {
  const { toasts, register } = useToast();
  return (
    <div className="App">
      <Toaster toasts={toasts} />
      <div className="toastButtons">
        <button
          className="button"
          onClick={() =>
            register(
              "default",
              "Default",
              `duration값을 입력하지 않으면 이렇게 지워지지 않습니다.\nx버튼을 눌러 종료하세요!`
            )
          }
        >
          Default
        </button>
        <button
          className="button"
          onClick={() =>
            register(
              "warning",
              "Warning",
              "druation 값을 3초로 설정했습니다.\n3초후에 이 메세지는 사라집니다.\n3, 2, 1!",
              "/",
              3000
            )
          }
        >
          Warning
        </button>
        <button
          className="button"
          onClick={() =>
            register(
              "info",
              "Info",
              "링크값을 입력하면 이렇게 Learn more(더보기) 버튼이 생성됩니다.",
              "/",
              3000
            )
          }
        >
          Info
        </button>
        <button
          className="button"
          onClick={() =>
            register(
              "success",
              "Success",
              " Lorem ipsum dolor repellat atque suscipit fuga deserunt quasi architectotempore numquam",
              "/",
              3000
            )
          }
        >
          Success
        </button>
        <button
          className="button"
          onClick={() =>
            register(
              "error",
              "Error",
              " Lorem ipsum dolor repellat atque suscipit fuga deserunt quasi architectotempore numquam",
              "/",
              3000
            )
          }
        >
          Error
        </button>
      </div>
    </div>
  );
}
