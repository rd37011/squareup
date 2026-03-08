import type { SplitType } from '../../types/models'
import Button from '../ui/Button'

interface SplitTypeSelectorProps {
  value: SplitType
  onChange: (type: SplitType) => void
}

const SplitTypeSelector = ({ value, onChange }: SplitTypeSelectorProps) => {
  const types: { id: SplitType; label: string }[] = [
    { id: 'equal', label: 'Equal' },
    { id: 'amount', label: 'Fixed Amounts' },
    { id: 'percent', label: 'Percentages' },
  ]

  return (
    <div className="flex gap-2 flex-wrap">
      {types.map((type) => (
        <Button
          key={type.id}
          variant={value === type.id ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onChange(type.id)}
        >
          {type.label}
        </Button>
      ))}
    </div>
  )
}

export default SplitTypeSelector
