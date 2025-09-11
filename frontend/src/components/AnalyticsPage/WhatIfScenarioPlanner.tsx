import React, { useState } from 'react';
import './WhatIfScenarioPlanner.css'

interface ScenarioInput {
  type: 'fertilizer' | 'irrigation' | 'timing';
  label: string;
  currentValue: number;
  unit: string;
  min: number;
  max: number;
  step: number;
}

interface SimulationResult {
  yieldChange: number;
  yieldChangePercent: number;
  confidence: number;
  recommendation: string;
  costImpact: number;
}

const WhatIfScenarioPlanner: React.FC = () => {
  const [scenarios, setScenarios] = useState<ScenarioInput[]>([
    {
      type: 'fertilizer',
      label: 'Nitrogen Fertilizer',
      currentValue: 100,
      unit: 'kg/hectare',
      min: 50,
      max: 200,
      step: 10
    },
    {
      type: 'irrigation',
      label: 'Irrigation Frequency',
      currentValue: 3,
      unit: 'times/week',
      min: 1,
      max: 7,
      step: 1
    },
    {
      type: 'timing',
      label: 'Next Irrigation Delay',
      currentValue: 0,
      unit: 'days',
      min: 0,
      max: 14,
      step: 1
    }
  ]);

  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleScenarioChange = (index: number, newValue: number) => {
    const updatedScenarios = [...scenarios];
    updatedScenarios[index].currentValue = newValue;
    setScenarios(updatedScenarios);
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock simulation results
    const mockResult: SimulationResult = {
      yieldChange: 0.3,
      yieldChangePercent: 6.4,
      confidence: 78,
      recommendation: "This combination shows promising results. The increased nitrogen may boost yield, but monitor for over-fertilization signs.",
      costImpact: 150
    };
    
    setSimulationResult(mockResult);
    setIsSimulating(false);
  };

  const resetScenarios = () => {
    setScenarios(scenarios.map(scenario => ({
      ...scenario,
      currentValue: scenario.type === 'fertilizer' ? 100 : scenario.type === 'irrigation' ? 3 : 0
    })));
    setSimulationResult(null);
  };

  return (
    <div className="scenario-planner-container">
      <div className="scenario-planner-header">
        <h2 className="scenario-planner-title">
          🔬 What-If Scenario Planner
        </h2>
        <p className="scenario-planner-subtitle">
          Test different farming decisions before implementing them
        </p>
      </div>

      {/* Scenario Controls */}
      <div className="scenario-controls">
        {scenarios.map((scenario, index) => (
          <div key={index} className="scenario-control-item">
            <div className="scenario-control-header">
              <label className="scenario-label">{scenario.label}</label>
              <span className="scenario-value">
                {scenario.currentValue} {scenario.unit}
              </span>
            </div>
            
            <div className="scenario-slider-container">
              <input
                type="range"
                min={scenario.min}
                max={scenario.max}
                step={scenario.step}
                value={scenario.currentValue}
                onChange={(e) => handleScenarioChange(index, Number(e.target.value))}
                className="scenario-slider"
              />
              <div className="scenario-range-labels">
                <span>{scenario.min}</span>
                <span>{scenario.max}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="scenario-actions">
        <button 
          onClick={runSimulation}
          disabled={isSimulating}
          className="scenario-simulate-btn"
        >
          {isSimulating ? '🔄 Simulating...' : '🚀 Run Simulation'}
        </button>
        <button 
          onClick={resetScenarios}
          className="scenario-reset-btn"
        >
          ↻ Reset to Current
        </button>
      </div>

      {/* Simulation Results */}
      {simulationResult && (
        <div className="simulation-results">
          <h3 className="results-title">Simulation Results</h3>
          
          <div className="results-grid">
            <div className="result-card yield-impact">
              <div className="result-icon">📈</div>
              <div className="result-content">
                <h4>Yield Impact</h4>
                <p className={`result-value ${simulationResult.yieldChange >= 0 ? 'positive' : 'negative'}`}>
                  {simulationResult.yieldChange >= 0 ? '+' : ''}{simulationResult.yieldChange.toFixed(1)} tons/hectare
                </p>
                <p className="result-percentage">
                  ({simulationResult.yieldChangePercent >= 0 ? '+' : ''}{simulationResult.yieldChangePercent.toFixed(1)}%)
                </p>
              </div>
            </div>

            <div className="result-card confidence">
              <div className="result-icon">🎯</div>
              <div className="result-content">
                <h4>Confidence Level</h4>
                <p className="result-value">{simulationResult.confidence}%</p>
                <div className="confidence-bar">
                  <div 
                    className="confidence-fill"
                    style={{ width: `${simulationResult.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="result-card cost-impact">
              <div className="result-icon">💰</div>
              <div className="result-content">
                <h4>Cost Impact</h4>
                <p className="result-value">₹{simulationResult.costImpact}</p>
                <p className="result-note">Additional investment</p>
              </div>
            </div>
          </div>

          <div className="recommendation-card">
            <h4>🤖 AI Recommendation</h4>
            <p className="recommendation-text">{simulationResult.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatIfScenarioPlanner;
