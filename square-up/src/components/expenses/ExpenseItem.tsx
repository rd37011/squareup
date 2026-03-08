import type { Expense, Member } from '../../types/models'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { formatCurrency, formatDate } from '../../utils/format'

interface ExpenseItemProps {
  expense: Expense
  members: Member[]
  onEdit: () => void
  onDelete: () => void
}

const ExpenseItem = ({
  expense,
  members,
  onEdit,
  onDelete,
}: ExpenseItemProps) => {
  const memberMap = new Map(members.map((m) => [m.id, m]))
  const payerName = memberMap.get(expense.payerId)?.name || 'Unknown'

  const splitTypeLabels: Record<string, string> = {
    equal: 'Equal',
    amount: 'Fixed Amounts',
    percent: 'Percentages',
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-zinc-900 mb-1">
            {expense.description}
          </h3>
          <p className="text-sm text-zinc-600">
            {formatDate(expense.date)} • Paid by {payerName}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-zinc-900 mb-1">
            {formatCurrency(expense.amount)}
          </p>
          <Badge label={splitTypeLabels[expense.splitType]} variant="default" />
        </div>
      </div>

      {/* Participants */}
      <div className="mb-4 bg-zinc-50 rounded-lg p-3">
        <p className="text-xs font-medium text-zinc-600 mb-2 uppercase tracking-wide">
          Split
        </p>
        <div className="space-y-2">
          {expense.participants.map((participant) => {
            const memberName = memberMap.get(participant.memberId)?.name || 'Unknown'
            return (
              <div
                key={participant.memberId}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-zinc-700">{memberName}</span>
                <span className="font-medium text-zinc-900">
                  {formatCurrency(participant.share)}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  )
}

export default ExpenseItem
