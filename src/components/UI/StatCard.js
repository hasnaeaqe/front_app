import React from 'react';
import PropTypes from 'prop-types';

/**
 * Statistics card with icon, title, value, and optional subtitle
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon element or component
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main statistic value
 * @param {string} props.subtitle - Optional subtitle text
 * @param {string} props.iconBgColor - Background color for icon (e.g., 'bg-violet-100')
 */
const StatCard = ({ icon, title, value, subtitle, iconBgColor = 'bg-violet-100' }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`${iconBgColor} p-4 rounded-lg`}>
          <div className="text-2xl">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  iconBgColor: PropTypes.string
};

export default StatCard;
