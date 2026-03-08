interface BadgeProps {
  label: string
  variant?: 'default' | 'green' | 'red'
}

const Badge = ({ label, variant = 'default' }: BadgeProps) => {
  const variants = {
    default: 'bg-zinc-200 text-zinc-900',
    green: 'bg-green-matte text-white',
    red: 'bg-red-200 text-red-900',
  }

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {label}
    </span>
  )
}

export default Badge
