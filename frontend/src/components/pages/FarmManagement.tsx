import React, { useState } from 'react';
import FarmPlotWizard from '../farmManageComponents/FarmPlotWizard';
import DigitalLogbook from '../farmManageComponents/DigitalLogbook';
import SoilHealthRecords from '../farmManageComponents/SoilHealthRecords';

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
  
  // Plot Setup Wizard state
  const [plots, setPlots] = useState<Plot[]>([]);
  const [currentPlot, setCurrentPlot] = useState<Partial<Plot>>({
    coordinates: [],
    cropType: '',
    seedVariety: '',
    plantingDate: '',
    name: '' // ADDED: Include name field
  });
  const [wizardStep, setWizardStep] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);

  // Digital Logbook state
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
      name: currentPlot.name || `Plot ${plots.length + 1}`, // CHANGED: Use entered name or auto-generate
      coordinates: currentPlot.coordinates,
      area: Math.round(area),
      cropType: currentPlot.cropType || '',
      seedVariety: currentPlot.seedVariety || '',
      plantingDate: currentPlot.plantingDate || ''
    };
    setPlots([...plots, newPlot]);
    setCurrentPlot({ 
      coordinates: [], 
      cropType: '', 
      seedVariety: '', 
      plantingDate: '',
      name: '' // ADDED: Reset name field
    });
    setIsDrawing(false);
    setWizardStep(1);
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
              <FarmPlotWizard
                plots={plots}
                currentPlot={currentPlot}
                setCurrentPlot={setCurrentPlot}
                wizardStep={wizardStep}
                setWizardStep={setWizardStep}
                isDrawing={isDrawing}
                setIsDrawing={setIsDrawing}
                savePlot={savePlot}
                calculateArea={calculateArea}
                handleMapClick={handleMapClick}
              />
            )}

            {/* Digital Logbook */}
            {activeTab === 'logbook' && (
              <DigitalLogbook 
                plots={plots} 
                logs={logs} 
                setLogs={setLogs}
                onSwitchToWizard={() => setActiveTab('wizard')}
              />
            )}

            {/* Soil Health Records - Now using separate component */}
            {activeTab === 'soil' && (
              <SoilHealthRecords
                plots={plots}
                soilRecords={soilRecords}
                setSoilRecords={setSoilRecords}
                soilInput={soilInput}
                setSoilInput={setSoilInput}
                addSoilRecord={addSoilRecord}
                onSwitchToWizard={() => setActiveTab('wizard')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmManagement;
