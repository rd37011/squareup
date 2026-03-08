import { useState } from 'react'
import type { Settlement, Member } from '../../types/models'
import Button from '../ui/Button'
import SettledHistoryItem from './SettledHistoryItem'

interface SettledHistoryProps {
  settlements: Settlement[]
  members: Member[]
}

const SettledHistory = ({ settlements, members }: SettledHistoryProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (settlements.length === 0) return null

  return (
    <div className="border-t border-zinc-200 mt-6 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-900">Settled Transactions</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Hide' : 'Show'}
        </Button>
      </div>
      {isExpanded && (
        <div className="space-y-1">
          {settlements.map((settlement) => (
            <SettledHistoryItem key={settlement.id} settlement={settlement} members={members} />
          ))}
        </div>
      )}
    </div>
  )
}

export default SettledHistory
