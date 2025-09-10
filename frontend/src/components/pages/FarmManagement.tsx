import React, { useState, useRef } from 'react';

// TypeScript interfaces
interface Plot {
  id: string;
  name: string;
  coordinates: Array<{lat: number, lng: number}>;
  area: number;
  cropType: string;
  seedVariety: string;
  plantingDate: string;
}

interface LogEntry {
  id: string;
  plotId: string;
  plotName: string;
  type: 'irrigation' | 'fertilization' | 'pestControl' | 'scouting';
  details: {
    amount?: string;
    type?: string;
    date: string;
    notes: string;
    photo?: File | null;
  };
  timestamp: Date;
}

interface SoilRecord {
  id: string;
  plotId: string;
  plotName: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  pH: number;
  testDate: string;
  reportFile?: File | null;
  timestamp: Date;
}

const FarmManagement: React.FC = () => {
  // Navigation state
  const [activeTab, setActiveTab] = useState<'wizard' | 'logbook' | 'soil'>('wizard');
  const [wizardStep, setWizardStep] = useState(1);

  // Plot Setup Wizard state
  const [plots, setPlots] = useState<Plot[]>([]);
  const [currentPlot, setCurrentPlot] = useState<Partial<Plot>>({
    coordinates: [],
    cropType: '',
    seedVariety: '',
    plantingDate: ''
  });
  const [isDrawing, setIsDrawing] = useState(false);

  // Digital Logbook state
  const [selectedPlotId, setSelectedPlotId] = useState<string>('');
  const [logType, setLogType] = useState<string>('');
  const [logDetails, setLogDetails] = useState({
    amount: '',
    type: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    photo: null as File | null
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Soil Health state
  const [soilInput, setSoilInput] = useState({
    plotId: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    pH: '',
    testDate: new Date().toISOString().split('T')[0],
    reportFile: null as File | null
  });
  const [soilRecords, setSoilRecords] = useState<SoilRecord[]>([]);

  // File input refs
  const photoInputRef = useRef<HTMLInputElement>(null);
  const reportInputRef = useRef<HTMLInputElement>(null);

  // Plot Setup Wizard functions
  const handleMapClick = (lat: number, lng: number) => {
    if (!isDrawing) return;
    
    setCurrentPlot(prev => ({
      ...prev,
      coordinates: [...(prev.coordinates || []), { lat, lng }]
    }));
  };

  const calculateArea = (coordinates: Array<{lat: number, lng: number}>): number => {
    // Simplified area calculation - in real implementation, use proper geodesic calculation
    if (coordinates.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < coordinates.length; i++) {
      const j = (i + 1) % coordinates.length;
      area += coordinates[i].lat * coordinates[j].lng;
      area -= coordinates[j].lat * coordinates[i].lng;
    }
    return Math.abs(area / 2) * 111000; // Convert to approximate square meters
  };

  const savePlot = () => {
    if (!currentPlot.coordinates || currentPlot.coordinates.length < 3) {
      alert('Please draw at least 3 points to create a plot');
      return;
    }

    const area = calculateArea(currentPlot.coordinates);
    const newPlot: Plot = {
      id: Date.now().toString(),
      name: `Plot ${plots.length + 1}`,
      coordinates: currentPlot.coordinates,
      area: Math.round(area),
      cropType: currentPlot.cropType || '',
      seedVariety: currentPlot.seedVariety || '',
      plantingDate: currentPlot.plantingDate || ''
    };

    setPlots([...plots, newPlot]);
    setCurrentPlot({ coordinates: [], cropType: '', seedVariety: '', plantingDate: '' });
    setIsDrawing(false);
    setWizardStep(1);
  };

  // Digital Logbook functions
  const quickLogButtons = [
    { type: 'irrigation', label: 'Irrigated Today', icon: '💧' },
    { type: 'fertilization', label: 'Applied Fertilizer', icon: '🌱' },
    { type: 'pestControl', label: 'Pest Control', icon: '🛡️' },
    { type: 'scouting', label: 'Plot Scouting', icon: '👁️' }
  ];

  const handleQuickLog = (type: string) => {
    setLogType(type);
    setLogDetails({
      ...logDetails,
      date: new Date().toISOString().split('T')[0]
    });
  };

  const addLogEntry = () => {
    if (!selectedPlotId || !logType) {
      alert('Please select a plot and activity type');
      return;
    }

    const selectedPlot = plots.find(p => p.id === selectedPlotId);
    if (!selectedPlot) return;

    const newLog: LogEntry = {
      id: Date.now().toString(),
      plotId: selectedPlotId,
      plotName: selectedPlot.name,
      type: logType as LogEntry['type'],
      details: { ...logDetails },
      timestamp: new Date()
    };

    setLogs([newLog, ...logs]);
    setLogType('');
    setLogDetails({
      amount: '',
      type: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      photo: null
    });
    setSelectedPlotId('');
  };

  // Soil Health functions
  const addSoilRecord = () => {
    if (!soilInput.plotId || !soilInput.nitrogen || !soilInput.phosphorus || 
        !soilInput.potassium || !soilInput.pH) {
      alert('Please fill all required fields');
      return;
    }

    const selectedPlot = plots.find(p => p.id === soilInput.plotId);
    if (!selectedPlot) return;

    const newRecord: SoilRecord = {
      id: Date.now().toString(),
      plotId: soilInput.plotId,
      plotName: selectedPlot.name,
      nitrogen: parseFloat(soilInput.nitrogen),
      phosphorus: parseFloat(soilInput.phosphorus),
      potassium: parseFloat(soilInput.potassium),
      pH: parseFloat(soilInput.pH),
      testDate: soilInput.testDate,
      reportFile: soilInput.reportFile,
      timestamp: new Date()
    };

    setSoilRecords([newRecord, ...soilRecords]);
    setSoilInput({
      plotId: '',
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      pH: '',
      testDate: new Date().toISOString().split('T')[0],
      reportFile: null
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900">Farm Management</h1>
            <p className="text-gray-600 mt-1">Manage your plots, activities, and soil health</p>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'wizard', label: 'Plot Setup', icon: '🗺️' },
                { id: 'logbook', label: 'Activity Log', icon: '📝' },
                { id: 'soil', label: 'Soil Health', icon: '🔬' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Farm & Plot Setup Wizard */}
            {activeTab === 'wizard' && (
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
            )}

            {/* Digital Logbook */}
            {activeTab === 'logbook' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Digital Logbook</h2>
                  <div className="text-sm text-gray-500">
                    {logs.length} log entr{logs.length !== 1 ? 'ies' : 'y'}
                  </div>
                </div>

                {plots.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Please set up your plots first to start logging activities.</p>
                    <button
                      onClick={() => setActiveTab('wizard')}
                      className="mt-2 text-green-600 hover:text-green-700 font-medium"
                    >
                      Go to Plot Setup →
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Quick Action Buttons */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {quickLogButtons.map((btn) => (
                        <button
                          key={btn.type}
                          onClick={() => handleQuickLog(btn.type)}
                          className={`p-4 rounded-lg border-2 text-center transition-colors ${
                            logType === btn.type
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <div className="text-2xl mb-2">{btn.icon}</div>
                          <div className="text-sm font-medium">{btn.label}</div>
                        </button>
                      ))}
                    </div>

                    {/* Logging Form */}
                    {logType && (
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Log {logType.charAt(0).toUpperCase() + logType.slice(1)} Activity
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Select Plot
                            </label>
                            <select
                              value={selectedPlotId}
                              onChange={(e) => setSelectedPlotId(e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                              required
                            >
                              <option value="">Select Plot</option>
                              {plots.map((plot) => (
                                <option key={plot.id} value={plot.id}>
                                  {plot.name} - {plot.cropType}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Date
                            </label>
                            <input
                              type="date"
                              value={logDetails.date}
                              onChange={(e) => setLogDetails({...logDetails, date: e.target.value})}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                              required
                            />
                          </div>

                          {logType === 'irrigation' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Water Amount (inches)
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={logDetails.amount}
                                onChange={(e) => setLogDetails({...logDetails, amount: e.target.value})}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="e.g., 1.5"
                              />
                            </div>
                          )}

                          {logType === 'fertilization' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fertilizer Type & Amount
                              </label>
                              <input
                                type="text"
                                value={logDetails.type}
                                onChange={(e) => setLogDetails({...logDetails, type: e.target.value})}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="e.g., Urea 50kg/hectare"
                              />
                            </div>
                          )}

                          {logType === 'pestControl' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Treatment Details
                              </label>
                              <input
                                type="text"
                                value={logDetails.type}
                                onChange={(e) => setLogDetails({...logDetails, type: e.target.value})}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="e.g., Insecticide XYZ 200ml/hectare"
                              />
                            </div>
                          )}

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Notes
                            </label>
                            <textarea
                              value={logDetails.notes}
                              onChange={(e) => setLogDetails({...logDetails, notes: e.target.value})}
                              rows={3}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                              placeholder="Additional observations or details..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Photo (optional)
                            </label>
                            <input
                              ref={photoInputRef}
                              type="file"
                              accept="image/*"
                              onChange={(e) => setLogDetails({...logDetails, photo: e.target.files?.[0] || null})}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </div>

                        <div className="flex space-x-4 mt-6">
                          <button
                            onClick={() => setLogType('')}
                            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={addLogEntry}
                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                          >
                            Add Log Entry
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Activity History */}
                    {logs.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
                        {logs.slice(0, 10).map((log) => (
                          <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="text-2xl">
                                    {quickLogButtons.find(b => b.type === log.type)?.icon}
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {log.plotName}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">
                                  {log.details.type || log.details.amount} • {log.details.date}
                                </p>
                                {log.details.notes && (
                                  <p className="text-sm text-gray-500">{log.details.notes}</p>
                                )}
                              </div>
                              <div className="text-xs text-gray-400">
                                {log.timestamp.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Soil Health Records */}
            {activeTab === 'soil' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Soil Health Records</h2>
                  <div className="text-sm text-gray-500">
                    {soilRecords.length} record{soilRecords.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {plots.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Please set up your plots first to track soil health.</p>
                    <button
                      onClick={() => setActiveTab('wizard')}
                      className="mt-2 text-green-600 hover:text-green-700 font-medium"
                    >
                      Go to Plot Setup →
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Add New Record Form */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Add Soil Test Record</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Plot
                          </label>
                          <select
                            value={soilInput.plotId}
                            onChange={(e) => setSoilInput({...soilInput, plotId: e.target.value})}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          >
                            <option value="">Select Plot</option>
                            {plots.map((plot) => (
                              <option key={plot.id} value={plot.id}>
                                {plot.name} - {plot.cropType}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Test Date
                          </label>
                          <input
                            type="date"
                            value={soilInput.testDate}
                            onChange={(e) => setSoilInput({...soilInput, testDate: e.target.value})}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nitrogen (N) mg/kg
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={soilInput.nitrogen}
                            onChange={(e) => setSoilInput({...soilInput, nitrogen: e.target.value})}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., 45.2"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phosphorus (P) mg/kg
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={soilInput.phosphorus}
                            onChange={(e) => setSoilInput({...soilInput, phosphorus: e.target.value})}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., 23.8"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Potassium (K) mg/kg
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={soilInput.potassium}
                            onChange={(e) => setSoilInput({...soilInput, potassium: e.target.value})}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., 156.7"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Soil pH
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="14"
                            value={soilInput.pH}
                            onChange={(e) => setSoilInput({...soilInput, pH: e.target.value})}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., 6.8"
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lab Report (PDF) - Optional
                          </label>
                          <input
                            ref={reportInputRef}
                            type="file"
                            accept=".pdf,.jpg,.png"
                            onChange={(e) => setSoilInput({...soilInput, reportFile: e.target.files?.[0] || null})}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>

                      <button
                        onClick={addSoilRecord}
                        className="w-full mt-6 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                      >
                        Add Soil Record
                      </button>
                    </div>

                    {/* Records History */}
                    {soilRecords.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Soil Test History</h3>
                        
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Plot
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Test Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  N (mg/kg)
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  P (mg/kg)
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  K (mg/kg)
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  pH
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Report
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {soilRecords.map((record) => (
                                <tr key={record.id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {record.plotName}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(record.testDate).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {record.nitrogen}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {record.phosphorus}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {record.potassium}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {record.pH}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {record.reportFile ? (
                                      <span className="text-green-600">📄 Attached</span>
                                    ) : (
                                      <span className="text-gray-400">No file</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmManagement;
