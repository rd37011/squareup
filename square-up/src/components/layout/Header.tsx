import Button from '../ui/Button'

interface HeaderProps {
  onOpenMembers: () => void
}

const Header = ({ onOpenMembers }: HeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold text-green-matte">Square Up</h1>
      <Button variant="secondary" size="sm" onClick={onOpenMembers}>
        People
      </Button>
    </div>
  )
}

export default Header
