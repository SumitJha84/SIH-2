import React, { useState, useRef } from 'react';

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

interface Plot {
  id: string;
  name: string;
  cropType: string;
}

interface Props {
  plots: Plot[];
  logs: LogEntry[];
  setLogs: React.Dispatch<React.SetStateAction<LogEntry[]>>;
  onSwitchToWizard?: () => void;
}

const DigitalLogbook: React.FC<Props> = ({ plots, logs, setLogs, onSwitchToWizard }) => {
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
  
  const photoInputRef = useRef<HTMLInputElement>(null);

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

  return (
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
          {onSwitchToWizard && (
            <button
              onClick={onSwitchToWizard}
              className="mt-2 text-green-600 hover:text-green-700 font-medium"
            >
              Go to Plot Setup →
            </button>
          )}
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
  );
};

export default DigitalLogbook;
