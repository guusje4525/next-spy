import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './features/App.tsx'
import { configure } from "mobx"
import { ThemeProvider, createTheme } from '@mui/material/styles'

configure({
  enforceActions: "never"
})

// Create a custom theme
const theme = createTheme({
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
  palette: {
    mode: 'light', // You can dynamically change this to 'dark' for dark mode
    text: {
      primary: 'rgba(255, 255, 255, 0.87)',
    },
    background: {
      default: '#242424',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // Global styles can be defined here
        ':root': {
          colorScheme: 'light dark',
          fontSynthesis: 'none',
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        body: {
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '320px',
          minHeight: '100vh',
        },
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
