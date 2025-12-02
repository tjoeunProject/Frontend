import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { IToast } from "./core/types";
import {
  ToastCloseButton,
  ToastContentContainer,
  ToastCotainer,
  ToastTitle
} from "./styles";
import { CSSTransition } from "react-transition-group";

interface IToastProps extends IToast {
  isExiting: boolean;
}

const Toast: React.FC<IToastProps> = ({
  id,
  title,
  link,
  linkText,
  type,
  message,
  isExiting
}) => {
  const [inProp, setInProp] = useState(false);
  const nodeRef = useRef(null);

  useEffect(() => setInProp(true), []);

  useEffect(() => {
    if (isExiting) setInProp(false);
  }, [isExiting]);

  return (
    <CSSTransition
      in={inProp}
      timeout={300}
      classNames="toast"
      ref={nodeRef}
      unmountOnExit
    >
      <ToastCotainer ref={nodeRef} id={id} type={type || "default"}>
        <div className="icon"></div>
        <div>
          <ToastTitle>{title}</ToastTitle>
          <ToastContentContainer>
            <div className="toast-content">{message}</div>
            {link && (
              <Link to={link} className="toast-link">
                {linkText}
              </Link>
            )}
          </ToastContentContainer>
        </div>
        <ToastCloseButton
          onClick={() => {
            setInProp(false);
          }}
        >
          &times;
        </ToastCloseButton>
      </ToastCotainer>
    </CSSTransition>
  );
};

Toast.defaultProps = {
  type: "default",
  linkText: "Learn more"
};

const Toaster = ({ toasts }: { toasts: IToast[] }) => {
  return (
    <>
      {toasts.map((props) => (
        <Toast key={props.id} {...props} />
      ))}
    </>
  );
};

export default Toaster;
