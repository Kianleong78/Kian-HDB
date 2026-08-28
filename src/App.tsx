import React, { useState, useEffect } from 'react';
import { INITIAL_HDB_PROPERTIES } from './data/hdbProperties';
import { HDBProperty, NavigationTab } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { PropertySearchView } from './views/PropertySearchView';
import { PropertyAnalysisView } from './views/PropertyAnalysisView';
import { MarketTrendsView } from './views/MarketTrendsView';
import { ComparePropertiesView } from './views/ComparePropertiesView';
import { BuyerToolsView } from './views/BuyerToolsView';
import { SellerToolsView } from './views/SellerToolsView';
import { AgentProView } from './views/AgentProView';
import { AskAIView } from './views/AskAIView';
import { PricingView } from './views/PricingView';
import { FinalAIReportView } from './views/FinalAIReportView';
import { ValuationMethodologyView } from './views/ValuationMethodologyView';
import { DisqusCommunityView } from './views/DisqusCommunityView';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [properties] = useState<HDBProperty[]>(INITIAL_HDB_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState<HDBProperty>(INITIAL_HDB_PROPERTIES[0]);
  const [comparisonList, setComparisonList] = useState<HDBProperty[]>([
    INITIAL_HDB_PROPERTIES[0],
    INITIAL_HDB_PROPERTIES[1],
  ]);

  // Scroll to top on tab transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const toggleComparison = (prop: HDBProperty) => {
    setComparisonList((prev) => {
      const exists = prev.some((p) => p.id === prop.id);
      if (exists) {
        return prev.filter((p) => p.id !== prop.id);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), prop];
      }
      return [...prev, prop];
    });
  };

  const addToCompare = (prop: HDBProperty) => {
    setComparisonList((prev) => {
      if (prev.some((p) => p.id === prop.id)) return prev;
      if (prev.length >= 4) return [...prev.slice(1), prop];
      return [...prev, prop];
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        properties={properties}
        selectedProperty={selectedProperty}
        setSelectedProperty={setSelectedProperty}
        comparisonList={comparisonList}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            properties={properties}
            selectedProperty={selectedProperty}
            setSelectedProperty={setSelectedProperty}
            setActiveTab={setActiveTab}
            addToCompare={addToCompare}
          />
        )}

        {activeTab === 'search' && (
          <PropertySearchView
            properties={properties}
            selectedProperty={selectedProperty}
            setSelectedProperty={setSelectedProperty}
            setActiveTab={setActiveTab}
            comparisonList={comparisonList}
            toggleComparison={toggleComparison}
          />
        )}

        {activeTab === 'analysis' && (
          <PropertyAnalysisView
            property={selectedProperty}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'methodology' && (
          <ValuationMethodologyView
            selectedProperty={selectedProperty}
            onExploreProperty={() => setActiveTab('analysis')}
            onRunSearch={() => setActiveTab('search')}
          />
        )}

        {activeTab === 'community-discussions' && (
          <DisqusCommunityView
            properties={properties}
            selectedProperty={selectedProperty}
            setSelectedProperty={setSelectedProperty}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'trends' && (
          <MarketTrendsView
            properties={properties}
            setSelectedProperty={setSelectedProperty}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'compare' && (
          <ComparePropertiesView
            properties={properties}
            comparisonList={comparisonList}
            toggleComparison={toggleComparison}
            setSelectedProperty={setSelectedProperty}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'buyer-tools' && (
          <BuyerToolsView
            selectedProperty={selectedProperty}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'seller-tools' && (
          <SellerToolsView
            selectedProperty={selectedProperty}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'agent-pro' && (
          <AgentProView
            properties={properties}
            selectedProperty={selectedProperty}
            setSelectedProperty={setSelectedProperty}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'ask-ai' && (
          <AskAIView
            selectedProperty={selectedProperty}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'pricing' && (
          <PricingView setActiveTab={setActiveTab} />
        )}

        {activeTab === 'final-report' && (
          <FinalAIReportView
            property={selectedProperty}
            properties={properties}
            setSelectedProperty={setSelectedProperty}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
