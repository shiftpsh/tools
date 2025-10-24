import styled from '@emotion/styled'
import { Alert, Box, Container, Paper, Stack, TextField } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import Character from './-components/Character'
import {
  HANJA_CATEGORY_HANGUL,
  HANJA_CHARS,
  VALID_HANJA_CATEGORIES,
} from './-utils/hanja'

const HANJA_CHAR_ENTRIES = Object.entries(HANJA_CHARS)

const Key = styled('span')({
  display: 'block',
  color: 'white',
  backgroundColor: '#0b1b38',
  borderRadius: 4,
  border: '1px solid #ccc',
  width: 48,
  height: 48,
  fontSize: '90%',
  position: 'relative',
})

const KeyLabelHangul = styled('span')({
  position: 'absolute',
  left: 8,
  bottom: 4,
})

const KeyLabelAlpha = styled('span')({
  position: 'absolute',
  right: 8,
  top: 4,
})

interface State {
  category: string
  index: number
}

export const Route = createFileRoute('/_main/glyphs/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [input, setInput] = useState('')
  const [state, setState] = useState<State | null>(null)

  const onCopyChar = (char: string) => {
    navigator.clipboard.writeText(char)
    setInput((prev) => prev + char)
    setState(null)
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return
      const { key, shiftKey } = e
      if (key === 'Escape') {
        e.preventDefault()
        setState(null)
        return
      }
      const isNumber = /^[1-9]$/.test(key)
      if (isNumber && state?.category) {
        const { category, index } = state
        const calculatedIndex = index * 9 + (parseInt(key, 10) - 1)
        const charList = HANJA_CHARS[category].flat()
        if (calculatedIndex >= 0 && calculatedIndex < charList.length) {
          e.preventDefault()
          onCopyChar(charList[calculatedIndex])
          return
        }
      }
      const isArrowKey =
        key === 'ArrowUp' ||
        key === 'ArrowDown' ||
        key === 'ArrowLeft' ||
        key === 'ArrowRight'
      if (isArrowKey && state?.category) {
        e.preventDefault()
        const { category, index } = state
        const charList = HANJA_CHARS[category].flat()
        const itemsPerRow = 9
        let newIndex = index
        if (key === 'ArrowUp' || key === 'ArrowLeft') {
          newIndex = Math.max(0, index - 1)
        } else if (key === 'ArrowDown' || key === 'ArrowRight') {
          newIndex = Math.min(
            Math.floor((charList.length - 1) / itemsPerRow),
            index + 1,
          )
        }
        setState({
          category,
          index: newIndex,
        })
        return
      }
      const validKey =
        !shiftKey && VALID_HANJA_CATEGORIES.includes(key.toLowerCase())
      const validKeyShift =
        shiftKey && VALID_HANJA_CATEGORIES.includes(key.toUpperCase())
      if (validKey || validKeyShift) {
        e.preventDefault()
        setState({
          category: shiftKey ? key.toUpperCase() : key.toLowerCase(),
          index: 0,
        })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [state])

  return (
    <Container>
      <h1>특수 문자</h1>
      <Stack spacing={2}>
        <Alert severity="info">
          <Stack spacing={1}>
            <Box>한자 버튼이 없는 불쌍한 맥 유저를 구해주세요.</Box>
            <Box>
              <ul>
                <li>
                  키보드에서 자음을 누른 후, 화살표 키와 숫자 키로 조작해
                  특수문자를 복사할 수 있습니다. (쌍자음은 Shift와 함께 눌러
                  주세요)
                </li>
                <li>글자를 클릭해도 복사됩니다.</li>
              </ul>
            </Box>
          </Stack>
        </Alert>
        <Paper sx={{ p: 2, position: 'sticky', top: 70, zIndex: 1 }}>
          <TextField
            label="입력"
            fullWidth
            multiline
            minRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </Paper>
        <Paper sx={{ p: 2 }}>
          <Stack spacing={4}>
            {HANJA_CHAR_ENTRIES.map(([category, chars]) => (
              <Stack key={category} direction="row" spacing={1}>
                <Box sx={{ flex: '0 0 32px' }}>
                  <Key>
                    <KeyLabelHangul>
                      {HANJA_CATEGORY_HANGUL[category]}
                    </KeyLabelHangul>
                    <KeyLabelAlpha>{category.toUpperCase()}</KeyLabelAlpha>
                  </Key>
                </Box>
                <Box sx={{ flex: '1', minWidth: 0 }}>
                  <Stack
                    key={category}
                    direction="row"
                    flexWrap="wrap"
                    sx={{
                      gap: '4px 16px',
                    }}
                  >
                    {chars.map((charChunk, i) => (
                      <Stack key={i} direction="row" spacing={1} sx={{ mb: 1 }}>
                        {charChunk.map((char, j) => (
                          <Character
                            key={char}
                            value={char}
                            onCopy={onCopyChar}
                            active={
                              state?.category === category && state?.index === i
                            }
                            index={j + 1}
                          />
                        ))}
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Paper>
        <Box sx={{ height: 32 }} />
      </Stack>
    </Container>
  )
}
