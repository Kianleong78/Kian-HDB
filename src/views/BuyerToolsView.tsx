import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Percent,
  DollarSign,
  ShieldCheck,
  Zap,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Info,
  Layers,
  ChevronRight,
  ArrowRight,
  Sliders,
} from 'lucide-react';
import { HDBProperty, NavigationTab } from '../types';

interface BuyerToolsViewProps {
  selectedProperty: HDBProperty;
  setActiveTab: (tab: NavigationTab) => void;
}

export const BuyerToolsView: React.FC<BuyerToolsViewProps> = ({
  selectedProperty,
  setActiveTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'affordability' | 'simulator'>('affordability');

  // Affordability Calculator State
  const [monthlyIncome, setMonthlyIncome] = useState<number>(8500);
  const [cpfOaBalance, setCpfOaBalance] = useState<number>(120000);
  const [cashSavings, setCashSavings] = useState<number>(50000);
  const [monthlyDebts, setMonthlyDebts] = useState<number>(600);
  const [buyerType, setBuyerType] = useState<'couple' | 'single' | 'joint_single'>('couple');
  const [isFirstTimer, setIsFirstTimer] = useState<boolean>(true);
  const [nearParents, setNearParents] = useState<boolean>(true);
  const [loanType, setLoanType] = useState<'hdb' | 'bank'>('hdb');
  const [tenureYears, setTenureYears] = useState<number>(25);

  // What-If Simulator State
  const [simBasePrice, setSimBasePrice] = useState<number>(selectedProperty.askingPrice);
  const [rateStressPct, setRateStressPct] = useState<number>(0);
  const [mrtCompletionAppreciationPct, setMrtCompletionAppreciationPct] = useState<number>(5);
  const [holdingYears, setHoldingYears] = useState<number>(5);

  // Calculate EHG, Family Grant & PHG based on income & eligibility
  const grantBreakdown = useMemo(() => {
    let ehg = 0;
    let family = 0;
    let phg = 0;

    if (isFirstTimer) {
      if (buyerType === 'couple') {
        // EHG scale for couple (income ceiling 9k)
        if (monthlyIncome <= 1500) ehg = 80000;
        else if (monthlyIncome <= 3000) ehg = 65000;
        else if (monthlyIncome <= 5000) ehg = 50000;
        else if (monthlyIncome <= 7000) ehg = 35000;
        else if (monthlyIncome <= 9000) ehg = 20000;
        else ehg = 0;

        // CPF Housing Grant (Family Grant): $80k for 2-4 room, $50k for 5-room/Executive
        family = 80000;

        // Proximity Housing Grant: $30k to live with/near parents within 4km
        if (nearParents) phg = 30000;
      } else {
        // Single scheme
        if (monthlyIncome <= 2500) ehg = 40000;
        else if (monthlyIncome <= 4500) ehg = 25000;
        else ehg = 0;
        family = 40000;
        if (nearParents) phg = 15000;
      }
    }

    const totalGrants = ehg + family + phg;
    return { ehg, family, phg, totalGrants };
  }, [monthlyIncome, isFirstTimer, buyerType, nearParents]);

  // Max Loan based on MSR 30% and TDSR 55%
  const loanCalculations = useMemo(() => {
    const interestRate = loanType === 'hdb' ? 0.026 : 0.031;
    const maxMsrMonthlyPayment = monthlyIncome * 0.30;
    const maxTdsrMonthlyPayment = monthlyIncome * 0.55 - monthlyDebts;
    const allowableMonthlyInstallment = Math.min(maxMsrMonthlyPayment, maxTdsrMonthlyPayment);

    // Present value formula for mortgage loan amount
    const r = interestRate / 12;
    const n = tenureYears * 12;
    const maxLoanAmount = allowableMonthlyInstallment * ((1 - Math.pow(1 + r, -n)) / r);

    // Max purchase price allowed by loan + downpayment (80% HDB or 75% Bank)
    const ltvRatio = loanType === 'hdb' ? 0.80 : 0.75;
    const maxAffordablePriceFromLoan = maxLoanAmount / ltvRatio;

    // Capital constraint = (CPF OA + Cash + Grants) / (1 - LTV)
    const availableDownpayment = cpfOaBalance + cashSavings + grantBreakdown.totalGrants;
    const maxAffordablePriceFromCapital = availableDownpayment / (1 - ltvRatio);

    const maxPropertyPrice = Math.min(maxAffordablePriceFromLoan, maxAffordablePriceFromCapital);

    // BSD for selected property
    const calculateBsd = (price: number) => {
      let bsd = 0;
      if (price <= 180000) bsd = price * 0.01;
      else if (price <= 360000) bsd = 1800 + (price - 180000) * 0.02;
      else if (price <= 1000000) bsd = 1800 + 3600 + (price - 360000) * 0.03;
      else if (price <= 1500000) bsd = 1800 + 3600 + 19200 + (price - 1000000) * 0.04;
      else bsd = 1800 + 3600 + 19200 + 20000 + (price - 1500000) * 0.05;
      return bsd;
    };

    const targetBsd = calculateBsd(selectedProperty.askingPrice);

    return {
      interestRate,
      maxLoanAmount,
      allowableMonthlyInstallment,
      maxPropertyPrice,
      targetBsd,
      ltvRatio,
    };
  }, [monthlyIncome, monthlyDebts, loanType, tenureYears, cpfOaBalance, cashSavings, grantBreakdown, selectedProperty.askingPrice]);

  // What-If Simulator Math
  const simulatorMath = useMemo(() => {
    const baseInterest = 0.026 + rateStressPct / 100;
    const loanVal = simBasePrice * 0.8;
    const r = baseInterest / 12;
    const n = 25 * 12;
    const monthlyInstallment = loanVal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    // Projected future property value after holdingYears
    // Base annual appreciation 2.5% + MRT catalyst - lease decay penalty
    const annualAppreciation = 0.025 + (mrtCompletionAppreciationPct / 100) / holdingYears;
    const leaseDecayDiscountFactor = holdingYears >= 5 ? 0.98 : 1.0;
    const projectedFutureVal = simBasePrice * Math.pow(1 + annualAppreciation, holdingYears) * leaseDecayDiscountFactor;
    const projectedCapitalGain = projectedFutureVal - simBasePrice;

    return {
      monthlyInstallment,
      projectedFutureVal,
      projectedCapitalGain,
    };
  }, [simBasePrice, rateStressPct, mrtCompletionAppreciationPct, holdingYears]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            <span>Singapore Buyer Financial Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">HDB Affordability & What-If Simulator</h1>
          <p className="text-xs text-slate-400 mt-1">
            Compute official CPF Housing Grants (EHG, Family, PHG), MSR 30% limits, Stamp Duty (BSD), and stress-test interest rates.
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="bg-slate-900 p-1.5 rounded-2xl flex items-center border border-slate-800 text-xs">
          <button
            id="subtab-affordability"
            onClick={() => setActiveSubTab('affordability')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'affordability' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Affordability & Grants</span>
          </button>
          <button
            id="subtab-simulator"
            onClick={() => setActiveSubTab('simulator')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'simulator' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>What-If Price Simulator</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'affordability' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Inputs */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>Buyer Financial Profile</span>
            </h3>

            {/* Income & Debts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Monthly Household Gross Income
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">S$</span>
                  <input
                    type="number"
                    id="calc-income"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 text-white pl-9 pr-3 py-2.5 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Existing Monthly Debt Obligations
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">S$</span>
                  <input
                    type="number"
                    id="calc-debts"
                    value={monthlyDebts}
                    onChange={(e) => setMonthlyDebts(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 text-white pl-9 pr-3 py-2.5 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* CPF OA Balance & Cash */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Combined CPF OA Balance
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">S$</span>
                  <input
                    type="number"
                    id="calc-cpf-oa"
                    value={cpfOaBalance}
                    onChange={(e) => setCpfOaBalance(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 text-white pl-9 pr-3 py-2.5 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Available Liquid Cash Savings
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">S$</span>
                  <input
                    type="number"
                    id="calc-cash"
                    value={cashSavings}
                    onChange={(e) => setCashSavings(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 text-white pl-9 pr-3 py-2.5 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Scheme & Eligibility Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Applicant Type</label>
                <select
                  id="calc-applicant-type"
                  value={buyerType}
                  onChange={(e) => setBuyerType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-xl px-2.5 py-2 focus:outline-none"
                >
                  <option value="couple">Married Couple (SC/SC)</option>
                  <option value="single">Single Citizen (&ge;35 yrs)</option>
                  <option value="joint_single">Joint Singles Scheme</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Loan Package</label>
                <select
                  id="calc-loan-type"
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-xl px-2.5 py-2 focus:outline-none"
                >
                  <option value="hdb">HDB Concessionary (2.6%)</option>
                  <option value="bank">Commercial Bank (3.1%)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Tenure (Years)</label>
                <select
                  id="calc-tenure"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-xl px-2.5 py-2 focus:outline-none"
                >
                  <option value={20}>20 Years</option>
                  <option value={25}>25 Years (Standard)</option>
                  <option value={30}>30 Years (Bank Max)</option>
                </select>
              </div>
            </div>

            {/* Checkbox Grants */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  id="calc-first-timer"
                  checked={isFirstTimer}
                  onChange={(e) => setIsFirstTimer(e.target.checked)}
                  className="rounded accent-emerald-400"
                />
                <span>First-Timer Applicant (Eligible for Full Grants)</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  id="calc-near-parents"
                  checked={nearParents}
                  onChange={(e) => setNearParents(e.target.checked)}
                  className="rounded accent-emerald-400"
                />
                <span>Within 4km of Parents (PHG Grant S$30,000)</span>
              </label>
            </div>
          </div>

          {/* Right Column: Computed Affordability & Breakdown */}
          <div className="lg:col-span-5 space-y-4">
            {/* Total Maximum Property Purchase Power Box */}
            <div className="bg-gradient-to-tr from-emerald-950/80 to-slate-900 border border-emerald-500/50 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Maximum Affordability Ceiling</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  MSR 30% Safe
                </span>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                  S${Math.round(loanCalculations.maxPropertyPrice).toLocaleString()}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Maximum recommended purchase price based on your current income and CPF capital.
                </p>
              </div>

              {/* Monthly Installment */}
              <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase text-slate-400 font-semibold">Max Monthly Installment (MSR 30%)</div>
                  <div className="text-lg font-bold text-white font-mono">
                    S${Math.round(loanCalculations.allowableMonthlyInstallment).toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ mo</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase text-slate-400 font-semibold">Max Loan Eligible</div>
                  <div className="text-base font-bold text-emerald-400 font-mono">
                    S${Math.round(loanCalculations.maxLoanAmount).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* CPF Grants Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Estimated Government Housing Grants</span>
                <span className="text-base font-black text-emerald-400 font-mono">
                  S${grantBreakdown.totalGrants.toLocaleString()}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Enhanced CPF Housing Grant (EHG):</span>
                  <span className="font-mono font-bold text-white">S${grantBreakdown.ehg.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>CPF Family Housing Grant:</span>
                  <span className="font-mono font-bold text-white">S${grantBreakdown.family.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Proximity Housing Grant (PHG):</span>
                  <span className="font-mono font-bold text-white">S${grantBreakdown.phg.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Target Property Stress Check */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2 text-xs">
              <div className="text-xs font-bold text-white uppercase tracking-wider">Target Unit Compatibility</div>
              <div className="text-slate-300">
                Active Property: <strong className="text-white">Blk {selectedProperty.block} {selectedProperty.streetName}</strong>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">Asking Price:</span>
                <span className="font-mono font-bold text-white">S${selectedProperty.askingPrice.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Buyer’s Stamp Duty (BSD):</span>
                <span className="font-mono font-bold text-amber-300">S${Math.round(loanCalculations.targetBsd).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                <span className="text-slate-300 font-semibold">Affordability Status:</span>
                <span className={`font-bold ${loanCalculations.maxPropertyPrice >= selectedProperty.askingPrice ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {loanCalculations.maxPropertyPrice >= selectedProperty.askingPrice ? '✓ 100% Fully Affordable' : '⚠️ Stretch Budget Needed'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* What-If Price Simulator */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white">Future Value & Mortgage Stress Simulator</h3>
            <p className="text-xs text-slate-400 mt-1">
              Simulate interest rate shocks, new infrastructure catalysts (Thomson-East Coast / Cross Island Line), and lease decay projections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Input Controls */}
            <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Base Property Price: S${simBasePrice.toLocaleString()}
                </label>
                <input
                  type="range"
                  id="sim-price"
                  min={400000}
                  max={1500000}
                  step={25000}
                  value={simBasePrice}
                  onChange={(e) => setSimBasePrice(Number(e.target.value))}
                  className="w-full accent-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Interest Rate Stress Shock: +{rateStressPct.toFixed(1)}% (Total {(2.6 + rateStressPct).toFixed(1)}%)
                </label>
                <input
                  type="range"
                  id="sim-rate"
                  min={0}
                  max={3.0}
                  step={0.25}
                  value={rateStressPct}
                  onChange={(e) => setRateStressPct(Number(e.target.value))}
                  className="w-full accent-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  MRT / Amenity Infrastructure Catalyst: +{mrtCompletionAppreciationPct}%
                </label>
                <input
                  type="range"
                  id="sim-mrt"
                  min={0}
                  max={15}
                  step={1}
                  value={mrtCompletionAppreciationPct}
                  onChange={(e) => setMrtCompletionAppreciationPct(Number(e.target.value))}
                  className="w-full accent-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Holding Period: {holdingYears} Years
                </label>
                <input
                  type="range"
                  id="sim-holding"
                  min={3}
                  max={15}
                  step={1}
                  value={holdingYears}
                  onChange={(e) => setHoldingYears(Number(e.target.value))}
                  className="w-full accent-emerald-400"
                />
              </div>
            </div>

            {/* Simulated Outcomes */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Simulated Monthly Payment</span>
                  <div className="text-2xl font-black text-white font-mono mt-2">
                    S${Math.round(simulatorMath.monthlyInstallment).toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ mo</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Includes +{rateStressPct.toFixed(1)}% interest shock over 25-year tenure.
                  </p>
                </div>
                <div className="text-xs text-emerald-400 font-medium mt-4">
                  CPF OA Monthly Contribution covers up to S$1,650/pax.
                </div>
              </div>

              <div className="bg-emerald-950/20 p-5 rounded-2xl border border-emerald-500/40 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    Projected Value in {holdingYears} Years
                  </span>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-2">
                    S${Math.round(simulatorMath.projectedFutureVal).toLocaleString()}
                  </div>
                  <div className="text-xs font-bold text-emerald-300 mt-1">
                    +{Math.round(simulatorMath.projectedCapitalGain).toLocaleString()} Estimated Capital Gain
                  </div>
                  <p className="text-xs text-slate-300 mt-2">
                    Adjusted for Bala's lease decay and infrastructure appreciation premium.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
