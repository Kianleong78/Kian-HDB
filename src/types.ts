export type NavigationTab =
  | 'home'
  | 'search'
  | 'analysis'
  | 'methodology'
  | 'community-discussions'
  | 'trends'
  | 'compare'
  | 'buyer-tools'
  | 'seller-tools'
  | 'agent-pro'
  | 'ask-ai'
  | 'pricing'
  | 'final-report';

export type UserPersona = 'first-timer' | 'seller' | 'agent' | 'investor';

export type AmenityCategory =
  | 'mrt'
  | 'bus'
  | 'school_pri'
  | 'school_sec'
  | 'childcare'
  | 'mall'
  | 'supermarket'
  | 'hawker'
  | 'market'
  | 'healthcare'
  | 'park'
  | 'community'
  | 'sports'
  | 'library';

export interface Amenity {
  id: string;
  name: string;
  category: AmenityCategory;
  distanceMeters: number;
  walkingMinutes: number;
  highlight?: string;
  lat?: number;
  lng?: number;
  rating?: number;
}

export interface LocationScoreBreakdown {
  transport: number;
  schools: number;
  shopping: number;
  food: number;
  healthcare: number;
  recreation: number;
  convenience: number;
  overallLocationScore: number;
}

export interface ComparableTransaction {
  id: string;
  block: string;
  streetName: string;
  storeyRange: string;
  sqm: number;
  sqft: number;
  transactedPrice: number;
  pricePsf: number;
  transactionDate: string; // e.g. "Jan 2026"
  distanceMeters: number;
  model: string;
}

export interface HistoricalPriceTrend {
  year: string;
  avgPsf: number;
  townAvgPsf: number;
  sgNationalAvgPsf: number;
  annualVolume: number;
}

export interface HDBProperty {
  id: string;
  block: string;
  streetName: string;
  town: string;
  postalCode: string;
  lat?: number;
  lng?: number;
  flatType: '2-Room' | '3-Room' | '4-Room' | '5-Room' | 'Executive' | 'Multi-Gen';
  model: string; // Model A, Improved, Premium Apartment, DBSS, Maisonette, Standard
  sqm: number;
  sqft: number;
  floorLevel: string; // e.g. "#15-180 (High Floor)"
  floorCategory: 'Low (01-04)' | 'Mid (05-10)' | 'High (11-20)' | 'Very High (21+)';
  leaseCommenceDate: number; // e.g. 2018
  remainingLease: number; // e.g. 91 (calculated)
  askingPrice: number;
  aiValuation: number;
  fairPriceMin: number;
  fairPriceMax: number;
  pricePsf: number;
  aiMarketScore: number; // 0-100
  aiConfidenceScore: number; // 0-100 (e.g. 94%)
  buyerSuggestedOffer: {
    aggressive: number;
    fair: number;
    ceiling: number;
  };
  sellerSuggestedListing: {
    quickSale: number;
    marketTarget: number;
    premium: number;
  };
  verdict: 'Good Value' | 'Fairly Priced' | 'Above Market' | 'Strong Growth' | 'Monitor';
  locationScores: LocationScoreBreakdown;
  amenities: Amenity[];
  comparables: ComparableTransaction[];
  historicalTrends: HistoricalPriceTrend[];
  imageUrl?: string;
  tags: string[];
  mrtStation: string;
  mrtDistance: number;
  topSchool: string;
  schoolDistance: number;
  mallNear: string;
  mallDistance: number;
  description: string;
  balasCurveRetentionPct: number;
  projected5YrGrowthPct: number;
  orientation: string; // North-South Facing
  renovationEstimate: number; // S$35,000
}

export interface AIPropertyReport {
  executiveVerdict: 'Good Value' | 'Fairly Priced' | 'Above Market' | 'Strong Growth' | 'Monitor';
  overallScore: number; // 0 - 100
  oneSentenceSummary: string;
  bottomLineRecommendation: string;
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  buyerStrategy: {
    recommendedOffer: number;
    maxCeiling: number;
    negotiationTactic: string;
  };
  sellerStrategy: {
    recommendedListingPrice: number;
    expectedDaysOnMarket: number;
    targetBuyerProfile: string;
  };
  leaseDecayAssessment: string;
  fiveYearGrowthForecastPct: number;
}

export interface TownMarketStat {
  town: string;
  region: 'Central' | 'East' | 'North' | 'North-East' | 'West';
  matureStatus: 'Mature' | 'Non-Mature';
  median3RoomPrice: number;
  median4RoomPrice: number;
  median5RoomPrice: number;
  avgPsf: number;
  yoyGrowthPct: number;
  quarterlyVolume: number;
  millionDollarCount: number;
  aiDemandHeat: 'Very High' | 'High' | 'Moderate' | 'Balanced';
}

export interface BuyerAffordabilityInputs {
  applicant1Income: number;
  applicant2Income: number;
  applicant1Age: number;
  applicant2Age: number;
  citizenship: 'Citizen+Citizen' | 'Citizen+PR' | 'Single Citizen' | 'Joint Singles';
  flatTypeSelected: '3-Room' | '4-Room' | '5-Room' | 'Executive';
  isFirstTimer: boolean;
  livingNearParents: boolean; // For PHG
  cpfOABalance: number;
  cashSavings: number;
  existingMonthlyDebt: number; // Car loans, study loans
  loanType: 'HDB' | 'Bank';
  bankInterestRate: number; // e.g. 2.8%
  loanTenureYears: number; // e.g. 25
}

export interface BuyerAffordabilityResult {
  maxPurchasePrice: number;
  maxLoanAmount: number;
  totalGrantsEligible: {
    ehg: number;
    familyGrant: number;
    phg: number;
    total: number;
  };
  minCashRequired: number;
  minCpfRequired: number;
  estimatedMonthlyMortgage: number;
  msrUtilizationPct: number;
  tdsrUtilizationPct: number;
  bsdStampDuty: number;
  isAffordable: boolean;
  adviceNotes: string[];
}

export interface SellerProceedsInputs {
  sellingPrice: number;
  outstandingMortgage: number;
  cpfPrincipalUsed: number;
  cpfAccruedInterest: number;
  resaleLevy: number;
  agentCommissionPct: number; // e.g. 2%
  legalFees: number;
}

export interface SellerProceedsResult {
  grossSellingPrice: number;
  outstandingLoanDeduction: number;
  cpfRefundToOA: number;
  resaleLevyDeduction: number;
  agentFeeWithGst: number;
  legalFeeDeduction: number;
  netCashProceeds: number;
  totalCpfReturned: number;
  capitalGainEstimated: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  quickActions?: { label: string; action: string }[];
}

declare global {
  interface Window {
    disqus_config?: any;
    DISQUS?: {
      reset: (options: { reload: boolean; config?: any }) => void;
    };
  }
}
