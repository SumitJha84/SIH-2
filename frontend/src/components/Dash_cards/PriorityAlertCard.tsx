import React from 'react';

interface Alert {
  type: 'red' | 'orange' | 'green';
  message: string;
  icon: string;
}

interface PriorityAlertCardProps {
  alert: Alert;
}

const PriorityAlertCard: React.FC<PriorityAlertCardProps> = ({ alert }) => {
  const cardStyle: React.CSSProperties = {
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const getAlertStyle = (type: Alert['type']): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      padding: '16px',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '14px'
    };

    switch (type) {
      case 'red':
        return { ...baseStyle, backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b' };
      case 'orange':
        return { ...baseStyle, backgroundColor: '#fffbeb', border: '1px solid #fed7aa', color: '#92400e' };
      case 'green':
        return { ...baseStyle, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534' };
      default:
        return baseStyle;
    }
  };

  return (
    <div style={cardStyle}>
      <div style={getAlertStyle(alert.type)}>
        {alert.icon} <strong>{alert.message}</strong>
      </div>
    </div>
  );
};

export default PriorityAlertCard;
