import React, { useState, useRef, useEffect, useContext } from 'react'
import { Box, TextField, Button, Typography, Snackbar, Container, Stack, Paper, IconButton, Link } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthContext } from '../contexts/AuthContext'
import PasswordInput from '../components/PasswordInput'

export default function ForgotPassword() {
  const [step, setStep] = useState(0) // 0: Enter email, 1: Enter OTP and Reset Password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [snackOpen, setSnackOpen] = useState(false)
  const [snackMessage, setSnackMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  const emailRef = useRef(null)
  const otpRef = useRef(null)
  const navigate = useNavigate()
  const { requestPasswordResetOtp, resetPasswordWithOtp } = useContext(AuthContext)

  useEffect(() => {
    if (step === 0 && emailRef.current) {
      emailRef.current.focus()
    } else if (step === 1 && otpRef.current) {
      otpRef.current.focus()
    }
  }, [step])

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  const handleRequestOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const response = await requestPasswordResetOtp(email)
      setSnackMessage(response.message || 'Verification code sent successfully.')
      setSnackOpen(true)
      setStep(1)
      setResendTimer(60)
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to send verification code.'
      setError(errMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendTimer > 0) return
    setLoading(true)
    setError('')
    try {
      const response = await requestPasswordResetOtp(email)
      setSnackMessage(response.message || 'Verification code resent successfully.')
      setSnackOpen(true)
      setResendTimer(60)
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to resend code.'
      setError(errMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit verification code.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const response = await resetPasswordWithOtp(email, otp, password)
      setSnackMessage(response.message || 'Password reset successfully!')
      setSnackOpen(true)
      setTimeout(() => {
        navigate('/auth')
      }, 2000)
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to reset password.'
      setError(errMsg)
    } finally {
      setLoading(false)
    }
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
                <IconButton onClick={() => step === 1 ? setStep(0) : navigate('/auth')} sx={{ border: '1px solid rgba(15,23,42,0.08)', bgcolor: '#F8FAFC' }}>
                   <ArrowBackIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <Typography sx={{ fontWeight: 800, fontSize: 20 }}>
                  {step === 0 ? 'Forgot Password' : 'Reset Password'}
                </Typography>
              </Box>

              <AnimatePresence mode="wait">
                {step === 0 ? (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Stack spacing={3}>
                      <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                        Enter your email address and we'll send you a 6-digit verification code to reset your password.
                      </Typography>

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
                        onClick={handleRequestOtp}
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
                        {loading ? 'Sending Code...' : 'Send Verification Code'}
                      </Button>

                      <Box sx={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                        <Link component="button" variant="body2" onClick={() => navigate('/auth')} sx={{ color: '#6D4AFF', fontWeight: 700, textDecoration: 'none' }}>
                          Back to Sign In
                        </Link>
                      </Box>
                    </Stack>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Stack spacing={2.5}>
                      <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                        We sent a 6-digit code to <strong>{email}</strong>. Enter it below along with your new password.
                      </Typography>

                      <TextField 
                        fullWidth 
                        label="Verification Code" 
                        placeholder="123456"
                        value={otp} 
                        onChange={(e) => {
                          setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                          setError('')
                        }} 
                        inputRef={otpRef}
                        error={!!error}
                        InputProps={{
                          startAdornment: (
                            <LockOutlinedIcon sx={{ color: 'rgba(15,23,42,0.38)', mr: 1.5, fontSize: 20 }} />
                          )
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px'
                          }
                        }}
                      />

                      <PasswordInput 
                        id="new-password"
                        name="new-password"
                        label="New Password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          setError('')
                        }}
                      />

                      <PasswordInput 
                        id="confirm-password"
                        name="confirm-password"
                        label="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          setError('')
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
                        onClick={handleResetPassword}
                        disabled={!otp || !password || !confirmPassword || loading}
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
                        {loading ? 'Resetting Password...' : 'Reset Password'}
                      </Button>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link 
                          component="button" 
                          variant="body2" 
                          onClick={() => setStep(0)} 
                          sx={{ color: '#64748B', fontWeight: 600, textDecoration: 'none' }}
                        >
                          Change Email
                        </Link>

                        <Link 
                          component="button" 
                          variant="body2" 
                          onClick={handleResendOtp}
                          disabled={resendTimer > 0 || loading}
                          sx={{ 
                            color: resendTimer > 0 ? '#94A3B8' : '#6D4AFF', 
                            fontWeight: 700, 
                            textDecoration: 'none',
                            cursor: resendTimer > 0 ? 'default' : 'pointer'
                          }}
                        >
                          {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
                        </Link>
                      </Box>
                    </Stack>
                  </motion.div>
                )}
              </AnimatePresence>
            </Stack>
          </Paper>
        </motion.div>
      </Container>

      <Snackbar 
        open={snackOpen} 
        autoHideDuration={4000} 
        onClose={() => setSnackOpen(false)} 
        message={snackMessage} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  )
}
