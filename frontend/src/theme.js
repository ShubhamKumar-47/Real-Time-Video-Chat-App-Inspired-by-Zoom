import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6D4AFF',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#8B5CF6'
    },
    info: {
      main: '#06B6D4'
    },
    success: {
      main: '#22C55E'
    },
    background: {
      default: '#F8FAFC',
      paper: '#ffffff'
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B'
    }
  },
  shape: {
    borderRadius: 8
  },
  typography: {
    fontFamily: ['"Plus Jakarta Sans"', 'Inter', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    h1: { 
      fontSize: '32px',
      '@media (min-width:600px)': { fontSize: '38px' },
      '@media (min-width:900px)': { fontSize: '44px' },
      '@media (min-width:1200px)': { fontSize: '52px' },
      fontWeight: 900, 
      lineHeight: 1.1,
      letterSpacing: '-0.03em'
    },
    h2: { 
      fontSize: '26px',
      '@media (min-width:600px)': { fontSize: '30px' },
      '@media (min-width:900px)': { fontSize: '34px' },
      '@media (min-width:1200px)': { fontSize: '40px' },
      fontWeight: 900, 
      lineHeight: 1.15,
      letterSpacing: '-0.02em'
    },
    h3: { 
      fontSize: '22px',
      '@media (min-width:600px)': { fontSize: '24px' },
      '@media (min-width:900px)': { fontSize: '28px' },
      fontWeight: 700, 
      lineHeight: 1.2 
    },
    h4: { 
      fontSize: '18px',
      '@media (min-width:600px)': { fontSize: '20px' },
      fontWeight: 700, 
      lineHeight: 1.3 
    },
    body1: { 
      fontSize: '16px', 
      '@media (min-width:600px)': { fontSize: '18px' },
      lineHeight: 1.8 
    },
    body2: { 
      fontSize: '14px', 
      '@media (min-width:600px)': { fontSize: '16px' },
      lineHeight: 1.7 
    },
    button: { textTransform: 'none', fontWeight: 800 }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          padding: '12px 22px',
          boxShadow: 'none'
        },
        containedPrimary: {
          background: 'linear-gradient(135deg,#6D4AFF,#8B5CF6)'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 12px 40px rgba(15,23,42,0.04)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 16px 48px rgba(15,23,42,0.04)'
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(15,23,42,0.06)',
          boxShadow: 'none',
          '&:not(:last-of-type)': {
            marginBottom: '16px'
          }
        }
      }
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          borderRadius: 12
        }
      }
    }
  }
})

export default theme
