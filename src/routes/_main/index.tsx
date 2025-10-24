import { Container, Paper, Stack } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/')({
  component: App,
})

function App() {
  return (
    <Container>
      <Stack spacing={2} sx={{ mb: 2, mt: 2 }}>
        <Paper sx={{ p: 2 }}>
          개인적 필요에 의해 만든 도구 모음입니다. 사이트가 깔끔하지 않을 수
          있습니다. (ㅠㅠ)
        </Paper>
        <Paper sx={{ p: 2 }}>
          만든 사람: <a href="https://shiftpsh.com">shiftpsh</a>
        </Paper>
      </Stack>
    </Container>
  )
}
