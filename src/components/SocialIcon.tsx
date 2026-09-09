type SocialIconProps = {
  type: 'github' | 'linkedin'
}

export function SocialIcon({ type }: SocialIconProps) {
  if (type === 'github') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M12 .7A11.3 11.3 0 0 0 8.4 22.8c.6.1.8-.3.8-.6v-2.1c-3.4.7-4.1-1.4-4.1-1.4-.5-1.4-1.4-1.7-1.4-1.7-1.1-.8.1-.8.1-.8 1.3.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.4 3.6 1 .1-.8.4-1.4.8-1.7-2.7-.3-5.5-1.4-5.5-6 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.4 1.3a11.4 11.4 0 0 1 6.2 0c2.3-1.6 3.3-1.3 3.3-1.3.7 1.6.3 2.9.1 3.2.8.9 1.3 2 1.3 3.3 0 4.7-2.9 5.7-5.6 6 .5.4.9 1.1.9 2.3v3.1c0 .3.2.7.8.6A11.3 11.3 0 0 0 12 .7Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M5 3.4A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1 0-5.1ZM3 9.6h4V21H3V9.6Zm6.3 0H13v1.6h.1c.5-1 1.8-2.1 3.8-2.1 4 0 4.8 2.7 4.8 6.1V21h-4v-5.2c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9.3V9.6Z" />
    </svg>
  )
}
