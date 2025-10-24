import styled from '@emotion/styled'
import { useEffect, useRef, useState } from 'react'

const CharacterContainer = styled('span')<{
  active?: boolean
  copied?: boolean
}>(({ active, copied }) => ({
  display: 'block',
  position: 'relative',
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

const CharacterLabel = styled('span')({
  position: 'absolute',
  top: -12,
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: '75%',
  fontWeight: 'bold',
  height: 16,
  lineHeight: '16px',
  padding: '0 4px',
  borderRadius: 4,
  border: '1px solid #eee',
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
})

interface Props {
  value: string
  onCopy: (char: string) => void
  active?: boolean
  index?: number
}

const Character = ({ value, onCopy, active, index }: Props) => {
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
      {active && <CharacterLabel>{index}</CharacterLabel>}
    </CharacterContainer>
  )
}

export default Character
