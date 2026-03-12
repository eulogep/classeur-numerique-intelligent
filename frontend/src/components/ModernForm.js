import React from 'react';
import './ModernForm.css';

const ModernForm = ({ onSubmit, children, className = '' }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form className={`modern-form ${className}`} onSubmit={handleSubmit}>
      {children}
    </form>
  );
};

const FormField = ({ label, children, required = false, error = null }) => {
  return (
    <div className="form-field">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="form-input-wrapper">
        {children}
        {error && <div className="form-error">{error}</div>}
      </div>
    </div>
  );
};

const FormInput = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  onFocus, 
  onBlur,
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <input
      type={type}
      className={`modern-input ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      {...props}
    />
  );
};

const FormSelect = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Sélectionner...',
  className = '',
  ...props 
}) => {
  return (
    <select
      className={`modern-select ${className}`}
      value={value}
      onChange={onChange}
      {...props}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

const FormButton = ({ 
  type = 'button', 
  variant = 'primary', 
  children, 
  onClick, 
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`modern-button ${variant} ${loading ? 'loading' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="loading-spinner" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="31.416" strokeDashoffset="31.416">
            <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite" />
            <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite" />
          </circle>
        </svg>
      )}
      {children}
    </button>
  );
};

const FormGroup = ({ children, className = '' }) => {
  return (
    <div className={`form-group ${className}`}>
      {children}
    </div>
  );
};

// Export des composants
ModernForm.Field = FormField;
ModernForm.Input = FormInput;
ModernForm.Select = FormSelect;
ModernForm.Button = FormButton;
ModernForm.Group = FormGroup;

export default ModernForm; 