import React from 'react';
import DynamicYieldForecast from '../AnalyticsPage/DynamicYieldForecast';
import WhatIfScenarioPlanner from '../AnalyticsPage/WhatIfScenarioPlanner';
import PerformanceBenchmarking from '../AnalyticsPage/PerformanceBenchmarking.tsx';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="analytics-page">
      <div className="analytics-page-header">
        <h1 className="page-title">Analytics & Predictions</h1>
        <p className="page-subtitle">
          Deep insights and data-driven predictions for smarter farming decisions
        </p>
      </div>

      <div className="analytics-sections">
        {/* Dynamic Yield Forecast Section */}
        <section className="analytics-section">
          <DynamicYieldForecast />
        </section>

        {/* What-If Scenario Planner Section */}
        <section className="analytics-section">
          <WhatIfScenarioPlanner />
        </section>

        {/* Performance & Benchmarking Section */}
        <section className="analytics-section">
          <PerformanceBenchmarking />
        </section>
      </div>
    </div>
  );
};

export default AnalyticsPage;
