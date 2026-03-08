import type { DebtSuggestion } from '../types/api'
import type { Settlement } from '../types/models'
import { useAppState } from '../hooks/useAppState'
import { computeBalances } from '../utils/balances'
import { computeSimplifiedDebts } from '../utils/settlements'
import SettleUpList from '../components/settlements/SettleUpList'
import SettledHistory from '../components/settlements/SettledHistory'

const SettleUpPage = () => {
  const { members, expenses, settlements, api } = useAppState()

  const balances = computeBalances(members, expenses, settlements)
  const suggestions = computeSimplifiedDebts(balances, members)

  const handleSettle = (suggestion: DebtSuggestion) => {
    const settlement: Settlement = {
      id: crypto.randomUUID(),
      fromId: suggestion.fromId,
      toId: suggestion.toId,
      amount: suggestion.amount,
      settledAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }
    api.markSettled(settlement)
  }

  return (
    <div className="space-y-6">
      <SettleUpList suggestions={suggestions} members={members} onSettle={handleSettle} />
      <SettledHistory settlements={settlements} members={members} />
    </div>
  )
}

export default SettleUpPage
