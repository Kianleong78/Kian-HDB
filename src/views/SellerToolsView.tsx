import React, { useState, useMemo } from 'react';
import {
  BadgeDollarSign,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Sparkles,
  Info,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { HDBProperty, NavigationTab } from '../types';

interface SellerToolsViewProps {
  selectedProperty: HDBProperty;
  setActiveTab: (tab: NavigationTab) => void;
}

export const SellerToolsView: React.FC<SellerToolsViewProps> = ({
  selectedProperty,
  setActiveTab,
}) => {
  const [sellingPrice, setSellingPrice] = useState<number>(selectedProperty.askingPrice);
  const [outstandingLoan, setOutstandingLoan] = useState<number>(240000);
  const [cpfPrincipalWithdrawn, setCpfPrincipalWithdrawn] = useState<number>(180000);
  const [accruedInterestYears, setAccruedInterestYears] = useState<number>(8);
  const [agentCommissionPct, setAgentCommissionPct] = useState<number>(2.0);
  const [resaleLevyAmount, setResaleLevyAmount] = useState<number>(0);
  const [legalFee, setLegalFee] = useState<number>(1800);

  // Computations
  const proceedsMath = useMemo(() => {
    // 2.5% compounded CPF accrued interest
    const totalCpfRefund = cpfPrincipalWithdrawn * Math.pow(1 + 0.025, accruedInterestYears);
    const accruedInterestOnly = totalCpfRefund - cpfPrincipalWithdrawn;

    // Agent fee + 9% GST
    const agentFee = sellingPrice * (agentCommissionPct / 100) * 1.09;

    // Total deductions
    const totalDeductions = outstandingLoan + totalCpfRefund + resaleLevyAmount + legalFee + agentFee;

    // Net Cash in Hand
    const netCashProceeds = Math.max(0, sellingPrice - totalDeductions);

    return {
      totalCpfRefund,
      accruedInterestOnly,
      agentFee,
      totalDeductions,
      netCashProceeds,
    };
  }, [sellingPrice, outstandingLoan, cpfPrincipalWithdrawn, accruedInterestYears, agentCommissionPct, resaleLevyAmount, legalFee]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
            <BadgeDollarSign className="w-3.5 h-3.5" />
            <span>Singapore Seller Financial Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Net Resale Cash Proceeds Calculator</h1>
          <p className="text-xs text-slate-400 mt-1">
            Deduct outstanding loans, CPF principal & 2.5% accrued interest refunds, resale levies, and legal fees accurately.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase">Subject Unit</div>
            <div className="text-xs font-bold text-white">Blk {selectedProperty.block} {selectedProperty.streetName}</div>
          </div>
          <button
            onClick={() => setActiveTab('analysis')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>Valuation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <DollarSign className="w-5 h-5 text-sky-400" />
            <span>Selling Parameters & Deductions</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Target Selling Price (Agreed Option Price)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">S$</span>
              <input
                type="number"
                id="seller-price"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-white pl-9 pr-3 py-2.5 rounded-xl text-sm font-mono font-bold focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Outstanding Housing Loan
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">S$</span>
                <input
                  type="number"
                  id="seller-loan"
                  value={outstandingLoan}
                  onChange={(e) => setOutstandingLoan(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 text-white pl-9 pr-3 py-2.5 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                CPF Principal Withdrawn
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">S$</span>
                <input
                  type="number"
                  id="seller-cpf-principal"
                  value={cpfPrincipalWithdrawn}
                  onChange={(e) => setCpfPrincipalWithdrawn(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 text-white pl-9 pr-3 py-2.5 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Holding Period</label>
              <select
                id="seller-years"
                value={accruedInterestYears}
                onChange={(e) => setAccruedInterestYears(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-xl px-2.5 py-2 focus:outline-none"
              >
                <option value={5}>5 Years (MOP)</option>
                <option value={8}>8 Years</option>
                <option value={10}>10 Years</option>
                <option value={15}>15 Years</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Agent Comm (% + GST)</label>
              <select
                id="seller-agent-comm"
                value={agentCommissionPct}
                onChange={(e) => setAgentCommissionPct(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-xl px-2.5 py-2 focus:outline-none"
              >
                <option value={1.0}>1.0% (+ 9% GST)</option>
                <option value={1.5}>1.5% (+ 9% GST)</option>
                <option value={2.0}>2.0% (+ 9% GST standard)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">HDB Resale Levy</label>
              <select
                id="seller-resale-levy"
                value={resaleLevyAmount}
                onChange={(e) => setResaleLevyAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-xl px-2.5 py-2 focus:outline-none"
              >
                <option value={0}>S$0 (1st Subsidised / None)</option>
                <option value={30000}>S$30,000 (3-Room)</option>
                <option value={40000}>S$40,000 (4-Room)</option>
                <option value={45000}>S$45,000 (5-Room)</option>
                <option value={50000}>S$50,000 (Executive)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Output: Net Cash & CPF Refund Summary */}
        <div className="lg:col-span-5 space-y-4">
          {/* Net Cash In Hand Hero Card */}
          <div className="bg-gradient-to-tr from-sky-950/80 to-slate-900 border border-sky-500/50 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-sky-400">Net Resale Cash Proceeds</span>
              <span className="text-xs bg-sky-500/20 text-sky-300 border border-sky-500/40 px-2.5 py-0.5 rounded-full font-bold">
                Actual Cash in Bank
              </span>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                S${Math.round(proceedsMath.netCashProceeds).toLocaleString()}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Net liquid cash unlocked after all official bank, CPF, and legal settlements.
              </p>
            </div>

            {/* Total CPF OA Refund */}
            <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase text-slate-400 font-semibold">Total CPF OA Refunded</div>
                <div className="text-base font-bold text-emerald-400 font-mono">
                  S${Math.round(proceedsMath.totalCpfRefund).toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase text-slate-400 font-semibold">Accrued Interest (2.5% p.a.)</div>
                <div className="text-xs font-bold text-slate-300 font-mono">
                  S${Math.round(proceedsMath.accruedInterestOnly).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Full Itemized Deductions Waterfall */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2.5 text-xs">
            <div className="font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">
              Itemized Transaction Deductions
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span>Gross Selling Price:</span>
              <span className="font-mono font-bold text-white">S${sellingPrice.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between text-red-400">
              <span>(-) Outstanding Housing Loan:</span>
              <span className="font-mono">-S${outstandingLoan.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between text-red-400">
              <span>(-) CPF OA Principal + 2.5% Accrued:</span>
              <span className="font-mono">-S${Math.round(proceedsMath.totalCpfRefund).toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between text-red-400">
              <span>(-) Agent Commission + 9% GST:</span>
              <span className="font-mono">-S${Math.round(proceedsMath.agentFee).toLocaleString()}</span>
            </div>

            {resaleLevyAmount > 0 && (
              <div className="flex items-center justify-between text-red-400">
                <span>(-) HDB Resale Levy:</span>
                <span className="font-mono">-S${resaleLevyAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-red-400">
              <span>(-) Legal Conveyancing Fee:</span>
              <span className="font-mono">-S${legalFee.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-slate-200 font-bold">
              <span>Total Deductions:</span>
              <span className="font-mono text-red-400">-S${Math.round(proceedsMath.totalDeductions).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
