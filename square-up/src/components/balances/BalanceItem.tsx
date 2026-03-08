import type { Balance } from '../../types/api'
import type { Member } from '../../types/models'
import { formatCurrency } from '../../utils/format'

interface BalanceItemProps {
  balance: Balance
  member: Member
}

const BalanceItem = ({ balance, member }: BalanceItemProps) => {
  const getNetDisplay = () => {
    if (balance.net > 0) {
      return {
        text: `gets back ${formatCurrency(balance.net)}`,
        className: 'text-green-600 font-medium',
      }
    } else if (balance.net < 0) {
      return {
        text: `owes ${formatCurrency(Math.abs(balance.net))}`,
        className: 'text-red-600 font-medium',
      }
    } else {
      return {
        text: 'settled',
        className: 'text-zinc-400 font-medium',
      }
    }
  }

  const netDisplay = getNetDisplay()

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-zinc-200">
      <div className="flex flex-col gap-1">
        <span className="text-zinc-900 font-medium">{member.name}</span>
        <div className="flex gap-4 text-sm text-zinc-600">
          <span>Paid: {formatCurrency(balance.totalPaid)}</span>
          <span>Owed: {formatCurrency(balance.totalOwed)}</span>
        </div>
      </div>
      <div className={netDisplay.className}>{netDisplay.text}</div>
    </div>
  )
}

export default BalanceItem
