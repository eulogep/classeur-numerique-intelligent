import React from 'react';
import './UISystem.css';

/**
 * Système de composants UI unifié
 * Fournit une interface cohérente pour tous les éléments de l'application
 */

// ─── BOUTONS ───

export const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={`ui-button ui-button-${variant} ui-button-${size} ${className || ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="button-loader"></span>}
      {icon && <span className="button-icon">{icon}</span>}
      {children}
    </button>
  );
};

// ─── CARTES ───

export const Card = ({ title, subtitle, children, className, ...props }) => {
  return (
    <div className={`ui-card ${className || ''}`} {...props}>
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card-content">{children}</div>
    </div>
  );
};

// ─── MODALES ───

export const Modal = ({ isOpen, onClose, title, size = 'md', children }) => {
  if (!isOpen) return null;

  return (
    <div className="ui-modal-overlay" onClick={onClose}>
      <div
        className={`ui-modal ui-modal-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button className="modal-close" onClick={onClose}>
              ✕
            </button>
          </div>
        )}
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

// ─── FORMULAIRES ───

export const FormGroup = ({ label, error, required, children }) => {
  return (
    <div className="ui-form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      {children}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export const Input = ({ error, ...props }) => {
  return (
    <input
      className={`ui-input ${error ? 'error' : ''}`}
      {...props}
    />
  );
};

export const Select = ({ error, options, ...props }) => {
  return (
    <select className={`ui-select ${error ? 'error' : ''}`} {...props}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

// ─── NOTIFICATIONS ───

export const Alert = ({ type = 'info', title, message, onClose }) => {
  return (
    <div className={`ui-alert ui-alert-${type}`}>
      <div className="alert-icon">
        {type === 'success' && '✓'}
        {type === 'error' && '✕'}
        {type === 'warning' && '⚠'}
        {type === 'info' && 'ℹ'}
      </div>
      <div className="alert-content">
        {title && <h4 className="alert-title">{title}</h4>}
        {message && <p className="alert-message">{message}</p>}
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose}>
          ✕
        </button>
      )}
    </div>
  );
};

// ─── LISTES ───

export const List = ({ items, renderItem, className }) => {
  return (
    <div className={`ui-list ${className || ''}`}>
      {items.map((item, index) => (
        <div key={item.id || index} className="list-item">
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
};

// ─── GRILLES ───

export const Grid = ({ columns = 3, gap = 'md', children, className }) => {
  return (
    <div
      className={`ui-grid ui-grid-${columns} ui-gap-${gap} ${className || ''}`}
    >
      {children}
    </div>
  );
};

// ─── BADGES ───

export const Badge = ({ variant = 'primary', children }) => {
  return <span className={`ui-badge ui-badge-${variant}`}>{children}</span>;
};

// ─── SPINNERS ───

export const Spinner = ({ size = 'md' }) => {
  return <div className={`ui-spinner ui-spinner-${size}`}></div>;
};

// ─── PROGRESSBAR ───

export const ProgressBar = ({ value, max = 100, showLabel = false }) => {
  const percentage = (value / max) * 100;

  return (
    <div className="ui-progress-bar">
      <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
      {showLabel && <span className="progress-label">{Math.round(percentage)}%</span>}
    </div>
  );
};

// ─── TABS ───

export const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="ui-tabs">
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {tabs.find((t) => t.id === activeTab)?.content}
      </div>
    </div>
  );
};

// ─── TOOLTIPS ───

export const Tooltip = ({ content, children, position = 'top' }) => {
  return (
    <div className={`ui-tooltip ui-tooltip-${position}`}>
      {children}
      <div className="tooltip-content">{content}</div>
    </div>
  );
};

// ─── SKELETON LOADERS ───

export const Skeleton = ({ width = '100%', height = '20px', className }) => {
  return (
    <div
      className={`ui-skeleton ${className || ''}`}
      style={{ width, height }}
    ></div>
  );
};

export const SkeletonCard = ({ count = 3 }) => {
  return (
    <div className="ui-skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <Skeleton height="200px" className="mb-2" />
          <Skeleton width="80%" height="16px" className="mb-1" />
          <Skeleton width="60%" height="14px" />
        </Card>
      ))}
    </div>
  );
};

export default {
  Button,
  Card,
  Modal,
  FormGroup,
  Input,
  Select,
  Alert,
  List,
  Grid,
  Badge,
  Spinner,
  ProgressBar,
  Tabs,
  Tooltip,
  Skeleton,
  SkeletonCard
};
