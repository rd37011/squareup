import { useState } from 'react'
import { AppContextProvider } from './context/AppContext'
import AppShell from './components/layout/AppShell'
import Header from './components/layout/Header'
import TabNav from './components/layout/TabNav'
import MemberPanel from './components/members/MemberPanel'
import ExpensesPage from './pages/ExpensesPage'
import BalancesPage from './pages/BalancesPage'
import SettleUpPage from './pages/SettleUpPage'

type Tab = 'expenses' | 'balances' | 'settle'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('expenses')
  const [membersOpen, setMembersOpen] = useState(false)

  return (
    <AppContextProvider>
      <AppShell>
        <Header onOpenMembers={() => setMembersOpen(true)} />
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content based on active tab */}
        {activeTab === 'expenses' && (
          <ExpensesPage />
        )}
        {activeTab === 'balances' && (
          <BalancesPage />
        )}
        {activeTab === 'settle' && (
          <SettleUpPage />
        )}

        <MemberPanel isOpen={membersOpen} onClose={() => setMembersOpen(false)} />
      </AppShell>
    </AppContextProvider>
  )
}

export default App
