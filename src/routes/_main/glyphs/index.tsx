import styled from '@emotion/styled'
import { Alert, Box, Container, Paper, Stack, TextField } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import Character from './-components/Character'
import { HANJA_CATEGORY_HANGUL, HANJA_CHARS } from './-utils/state/hanja'
import { nextState } from './-utils/state/state'
import type { GlyphsState } from './-utils/state/types'
import { CIRCLE_CHARS } from './-utils/state/circle'

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

export const Route = createFileRoute('/_main/glyphs/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [input, setInput] = useState('')
  const [state, setState] = useState<GlyphsState | null>(null)

  const onCopyChar = (char: string) => {
    navigator.clipboard.writeText(char)
    setInput((prev) => prev + char)
    setState(null)
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const { newState, input } = nextState(state, e)
      setState(newState)
      if (input) {
        navigator.clipboard.writeText(input)
        setInput((prev) => prev + input)
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
              <strong>한자 특수 기호</strong>
              <ul>
                <li>
                  키보드에서 자음을 누른 후, 화살표 키와 숫자 키로 조작해
                  특수문자를 복사할 수 있습니다. (쌍자음은 Shift와 함께 눌러
                  주세요)
                </li>
                <li>글자를 클릭해도 복사됩니다.</li>
              </ul>
            </Box>
            <Box>
              <strong>기타</strong>
              <ul>
                <li>
                  <b>o</b> 키를 누르면 원 문자 입력 모드로 전환합니다.
                </li>
              </ul>
            </Box>
          </Stack>
        </Alert>
        <Stack
          spacing={2}
          sx={{
            position: 'sticky',
            top: 70,
            zIndex: 1,
          }}
        >
          <Paper sx={{ p: 2 }}>
            <TextField
              label="입력"
              fullWidth
              multiline
              minRows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </Paper>
          {state?.type === 'circle' && (
            <Alert sx={{ p: 2 }} severity="info">
              <Stack spacing={2}>
                <Box sx={{ fontSize: '150%' }}>
                  {CIRCLE_CHARS.find(([k]) => k === state.input)?.[1] ?? ''}
                </Box>
                <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                  {CIRCLE_CHARS.filter(
                    ([k]) => k.startsWith(state.input) && k !== state.input,
                  ).length > 0 &&
                    CIRCLE_CHARS.filter(
                      ([k]) => k.startsWith(state.input) && k !== state.input,
                    ).map(([k, v]) => (
                      <Character
                        key={k}
                        value={v}
                        onCopy={onCopyChar}
                        active={false}
                        label={k.slice(state.input.length)}
                      />
                    ))}
                </Stack>
                <Box>
                  Enter, Space, Tab 키를 눌러 입력을 마칩니다. Backspace 키로
                  입력을 지울 수 있습니다.
                </Box>
              </Stack>
            </Alert>
          )}
        </Stack>
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
                              state?.type === 'hanja' &&
                              state.category === category &&
                              state.page === i
                            }
                            label={
                              state?.type === 'hanja' &&
                              state.category === category &&
                              state.page === i
                                ? (j + 1).toString()
                                : undefined
                            }
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
