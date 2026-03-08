import { useAppState } from '../hooks/useAppState'
import { computeBalances } from '../utils/balances'
import BalanceList from '../components/balances/BalanceList'

const BalancesPage = () => {
  const { members, expenses, settlements } = useAppState()
  const balances = computeBalances(members, expenses, settlements)

  return (
    <div className="space-y-4">
      <BalanceList balances={balances} members={members} />
    </div>
  )
}

export default BalancesPage
