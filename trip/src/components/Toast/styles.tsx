import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { ToastType } from "./core/types";

type ToastColorsType = {
  [key in ToastType]: {
    icon: string;
    color: string;
    borderColor: string;
    backgroundColor: string;
    titleColor: string;
  };
};

const colors: ToastColorsType = {
  default: {
    icon: `"😀"`,
    color: "#646975",
    borderColor: "#d8d9dc",
    backgroundColor: "#fdfdfd",
    titleColor: "#333d4a"
  },
  success: {
    icon: `"😍"`,
    color: "#227d55",
    borderColor: "#aadec2",
    backgroundColor: "#f7fef9",
    titleColor: "#257856"
  },
  warning: {
    icon: `"😧"`,
    color: "#af8024",
    borderColor: "#f2e7b8",
    backgroundColor: "#fdfdef",
    titleColor: "#936120"
  },
  info: {
    icon: `"🧐"`,
    color: "#7070ae",
    borderColor: "#a6a7d6",
    backgroundColor: "#f5f6ff",
    titleColor: "#60619b"
  },
  error: {
    icon: `"😱"`,
    color: "#d67b73",
    borderColor: "#eac9c7",
    backgroundColor: "#fffbfb",
    titleColor: "#d54237"
  }
};

interface ToastProps {
  type: ToastType;
}

const showAnim = keyframes`
  from {
    opacity:0;
    transform: translate3d(0,-100%,0) scale(.5,.2);
    max-height:0%;
  }

  to {
    opacity:1
    transform: translate3d(0,0,0) scale(1,1);
    max-height:100%;
  }
`;

const hideAnim = keyframes`
  from {
    transform: translate3d(0,0,0) scaleY(1);
    max-height:100%;
    opacity:1;
  }
  30%{
    opacity:1;
  }
  to {
    opacity:0;
    transform: translate3d(0,-110%,0);
    max-height:0%;
  }
`;

export const ToastTitle = styled.h1`
  margin: 0;
  padding: 0;
  font-size: 18px;
  font-weight: 700;
  color: inherit;
`;

export const ToastContentContainer = styled.div`
  margin: 0 25px 0 0;
  padding: 0;
  flex: 1;
  color: inherit;
  & .toast-content {
    margin-top: 5px;
    white-space: pre-wrap;
  }

  & .toast-link {
    display: inline-block;
    margin-top: 10px;
    text-decoration: none;
    font-weight: 600;
    color: inherit;
  }
`;

export const ToastCloseButton = styled.button`
  border: 0;
  background: none;
  outline: none;
  font-size: 28px;
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 3px 13px;
  cursor: pointer;
`;

export const ToastCotainer = styled.div<ToastProps>`
  max-width: 800px;
  margin: 5px auto;
  border: 1px solid ${({ type }) => colors[type]?.borderColor || "#d8d9dc"};
  border-radius: 10px;
  padding: 13px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
  box-sizing: border-box;
  text-align: left;
  background: ${({ type }) => colors[type]?.backgroundColor || "#fdfdfd"};

  &.toast-enter-active {
    animation: ${showAnim} 0.5s ease forwards;
  }

  &.toast-exit-active {
    animation: ${hideAnim} 0.6s ease forwards;
  }

  & .icon::after {
    content: ${({ type }) => colors[type]?.icon || "#fdfdfd"};
    display: inline-block;
    margin-right: 13px;
    font-size: 20px;
  }

  & .toast-title {
    color: ${({ type }) => `${colors[type]?.titleColor}` || "#fdfdfd"};
  }

  & .toast-content-container {
    color: ${({ type }) => colors[type]?.color || "#fdfdfd"};
  }

  & .toast-closeButton {
    color: ${({ type }) => colors[type]?.titleColor || "#fdfdfd"};
  }
`;

ToastTitle.defaultProps = { className: "toast-title" };
ToastContentContainer.defaultProps = { className: "toast-content-container" };
ToastCloseButton.defaultProps = { className: "toast-closeButton" };
