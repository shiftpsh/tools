import styled from '@emotion/styled'
import { useEffect, useRef, useState } from 'react'

const CharacterContainer = styled('span')<{
  active?: boolean
  copied?: boolean
}>(({ active, copied }) => ({
  display: 'block',
  width: 32,
  height: 32,
  lineHeight: '32px',
  textAlign: 'center',
  border: '1px solid #ccc',
  borderRadius: 4,
  cursor: 'pointer',
  userSelect: 'none',
  backgroundColor: copied ? '#3fe68a' : active ? '#ffc273' : 'transparent',
  '&:hover': {
    backgroundColor: copied ? '#3fe68a' : active ? '#ffc273' : '#f0f0f0',
  },
}))

interface Props {
  value: string
  onCopy: (char: string) => void
  active?: boolean
}

const Character = ({ value, onCopy, active }: Props) => {
  const ref = useRef<HTMLSpanElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (active) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [active])

  const handleCopy = (char: string) => {
    setCopied(true)
    onCopy(char)
    setTimeout(() => setCopied(false), 1000)
  }

  return (
    <CharacterContainer
      ref={ref}
      key={value}
      onClick={() => handleCopy(value)}
      active={active}
      copied={copied}
    >
      {value}
    </CharacterContainer>
  )
}

export default Character
