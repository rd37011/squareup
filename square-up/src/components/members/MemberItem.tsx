import type { Member } from '../../types/models'
import Button from '../ui/Button'

interface MemberItemProps {
  member: Member
  onRemove: (id: string) => void
}

const MemberItem = ({ member, onRemove }: MemberItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-zinc-200">
      <span className="text-zinc-900">{member.name}</span>
      <Button
        variant="danger"
        size="sm"
        onClick={() => onRemove(member.id)}
        className="p-1 w-8 h-8 flex items-center justify-center"
        title="Remove member"
      >
        ×
      </Button>
    </div>
  )
}

export default MemberItem
