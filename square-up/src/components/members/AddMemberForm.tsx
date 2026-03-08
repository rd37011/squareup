import { useState } from 'react'
import Input from '../ui/Input'
import Button from '../ui/Button'

interface AddMemberFormProps {
  onSubmit: (name: string) => void
}

const AddMemberForm = ({ onSubmit }: AddMemberFormProps) => {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Name is required')
      return
    }

    onSubmit(trimmedName)
    setName('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Member Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
        error={error}
        required
      />
      <Button type="submit" className="w-full">
        Add Member
      </Button>
    </form>
  )
}

export default AddMemberForm
