import React from 'react';
import PropTypes from 'prop-types';

/**
 * Input field with label, error message, and optional icon
 * @param {Object} props
 * @param {string} props.label - Input label text
 * @param {string} props.type - Input type attribute
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.error - Error message to display
 * @param {React.ReactNode} props.icon - Optional icon element
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Required field indicator
 */
const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  icon, 
  placeholder, 
  required = false,
  ...rest 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">
              {icon}
            </span>
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500' : 'border-gray-300'}
            disabled:bg-gray-100 disabled:cursor-not-allowed
          `}
          {...rest}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
  icon: PropTypes.node,
  placeholder: PropTypes.string,
  required: PropTypes.bool
};

export default Input;
