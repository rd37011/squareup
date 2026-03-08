interface TabNavProps {
  activeTab: 'expenses' | 'balances' | 'settle'
  onTabChange: (tab: 'expenses' | 'balances' | 'settle') => void
}

const TabNav = ({ activeTab, onTabChange }: TabNavProps) => {
  const tabs = [
    { id: 'expenses', label: 'Expenses' },
    { id: 'balances', label: 'Balances' },
    { id: 'settle', label: 'Settle Up' },
  ] as const

  return (
    <div className="flex border-b border-zinc-200 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === tab.id
              ? 'text-green-matte border-green-matte'
              : 'text-zinc-600 border-transparent hover:text-zinc-900'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default TabNav
