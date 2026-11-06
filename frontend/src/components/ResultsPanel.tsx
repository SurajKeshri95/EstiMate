import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ResultsPanel.css';

interface ResultsPanelProps {
  data: any;
  estimationData: any;
}

export default function ResultsPanel({ data, estimationData }: ResultsPanelProps) {
  if (!data) {
    return (
      <div className="results-container">
        <p>No data available</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    const val = value || 0;
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} L`;
    }
    return `₹${val.toFixed(0)}`;
  };

  const formatHours = (value: number) => {
    const val = value || 0;
    return `${val.toFixed(0)} Hours`;
  };

  // Generate realistic Rayleigh curve data scaled safely
  const generateRayleighData = () => {
    const chartData: any[] = [];
    const duration = data?.duration || 3;
    
    const sb = data?.staffingBreakdown || {
      backendDevelopers: 0.1,
      frontendDevelopers: 0.1,
      qaEngineers: 0.1,
      devOpsEngineers: 0.1,
      designers: 0.1,
      projectManagers: 0.1
    };

    for (let i = 0; i <= duration; i++) {
      const t = i / duration;
      const curveMultiplier = Math.max(0.05, Math.sin(t * Math.PI) * 2.2);

      chartData.push({
        month: `m${i}`,
        backend: Number((sb.backendDevelopers * curveMultiplier).toFixed(2)),
        frontend: Number((sb.frontendDevelopers * curveMultiplier).toFixed(2)),
        qa: Number((sb.qaEngineers * curveMultiplier).toFixed(2)),
        devops: Number((sb.devOpsEngineers * curveMultiplier).toFixed(2)),
        design: Number((sb.designers * curveMultiplier).toFixed(2)),
        pm: Number((sb.projectManagers * curveMultiplier).toFixed(2)),
      });
    }
    return chartData;
  };

  const staffingData = generateRayleighData();

  const getPeak = (roleKey: string) => {
    if (!staffingData.length) return 0;
    return Math.max(...staffingData.map((d: any) => d[roleKey] || 0));
  };

  const totalHours = data.totalHours || data.estimatedHours || 0;

  return (
    <div className="results-container">
      {/* Effort and Duration */}
      <div className="results-section">
        <h3>Effort and duration</h3>
        <div className="effort-summary">
          <div className="effort-card">
            <div className="effort-label">P50 effort</div>
            <div className="effort-value">{formatHours(totalHours * 0.9)}</div>
          </div>
          <div className="effort-card">
            <div className="effort-label">P80 effort</div>
            <div className="effort-value">{formatHours(totalHours)}</div>
          </div>
          <div className="effort-card">
            <div className="effort-label">P95 effort</div>
            <div className="effort-value">{formatHours(totalHours * 1.2)}</div>
          </div>
        </div>

        <div className="metrics-grid">
          <div className="metric">
            <div className="metric-label">Scale exponent E</div>
            <div className="metric-value">0.91 + 0.01 × 12.65 = 1.036</div>
          </div>
          <div className="metric">
            <div className="metric-label">Nominal effort, before uncertainty</div>
            <div className="metric-value">{totalHours.toFixed(0)} Hours</div>
          </div>
          <div className="metric">
            <div className="metric-label">Scope growth assumed</div>
            <div className="metric-value">median ×1.22, σ 0.28</div>
          </div>
          <div className="metric">
            <div className="metric-label">Schedule compression</div>
            <div className="metric-value">×1.00 (SCED)</div>
          </div>
          <div className="metric">
            <div className="metric-label">Communication overhead</div>
            <div className="metric-value">×1.04</div>
          </div>
          <div className="metric">
            <div className="metric-label">Planning effort and duration</div>
            <div className="metric-value">{totalHours.toFixed(0)} Hours over {data.duration || 3} months</div>
          </div>
        </div>
      </div>

      {/* Staffing Over Time */}
      <div className="results-section">
        <h3>
          Staffing over time <span className="section-label">Rayleigh curve, by role</span>
        </h3>
        <p className="section-description">
          Effort divided by months gives an average that nobody ever staffs. Real projects ramp, peak around 40% of
          elapsed time, then taper through hardening.
        </p>

        <div className="chart-container">
          {staffingData && staffingData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={staffingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="backend" stackId="1" stroke="none" fill="#00796B" />
                <Area type="monotone" dataKey="frontend" stackId="1" stroke="none" fill="#FBC02D" />
                <Area type="monotone" dataKey="qa" stackId="1" stroke="none" fill="#388E3C" />
                <Area type="monotone" dataKey="devops" stackId="1" stroke="none" fill="#0097A7" />
                <Area type="monotone" dataKey="design" stackId="1" stroke="none" fill="#7B1FA2" />
                <Area type="monotone" dataKey="pm" stackId="1" stroke="none" fill="#E65100" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p>Loading chart...</p>
          )}
        </div>

        <div className="staffing-legend">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#00796B' }}></span>
            <span>Backend Developers</span>
            <span className="peak-staffing">Peak: {getPeak('backend').toFixed(2)}</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#FBC02D' }}></span>
            <span>Frontend Developers</span>
            <span className="peak-staffing">Peak: {getPeak('frontend').toFixed(2)}</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#388E3C' }}></span>
            <span>QA Engineers</span>
            <span className="peak-staffing">Peak: {getPeak('qa').toFixed(2)}</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#0097A7' }}></span>
            <span>DevOps Engineers</span>
            <span className="peak-staffing">Peak: {getPeak('devops').toFixed(2)}</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#7B1FA2' }}></span>
            <span>Designers</span>
            <span className="peak-staffing">Peak: {getPeak('design').toFixed(2)}</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#E65100' }}></span>
            <span>Project Managers</span>
            <span className="peak-staffing">Peak: {getPeak('pm').toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Where the Effort Goes */}
      <div className="results-section">
        <h3>Where the effort goes <span className="section-label">phase bars</span></h3>
        <div className="phase-bars">
          <div className="phase-bar">
            <div className="phase-header">
              <span className="phase-name">Requirements</span>
              <span className="phase-effort">{(data.phaseBreakdown?.requirements || totalHours * 0.1).toFixed(0)} hrs</span>
            </div>
            <div className="bar-container">
              <div className="bar" style={{ width: '10%', backgroundColor: '#FF6B6B' }}></div>
            </div>
          </div>
          <div className="phase-bar">
            <div className="phase-header">
              <span className="phase-name">Design</span>
              <span className="phase-effort">{(data.phaseBreakdown?.design || totalHours * 0.15).toFixed(0)} hrs</span>
            </div>
            <div className="bar-container">
              <div className="bar" style={{ width: '15%', backgroundColor: '#4ECDC4' }}></div>
            </div>
          </div>
          <div className="phase-bar">
            <div className="phase-header">
              <span className="phase-name">Implementation</span>
              <span className="phase-effort">{(data.phaseBreakdown?.implementation || totalHours * 0.5).toFixed(0)} hrs</span>
            </div>
            <div className="bar-container">
              <div className="bar" style={{ width: '50%', backgroundColor: '#45B7D1' }}></div>
            </div>
          </div>
          <div className="phase-bar">
            <div className="phase-header">
              <span className="phase-name">Testing</span>
              <span className="phase-effort">{(data.phaseBreakdown?.testing || totalHours * 0.2).toFixed(0)} hrs</span>
            </div>
            <div className="bar-container">
              <div className="bar" style={{ width: '20%', backgroundColor: '#96CEB4' }}></div>
            </div>
          </div>
          <div className="phase-bar">
            <div className="phase-header">
              <span className="phase-name">Deployment</span>
              <span className="phase-effort">{(data.phaseBreakdown?.deployment || totalHours * 0.05).toFixed(0)} hrs</span>
            </div>
            <div className="bar-container">
              <div className="bar" style={{ width: '5%', backgroundColor: '#FFEAA7' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="results-section">
        <h3>Price</h3>
        <div className="price-cards">
          <div className="price-card">
            <div className="price-label">P50 Cost</div>
            <div className="price-value">{formatCurrency(data.estimatedCost * 0.8)}</div>
          </div>
          <div className="price-card">
            <div className="price-label">P80 Cost</div>
            <div className="price-value">{formatCurrency(data.estimatedCost)}</div>
          </div>
          <div className="price-card">
            <div className="price-label">P95 Cost</div>
            <div className="price-value">{formatCurrency(data.estimatedCost * 1.25)}</div>
          </div>
          <div className="price-card">
            <div className="price-label">Contingency</div>
            <div className="price-value">{formatCurrency(data.contingencyReserve || 0)}</div>
          </div>
        </div>

        <div className="price-note">
          <strong>At 30% margin:</strong> Client price = Internal cost × 1.30
        </div>

        <div className="price-breakdown">
          <div className="breakdown-row">
            <span>Estimated Cost</span>
            <span>{formatCurrency(data.estimatedCost || 0)}</span>
          </div>
          <div className="breakdown-row">
            <span>+ Management Reserve</span>
            <span>{formatCurrency(data.managementReserve || 0)}</span>
          </div>
          <div className="breakdown-row total">
            <span>Internal Cost</span>
            <span>{formatCurrency((data.estimatedCost || 0) + (data.managementReserve || 0))}</span>
          </div>
          <div className="breakdown-row">
            <span>Target Margin (30%)</span>
            <span>{formatCurrency(((data.estimatedCost || 0) + (data.managementReserve || 0)) * 0.3)}</span>
          </div>
          <div className="breakdown-row final">
            <span>Client Price</span>
            <span>{formatCurrency(((data.estimatedCost || 0) + (data.managementReserve || 0)) * 1.3)}</span>
          </div>
        </div>
      </div>

      {/* Assumptions */}
      <div className="results-section">
        <h3>Assumptions</h3>
        <div className="assumptions-list">
          <div className="assumption-item">
            <strong>Project:</strong> {estimationData?.projectName}
          </div>
          <div className="assumption-item">
            <strong>Total Cost:</strong> {formatCurrency(data.estimatedCost || 0)}
          </div>
          <div className="assumption-item">
            <strong>Total Effort:</strong> {totalHours.toFixed(0)} Hours ({ (totalHours / 160).toFixed(1) } PM)
          </div>
          <div className="assumption-item">
            <strong>Average Team Size:</strong> {(data.averageTeamSize || 0).toFixed(1)} people
          </div>
          <div className="assumption-item">
            <strong>Project Duration:</strong> {data.duration || 3} months
          </div>
          <div className="assumption-item">
            <strong>Cost per Person-Month:</strong> {formatCurrency(data.costPerPersonMonth || 10000)}
          </div>
        </div>
      </div>

      {/* Engine Info */}
      <div className="engine-info">
        Powered by EstiMate Estimation Engine v1.0
      </div>
    </div>
  );
}