import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import Icon from './Icon';

const Toast = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  const toastVariants = {
    success: {
      icon: 'check',
      bg: 'bg-success-500',
      border: 'border-success-400',
      text: 'text-white',
      shadow: 'shadow-success-500/20'
    },
    error: {
      icon: 'close',
      bg: 'bg-error-500',
      border: 'border-error-400',
      text: 'text-white',
      shadow: 'shadow-error-500/20'
    },
    warning: {
      icon: 'star',
      bg: 'bg-warning-500',
      border: 'border-warning-400',
      text: 'text-white',
      shadow: 'shadow-warning-500/20'
    },
    info: {
      icon: 'eye',
      bg: 'bg-primary-500',
      border: 'border-primary-400',
      text: 'text-white',
      shadow: 'shadow-primary-500/20'
    }
  };

  const variant = toastVariants[type];

  return (
    <div
      className={cn(
        "toast-modern",
        variant.bg,
        variant.border,
        variant.text,
        variant.shadow,
        "border-2 rounded-lg p-4 shadow-lg backdrop-blur-md",
        "transform transition-all duration-300 ease-out",
        isExiting ? "translate-x-full opacity-0 scale-95" : "translate-x-0 opacity-100 scale-100",
        "flex items-center gap-3 min-w-[300px] max-w-[400px]",
        className
      )}
    >
      <div className="toast-icon-container">
        <Icon 
          name={variant.icon} 
          size={20} 
          variant="default"
          className="text-white"
        />
      </div>
      
      <div className="toast-content flex-1">
        <p className="toast-message font-medium text-sm">
          {message}
        </p>
      </div>
      
      <button
        onClick={handleClose}
        className="toast-close-btn p-1 rounded-full hover:bg-white/20 transition-colors"
      >
        <Icon name="close" size={16} className="text-white" />
      </button>
    </div>
  );
};

export default Toast; 