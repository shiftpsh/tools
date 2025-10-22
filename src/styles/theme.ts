import { createTheme } from '@mui/material'
import { shade, tint } from 'polished'

const FONTS = `"Pretendard","Inter","Noto Sans JP",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple string Emoji","Segoe UI Emoji","Segoe UI Symbol"`

const SHIFTED_RUBY = '#ff3b57'
const SHIFTED_GOLD = '#ffa71a'
const SHIFTED_MIDNIGHT = '#0b1b38'

export const theme = createTheme({
  typography: {
    fontFamily: FONTS,
  },
  palette: {
    primary: {
      main: SHIFTED_RUBY,
      light: tint(0.2, SHIFTED_RUBY),
      dark: shade(0.2, SHIFTED_RUBY),
    },
    secondary: {
      main: SHIFTED_GOLD,
      light: tint(0.2, SHIFTED_GOLD),
      dark: shade(0.2, SHIFTED_GOLD),
    },
    grey: {
      900: tint(0.1, SHIFTED_MIDNIGHT),
      800: tint(0.2, SHIFTED_MIDNIGHT),
      700: tint(0.3, SHIFTED_MIDNIGHT),
      600: tint(0.4, SHIFTED_MIDNIGHT),
      500: tint(0.5, SHIFTED_MIDNIGHT),
      400: tint(0.6, SHIFTED_MIDNIGHT),
      300: tint(0.7, SHIFTED_MIDNIGHT),
      200: tint(0.8, SHIFTED_MIDNIGHT),
      100: tint(0.9, SHIFTED_MIDNIGHT),
      50: tint(0.95, SHIFTED_MIDNIGHT),
      A700: tint(0.3, SHIFTED_MIDNIGHT),
      A400: tint(0.6, SHIFTED_MIDNIGHT),
      A200: tint(0.8, SHIFTED_MIDNIGHT),
      A100: tint(0.9, SHIFTED_MIDNIGHT),
    },
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          color: 'black',
        },
      },
    },
  },
})
