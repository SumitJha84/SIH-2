import React, { useRef } from 'react';

interface Plot {
  id: string;
  name: string;
  cropType: string;
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

interface SoilInputState {
  plotId: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  pH: string;
  testDate: string;
  reportFile: File | null;
}

interface Props {
  plots: Plot[];
  soilRecords: SoilRecord[];
  setSoilRecords: React.Dispatch<React.SetStateAction<SoilRecord[]>>;
  soilInput: SoilInputState;
  setSoilInput: React.Dispatch<React.SetStateAction<SoilInputState>>;
  addSoilRecord: () => void;
  onSwitchToWizard?: () => void;
}

const SoilHealthRecords: React.FC<Props> = ({
  plots,
  soilRecords,
  setSoilRecords,
  soilInput,
  setSoilInput,
  addSoilRecord,
  onSwitchToWizard
}) => {
  const reportInputRef = useRef<HTMLInputElement>(null);

  return (
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
  );
};

export default SoilHealthRecords;
