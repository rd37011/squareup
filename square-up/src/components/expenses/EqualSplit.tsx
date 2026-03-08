import type { Participant, Member } from '../../types/models'
import { formatCurrency } from '../../utils/format'

interface EqualSplitProps {
  participants: Participant[]
  members: Member[]
  shareAmount: number
}

const EqualSplit = ({ participants, members, shareAmount }: EqualSplitProps) => {
  const memberMap = new Map(members.map((m) => [m.id, m]))

  return (
    <div className="space-y-3">
      {participants.map((participant) => {
        const member = memberMap.get(participant.memberId)
        return (
          <div
            key={participant.memberId}
            className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg"
          >
            <span className="text-zinc-900 font-medium">{member?.name}</span>
            <span className="text-zinc-700">{formatCurrency(shareAmount)}</span>
          </div>
        )
      })}
    </div>
  )
}

export default EqualSplit
