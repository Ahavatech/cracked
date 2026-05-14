type FieldProps = {
  label: string
  name: string
  type?: string
  value?: string | number
  required?: boolean
  placeholder?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function Field({ label, name, type = 'text', value, required, placeholder, onChange }: FieldProps) {
  return (
    <label className="form-grid">
      <span>{label}</span>
      <input
        className="input"
        name={name}
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={onChange}
      />
    </label>
  )
}

type TextareaProps = {
  label: string
  name: string
  value?: string
  required?: boolean
  placeholder?: string
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export function Textarea({ label, name, value, required, placeholder, onChange }: TextareaProps) {
  return (
    <label className="form-grid">
      <span>{label}</span>
      <textarea
        className="textarea"
        name={name}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={onChange}
      />
    </label>
  )
}
