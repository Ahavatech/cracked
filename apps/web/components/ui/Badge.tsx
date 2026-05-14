import { FaStar } from 'react-icons/fa'

export function Badge({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span className={`section-badge ${dark ? 'badge-dark' : ''}`}>
      <FaStar aria-hidden="true" />
      {children}
    </span>
  )
}
