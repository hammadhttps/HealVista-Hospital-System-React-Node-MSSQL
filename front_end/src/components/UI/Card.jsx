import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'p-6',
  onClick,
  gradient = false 
}) => {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-200
        ${hover ? 'hover:shadow-md hover:-translate-y-1 cursor-pointer' : ''}
        ${gradient ? 'bg-gradient-to-br from-white to-gray-50' : ''}
        ${padding}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;