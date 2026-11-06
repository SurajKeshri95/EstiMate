import './EstimationForm.css';

interface EstimationFormProps {
  data: any;
  onInputChange: (field: string, value: any) => void;
  onAddFeature: (feature: any) => void;
  onRemoveFeature: (index: number) => void;
  features: any[];
  onCalculate: () => void;
  loading: boolean;
  error?: string | null;
}

export default function EstimationForm({
  data,
  onInputChange,
  onAddFeature,
  onRemoveFeature,
  features,
  onCalculate,
  loading,
  error,
}: EstimationFormProps) {
  const inputQuality = Math.min(100, ((features?.length || 0) * 20));

  const handleAddFeature = () => {
    onAddFeature({
      name: '',
      kind: 'Input',
      complexity: 'average',
      count: 1,
      fp: 0,
    });
  };

  const updateFeature = (index: number, field: string, value: any) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    onInputChange('features', updatedFeatures);
  };

  const quickSelectOptions = [
    'B2B logistics dashboard',
    'E-commerce platform',
    'Internal admin tool',
    'Mobile app with backend',
  ];

  return (
    <div className="form-container">
      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* Input Quality */}
      <div className="input-quality-section">
        <span className="quality-label">Input quality {inputQuality}%</span>
        <div className="quality-bar">
          <div className="quality-fill" style={{ width: `${inputQuality}%` }}></div>
        </div>
        <span className="quality-note">
          {inputQuality < 20 ? 'Low' : inputQuality < 60 ? 'Medium' : 'High'} — this range is{' '}
          {inputQuality < 20 ? 'very wide' : inputQuality < 60 ? 'moderate' : 'narrow'} because you have{' '}
          {inputQuality < 20
            ? 'told it very little'
            : inputQuality < 60
            ? 'given partial info'
            : 'been thorough'}{' '}
          with details.
        </span>
      </div>

      {/* What you are building */}
      <div className="form-section">
        <h3>What you are building <span className="section-label">sizing</span></h3>
        <p className="section-description">
          Count things the client would recognize, not lines of code. A form is an input, a report is an output, a search
          is an inquiry, a stored entity is a file, a third-party service is an interface.
        </p>

        {/* Quick Select */}
        <div className="quick-select">
          {quickSelectOptions.map((option) => (
            <button
              key={option}
              className={`quick-btn ${data.projectName === option ? 'active' : ''}`}
              onClick={() => onInputChange('projectName', option)}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Feature Table */}
        <div className="features-table-wrapper">
          <table className="features-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Kind</th>
                <th>Complexity</th>
                <th>Count</th>
                <th>FP</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      placeholder="Feature name"
                      value={feature.name || ''}
                      onChange={(e) => updateFeature(index, 'name', e.target.value)}
                      className="input-field"
                    />
                  </td>
                  <td>
                    <select
                      value={feature.kind || 'Input'}
                      onChange={(e) => updateFeature(index, 'kind', e.target.value)}
                      className="select-field"
                    >
                      <option>Input</option>
                      <option>Output</option>
                      <option>Inquiry</option>
                      <option>File</option>
                      <option>Interface</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={feature.complexity || 'average'}
                      onChange={(e) => updateFeature(index, 'complexity', e.target.value)}
                      className="select-field"
                    >
                      <option value="simple">Simple</option>
                      <option value="average">Average</option>
                      <option value="complex">Complex</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={feature.count || 1}
                      onChange={(e) => updateFeature(index, 'count', parseInt(e.target.value))}
                      className="input-field narrow"
                    />
                  </td>
                  <td className="fp-cell">{feature.fp || 0}</td>
                  <td>
                    <button
                      className="remove-btn"
                      onClick={() => onRemoveFeature(index)}
                      title="Remove feature"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="add-feature-btn" onClick={handleAddFeature}>
          + Add a feature
        </button>

        <div className="fp-note">
          0 unadjusted function points → 0 adjusted → 15.3 KSLOC equivalent
        </div>
      </div>

      {/* Team and Context */}
      <div className="form-section">
        <h3>Team and context <span className="section-label">effort multipliers</span></h3>
        <p className="section-description">
          These answer how the work differs from a nominal project. Nothing here is a score of anyone — it is experience
          with this kind of work, in this stack, under these conditions.
        </p>

        <div className="sliders-group">
          <div className="slider-item">
            <label>What happens if this software fails in production?</label>
            <div className="slider-container">
              <span className="slider-label">Reliability and complexity · RCPX</span>
              <input
                type="range"
                min="-2"
                max="2"
                value={data.requirementsStability}
                onChange={(e) => onInputChange('requirementsStability', parseInt(e.target.value))}
                className="slider"
              />
              <span className="slider-value">Loss · ×1.00</span>
            </div>
          </div>

          <div className="slider-item">
            <label>Is this being built for reuse elsewhere?</label>
            <div className="slider-container">
              <span className="slider-label">Reuse · RUSE</span>
              <input
                type="range"
                min="-2"
                max="2"
                value={data.architectureRework}
                onChange={(e) => onInputChange('architectureRework', parseInt(e.target.value))}
                className="slider"
              />
              <span className="slider-value">This project only · ×1.00</span>
            </div>
          </div>

          <div className="slider-item">
            <label>How constrained is the platform underneath?</label>
            <div className="slider-container">
              <span className="slider-label">Platform difficulty · PDIF</span>
              <input
                type="range"
                min="-2"
                max="2"
                value={data.testingRequirements}
                onChange={(e) => onInputChange('testingRequirements', parseInt(e.target.value))}
                className="slider"
              />
              <span className="slider-value">Normal · ×1.00</span>
            </div>
          </div>

          <div className="slider-item">
            <label>What is the average ability level?</label>
            <div className="slider-container">
              <span className="slider-label">Personnel · PERS</span>
              <input
                type="range"
                min="-2"
                max="2"
                value={data.cicdMaturity}
                onChange={(e) => onInputChange('cicdMaturity', parseInt(e.target.value))}
                className="slider"
              />
              <span className="slider-value">Mid · ×1.00</span>
            </div>
          </div>

          <div className="slider-item">
            <label>How experienced is the team with the technology?</label>
            <div className="slider-container">
              <span className="slider-label">Experience · PREX</span>
              <input
                type="range"
                min="-2"
                max="2"
                value={data.platformAvailability}
                onChange={(e) => onInputChange('platformAvailability', parseInt(e.target.value))}
                className="slider"
              />
              <span className="slider-value">New · ×1.00</span>
            </div>
          </div>

          <div className="slider-item">
            <label>How good are the tools and CI/CD?</label>
            <div className="slider-container">
              <span className="slider-label">Facility and infrastructure · FCIL</span>
              <input
                type="range"
                min="-2"
                max="2"
                value={data.domainFamiliarity}
                onChange={(e) => onInputChange('domainFamiliarity', parseInt(e.target.value))}
                className="slider"
              />
              <span className="slider-value">Good · ×1.00</span>
            </div>
          </div>

          <div className="slider-item">
            <label>How tight is the schedule?</label>
            <div className="slider-container">
              <span className="slider-label">Schedule compression · SCED</span>
              <input
                type="range"
                min="-2"
                max="2"
                value={data.scheduleCompression}
                onChange={(e) => onInputChange('scheduleCompression', parseInt(e.target.value))}
                className="slider"
              />
              <span className="slider-value">As-needed · ×1.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Process and Requirements */}
      <div className="form-section">
        <h3>Process and requirements</h3>

        <div className="sliders-group">
          <div className="slider-item">
            <label>How much definition do requirements need?</label>
            <div className="slider-container">
              <span className="slider-label">Precedence · PREC</span>
              <input type="range" min="-2" max="2" defaultValue="0" className="slider" />
              <span className="slider-value">Breakaway · ×1.00</span>
            </div>
          </div>

          <div className="slider-item">
            <label>How flexible should the development be?</label>
            <div className="slider-container">
              <span className="slider-label">Flexibility · FLEX</span>
              <input type="range" min="-2" max="2" defaultValue="0" className="slider" />
              <span className="slider-value">Rigid · ×1.00</span>
            </div>
          </div>

          <div className="slider-item">
            <label>What is the resolution of the architecture?</label>
            <div className="slider-container">
              <span className="slider-label">Resolution · RESL</span>
              <input type="range" min="-2" max="2" defaultValue="0" className="slider" />
              <span className="slider-value">Reviewed · ×1.00</span>
            </div>
          </div>

          <div className="slider-item">
            <label>How aligned are the team members?</label>
            <div className="slider-container">
              <span className="slider-label">Team cohesion · TEAM</span>
              <input type="range" min="-2" max="2" defaultValue="0" className="slider" />
              <span className="slider-value">Largely co-op · ×2.19</span>
            </div>
          </div>

          <div className="slider-item">
            <label>How established are CI, review and testing discipline?</label>
            <div className="slider-container">
              <span className="slider-label">Process maturity · PMAT</span>
              <input type="range" min="-2" max="2" defaultValue="0" className="slider" />
              <span className="slider-value">Managed · ×3.12</span>
            </div>
          </div>
        </div>
      </div>

      {/* Money and Calendar */}
      <div className="form-section">
        <h3>Money and calendar</h3>

        <div className="form-group">
          <label>Primary stack</label>
          <select
            value={data.primaryStack || 'TypeScript / Node'}
            onChange={(e) => onInputChange('primaryStack', e.target.value)}
            className="select-field"
          >
            <option>TypeScript / Node</option>
            <option>Python / Django</option>
            <option>Java / Spring</option>
            <option>Go</option>
            <option>Rust</option>
          </select>
        </div>

        <div className="form-group">
          <label>Project shape <span className="label-note">sets the role mix</span></label>
          <select
            value={data.projectShape || 'Web platform'}
            onChange={(e) => onInputChange('projectShape', e.target.value)}
            className="select-field"
          >
            <option>Web platform</option>
            <option>Mobile app</option>
            <option>Desktop app</option>
            <option>Data pipeline</option>
          </select>
        </div>

        <div className="form-group">
          <label>Requirements <span className="label-note">stability also sets scope growth</span></label>
          <select
            value={data.requirementsStability_stability || 'Moderately stab'}
            onChange={(e) => onInputChange('requirementsStability_stability', e.target.value)}
            className="select-field"
          >
            <option>Fairly unstab</option>
            <option>Moderately stab</option>
            <option>Mostly stab</option>
          </select>
        </div>

        <div className="form-group">
          <label>Loaded cost per person-month <span className="label-note">INR, fully loaded (e.g., 10000, 50000, 500000)</span></label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="500000"
            value={data.costPerPersonMonth === undefined || data.costPerPersonMonth === null ? '' : String(data.costPerPersonMonth)}
            onChange={(e) => {
              const rawValue = e.target.value;
              
              // Allow empty input - this lets user clear the field completely
              if (rawValue === '' || rawValue === '0') {
                onInputChange('costPerPersonMonth', undefined);
                return;
              }
              
              // Remove any non-numeric characters
              const numericValue = rawValue.replace(/[^0-9]/g, '');
              
              if (numericValue) {
                const parsed = parseInt(numericValue);
                if (!isNaN(parsed) && parsed > 0) {
                  onInputChange('costPerPersonMonth', parsed);
                }
              }
            }}
            className="input-field editable"
          />
          <small className="field-hint">
            {data.costPerPersonMonth 
              ? `₹${data.costPerPersonMonth.toLocaleString('en-IN')} per person-month` 
              : 'Enter your organization salary cost (min ₹1,000)'}
          </small>
        </div>

        <div className="form-group">
          <label>Target duration <span className="label-note">months (0 = let the model decide)</span></label>
          <input
            type="number"
            min="0"
            max="120"
            placeholder="0"
            value={data.targetDuration === undefined || data.targetDuration === 0 ? '' : data.targetDuration}
            onChange={(e) => {
              if (e.target.value === '') {
                onInputChange('targetDuration', undefined);
              } else {
                onInputChange('targetDuration', parseInt(e.target.value));
              }
            }}
            className="input-field editable"
          />
          <small className="field-hint">
            {data.targetDuration === 0 || data.targetDuration === undefined 
              ? 'Model will decide based on effort' 
              : `${data.targetDuration} months`}
          </small>
        </div>

        <div className="form-group">
          <label>Management reserve <span className="label-note">% of P80 estimate</span></label>
          <div className="slider-with-input">
            <input
              type="number"
              min="0"
              max="50"
              value={data.managementReservePercent !== undefined ? data.managementReservePercent : 7}
              onChange={(e) => onInputChange('managementReservePercent', parseInt(e.target.value) || 7)}
              className="input-field editable"
            />
            <input
              type="range"
              min="0"
              max="50"
              value={data.managementReservePercent !== undefined ? data.managementReservePercent : 7}
              onChange={(e) => onInputChange('managementReservePercent', parseInt(e.target.value))}
              className="slider"
            />
          </div>
          <small className="field-hint">{data.managementReservePercent !== undefined ? data.managementReservePercent : 7}% buffer for uncertainties</small>
        </div>

        <div className="form-group">
          <label>Target margin <span className="label-note">profit margin %</span></label>
          <div className="slider-with-input">
            <input
              type="number"
              min="0"
              max="100"
              value={data.targetMarginPercent !== undefined ? data.targetMarginPercent : 30}
              onChange={(e) => onInputChange('targetMarginPercent', parseInt(e.target.value) || 30)}
              className="input-field editable"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={data.targetMarginPercent !== undefined ? data.targetMarginPercent : 30}
              onChange={(e) => onInputChange('targetMarginPercent', parseInt(e.target.value))}
              className="slider"
            />
          </div>
          <small className="field-hint">{data.targetMarginPercent !== undefined ? data.targetMarginPercent : 30}% markup on internal cost</small>
        </div>
      </div>

      {/* Calculate Button */}
      <button
        onClick={onCalculate}
        disabled={loading || !data.projectName || (data.features && data.features.length === 0)}
        className="btn-calculate"
      >
        {loading ? 'Calculating...' : 'Calculate'}
      </button>
    </div>
  );
}