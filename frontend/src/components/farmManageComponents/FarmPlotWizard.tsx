import React from 'react';

interface Plot {
  id: string;
  name: string;
  coordinates: Array<{lat: number, lng: number}>;
  area: number;
  cropType: string;
  seedVariety: string;
  plantingDate: string;
}

interface Props {
  plots: Plot[];
  currentPlot: Partial<Plot>;
  setCurrentPlot: React.Dispatch<React.SetStateAction<Partial<Plot>>>;
  wizardStep: number;
  setWizardStep: React.Dispatch<React.SetStateAction<number>>;
  isDrawing: boolean;
  setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  savePlot: () => void;
  calculateArea: (coordinates: Array<{lat: number; lng: number}>) => number;
  handleMapClick?: (lat: number, lng: number) => void;
}

const FarmPlotWizard: React.FC<Props> = ({ 
  plots, 
  currentPlot, 
  setCurrentPlot, 
  wizardStep, 
  setWizardStep, 
  isDrawing, 
  setIsDrawing, 
  savePlot, 
  calculateArea,
  handleMapClick 
}) => {
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Farm & Plot Setup Wizard</h2>
        <div className="text-sm text-gray-500">
          {plots.length} plot{plots.length !== 1 ? 's' : ''} configured
        </div>
      </div>

      {/* Existing Plots */}
      {plots.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {plots.map((plot) => (
            <div key={plot.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900">{plot.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {plot.cropType} - {plot.seedVariety}
              </p>
              <p className="text-sm text-gray-500">
                Area: {(plot.area / 10000).toFixed(2)} hectares
              </p>
              <p className="text-sm text-gray-500">
                Planted: {new Date(plot.plantingDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* New Plot Form */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Plot</h3>
        
        {wizardStep === 1 && (
          <div className="space-y-4">
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 6-3 .553.894A1 1 0 0122 5.618v10.764a1 1 0 01-.553.894L15 20l-6-3z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Interactive Map</h4>
              <p className="text-gray-600 mb-4">Click to draw your plot boundaries</p>
              <button
                onClick={() => setIsDrawing(!isDrawing)}
                className={`px-4 py-2 rounded-md font-medium ${
                  isDrawing
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isDrawing ? 'Stop Drawing' : 'Start Drawing'}
              </button>
              
              {currentPlot.coordinates && currentPlot.coordinates.length > 0 && (
                <div className="mt-4 text-sm text-gray-600">
                  Points: {currentPlot.coordinates.length} | 
                  Area: {(calculateArea(currentPlot.coordinates) / 10000).toFixed(2)} hectares
                </div>
              )}
            </div>
            
            {currentPlot.coordinates && currentPlot.coordinates.length >= 3 && (
              <button
                onClick={() => setWizardStep(2)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Continue to Plot Details
              </button>
            )}
          </div>
        )}

        {wizardStep === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Type
                </label>
                <select
                  value={currentPlot.cropType || ''}
                  onChange={(e) => setCurrentPlot({...currentPlot, cropType: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select Crop</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Corn">Corn</option>
                  <option value="Rice">Rice</option>
                  <option value="Soybean">Soybean</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Barley">Barley</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seed Variety
                </label>
                <input
                  type="text"
                  value={currentPlot.seedVariety || ''}
                  onChange={(e) => setCurrentPlot({...currentPlot, seedVariety: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., HD-2967, Pioneer 1234"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Planting Date
                </label>
                <input
                  type="date"
                  value={currentPlot.plantingDate || ''}
                  onChange={(e) => setCurrentPlot({...currentPlot, plantingDate: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setWizardStep(1)}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
              >
                Back to Map
              </button>
              <button
                onClick={savePlot}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Save Plot
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmPlotWizard;
