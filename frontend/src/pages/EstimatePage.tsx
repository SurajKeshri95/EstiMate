import { useState } from 'react';
import EstimationForm from '../components/EstimationForm';
import ResultsPanel from '../components/ResultsPanel';
import { estimationAPI } from '../services/api';
import './EstimatePage.css';

interface EstimationData {
  projectName: string;
  projectDescription?: string;
  projectType: string;
  features: Array<{
    name: string;
    kind: string;
    complexity: string;
    count: number;
    fp?: number;
  }>;
  complexity: string;
  teamSize?: number;
  teamExperience: string;
  requirementsStability: number;
  architectureRework: number;
  testingRequirements: number;
  cicdMaturity: number;
  platformAvailability: number;
  domainFamiliarity: number;
  toolsEnvironment: number;
  scheduleCompression: number;
  costPerPersonMonth?: number;
  primaryStack?: string;
  projectShape?: string;
  requirementsStability_stability?: string;
  targetDuration?: number;
  managementReservePercent?: number;
  targetMarginPercent?: number;
}

export default function EstimatePage() {
  const [view, setView] = useState<'form' | 'report'>('form');
  const [estimationData, setEstimationData] = useState<EstimationData>({
    projectName: '',
    projectType: '',
    features: [],
    complexity: 'Medium',
    teamExperience: 'Mid',
    requirementsStability: 0,
    architectureRework: 0,
    testingRequirements: 0,
    cicdMaturity: 0,
    platformAvailability: 0,
    domainFamiliarity: 0,
    toolsEnvironment: 0,
    scheduleCompression: 0,
    costPerPersonMonth: 500000,
  });

  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: any) => {
    setEstimationData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddFeature = (feature: any) => {
    setEstimationData((prev) => ({
      ...prev,
      features: [...prev.features, feature],
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setEstimationData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        projectName: estimationData.projectName,
        projectDescription: estimationData.projectDescription,
        projectType: estimationData.projectType,
        features: estimationData.features.map((f) => ({
          name: f.name,
          hours: f.count * 40, // Approximate hours based on count
          complexity: f.complexity,
        })),
        complexity: estimationData.complexity,
        teamSize: estimationData.teamSize || 5,
        teamExperience: estimationData.teamExperience,
        requirementsStability: estimationData.requirementsStability,
        architectureRework: estimationData.architectureRework,
        testingRequirements: estimationData.testingRequirements,
        cicdMaturity: estimationData.cicdMaturity,
        platformAvailability: estimationData.platformAvailability,
        domainFamiliarity: estimationData.domainFamiliarity,
        toolsEnvironment: estimationData.toolsEnvironment,
        scheduleCompression: estimationData.scheduleCompression,
        costPerPersonMonth: estimationData.costPerPersonMonth || 500000,
      };

      const response = await estimationAPI.createEstimation(payload);

      if (response.success) {
        setResults({
          ...response.data,
          p50Cost: response.data.estimatedCost * 0.8,
          p80Cost: response.data.estimatedCost,
          p95Cost: response.data.estimatedCost * 1.25,
          peakStaffing: (response.data.staffingBreakdown?.totalHeadcount || 0) * 1.2,
          duration: estimationData.targetDuration || 6,
        });
        setView('report');
      } else {
        setError(response.error || 'Failed to calculate estimation');
      }
    } catch (err) {
      setError((err as Error).message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="estimate-page">
      {view === 'form' ? (
        <div className="form-view">
          <header className="estimate-header">
            <div className="header-content">
              <h1>EstiMate</h1>
              <p>Cost and staffing estimator</p>
            </div>
          </header>

          <EstimationForm
            data={estimationData}
            onInputChange={handleInputChange}
            onAddFeature={handleAddFeature}
            onRemoveFeature={handleRemoveFeature}
            features={estimationData.features}
            onCalculate={handleCalculate}
            loading={loading}
            error={error}
          />
        </div>
      ) : (
        <div className="report-view">
          <header className="estimate-header">
            <div className="header-content">
              <h1>EstiMate</h1>
              <p>Cost and staffing estimator Tool</p>
            </div>
            <div className="header-actions">
              <button className="back-btn" onClick={() => setView('form')}>
                ← Back to Form
              </button>
            </div>
          </header>

          <ResultsPanel data={results} estimationData={estimationData} />
        </div>
      )}
    </div>
  );
}