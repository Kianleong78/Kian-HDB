import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  RotateCcw,
  Building2,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Info,
} from 'lucide-react';
import { HDBProperty, NavigationTab } from '../types';

interface AskAIViewProps {
  selectedProperty: HDBProperty;
  setActiveTab: (tab: NavigationTab) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  'What is Cash-Over-Valuation (COV) and how can I avoid paying it for this unit?',
  'Am I eligible for the S$80k Enhanced CPF Housing Grant (EHG) and Proximity Grant?',
  'Compare 40-year lease decay vs a 95-year new flat in terms of resale exit value.',
  'Explain the new Standard vs Plus vs Prime (PLH) 10-year MOP rules.',
  'How does MSR 30% and TDSR 55% restrict my maximum loan eligibility?',
];

export const AskAIView: React.FC<AskAIViewProps> = ({ selectedProperty, setActiveTab }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I am your **HDB Insight AI Property Assistant**.\n\nI have loaded the full data for **Blk ${selectedProperty.block} ${selectedProperty.streetName} (${selectedProperty.town})** — including asking price S$${selectedProperty.askingPrice.toLocaleString()}, AI base valuation S$${selectedProperty.aiValuation.toLocaleString()}, remaining lease of ${selectedProperty.remainingLease} years, and 14 nearby amenities.\n\nHow can I assist your property decision today? You can ask about grants, mortgage calculations, COV risks, or negotiation tactics.`,
      timestamp: 'Just now',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (promptToSend?: string) => {
    const query = promptToSend || inputPrompt;
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          propertyContext: selectedProperty,
          conversationHistory: messages.map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            text: m.content,
          })),
        }),
      });

      const data = await response.json();
      const assistantReply = data.reply || 'I analyzed the HDB market data for your query.';

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: assistantReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Here is the AI advisory based on Singapore HDB guidelines:\n\nFor **Blk ${selectedProperty.block} ${selectedProperty.streetName}**, the asking price of S$${selectedProperty.askingPrice.toLocaleString()} is evaluated as **${selectedProperty.verdict}** against the base valuation of S$${selectedProperty.aiValuation.toLocaleString()}.\n\nEnsure you obtain your official HFE (HDB Flat Eligibility) letter to confirm your loan quota and CPF housing grants before exercising an Option to Purchase (OTP).`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Conversation reset. I am ready to analyze any HDB property or policy question for you.`,
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <Bot className="w-3.5 h-3.5" />
            <span>Gemini Intelligence Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Ask AI Property Assistant</h1>
          <p className="text-xs text-slate-400 mt-1">
            Grounded in Singapore HDB regulations, CPF financing limits, MSR/TDSR criteria, and live valuation data.
          </p>
        </div>

        {/* Active Context Unit */}
        <div className="bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-2xl flex items-center gap-3 text-xs">
          <div>
            <div className="text-[10px] text-slate-400">Context Flat:</div>
            <div className="font-bold text-white">Blk {selectedProperty.block} {selectedProperty.streetName}</div>
          </div>
          <button
            id="clear-chat-btn"
            onClick={handleClear}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Reset Chat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Question Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap uppercase tracking-wider">
          Suggested:
        </span>
        {QUICK_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            id={`quick-prompt-${i}`}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white whitespace-nowrap transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col h-[560px]">
        {/* Messages scroll area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg, idx) => {
            const isAI = msg.role === 'assistant';
            return (
              <div
                key={idx}
                className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                    isAI
                      ? 'bg-slate-950/80 border border-slate-800 text-slate-200 shadow-md'
                      : 'bg-emerald-500 text-slate-950 font-medium shadow-lg'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  <div
                    className={`text-[10px] mt-2 ${
                      isAI ? 'text-slate-500' : 'text-slate-900/60'
                    } text-right`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {!isAI && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl text-xs text-emerald-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Gemini is analyzing HDB datasets & calculating advice...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            id="ask-ai-input"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask anything about HDB valuations, CPF grants, COV, or loan rules..."
            disabled={isLoading}
            className="flex-1 bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-emerald-500 placeholder-slate-500"
          />

          <button
            type="submit"
            id="ask-ai-submit-btn"
            disabled={isLoading || !inputPrompt.trim()}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 p-3 rounded-xl font-bold transition-colors flex items-center justify-center shadow-lg shadow-emerald-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
