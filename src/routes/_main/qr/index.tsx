import {
  Alert,
  Container,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import QRCode from 'qrcode'
import { useEffect, useState } from 'react'
import { convertToPaths } from './-utils/render'

type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

export const Route = createFileRoute('/_main/qr/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [input, setInput] = useState('')
  const [version, setVersion] = useState<number | null>(null)
  const [errorCorrectionLevel, setErrorCorrectionLevel] =
    useState<ErrorCorrectionLevel>('M')

  const [data, setData] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    let throttleTimeout: NodeJS.Timeout | null = null

    async function generate() {
      try {
        const qr = await QRCode.create(input || 'https://shiftpsh.com', {
          version: version ?? undefined,
          errorCorrectionLevel,
        })
        const { size, data } = qr.modules
        if (isMounted) {
          setData(convertToPaths(size, data))
          setError(null)
        }
      } catch (error) {
        if (isMounted) {
          setError((error as Error).message)
        }
      }
    }

    throttleTimeout && clearTimeout(throttleTimeout)
    throttleTimeout = setTimeout(generate, 300)

    return () => {
      isMounted = false
      throttleTimeout && clearTimeout(throttleTimeout)
    }
  }, [input, version, errorCorrectionLevel])

  return (
    <Container>
      <h1>QR Code Generator</h1>
      <Stack spacing={2}>
        <Alert severity="error">Under Construction</Alert>
        <Alert severity="info">
          Adobe Illustrator에 바로 붙여넣을 수 있는 QR을 생성합니다. 모든 검은색
          영역은 그룹되어 있고 가능한 한 최소 개수의 패스로 구성됩니다.
          <br />
          다른 QR 생성기와 달리 광고를 삽입하지 않고, 정사각형 QR 코드를
          생성하며, 래스터 시 사각형들 사이에 간격이 생기지 않도록 합니다.
        </Alert>
        <Paper
          sx={{
            fontFamily: 'monospace',
            whiteSpace: 'pre',
            lineHeight: 0.8,
            p: 2,
          }}
        >
          <div
            style={{
              maxWidth: 256,
              margin: '0 auto',
            }}
            dangerouslySetInnerHTML={{ __html: data }}
          />
        </Paper>
        {error && <Alert severity="error">{error}</Alert>}
        <Paper sx={{ p: 2 }}>
          <Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography sx={{ flex: 1, minWidth: 0 }}>입력 데이터</Typography>
              <TextField
                sx={{ flex: 3, minWidth: 0 }}
                fullWidth
                value={input}
                multiline
                onChange={(e) => setInput(e.target.value)}
                placeholder="https://shiftpsh.com"
              />
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center" mt={2}>
              <Typography sx={{ flex: 1, minWidth: 0 }}>
                버전 (크기, 1-40, 자동 선택 시 비워두기)
              </Typography>
              <TextField
                sx={{ flex: 3, minWidth: 0 }}
                fullWidth
                type="number"
                inputProps={{ min: 1, max: 40 }}
                value={version ?? ''}
                onChange={(e) =>
                  setVersion(
                    e.target.value
                      ? Math.max(1, Math.min(40, Number(e.target.value)))
                      : null,
                  )
                }
                placeholder="자동 선택"
              />
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center" mt={2}>
              <Typography sx={{ flex: 1, minWidth: 0 }}>
                오류 수정 수준
              </Typography>
              <Select
                sx={{ flex: 3, minWidth: 0 }}
                value={errorCorrectionLevel}
                onChange={(e) =>
                  setErrorCorrectionLevel(
                    e.target.value as ErrorCorrectionLevel,
                  )
                }
              >
                <MenuItem value="L">L - 약 7% 복원 가능</MenuItem>
                <MenuItem value="M">M - 약 15% 복원 가능</MenuItem>
                <MenuItem value="Q">Q - 약 25% 복원 가능</MenuItem>
                <MenuItem value="H">H - 약 30% 복원 가능</MenuItem>
              </Select>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  )
}
