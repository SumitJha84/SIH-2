import React, { useState } from 'react';
import WelcomeBanner from '../Dash_cards/WelcomeBanner';
import PriorityAlertCard from '../Dash_cards/PriorityAlertCard';
import WeatherForecastCard from '../Dash_cards/WeatherForecastCard';
import ActionPlanCard from '../Dash_cards/ActionPlanCard';
import FarmMapCard from '../Dash_cards/FarmMapCard';
import YieldForecastCard from '../Dash_cards/YieldForecastCard';

// TypeScript interfaces
interface WeatherCondition {
  icon: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  forecast5Days: ForecastDay[];
}

interface ForecastDay {
  day: string;
  icon: string;
  high: number;
  low: number;
  precipitation: number;
}

interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface Plot {
  id: number;
  name: string;
  status: 'green' | 'yellow' | 'red';
  cropType: string;
  plantingDate: string;
  yieldForecast: number;
  area: number; // in hectares
}

interface Alert {
  type: 'red' | 'orange' | 'green';
  message: string;
  icon: string;
}

const Dashboard: React.FC = () => {
  const farmerName = "Sumit Jha";
  // Remove currentDate generation - now handled in WelcomeBanner
  // const currentDate = new Date().toLocaleDateString('en-IN', {
  //   weekday: 'long',
  //   year: 'numeric',
  //   month: 'long',
  //   day: 'numeric'
  // });

  // Alert state management
  const [alert] = useState<Alert>({
    type: 'red',
    icon: '🔴',
    message: 'HEAVY RAIN ALERT: 50mm of rain forecasted for tonight. Ensure proper drainage in Plot B'
  });

  // Weather data
  const weather: WeatherCondition = {
    icon: '☀️',
    temperature: 29,
    humidity: 65,
    windSpeed: 12,
    forecast5Days: [
      { day: 'Thu', icon: '🌦️', high: 31, low: 24, precipitation: 40 },
      { day: 'Fri', icon: '🌤️', high: 33, low: 25, precipitation: 10 },
      { day: 'Sat', icon: '☀️', high: 35, low: 26, precipitation: 0 },
      { day: 'Sun', icon: '☁️', high: 32, low: 24, precipitation: 20 },
      { day: 'Mon', icon: '🌧️', high: 28, low: 22, precipitation: 60 }
    ]
  };

  // Tasks state management
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Today: Scout Plot A for signs of leaf rust', completed: false, priority: 'high' },
    { id: 2, text: 'Tomorrow: Irrigate Plot C with 1.5 inches of water', completed: false, priority: 'medium' },
    { id: 3, text: 'By Friday: Purchase and apply Potassium fertilizer', completed: false, priority: 'medium' },
    { id: 4, text: 'This week: Soil pH testing for Plot B', completed: true, priority: 'low' }
  ]);

  const toggleTask = (id: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Farm plots data
  const plots: Plot[] = [
    { id: 1, name: 'Plot A', status: 'green', cropType: 'Corn', plantingDate: '2025-04-01', yieldForecast: 5.2, area: 2.5 },
    { id: 2, name: 'Plot B', status: 'red', cropType: 'Wheat', plantingDate: '2025-03-15', yieldForecast: 3.3, area: 3.0 },
    { id: 3, name: 'Plot C', status: 'yellow', cropType: 'Soybean', plantingDate: '2025-04-10', yieldForecast: 4.1, area: 2.0 },
    { id: 4, name: 'Plot D', status: 'green', cropType: 'Rice', plantingDate: '2025-05-01', yieldForecast: 6.1, area: 1.8 }
  ];

  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);

  // Yield forecast state
  const [selectedYieldPlot, setSelectedYieldPlot] = useState<string>('Overall');
  const overallYield = 4.8;
  const yieldTrend = 1.5;

  return (
    <div style={{ 
      padding: '24px', 
      fontFamily: 'system-ui, sans-serif', 
      backgroundColor: '#f9fafb', 
      minHeight: '100vh',
      width: '100%'
    }}>
      <div style={{ width: '100%' }}>

        {/* 1. Welcome Banner Component - Only pass farmerName */}
        <WelcomeBanner farmerName={farmerName} />

        {/* 2. Priority Alert Component */}
        <PriorityAlertCard alert={alert} />

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '20px' 
        }}>

          {/* 3. Weather Forecast Component */}
          <WeatherForecastCard weather={weather} />

          {/* 4. Action Plan Component */}
          <ActionPlanCard tasks={tasks} toggleTask={toggleTask} />

        </div>

        {/* 5. Farm Map Component */}
        <FarmMapCard 
          plots={plots} 
          selectedPlot={selectedPlot} 
          setSelectedPlot={setSelectedPlot} 
        />

        {/* 6. Yield Forecast Component */}
        <YieldForecastCard 
          plots={plots}
          selectedYieldPlot={selectedYieldPlot}
          setSelectedYieldPlot={setSelectedYieldPlot}
          overallYield={overallYield}
          yieldTrend={yieldTrend}
        />

      </div>
    </div>
  );
};

export default Dashboard;
