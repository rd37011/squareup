import type { Member } from '../../types/models'

interface ParticipantSelectorProps {
  members: Member[]
  selected: string[]
  onChange: (memberIds: string[]) => void
}

const ParticipantSelector = ({
  members,
  selected,
  onChange,
}: ParticipantSelectorProps) => {
  const handleToggle = (memberId: string) => {
    if (selected.includes(memberId)) {
      onChange(selected.filter((id) => id !== memberId))
    } else {
      onChange([...selected, memberId])
    }
  }

  return (
    <div className="space-y-3">
      {members.map((member) => (
        <label key={member.id} className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={selected.includes(member.id)}
            onChange={() => handleToggle(member.id)}
            className="w-4 h-4 rounded border-zinc-300 text-green-matte focus-visible:ring-green-matte"
          />
          <span className="ml-3 text-zinc-900">{member.name}</span>
        </label>
      ))}
    </div>
  )
}

export default ParticipantSelector
