import type { Member } from '../../types/models'
import Input from '../ui/Input'

interface PercentSplitProps {
  members: Member[]
  participantIds: string[]
  values: Record<string, number>
  onChange: (memberId: string, value: number) => void
}

const PercentSplit = ({
  members,
  participantIds,
  values,
  onChange,
}: PercentSplitProps) => {
  const memberMap = new Map(members.map((m) => [m.id, m]))
  const sum = participantIds.reduce((acc, id) => acc + (values[id] || 0), 0)
  const isMatched = Math.abs(sum - 100) < 0.01

  return (
    <div className="space-y-4">
      {participantIds.map((memberId) => (
        <Input
          key={memberId}
          label={memberMap.get(memberId)?.name}
          type="number"
          step="0.01"
          min="0"
          max="100"
          value={values[memberId] || ''}
          onChange={(e) => onChange(memberId, parseFloat(e.target.value) || 0)}
          placeholder="0"
        />
      ))}

      <div className="pt-3 border-t border-zinc-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-700">Total Percentage:</span>
          <span
            className={`font-semibold ${
              isMatched ? 'text-green-matte' : 'text-red-600'
            }`}
          >
            {sum.toFixed(2)}%
          </span>
        </div>
        {!isMatched && (
          <p className="text-red-600 text-sm mt-2">
            Percentages must equal 100%
          </p>
        )}
      </div>
    </div>
  )
}

export default PercentSplit
