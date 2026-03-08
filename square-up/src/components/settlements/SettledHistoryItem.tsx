import type { Settlement, Member } from '../../types/models'
import { formatCurrency, formatDate } from '../../utils/format'

interface SettledHistoryItemProps {
  settlement: Settlement
  members: Member[]
}

const SettledHistoryItem = ({ settlement, members }: SettledHistoryItemProps) => {
  const fromMember = members.find((m) => m.id === settlement.fromId)
  const toMember = members.find((m) => m.id === settlement.toId)

  if (!fromMember || !toMember) return null

  return (
    <div className="flex items-center justify-between py-2 px-3 text-sm text-zinc-500">
      <span>
        {fromMember.name} paid {toMember.name} {formatCurrency(settlement.amount)}
      </span>
      <span className="text-xs text-zinc-400">{formatDate(settlement.settledAt)}</span>
    </div>
  )
}

export default SettledHistoryItem
