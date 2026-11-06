// Simple estimation service without complex Prisma imports
export interface EstimationInput {
  projectName: string;
  projectDescription?: string;
  projectType: string;
  features: { name: string; hours: number; complexity: string }[];
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
}

export class EstimationService {
  // Calculate base effort in hours from features
  private calculateBaseEffort(features: any[], complexity: string): number {
    const multipliers: { [key: string]: number } = {
      Low: 1.0,      // Simple CRUD features
      Medium: 1.3,   // Features with business logic
      High: 1.6,     // Complex features with integrations
    };

    const baseHours = features.reduce((sum, f) => {
      return sum + (f.hours || 40); // Default 40 hours per feature
    }, 0);

    return baseHours * (multipliers[complexity] || 1.0);
  }

  // Calculate adjustment factor from input parameters
  private calculateAdjustmentFactor(adjustments: any): number {
    const factors = Object.values(adjustments);
    const totalAdjustment = (factors as number[]).reduce((sum, val) => sum + val, 0);
    const avgAdjustment = totalAdjustment / factors.length;
    return Math.max(0.85, Math.min(1 + avgAdjustment * 0.15, 1.5));
  }

  // Calculate risk and management reserves in hours
  private calculateReserves(estimatedHours: number, complexity: string) {
    const riskMap: { [key: string]: number } = {
      Low: 0.1,
      Medium: 0.2,
      High: 0.35,
    };

    const contingency = estimatedHours * (riskMap[complexity] || 0.2);
    const management = estimatedHours * 0.07;

    return {
      contingencyReserve: contingency,
      managementReserve: management,
    };
  }

  // Main calculation
  async createEstimation(input: EstimationInput) {
    try {
      const baseEffortHours = this.calculateBaseEffort(input.features, input.complexity);
      const adjustmentFactor = this.calculateAdjustmentFactor({
        requirementsStability: input.requirementsStability,
        architectureRework: input.architectureRework,
        testingRequirements: input.testingRequirements,
        cicdMaturity: input.cicdMaturity,
        platformAvailability: input.platformAvailability,
        domainFamiliarity: input.domainFamiliarity,
        toolsEnvironment: input.toolsEnvironment,
        scheduleCompression: input.scheduleCompression,
      });

      // 1. Total Effort calculated strictly in Working Hours
      const totalHours = Math.round(baseEffortHours * adjustmentFactor);
      
      // Default duration (e.g., 3 months)
      const projectDuration = 3; 

      // 2. Effort Breakdown by Role (in Working Hours)
      const effortBreakdown = {
        backend: totalHours * 0.3,
        frontend: totalHours * 0.28,
        qa: totalHours * 0.18,
        devops: totalHours * 0.08,
        design: totalHours * 0.1,
        pm: totalHours * 0.06,
      };

      // 3. Phase Breakdown (in Working Hours)
      const phaseBreakdown = {
        requirements: totalHours * 0.1,
        design: totalHours * 0.15,
        implementation: totalHours * 0.5,
        testing: totalHours * 0.2,
        deployment: totalHours * 0.05,
      };

      // Standard monthly capacity per full-time person (160 hours / month)
      const hoursPerPersonMonth = 160; 

      // 4. Staffing Breakdown (Average full-time equivalent headcount per role over duration)
      const staffingBreakdown = {
        backendDevelopers: Math.round((effortBreakdown.backend / (projectDuration * hoursPerPersonMonth)) * 10) / 10,
        frontendDevelopers: Math.round((effortBreakdown.frontend / (projectDuration * hoursPerPersonMonth)) * 10) / 10,
        qaEngineers: Math.round((effortBreakdown.qa / (projectDuration * hoursPerPersonMonth)) * 10) / 10,
        devOpsEngineers: Math.round((effortBreakdown.devops / (projectDuration * hoursPerPersonMonth)) * 10) / 10,
        designers: Math.round((effortBreakdown.design / (projectDuration * hoursPerPersonMonth)) * 10) / 10,
        projectManagers: Math.round((effortBreakdown.pm / (projectDuration * hoursPerPersonMonth)) * 10) / 10,
      };

      // Average Team Size in FTE (Full-Time Equivalent people)
      const averageTeamSize = Math.round((totalHours / (projectDuration * hoursPerPersonMonth)) * 10) / 10;

      // Financials
      const costPerPersonMonth = input.costPerPersonMonth || 10000;
      const hourlyRate = costPerPersonMonth / hoursPerPersonMonth; // Hourly cost based on salary

      const reserves = this.calculateReserves(totalHours, input.complexity);
      const baseCost = totalHours * hourlyRate;
      const contingencyCost = reserves.contingencyReserve * hourlyRate;
      const managementCost = reserves.managementReserve * hourlyRate;
      const estimatedCost = baseCost + contingencyCost + managementCost;

      return {
        projectName: input.projectName,
        estimatedHours: totalHours,
        totalHours: totalHours,               // Clear total hours spent
        estimatedCost: estimatedCost,
        averageTeamSize: averageTeamSize,     // Dynamic team size (e.g. 0.5 = part-time / half capacity)
        duration: projectDuration,
        effortBreakdown,
        phaseBreakdown,
        staffingBreakdown,
        contingencyReserve: contingencyCost,
        managementReserve: managementCost,
        costPerPersonMonth,
      };
    } catch (error) {
      console.error('Error in estimation:', error);
      throw error;
    }
  }

  async getEstimation(id: string) {
    return { id, message: 'Get estimation - to be implemented' };
  }

  async getEstimations(skip = 0, take = 10) {
    return [];
  }

  async updateEstimation(id: string, input: any) {
    return { id, message: 'Update estimation - to be implemented' };
  }

  async deleteEstimation(id: string) {
    return { id, message: 'Delete estimation - to be implemented' };
  }
}

export const estimationService = new EstimationService();