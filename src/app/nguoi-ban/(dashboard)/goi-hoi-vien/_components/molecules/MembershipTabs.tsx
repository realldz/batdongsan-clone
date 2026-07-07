interface Tab {
  id: string;
  label: string;
  badge?: string;
}

interface MembershipTabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

export function MembershipTabs({ tabs, activeTab, onChange }: MembershipTabsProps) {
  return (
    <div className="flex items-center gap-6 border-b border-gray-200 bg-white px-6">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center py-4 text-sm font-bold transition-colors ${
              isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {tab.badge && (
              <span className="ml-2 rounded bg-[#e03c31] px-1.5 py-0.5 text-[10px] font-bold text-white">
                {tab.badge}
              </span>
            )}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e03c31]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
