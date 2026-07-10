import React, { useState, useRef, useEffect } from 'react'
import { Box, TextField, Button, Typography, Snackbar, Container, Stack, Paper, IconButton, Link } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [snackOpen, setSnackOpen] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const emailRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (emailRef.current) emailRef.current.focus()
  }, [])

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setLoading(true)
    setSnackOpen(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/auth')
    }, 2500)
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at top left, rgba(99,102,241,0.15), transparent 24%), radial-gradient(circle at bottom right, rgba(59,130,246,0.12), transparent 28%), #F8FAFC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Container maxWidth="xs">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Paper sx={{ p: 4, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid rgba(15,23,42,0.06)', boxShadow: '0 40px 120px rgba(15,23,42,0.08)' }}>
            <Stack spacing={3.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <IconButton onClick={() => navigate('/auth')} sx={{ border: '1px solid rgba(15,23,42,0.08)', bgcolor: '#F8FAFC' }}>
                   <ArrowBackIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <Typography sx={{ fontWeight: 800, fontSize: 20 }}>Forgot Password</Typography>
              </Box>

              <Box>
                <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                  Enter your email address and we'll send you instructions to reset your password.
                </Typography>
              </Box>

              <Stack spacing={2.5}>
                <TextField 
                  fullWidth 
                  label="Email Address" 
                  placeholder="you@company.com"
                  value={email} 
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError('')
                  }} 
                  inputRef={emailRef}
                  error={!!error}
                  InputProps={{
                    startAdornment: (
                      <EmailOutlinedIcon sx={{ color: 'rgba(15,23,42,0.38)', mr: 1.5, fontSize: 20 }} />
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px'
                    }
                  }}
                />

                {error && (
                  <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: 'rgba(248,113,113,0.1)', color: '#B91C1C' }}>
                    <Typography sx={{ fontSize: 13.5 }}>{error}</Typography>
                  </Box>
                )}
                
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={handleSubmit}
                  disabled={!email || loading}
                  sx={{ 
                    py: 1.6, 
                    minHeight: 48,
                    borderRadius: '10px', 
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #6D4AFF, #8B5CF6)',
                    boxShadow: '0 12px 30px rgba(109,74,255,0.18)',
                    '&:hover': {
                      boxShadow: '0 16px 40px rgba(109,74,255,0.25)'
                    }
                  }}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </Stack>

              <Box sx={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                <Link component="button" variant="body2" onClick={() => navigate('/auth')} sx={{ color: '#6D4AFF', fontWeight: 700, textDecoration: 'none' }}>
                  Back to Sign In
                </Link>
              </Box>
            </Stack>
          </Paper>
        </motion.div>
      </Container>

      <Snackbar 
        open={snackOpen} 
        autoHideDuration={3000} 
        onClose={() => setSnackOpen(false)} 
        message="Password reset instructions sent (mock)" 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  )
}
