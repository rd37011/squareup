import type { Member } from '../../types/models'
import MemberItem from './MemberItem'
import EmptyState from '../ui/EmptyState'

interface MemberListProps {
  members: Member[]
  onRemove: (id: string) => void
}

const MemberList = ({ members, onRemove }: MemberListProps) => {
  if (members.length === 0) {
    return <EmptyState message="No members yet. Add one to get started!" />
  }

  return (
    <div className="space-y-2">
      {members.map((member) => (
        <MemberItem
          key={member.id}
          member={member}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}

export default MemberList
