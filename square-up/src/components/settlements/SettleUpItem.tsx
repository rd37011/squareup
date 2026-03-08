import type { DebtSuggestion } from '../../types/api'
import type { Member } from '../../types/models'
import Button from '../ui/Button'
import { formatCurrency } from '../../utils/format'

interface SettleUpItemProps {
  suggestion: DebtSuggestion
  members: Member[]
  onSettle: () => void
}

const SettleUpItem = ({ suggestion, members, onSettle }: SettleUpItemProps) => {
  const fromMember = members.find((m) => m.id === suggestion.fromId)
  const toMember = members.find((m) => m.id === suggestion.toId)

  if (!fromMember || !toMember) return null

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-lg">
      <span className="text-base text-zinc-900">
        {fromMember.name} pays {toMember.name} {formatCurrency(suggestion.amount)}
      </span>
      <Button variant="primary" size="sm" onClick={onSettle}>
        Mark as Settled
      </Button>
    </div>
  )
}

export default SettleUpItem
