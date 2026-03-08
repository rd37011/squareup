import { useState } from 'react'
import type { Member } from '../../types/models'
import Modal from '../ui/Modal'
import MemberList from './MemberList'
import AddMemberForm from './AddMemberForm'
import { useAppState } from '../../hooks/useAppState'

interface MemberPanelProps {
  isOpen: boolean
  onClose: () => void
}

const MemberPanel = ({ isOpen, onClose }: MemberPanelProps) => {
  const { members, expenses, api } = useAppState()
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null)

  const handleAddMember = (name: string) => {
    const newMember: Member = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
    }
    api.addMember(newMember)
  }

  const handleRemoveMember = (id: string) => {
    const hasExpenses = expenses.some(
      (e) => e.payerId === id || e.participants.some((p) => p.memberId === id)
    )

    if (hasExpenses) {
      if (window.confirm(
        `${members.find((m) => m.id === id)?.name || 'This member'} has expenses. Remove anyway?`
      )) {
        api.removeMember(id)
      }
    } else {
      api.removeMember(id)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Members">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">Members</h3>
          <MemberList members={members} onRemove={handleRemoveMember} />
        </div>

        <div className="border-t border-zinc-200 pt-6">
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">Add New Member</h3>
          <AddMemberForm onSubmit={handleAddMember} />
        </div>
      </div>
    </Modal>
  )
}

export default MemberPanel
