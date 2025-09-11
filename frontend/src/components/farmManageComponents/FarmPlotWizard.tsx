import React, { useState } from 'react';

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
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    centerLat: '',
    centerLng: ''
  });

  // Create rectangular plot
  const createRectangularPlot = () => {
    const { length, width, centerLat, centerLng } = dimensions;
    if (!length || !width || !centerLat || !centerLng) {
      alert('Please fill all dimension fields');
      return;
    }

    const lat = parseFloat(centerLat);
    const lng = parseFloat(centerLng);
    const lengthKm = parseFloat(length) / 1000;
    const widthKm = parseFloat(width) / 1000;

    const latOffset = lengthKm / 111;
    const lngOffset = widthKm / (111 * Math.cos(lat * Math.PI / 180));

    const rectangularCoords = [
      { lat: lat - latOffset/2, lng: lng - lngOffset/2 },
      { lat: lat - latOffset/2, lng: lng + lngOffset/2 },
      { lat: lat + latOffset/2, lng: lng + lngOffset/2 },
      { lat: lat + latOffset/2, lng: lng - lngOffset/2 }
    ];

    setCurrentPlot({
      ...currentPlot,
      coordinates: rectangularCoords
    });
    alert('Plot created successfully!');
  };

  // Clear coordinates
  const clearCoordinates = () => {
    setCurrentPlot({
      ...currentPlot,
      coordinates: []
    });
    setDimensions({
      length: '',
      width: '',
      centerLat: '',
      centerLng: ''
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Farm & Plot Setup Wizard</h2>
        <div className="text-sm text-gray-500">
          {plots.length} plot{plots.length !== 1 ? 's' : ''} configured
        </div>
      </div>

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

      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Plot</h3>
        
        {wizardStep === 1 && (
          <div className="space-y-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">📐 Enter Plot Dimensions</h4>
              <p className="text-green-700 mb-6">
                Create your plot by entering the field dimensions and center coordinates
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Length (meters) *
                  </label>
                  <input
                    type="number"
                    value={dimensions.length}
                    onChange={(e) => setDimensions(prev => ({...prev, length: e.target.value}))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Width (meters) *
                  </label>
                  <input
                    type="number"
                    value={dimensions.width}
                    onChange={(e) => setDimensions(prev => ({...prev, width: e.target.value}))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Center Latitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={dimensions.centerLat}
                    onChange={(e) => setDimensions(prev => ({...prev, centerLat: e.target.value}))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 28.7041"
                  />
                  <p className="text-xs text-gray-500 mt-1">You can get this from Google Maps</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Center Longitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={dimensions.centerLng}
                    onChange={(e) => setDimensions(prev => ({...prev, centerLng: e.target.value}))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 77.1025"
                  />
                  <p className="text-xs text-gray-500 mt-1">You can get this from Google Maps</p>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button 
                  onClick={createRectangularPlot}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                >
                  Create Plot
                </button>
                
                {currentPlot.coordinates && currentPlot.coordinates.length > 0 && (
                  <button
                    onClick={clearCoordinates}
                    className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Reset
                  </button>
                )}
              </div>

              {currentPlot.coordinates && currentPlot.coordinates.length > 0 && (
                <div className="mt-6 bg-white p-4 rounded-md border border-green-200">
                  <div className="flex items-center mb-2">
                    <span className="text-green-600 mr-2">✅</span>
                    <h5 className="font-medium text-green-900">Plot Created Successfully</h5>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Area:</span> 
                      <span className="ml-2 font-medium text-green-700">
                        {(calculateArea(currentPlot.coordinates) / 10000).toFixed(2)} hectares
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Shape:</span> 
                      <span className="ml-2 font-medium text-green-700">Rectangular</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Length:</span> 
                      <span className="ml-2 font-medium text-green-700">{dimensions.length}m</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Width:</span> 
                      <span className="ml-2 font-medium text-green-700">{dimensions.width}m</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {currentPlot.coordinates && currentPlot.coordinates.length >= 3 && (
              <div className="mt-6">
                <button
                  onClick={() => setWizardStep(2)}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 font-medium text-lg"
                >
                  Continue to Plot Details →
                </button>
              </div>
            )}
          </div>
        )}

        {wizardStep === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plot Name *
                </label>
                <input
                  type="text"
                  value={currentPlot.name || ''}
                  onChange={(e) => setCurrentPlot(prev => ({...prev, name: e.target.value}))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., North Field, Main Plot"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Type *
                </label>
                <select
                  value={currentPlot.cropType || ''}
                  onChange={(e) => setCurrentPlot(prev => ({...prev, cropType: e.target.value}))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Crop</option>
                  <option value="Wheat">🌾 Wheat</option>
                  <option value="Rice">🍚 Rice</option>
                  <option value="Corn">🌽 Corn</option>
                  <option value="Cotton">🌿 Cotton</option>
                  <option value="Soybean">🫘 Soybean</option>
                  <option value="Sugarcane">🎋 Sugarcane</option>
                  <option value="Barley">🌾 Barley</option>
                  <option value="Mustard">🌻 Mustard</option>
                  <option value="Other">🌱 Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seed Variety *
                </label>
                <input
                  type="text"
                  value={currentPlot.seedVariety || ''}
                  onChange={(e) => setCurrentPlot(prev => ({...prev, seedVariety: e.target.value}))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., HD-2967, Pioneer 1234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Planting Date *
                </label>
                <input
                  type="date"
                  value={currentPlot.plantingDate || ''}
                  onChange={(e) => setCurrentPlot(prev => ({...prev, plantingDate: e.target.value}))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-medium text-blue-900 mb-3">📋 Plot Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600">Name:</span> 
                    <span className="ml-2 font-medium">
                      {currentPlot.name || 'Not set'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Area:</span> 
                    <span className="ml-2 font-medium text-blue-700">
                      {(calculateArea(currentPlot.coordinates || []) / 10000).toFixed(2)} hectares
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Crop:</span> 
                    <span className="ml-2 font-medium">
                      {currentPlot.cropType || 'Not selected'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600">Variety:</span> 
                    <span className="ml-2 font-medium">
                      {currentPlot.seedVariety || 'Not set'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Planting Date:</span> 
                    <span className="ml-2 font-medium">
                      {currentPlot.plantingDate || 'Not set'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Coordinates:</span> 
                    <span className="ml-2 font-medium">{currentPlot.coordinates?.length || 0} points</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setWizardStep(1)}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 font-medium"
              >
                ← Back to Dimensions
              </button>
              <button
                onClick={savePlot}
                disabled={!currentPlot.name || !currentPlot.cropType || !currentPlot.seedVariety || !currentPlot.plantingDate}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                💾 Save Plot
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmPlotWizard;
