import React from 'react';

interface Plot {
  id: number;
  name: string;
  status: 'green' | 'yellow' | 'red';
  cropType: string;
  plantingDate: string;
  yieldForecast: number;
  area: number; // in hectares
}

interface FarmMapCardProps {
  plots: Plot[];
  selectedPlot: Plot | null;
  setSelectedPlot: (plot: Plot | null) => void;
}

const FarmMapCard: React.FC<FarmMapCardProps> = ({ plots, selectedPlot, setSelectedPlot }) => {
  const cardStyle: React.CSSProperties = {
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const getPlotColor = (status: Plot['status']): string => {
    switch (status) {
      case 'green': return '#10b981';
      case 'yellow': return '#f59e0b';
      case 'red': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginTop: 0 }}>
        🗺️ Interactive Farm Map
      </h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
        gap: '16px', 
        marginBottom: '20px' 
      }}>
        {plots.map(plot => (
          <div
            key={plot.id}
            onClick={() => setSelectedPlot(selectedPlot?.id === plot.id ? null : plot)}
            style={{
              cursor: 'pointer',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: getPlotColor(plot.status),
              color: 'white',
              textAlign: 'center',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              transform: selectedPlot?.id === plot.id ? 'scale(1.05)' : 'scale(1)',
              boxShadow: selectedPlot?.id === plot.id ? '0 4px 12px rgba(0,0,0,0.2)' : 'none'
            }}
          >
            <div style={{ fontSize: '18px', marginBottom: '8px' }}>{plot.name}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>{plot.cropType}</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>{plot.area} ha</div>
          </div>
        ))}
      </div>

      {selectedPlot && (
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 12px 0' }}>
            📍 {selectedPlot.name} Details
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '12px' 
          }}>
            <div>
              <strong>Crop Type:</strong> {selectedPlot.cropType}
            </div>
            <div>
              <strong>Planting Date:</strong> {new Date(selectedPlot.plantingDate).toLocaleDateString()}
            </div>
            <div>
              <strong>Area:</strong> {selectedPlot.area} hectares
            </div>
            <div>
              <strong>Yield Forecast:</strong> {selectedPlot.yieldForecast} tons/hectare
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmMapCard;
