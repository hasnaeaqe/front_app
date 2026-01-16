import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Autocomplete input for searching patients and medications
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.value - Current input value
 * @param {Function} props.onChange - Input change handler
 * @param {Function} props.onSelect - Option select handler
 * @param {Array} props.options - Array of option objects
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.loading - Loading state
 */
const Autocomplete = ({ 
  label, 
  value, 
  onChange, 
  onSelect, 
  options = [], 
  placeholder, 
  loading = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (options.length > 0) {
      setIsOpen(true);
      setHighlightedIndex(-1);
    } else {
      setIsOpen(false);
    }
  }, [options]);

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev < options.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          handleSelect(options[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  return (
    <div className="w-full" ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => options.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-violet-600 border-t-transparent rounded-full"></div>
          </div>
        )}

        {isOpen && options.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option, index) => {
              const optionKey = option.id !== undefined ? option.id : `${option.label || option.name}-${index}`;
              return (
                <div
                  key={optionKey}
                  onClick={() => handleSelect(option)}
                  className={`px-4 py-2 cursor-pointer transition-colors ${
                    index === highlightedIndex
                      ? 'bg-violet-50 text-violet-900'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-gray-900">
                    {option.label || option.name}
                  </div>
                  {option.subtitle && (
                    <div className="text-sm text-gray-500">{option.subtitle}</div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {isOpen && !loading && options.length === 0 && value && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
            No results found
          </div>
        )}
      </div>
    </div>
  );
};

Autocomplete.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
      name: PropTypes.string,
      subtitle: PropTypes.string
    })
  ),
  placeholder: PropTypes.string,
  loading: PropTypes.bool
};

export default Autocomplete;
