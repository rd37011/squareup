import type { Balance } from '../../types/api'
import type { Member } from '../../types/models'
import BalanceItem from './BalanceItem'
import EmptyState from '../ui/EmptyState'

interface BalanceListProps {
  balances: Balance[]
  members: Member[]
}

const BalanceList = ({ balances, members }: BalanceListProps) => {
  if (balances.length === 0) {
    return <EmptyState message="Add members and expenses to see balances." />
  }

  return (
    <div className="flex flex-col gap-3">
      {balances.map((balance) => {
        const member = members.find((m) => m.id === balance.memberId)
        if (!member) return null
        return <BalanceItem key={balance.memberId} balance={balance} member={member} />
      })}
    </div>
  )
}

export default BalanceList
