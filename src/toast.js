import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";

const ToastWrapper = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ToastNotification = styled.div`
  background-color: ${({ type }) =>
    type === "success" ? "#4CAF50" : type === "error" ? "#F44336" : "#333"};
  color: white;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  animation: ${({ animation }) => animation} 0.5s ease-out;

  ${({ autoDismiss }) =>
    autoDismiss &&
    css`
      animation: fadeout 0.5s ease-in ${(props) => props.duration || 5000}ms
        forwards;
    `}

  @keyframes fadeout {
    to {
      opacity: 0;
      transform: translateY(-20px);
    }
  }
`;

const Toast = ({ message, type, duration, onDismiss, autoDismiss }) => {
  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, duration, onDismiss]);

  return (
    <ToastNotification
      type={type}
      autoDismiss={autoDismiss}
      duration={duration}
    >
      {message}
    </ToastNotification>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (
    message,
    type = "info",
    duration = 5000,
    autoDismiss = true
  ) => {
    const id = Date.now();
    setToasts([...toasts, { id, message, type, duration, autoDismiss }]);
    setTimeout(() => removeToast(id), duration);
  };

  const removeToast = (id) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastWrapper>
      {toasts.map(({ id, message, type, duration, autoDismiss }) => (
        <Toast
          key={id}
          message={message}
          type={type}
          duration={duration}
          onDismiss={() => removeToast(id)}
          autoDismiss={autoDismiss}
        />
      ))}
    </ToastWrapper>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type, duration, autoDismiss) => {
    setToasts([...toasts, { message, type, duration, autoDismiss }]);
  };

  return { addToast };
};
