import Link from 'next/link'

type ButtonProps = {
  children: React.ReactNode
  href?: string
  variant?: 'primary' | 'ghost' | 'ghostLight'
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
  className?: string
}

export function Button({
  children,
  href,
  variant = 'primary',
  type = 'button',
  disabled,
  onClick,
  className = ''
}: ButtonProps) {
  const variantClass =
    variant === 'ghost' ? 'btn-ghost' : variant === 'ghostLight' ? 'btn-ghost-light' : 'btn-primary'
  const classes = `btn ${variantClass} ${className}`

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}
