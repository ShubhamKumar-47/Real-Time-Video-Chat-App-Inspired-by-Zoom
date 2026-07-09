import React from 'react'
import { Box, Typography, Link, IconButton, Container, Stack } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import Logo from './Logo'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#cta' }
]

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/ShubhamKumar-47', icon: <GitHubIcon sx={{ fontSize: 20 }} /> },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/shubhamkumar47/', icon: <LinkedInIcon sx={{ fontSize: 20 }} /> }
]

export default function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: '#0F172A', 
        borderTop: '1px solid rgba(255,255,255,0.06)', 
        color: 'rgba(255,255,255,0.5)', 
        py: 2.5,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Ambient background glow bubbles */}
      <Box sx={{ position: 'absolute', bottom: -50, right: -50, width: 140, height: 140, borderRadius: '50%', bgcolor: 'rgba(109,74,255,0.08)', filter: 'blur(50px)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', top: -50, left: -50, width: 140, height: 140, borderRadius: '50%', bgcolor: 'rgba(6,182,212,0.06)', filter: 'blur(50px)', pointerEvents: 'none' }} />

      <Container maxWidth="xl" sx={{ maxWidth: 1280, px: { xs: 3, sm: 4, md: 5 }, mx: 'auto', position: 'relative', zIndex: 1 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 1.5, textAlign: { xs: 'center', sm: 'left' } }}>
              <Logo size={32} />
              <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography sx={{ fontWeight: 800, fontSize: 17, color: '#fff', letterSpacing: 0.5 }}>EasyMeet.space</Typography>
                <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', mt: 0.2 }}>Secure meetings for modern teams.</Typography>
              </Box>
            </Box>
            
            <Stack direction="row" flexWrap="wrap" spacing={3} sx={{ justifyContent: { xs: 'center', sm: 'flex-end' }, gap: { xs: 2, sm: 3 } }}>
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  underline="none"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 13.5,
                    fontWeight: 600,
                    transition: 'color 0.2s ease',
                    '&:hover': { color: '#6D4AFF' }
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </Stack>
          </Box>

          <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(255,255,255,0.05)' }} />

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: { xs: 'center', sm: 'left' } }}>
              © 2026 EasyMeet.space. All rights reserved. Developed with ❤️ by {' '}
              <Link 
                href="https://github.com/ShubhamKumar-47" 
                target="_blank" 
                rel="noopener" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#6D4AFF', 
                  textDecoration: 'none', 
                  transition: 'color 0.2s ease',
                  '&:hover': { color: '#8B5CF6', textDecoration: 'underline' } 
                }}
              >
                Shubham Kumar
              </Link>
            </Typography>

            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              {socialLinks.map((item) => (
                <IconButton
                  key={item.label}
                  component={Link}
                  href={item.href}
                  target="_blank"
                  rel="noopener"
                  aria-label={item.label}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.1)',
                    bgcolor: 'transparent',
                    color: 'rgba(255,255,255,0.7)',
                    p: 0.5,
                    transition: 'all 0.22s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #6D4AFF, #8B5CF6)',
                      color: '#fff',
                      borderColor: 'transparent',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  {React.cloneElement(item.icon, { sx: { fontSize: 17 } })}
                </IconButton>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}
