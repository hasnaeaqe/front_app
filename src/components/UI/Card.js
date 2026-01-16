import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card component with colored borders
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.borderColor - Border color variant (violet, rose, cyan, green, blue)
 * @param {string} props.className - Additional CSS classes
 */
const Card = ({ children, borderColor = 'violet', className = '' }) => {
  const borderColors = {
    violet: 'border-l-violet-500',
    rose: 'border-l-rose-500',
    cyan: 'border-l-cyan-500',
    green: 'border-l-green-500',
    blue: 'border-l-blue-500'
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border-l-4 ${borderColors[borderColor]} p-6 ${className}`}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  borderColor: PropTypes.oneOf(['violet', 'rose', 'cyan', 'green', 'blue']),
  className: PropTypes.string
};

export default Card;
