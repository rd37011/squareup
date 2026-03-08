import type { DebtSuggestion } from '../../types/api'
import type { Member } from '../../types/models'
import EmptyState from '../ui/EmptyState'
import SettleUpItem from './SettleUpItem'

interface SettleUpListProps {
  suggestions: DebtSuggestion[]
  members: Member[]
  onSettle: (suggestion: DebtSuggestion) => void
}

const SettleUpList = ({ suggestions, members, onSettle }: SettleUpListProps) => {
  if (suggestions.length === 0) {
    return <EmptyState message="All settled up!" />
  }

  return (
    <div className="space-y-3">
      {suggestions.map((suggestion, index) => (
        <SettleUpItem
          key={`${suggestion.fromId}-${suggestion.toId}-${index}`}
          suggestion={suggestion}
          members={members}
          onSettle={() => onSettle(suggestion)}
        />
      ))}
    </div>
  )
}

export default SettleUpList
