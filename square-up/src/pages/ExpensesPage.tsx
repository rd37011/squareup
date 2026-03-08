import { useState } from 'react'
import { useAppState } from '../hooks/useAppState'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import ExpenseForm from '../components/expenses/ExpenseForm'
import ExpenseList from '../components/expenses/ExpenseList'
import type { Expense } from '../types/models'

const ExpensesPage = () => {
  const { members, expenses, api } = useAppState()
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  const handleOpenForm = () => {
    setEditingExpense(null)
    setShowForm(true)
  }

  const handleEditExpense = (id: string) => {
    const expense = expenses.find((e: Expense) => e.id === id)
    if (expense) {
      setEditingExpense(expense)
      setShowForm(true)
    }
  }

  const handleSaveExpense = (expense: Expense) => {
    if (editingExpense) {
      api.editExpense(expense)
    } else {
      api.addExpense(expense)
    }
    setShowForm(false)
    setEditingExpense(null)
  }

  const handleDeleteExpense = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      api.deleteExpense(id)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingExpense(null)
  }

  return (
    <div className="space-y-6">
      {/* Add Expense Button */}
      <div className="flex justify-end">
        <Button variant="primary" onClick={handleOpenForm}>
          Add Expense
        </Button>
      </div>

      {/* Expense List */}
      <ExpenseList
        expenses={expenses}
        members={members}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
      />

      {/* Expense Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
      >
        <ExpenseForm
          initialExpense={editingExpense ?? undefined}
          members={members}
          onSave={handleSaveExpense}
          onCancel={handleCloseForm}
        />
      </Modal>
    </div>
  )
}

export default ExpensesPage
