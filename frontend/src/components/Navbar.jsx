import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import MenuIcon from '@mui/icons-material/Menu'
import { Box, Container, Drawer, List, ListItemButton, ListItemText, Divider } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close'
import Logo from './Logo'

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#cta' }
]

export default function Navbar() {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('md'))
  const [scrolled, setScrolled] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const location = useLocation()

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        background: scrolled ? 'rgba(255,255,255,0.7)' : 'transparent',
        color: 'text.primary',
        borderBottom: scrolled ? '1px solid rgba(15,23,42,0.06)' : '1px solid transparent',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'all 240ms ease'
      }}
    >
      <Container maxWidth="xl" sx={{ maxWidth: 1280 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 80, px: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Logo size={42} />
            <Typography variant="h6" component={RouterLink} to="/" sx={{ textDecoration: 'none', color: 'text.primary', fontWeight: 900, letterSpacing: 0.2 }}>
              EasyMeet.space
            </Typography>
          </Box>

          {mobile ? (
            <IconButton edge="end" color="inherit" aria-label="menu" onClick={() => setOpen(true)}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component="a"
                  href={item.href}
                  color="inherit"
                  sx={{
                    px: 1.5,
                    py: 1,
                    color: 'text.secondary',
                    fontWeight: 600,
                    '&:hover': { color: 'text.primary', bgcolor: 'rgba(79,70,229,0.06)' }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button component={RouterLink} to="/auth" sx={{ color: 'text.secondary', fontWeight: 600 }}>Login</Button>
            <Button
              component={RouterLink}
              to="/auth"
              variant="contained"
              sx={{
                px: 3,
                py: 1.2,
                fontWeight: 800,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6D4AFF, #8B5CF6)',
                color: '#fff',
                boxShadow: '0 16px 40px rgba(109,74,255,0.12)',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 22px 50px rgba(109,74,255,0.16)' }
              }}
            >
              Start Meeting
            </Button>
          </Box>
        </Toolbar>
      </Container>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: { xs: '100vw', sm: 280 }, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List>
            {navItems.map((item) => (
              <ListItemButton key={item.label} component="a" href={item.href} onClick={() => setOpen(false)}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button component={RouterLink} to="/auth" sx={{ justifyContent: 'flex-start' }} onClick={() => setOpen(false)}>Login</Button>
            <Button component={RouterLink} to="/auth" variant="contained" sx={{ justifyContent: 'flex-start', bgcolor: 'primary.main', color: '#fff' }} onClick={() => setOpen(false)}>Start Meeting</Button>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  )
}
