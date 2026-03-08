import { useState, useMemo } from 'react'
import type { Expense, Member, SplitType } from '../../types/models'
import Input from '../ui/Input'
import Button from '../ui/Button'
import SplitTypeSelector from './SplitTypeSelector'
import ParticipantSelector from './ParticipantSelector'
import EqualSplit from './EqualSplit'
import AmountSplit from './AmountSplit'
import PercentSplit from './PercentSplit'

interface ExpenseFormProps {
  initialExpense?: Expense | null
  members: Member[]
  onSave: (expense: Expense) => void
  onCancel: () => void
}

const ExpenseForm = ({
  initialExpense,
  members,
  onSave,
  onCancel,
}: ExpenseFormProps) => {
  // Initialize form state based on initialExpense
  const initialState = useMemo(() => {
    if (initialExpense) {
      const ids = initialExpense.participants.map((p) => p.memberId)
      const amountVals = Object.fromEntries(
        initialExpense.participants.map((p) => [p.memberId, p.share])
      )
      const percentVals = Object.fromEntries(
        initialExpense.participants.map((p) => [
          p.memberId,
          (p.share / initialExpense.amount) * 100,
        ])
      )

      return {
        description: initialExpense.description,
        amount: initialExpense.amount.toString(),
        payerId: initialExpense.payerId,
        date: initialExpense.date.split('T')[0],
        splitType: initialExpense.splitType,
        participantIds: ids,
        amountValues: amountVals,
        percentValues: percentVals,
      }
    }

    const today = new Date().toISOString().split('T')[0]
    return {
      description: '',
      amount: '',
      payerId: '',
      date: today,
      splitType: 'equal' as SplitType,
      participantIds: [] as string[],
      amountValues: {} as Record<string, number>,
      percentValues: {} as Record<string, number>,
    }
  }, [initialExpense])

  const [description, setDescription] = useState(initialState.description)
  const [amount, setAmount] = useState(initialState.amount)
  const [payerId, setPayerId] = useState(initialState.payerId)
  const [date, setDate] = useState(initialState.date)
  const [splitType, setSplitType] = useState<SplitType>(initialState.splitType)
  const [participantIds, setParticipantIds] = useState<string[]>(
    initialState.participantIds
  )
  const [amountValues, setAmountValues] = useState<Record<string, number>>(
    initialState.amountValues
  )
  const [percentValues, setPercentValues] = useState<Record<string, number>>(
    initialState.percentValues
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!description.trim()) {
      newErrors.description = 'Description is required'
    }

    const expenseAmount = parseFloat(amount)
    if (!amount || expenseAmount <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }

    if (!payerId) {
      newErrors.payerId = 'Payer is required'
    }

    if (participantIds.length === 0) {
      newErrors.participants = 'At least one participant is required'
    }

    if (splitType === 'amount') {
      const sum = participantIds.reduce(
        (acc, id) => acc + (amountValues[id] || 0),
        0
      )
      if (Math.abs(sum - expenseAmount) >= 0.01) {
        newErrors.split = `Amount split must equal the total expense (${expenseAmount})`
      }
    } else if (splitType === 'percent') {
      const sum = participantIds.reduce(
        (acc, id) => acc + (percentValues[id] || 0),
        0
      )
      if (Math.abs(sum - 100) >= 0.01) {
        newErrors.split = 'Percentages must equal 100%'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const expenseAmount = parseFloat(amount)

    // Calculate participants with dollar shares
    const participantsList = participantIds.map((memberId) => {
      if (splitType === 'equal') {
        return {
          memberId,
          share: expenseAmount / participantIds.length,
        }
      } else if (splitType === 'amount') {
        return {
          memberId,
          share: amountValues[memberId] || 0,
        }
      } else {
        // percent - convert to dollars
        const percent = percentValues[memberId] || 0
        return {
          memberId,
          share: (percent / 100) * expenseAmount,
        }
      }
    })

    const newExpense: Expense = {
      id: initialExpense?.id || crypto.randomUUID(),
      description,
      amount: expenseAmount,
      payerId,
      date: new Date(date).toISOString(),
      splitType,
      participants: participantsList,
      createdAt: initialExpense?.createdAt || new Date().toISOString(),
    }

    onSave(newExpense)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Description */}
      <Input
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="e.g., Dinner, Groceries, Gas"
        required
        error={errors.description}
      />

      {/* Amount */}
      <Input
        label="Amount"
        type="number"
        step="0.01"
        min="0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.00"
        required
        error={errors.amount}
      />

      {/* Payer */}
      <div>
        <label htmlFor="payer" className="block text-sm font-medium text-zinc-700 mb-1">
          Payer <span className="text-red-600">*</span>
        </label>
        <select
          id="payer"
          value={payerId}
          onChange={(e) => setPayerId(e.target.value)}
          className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-matte transition-colors"
          required
        >
          <option value="">Select a payer</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
        {errors.payerId && (
          <p className="text-red-600 text-sm mt-1">{errors.payerId}</p>
        )}
      </div>

      {/* Date */}
      <Input
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      {/* Participants */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-3">
          Participants <span className="text-red-600">*</span>
        </label>
        <ParticipantSelector
          members={members}
          selected={participantIds}
          onChange={setParticipantIds}
        />
        {errors.participants && (
          <p className="text-red-600 text-sm mt-2">{errors.participants}</p>
        )}
      </div>

      {/* Split Type Selector */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-3">
          Split Type
        </label>
        <SplitTypeSelector value={splitType} onChange={setSplitType} />
      </div>

      {/* Split Details */}
      {participantIds.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-3">
            {splitType === 'equal' && 'Equal Split'}
            {splitType === 'amount' && 'Amount per Participant'}
            {splitType === 'percent' && 'Percentage per Participant'}
          </label>

          {splitType === 'equal' && (
            <EqualSplit
              participants={participantIds.map((id) => ({
                memberId: id,
                share: parseFloat(amount) / participantIds.length || 0,
              }))}
              members={members}
              shareAmount={parseFloat(amount) / participantIds.length || 0}
            />
          )}

          {splitType === 'amount' && (
            <AmountSplit
              members={members}
              participantIds={participantIds}
              values={amountValues}
              onChange={(memberId, value) =>
                setAmountValues({ ...amountValues, [memberId]: value })
              }
              total={parseFloat(amount) || 0}
            />
          )}

          {splitType === 'percent' && (
            <PercentSplit
              members={members}
              participantIds={participantIds}
              values={percentValues}
              onChange={(memberId, value) =>
                setPercentValues({ ...percentValues, [memberId]: value })
              }
            />
          )}
        </div>
      )}

      {errors.split && (
        <p className="text-red-600 text-sm">{errors.split}</p>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-zinc-200">
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
        >
          {initialExpense ? 'Update Expense' : 'Add Expense'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default ExpenseForm
