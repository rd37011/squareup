import type { Member } from '../../types/models'
import Input from '../ui/Input'
import { formatCurrency } from '../../utils/format'

interface AmountSplitProps {
  members: Member[]
  participantIds: string[]
  values: Record<string, number>
  onChange: (memberId: string, value: number) => void
  total: number
}

const AmountSplit = ({
  members,
  participantIds,
  values,
  onChange,
  total,
}: AmountSplitProps) => {
  const memberMap = new Map(members.map((m) => [m.id, m]))
  const sum = participantIds.reduce((acc, id) => acc + (values[id] || 0), 0)
  const isMatched = Math.abs(sum - total) < 0.01

  return (
    <div className="space-y-4">
      {participantIds.map((memberId) => (
        <Input
          key={memberId}
          label={memberMap.get(memberId)?.name}
          type="number"
          step="0.01"
          min="0"
          value={values[memberId] || ''}
          onChange={(e) => onChange(memberId, parseFloat(e.target.value) || 0)}
          placeholder="0.00"
        />
      ))}

      <div className="pt-3 border-t border-zinc-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-zinc-700">Total Allocated:</span>
          <span
            className={`font-semibold ${
              isMatched ? 'text-green-matte' : 'text-red-600'
            }`}
          >
            {formatCurrency(sum)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-700">Expense Total:</span>
          <span className="font-semibold text-zinc-900">{formatCurrency(total)}</span>
        </div>
        {!isMatched && (
          <p className="text-red-600 text-sm mt-2">
            Amounts must equal {formatCurrency(total)}
          </p>
        )}
      </div>
    </div>
  )
}

export default AmountSplit
