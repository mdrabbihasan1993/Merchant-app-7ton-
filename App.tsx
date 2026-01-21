
import React, { useState, useCallback } from 'react';
import { 
  LayoutDashboard, Package, Truck, Wallet, User, Bell, Plus, 
  Clock, CheckCircle2, ArrowRightLeft, XCircle, RotateCcw, 
  RefreshCw, Zap, ArrowLeft, FileText, LifeBuoy, Settings, 
  AlertCircle, ShieldAlert, Activity, Info, Sparkles, ShieldCheck, 
  Loader2, Ban, History, ChevronDown, ChevronUp, ChevronRight,
  Camera, FilePlus, BrainCircuit, Trophy
} from 'lucide-react';
import { COLORS, DASHBOARD_STATS, PAYMENT_STATS } from './constants';
import { TabType, StatItem } from './types';
import { analyzeBusinessPerformance, checkFraudRisk } from './geminiService';

// --- Helper Components ---

const Logo: React.FC = () => (
  <div className="flex items-center space-x-2">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: COLORS.darkBlue }}>
      <span className="text-white font-black text-xl italic">7</span>
    </div>
    <div>
      <h2 className="text-lg font-black leading-none tracking-tighter" style={{ color: COLORS.darkBlue }}>
        ton<span style={{ color: COLORS.orange }}>Express</span>
      </h2>
      <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-400">Logistics Solutions</p>
    </div>
  </div>
);

const StatCard: React.FC<{ item: StatItem }> = ({ item }) => (
  <div className="bg-white p-2.5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-24 transition-all hover:border-gray-200">
    <div className="flex justify-between items-start">
      <div 
        className="p-1.5 rounded-lg" 
        style={{ 
          backgroundColor: item.isOrange ? `${COLORS.orange}15` : `${COLORS.darkBlue}15`, 
          color: item.isOrange ? COLORS.orange : COLORS.darkBlue 
        }}
      >
        <item.icon size={16} />
      </div>
    </div>
    <div>
      <p className="text-[8px] text-gray-400 font-bold tracking-wider uppercase truncate">{item.title}</p>
      <p className="text-sm font-extrabold text-gray-900 leading-tight">{item.value}</p>
    </div>
  </div>
);

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center space-y-1.5 transition-all duration-300 ${active ? 'opacity-100' : 'opacity-40'}`} 
    style={{ color: '#ffffff' }}
  >
    <Icon size={22} strokeWidth={active ? 2.5 : 2} />
    <span className={`text-[9px] font-black uppercase tracking-widest`}>{label}</span>
  </button>
);

// --- Main App Component ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);
  const [isPaymentExpanded, setIsPaymentExpanded] = useState(false);
  
  // AI States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [fraudPhone, setFraudPhone] = useState('');
  const [fraudResult, setFraudResult] = useState<string | null>(null);

  const handleAnalyzeBusiness = async () => {
    setAiLoading(true);
    const context = "Total parcels: 1284, Pending: 342, Delivered: 942, Hold: 8, Success Rate: 94.2%, Return Rate: 3.8%, Invoices: 42 (Paid: 30, Unpaid: 12)";
    const result = await analyzeBusinessPerformance(context);
    setAiInsight(result);
    setAiLoading(false);
  };

  const handleFraudCheck = async () => {
    if (!fraudPhone) return;
    setAiLoading(true);
    const result = await checkFraudRisk(fraudPhone);
    setFraudResult(result);
    setAiLoading(false);
  };

  const renderHomeContent = () => (
    <div className="space-y-6 pb-32 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center pt-2">
        <Logo />
        <div className="flex items-center space-x-2">
          <button onClick={() => setActiveTab('invoices')} className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
            <div className="p-1 rounded-full bg-orange-50 text-[#ff751f]"><Wallet size={14} /></div>
            <span className="text-[11px] font-black text-gray-700">৳45.6k</span>
          </button>
          <button className="relative p-2.5 bg-white rounded-full border border-gray-100 shadow-sm text-gray-500">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#ff751f] rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold text-gray-800">Hi, John! 👋</h1>
          <p className="text-xs text-gray-500 font-medium">Business is healthy today.</p>
        </div>
        <button 
          onClick={handleAnalyzeBusiness}
          className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg shadow-indigo-200 hover:scale-105 active:scale-95 transition-all"
        >
          <Sparkles size={20} />
        </button>
      </div>

      {aiInsight && (
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-3xl animate-in slide-in-from-top-4 duration-500">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-2 text-indigo-600">
              <Sparkles size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.1em]">AI Business Insight</span>
            </div>
            <button onClick={() => setAiInsight(null)} className="text-indigo-400 hover:text-indigo-600"><XCircle size={14} /></button>
          </div>
          <div className="text-xs text-indigo-900 leading-relaxed font-medium whitespace-pre-line prose prose-sm">{aiInsight}</div>
        </div>
      )}

      {/* Performance Dashboard Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Performance Dashboard</h3>
          <button onClick={() => setIsStatsExpanded(!isStatsExpanded)} className="flex items-center text-[10px] font-bold text-[#1a3762] uppercase tracking-wider">
            {isStatsExpanded ? 'Show Less' : 'Show All'}
            {isStatsExpanded ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {DASHBOARD_STATS.slice(0, isStatsExpanded ? DASHBOARD_STATS.length : 3).map((stat, index) => (
            <StatCard key={index} item={stat} />
          ))}
        </div>
      </div>

      {/* Pickup & History Card */}
      <div className="bg-white p-5 rounded-[28px] border-2 border-[#ff751f] shadow-sm grid grid-cols-2 divide-x divide-gray-100">
        <div className="pr-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2">Pickup</p>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-50 text-[#ff751f] rounded-xl"><Clock size={16} /></div>
            <div>
              <p className="text-sm font-black text-[#1a3762] leading-none">12</p>
              <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">Request Pending</p>
            </div>
          </div>
        </div>
        <div className="pl-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2">History</p>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 text-[#1a3762] rounded-xl"><History size={16} /></div>
            <div>
              <p className="text-sm font-black text-[#1a3762] leading-none">45</p>
              <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">Picked yesterday</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Payment Details</h3>
          <button onClick={() => setIsPaymentExpanded(!isPaymentExpanded)} className="flex items-center text-[10px] font-bold text-[#1a3762] uppercase tracking-wider">
            {isPaymentExpanded ? 'Show Less' : 'Show All'}
            {isPaymentExpanded ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {PAYMENT_STATS.slice(0, isPaymentExpanded ? PAYMENT_STATS.length : 3).map((stat, index) => (
            <StatCard key={index} item={stat} />
          ))}
        </div>
      </div>

      {/* Service Health */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Activity size={80} className="text-[#1a3762]" />
        </div>
        <div className="flex items-center space-x-2 relative z-10">
          <div className="p-1.5 bg-blue-50 rounded-lg text-[#1a3762]"><Activity size={16} /></div>
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Service Health</span>
        </div>
        <div className="flex justify-between items-center relative z-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Success Rate</p>
            </div>
            <h2 className="text-3xl font-black text-[#1a3762] tracking-tight">94.2%</h2>
          </div>
          <div className="h-10 w-px bg-gray-100"></div>
          <div className="space-y-1 text-right">
            <div className="flex items-center justify-end space-x-1">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Returned Rate</p>
              <div className="w-1.5 h-1.5 rounded-full bg-[#ff751f]"></div>
            </div>
            <h2 className="text-3xl font-black text-[#1a3762] tracking-tight">3.8%</h2>
          </div>
        </div>
      </div>

      {/* Return Approval Module */}
      <div className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-orange-50 text-[#ff751f] rounded-2xl group-hover:bg-[#ff751f] group-hover:text-white transition-colors">
            <RotateCcw size={22} />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#1a3762] tracking-tight">Return Approval</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Review pending return requests</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-red-500 text-white text-[10px] font-black h-6 w-6 rounded-lg flex items-center justify-center shadow-lg shadow-red-200">5</div>
          <ChevronRight size={18} className="text-gray-300" />
        </div>
      </div>

      {/* Entry Methods Section - Updated to have a light blue (halka blue) background */}
      <div className="grid grid-cols-3 gap-3 px-1">
        {[
          { icon: FilePlus, label: "Manual Entry", color: "blue", bg: "bg-blue-100", text: "text-blue-700" },
          { icon: BrainCircuit, label: "AI Entry", color: "indigo", bg: "bg-indigo-100", text: "text-indigo-700" },
          { icon: Camera, label: "Camera Entry", color: "orange", bg: "bg-orange-100", text: "text-[#ff751f]" },
        ].map((item, i) => (
          <button 
            key={i} 
            className="flex flex-col items-center justify-center space-y-2 bg-[#f0f7ff] p-4 rounded-2xl border border-blue-100 shadow-sm active:scale-95 transition-all hover:border-blue-200 hover:bg-blue-100/50"
          >
            <div className={`p-2.5 rounded-xl ${item.bg} ${item.text}`}>
              <item.icon size={20} />
            </div>
            <span className="text-[10px] font-black text-gray-700 uppercase tracking-tighter text-center leading-tight">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: Ban, label: "No Entry", color: "slate", action: () => {} },
          { icon: Zap, label: "Quick Booking", color: "orange", action: () => {} },
          { icon: Trophy, label: "Reward Board", color: "blue", action: () => {} },
          { icon: Truck, label: "Pickup", color: "orange", action: () => setActiveTab('pickup') },
          { icon: LifeBuoy, label: "Support", color: "green", action: () => {} },
          { icon: Settings, label: "Settings", color: "slate", action: () => {} },
          { icon: ShieldAlert, label: "✨ Fraud Check", color: "red", action: () => setActiveTab('fraud_check') },
          { icon: Info, label: "Latest Updates", color: "indigo", action: () => {} },
        ].map((btn, i) => (
          <button 
            key={i} 
            onClick={btn.action}
            className="flex items-center space-x-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-all hover:bg-slate-50"
          >
            <div className={`p-2 rounded-lg bg-${btn.color}-50 text-${btn.color === 'orange' ? '[#ff751f]' : btn.color + '-600'}`}>
              <btn.icon size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-gray-700">{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderFraudCheck = () => (
    <div className="space-y-6 pb-32 animate-in slide-in-from-right-10 duration-500">
      <div className="flex items-center space-x-4 pt-2">
        <button onClick={() => { setActiveTab('home'); setFraudResult(null); }} className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <ArrowLeft size={20} className="text-[#1a3762]" />
        </button>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">✨ Smart Fraud Check</h1>
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
        <p className="text-xs text-gray-500 font-medium">Verify customer credibility using AI analyzing historical logistics behavior across Bangladesh.</p>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Customer Phone Number</label>
          <div className="flex space-x-2">
            <input 
              type="tel" 
              placeholder="017XXXXXXXX" 
              value={fraudPhone} 
              onChange={(e) => setFraudPhone(e.target.value)} 
              className="flex-1 bg-slate-50 border-none rounded-2xl py-4 px-4 focus:ring-2 focus:ring-[#ff751f] font-bold text-sm outline-none" 
            />
            <button 
              onClick={handleFraudCheck} 
              disabled={aiLoading || !fraudPhone} 
              className="bg-[#1a3762] text-white p-4 rounded-2xl shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
              {aiLoading ? <Loader2 size={24} className="animate-spin" /> : <ShieldCheck size={24} />}
            </button>
          </div>
        </div>
        {fraudResult && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl mt-4 animate-in slide-in-from-bottom-2">
            <div className="flex items-center space-x-2 text-red-600 mb-2">
              <ShieldAlert size={16} />
              <span className="text-[10px] font-black uppercase">AI Risk Report</span>
            </div>
            <p className="text-xs text-red-900 leading-relaxed font-bold italic">{fraudResult}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'home': return renderHomeContent();
      case 'fraud_check': return renderFraudCheck();
      default:
        return (
          <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
            <Clock size={48} className="text-[#1a3762] animate-pulse" />
            <div className="text-center">
              <h2 className="text-2xl font-black text-gray-900">Module Under Construction</h2>
              <p className="text-sm text-gray-400 font-medium mt-1 uppercase tracking-widest">We're loading something awesome!</p>
            </div>
            <button onClick={() => setActiveTab('home')} className="mt-4 px-6 py-2 bg-[#1a3762] text-white rounded-full font-bold text-xs">Back Home</button>
          </div>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#f8fafc] min-h-screen relative selection:bg-[#ff751f]/20">
      <div className="h-4"></div>
      
      {/* Global AI Loading Overlay */}
      {aiLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/10 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white p-8 rounded-[40px] shadow-2xl flex flex-col items-center space-y-4 animate-in zoom-in-95">
             <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
                <div className="bg-white p-4 rounded-3xl shadow-lg relative z-10">
                  <Loader2 size={48} className="text-indigo-600 animate-spin" />
                </div>
             </div>
             <div className="text-center">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 animate-bounce">AI is Thinking...</p>
               <p className="text-[8px] text-gray-400 mt-1 uppercase">Analyzing Logistics Data</p>
             </div>
          </div>
        </div>
      )}

      <main className="px-5 pb-32">{renderContent()}</main>

      {/* Persistent Navigation Bar */}
      <nav 
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-8 py-5 flex justify-between items-center z-50 rounded-t-[48px] shadow-[0_-15px_50px_rgba(26,55,98,0.25)] border-t border-white/5"
        style={{ backgroundColor: COLORS.darkBlue }}
      >
        <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={LayoutDashboard} label="Home" />
        <NavButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={Package} label="Parcels" />
        
        {/* Floating Add Action */}
        <div className="relative -top-14">
           <button 
             className="w-16 h-16 rounded-3xl shadow-2xl border-[6px] border-[#f8fafc] bg-[#ff751f] flex items-center justify-center hover:scale-110 active:scale-90 transition-all group overflow-hidden"
           >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <Plus size={28} className="text-white group-hover:rotate-90 transition-transform" strokeWidth={3} />
           </button>
        </div>

        <NavButton active={activeTab === 'invoices'} onClick={() => setActiveTab('invoices')} icon={FileText} label="Invoices" />
        <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={User} label="Account" />
      </nav>
    </div>
  );
};

export default App;
