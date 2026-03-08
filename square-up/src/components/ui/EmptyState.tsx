interface EmptyStateProps {
  message: string
}

const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="flex items-center justify-center py-12">
      <p className="text-zinc-500 text-center">{message}</p>
    </div>
  )
}

export default EmptyState
