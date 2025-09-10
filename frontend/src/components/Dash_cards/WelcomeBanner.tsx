import React from 'react';

interface WelcomeBannerProps {
  farmerName: string;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ farmerName }) => {
  // Generate current date
  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Dynamic greeting based on time of day
  const getTimeBasedGreeting = (): string => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return 'Good morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good afternoon';
    } else if (hour >= 17 && hour < 21) {
      return 'Good evening';
    } else {
      return 'Good night';
    }
  };

  // Get appropriate emoji for time of day
  const getTimeEmoji = (): string => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return '🌅'; // sunrise
    } else if (hour >= 12 && hour < 17) {
      return '☀️'; // sun
    } else if (hour >= 17 && hour < 21) {
      return '🌇'; // sunset
    } else {
      return '🌙'; // moon
    }
  };

  const cardStyle: React.CSSProperties = {
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  return (
    <div style={cardStyle}>
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: 0 }}>
          {getTimeBasedGreeting()}, {farmerName}! {getTimeEmoji()}
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', margin: '4px 0 0 0' }}>{currentDate}</p>
      </div>
    </div>
  );
};

export default WelcomeBanner;
