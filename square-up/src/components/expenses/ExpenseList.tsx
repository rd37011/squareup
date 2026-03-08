import type { Expense, Member } from '../../types/models'
import ExpenseItem from './ExpenseItem'
import EmptyState from '../ui/EmptyState'

interface ExpenseListProps {
  expenses: Expense[]
  members: Member[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const ExpenseList = ({
  expenses,
  members,
  onEdit,
  onDelete,
}: ExpenseListProps) => {
  if (expenses.length === 0) {
    return <EmptyState message="No expenses yet. Add one to get started!" />
  }

  // Sort newest first (by date, then by createdAt)
  const sortedExpenses = [...expenses].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    if (dateA !== dateB) return dateB - dateA
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <div className="space-y-4">
      {sortedExpenses.map((expense) => (
        <ExpenseItem
          key={expense.id}
          expense={expense}
          members={members}
          onEdit={() => onEdit(expense.id)}
          onDelete={() => onDelete(expense.id)}
        />
      ))}
    </div>
  )
}

export default ExpenseList
