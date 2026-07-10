import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Zoom,
  CircularProgress,
  Avatar
} from '@mui/material'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import GoogleIcon from '@mui/icons-material/Google'
import GitHubIcon from '@mui/icons-material/GitHub'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AuthTextField from '../components/AuthTextField'
import PasswordInput from '../components/PasswordInput'
import { AuthContext } from '../contexts/AuthContext'

const formVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
}

const features = [
  'HD Meetings',
  'AI Notes',
  'Screen Sharing',
  'End-to-End Encryption'
]

export default function Authentication() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [formState, setFormState] = useState(0)
  const [successOpen, setSuccessOpen] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [emailValid, setEmailValid] = useState(true)
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' })

  const { handleRegister, handleLogin } = React.useContext(AuthContext)
  const navigate = useNavigate()
  const theme = useTheme()
  const isMd = useMediaQuery(theme.breakpoints.up('md'))

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const emailParam = params.get('email')
    if (emailParam) {
      setUsername(emailParam)
      setFormState(1)
    }
  }, [])

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/
    setEmailValid(emailRegex.test(username) || usernameRegex.test(username) || username === '')
  }, [username])

  useEffect(() => {
    const score = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length
    if (!password) {
      setPasswordStrength({ score: 0, label: '', color: '' })
    } else if (score <= 1) {
      setPasswordStrength({ score, label: 'Weak', color: 'error.main' })
    } else if (score === 2) {
      setPasswordStrength({ score, label: 'Medium', color: 'warning.main' })
    } else {
      setPasswordStrength({ score, label: 'Strong', color: 'success.main' })
    }
  }, [password])

  const handleAuth = async () => {
    try {
      setLoading(true)
      if (formState === 0) {
        const token = await handleLogin(username, password, rememberMe)
        if (token) {
          setTimeout(() => navigate('/home'), 500)
        }
        setLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        setLoading(false)
        return
      }

      await handleRegister(name, username, password)
      setSuccessOpen(true)
      setError('')
      setFormState(0)
      setPassword('')
      setConfirmPassword('')
      setName('')
      setLoading(false)
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Something went wrong'
      setError(message)
      setLoading(false)
    }
  }

  const toggleForm = (state) => {
    setFormState(state)
    setError('')
  }

  const activeCard = formState === 0

  return (
    <Box sx={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <CssBaseline />
      <Grid container sx={{ minHeight: '100vh' }}>
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'block' }, position: 'relative', background: 'linear-gradient(180deg, #312E81 0%, #1E293B 100%)', color: '#fff', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', width: 320, height: 320, top: -80, right: -80, bgcolor: 'rgba(167,139,250,0.28)', borderRadius: '50%', filter: 'blur(100px)' }} />
          <Box sx={{ position: 'absolute', width: 260, height: 260, top: 160, left: -40, bgcolor: 'rgba(59,130,246,0.18)', borderRadius: '50%', filter: 'blur(90px)' }} />
          <Box sx={{ position: 'absolute', width: 280, height: 240, bottom: 60, right: 40, bgcolor: 'rgba(99,102,241,0.18)', borderRadius: 32, filter: 'blur(80px)' }} />
          
          {/* Glass dashboard status indicator */}
          <Box 
            sx={{ 
              position: 'absolute', 
              background: 'rgba(255,255,255,0.06)', 
              border: '1px solid rgba(255,255,255,0.12)',
              width: 'fit-content',
              whiteSpace: 'nowrap',
              height: 52, 
              borderRadius: '12px', 
              top: 40, 
              right: 40, 
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              px: 2,
              gap: 1.2
            }}
          >
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10B981', boxShadow: '0 0 10px #10B981' }} />
            <Box>
              <Typography sx={{ fontSize: 9.5, fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.8, textTransform: 'uppercase' }}>System Status</Typography>
              <Typography sx={{ fontSize: 11.5, fontWeight: 800, color: '#fff', mt: 0.1 }}>All Services Live</Typography>
            </Box>
          </Box>

          <Box sx={{ position: 'absolute', width: 100, height: 100, top: 80, left: 60, bgcolor: 'rgba(167,139,250,0.12)', borderRadius: '50%', filter: 'blur(80px)' }} />
          <Box sx={{ position: 'absolute', width: 160, height: 120, bottom: 180, left: 60, bgcolor: 'rgba(99,102,241,0.14)', borderRadius: 4, filter: 'blur(70px)' }} />
          <Box sx={{ position: 'absolute', width: 180, height: 220, top: 140, right: 120, bgcolor: 'rgba(59,130,246,0.08)', borderRadius: 32, filter: 'blur(90px)' }} />
          <Box sx={{ position: 'absolute', width: 220, height: 140, bottom: 60, right: 120, bgcolor: 'rgba(167,139,250,0.12)', borderRadius: 32, filter: 'blur(80px)' }} />
 
          <Box sx={{ position: 'relative', height: '100%', px: 7, py: 9, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.6)', fontWeight: 800, fontSize: 11, mb: 2.5 }}>EasyMeet.space</Typography>
              <Typography sx={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.1, mb: 2.5, letterSpacing: '-0.02em' }}>Welcome to EasyMeet.space</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, maxWidth: 380, lineHeight: 1.7 }}>Secure meetings for modern teams.</Typography>
            </Box>
 
            <Stack spacing={2} sx={{ mt: 4 }}>
              {features.map((item) => (
                <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.8, color: '#fff', opacity: 0.95 }}>
                  <CheckCircleIcon sx={{ color: '#10B981', fontSize: 20, flexShrink: 0 }} />
                  <Typography sx={{ fontWeight: 600, fontSize: 15.5 }}>{item}</Typography>
                </Box>
              ))}
            </Stack>
 
            <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', gap: 3, color: 'rgba(255,255,255,0.85)' }}>
              <Stack direction="row" spacing={-1.2}>
                {[
                  { initial: 'JD', bg: '#6D4AFF' },
                  { initial: 'AK', bg: '#06B6D4' },
                  { initial: 'ST', bg: '#10B981' },
                  { initial: 'ML', bg: '#F59E0B' }
                ].map((av, index) => (
                  <Avatar 
                    key={index} 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      fontSize: 13, 
                      fontWeight: 800, 
                      bgcolor: av.bg, 
                      color: '#fff', 
                      border: '2px solid #1E293B',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                    }}
                  >
                    {av.initial}
                  </Avatar>
                ))}
              </Stack>
              <Box>
                <Typography sx={{ fontWeight: 700 }}>Trusted by 25,000+ teams</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: { xs: 3, md: 6 }, py: { xs: 4, md: 4 }, bgcolor: '#F8FAFC' }}>
          <motion.div initial="hidden" animate="visible" variants={formVariants} style={{ width: '100%', maxWidth: 450 }}>
            <Box sx={{ width: '100%', borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid rgba(15,23,42,0.06)', boxShadow: '0 30px 90px rgba(15,23,42,0.05)', p: { xs: 3, md: 4 } }}>
              <Stack spacing={2.2}>
                <Box sx={{ mb: 0.5 }}>
                  <Typography sx={{ fontSize: '2.1rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>{activeCard ? 'Welcome Back' : 'Create your workspace'}</Typography>
                  <Typography sx={{ mt: 0.5, color: '#64748B', fontSize: 14.5 }}>{activeCard ? 'Continue to your workspace' : 'Start collaborating in minutes.'}</Typography>
                </Box>

                <Stack direction="row" spacing={2}>
                  <Button fullWidth startIcon={<GoogleIcon />} sx={{ textTransform: 'none', borderRadius: '10px', py: 1, minHeight: 40, color: '#0F172A', border: '1px solid rgba(15,23,42,0.08)', backgroundColor: '#F8FAFC', fontSize: 13.5, '&:hover': { backgroundColor: '#F1F5F9', transform: 'translateY(-1px)' } }}>
                    Google
                  </Button>
                  <Button fullWidth startIcon={<GitHubIcon />} sx={{ textTransform: 'none', borderRadius: '10px', py: 1, minHeight: 40, color: '#0F172A', border: '1px solid rgba(15,23,42,0.08)', backgroundColor: '#F8FAFC', fontSize: 13.5, '&:hover': { backgroundColor: '#F1F5F9', transform: 'translateY(-1px)' } }}>
                    GitHub
                  </Button>
                </Stack>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 1 }}>
                  <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(15,23,42,0.08)' }} />
                  <Typography sx={{ color: '#64748B', fontSize: 13, whiteSpace: 'nowrap' }}>or continue with email</Typography>
                  <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(15,23,42,0.08)' }} />
                </Box>

                <Stack spacing={2}>
                  {formState === 1 && (
                    <AuthTextField
                      label="Full Name"
                      icon={PersonOutlinedIcon}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                    />
                  )}

                  <AuthTextField
                    label="Username"
                    icon={PersonOutlinedIcon}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username or email"
                    error={!emailValid}
                    helperText={!emailValid ? 'Enter a valid email or alphanumeric username (min 3 characters)' : ''}
                  />

                  <PasswordInput
                    id="password"
                    name="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  {formState === 1 && (
                    <PasswordInput
                      id="confirmPassword"
                      name="confirmPassword"
                      label="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  )}

                  {passwordStrength.label && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: passwordStrength.color, fontWeight: 600, fontSize: 13 }}>
                      <Typography sx={{ fontSize: 12.5 }}>{passwordStrength.label} password</Typography>
                      <Typography sx={{ fontSize: 12.5 }}>{passwordStrength.score}/4</Typography>
                    </Box>
                  )}
                </Stack>

                {error && (
                  <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: 'rgba(248,113,113,0.1)', color: '#B91C1C' }}>
                    <Typography sx={{ fontSize: 13.5 }}>{error}</Typography>
                  </Box>
                )}

                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
                  <FormControlLabel
                    control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} sx={{ color: '#6D4AFF', '&.Mui-checked': { color: '#6D4AFF' } }} />}
                    label={<Typography sx={{ color: '#64748B', fontSize: 13.5 }}>Remember me</Typography>}
                  />
                  {activeCard && (
                    <Link component="button" variant="body2" onClick={() => navigate('/forgot-password')} sx={{ color: '#6D4AFF', fontWeight: 600, fontSize: 13.5 }}>
                      Forgot password?
                    </Link>
                  )}
                </Stack>

                <Button
                  fullWidth
                  onClick={handleAuth}
                  disabled={loading || (formState === 1 && (!name || !confirmPassword || !emailValid))}
                  sx={{
                    py: 1.2,
                    minHeight: 44,
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: 14.5,
                    background: 'linear-gradient(135deg, #6D4AFF, #8B5CF6)',
                    color: '#fff',
                    boxShadow: '0 16px 40px rgba(109,74,255,0.22)',
                    transition: 'transform 180ms ease, box-shadow 180ms ease',
                    '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 20px 48px rgba(109,74,255,0.26)' }
                  }}
                >
                  {loading ? <CircularProgress size={18} color="inherit" /> : activeCard ? 'Sign In' : 'Create Account'}
                </Button>


                <Box sx={{ textAlign: 'center', color: '#64748B' }}>
                  {activeCard ? (
                    <>
                      Don&apos;t have an account?{' '}
                      <Link component="button" variant="body2" onClick={() => toggleForm(1)} sx={{ color: '#6D4AFF', fontWeight: 700 }}>
                        Create account →
                      </Link>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <Link component="button" variant="body2" onClick={() => toggleForm(0)} sx={{ color: '#6D4AFF', fontWeight: 700 }}>
                        Sign In →
                      </Link>
                    </>
                  )}
                </Box>
              </Stack>
            </Box>
          </motion.div>
        </Grid>
      </Grid>

      <Dialog open={successOpen} onClose={() => setSuccessOpen(false)} aria-labelledby="signup-success-title" TransitionComponent={Zoom} keepMounted fullWidth maxWidth="xs">
        <DialogTitle id="signup-success-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleIcon color="success" fontSize="large" />
          <Typography variant="h6">Signup Successful!</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>Your account has been created successfully. Please log in to continue.</Typography>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={() => setSuccessOpen(false)}>Close</Button>
          <Button variant="contained" onClick={() => { setSuccessOpen(false); toggleForm(0); }} sx={{ backgroundColor: '#6D4AFF', '&:hover': { backgroundColor: '#5B35F8' } }}>
            Go to Login
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
