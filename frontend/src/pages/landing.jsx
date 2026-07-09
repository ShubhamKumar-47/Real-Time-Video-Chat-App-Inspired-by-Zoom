import React from 'react'
import { motion } from 'framer-motion'
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
  Chip,
  TextField,
  Paper,
  Avatar,
  AvatarGroup
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import GoogleIcon from '@mui/icons-material/Google'
import GitHubIcon from '@mui/icons-material/GitHub'
import BoltIcon from '@mui/icons-material/Bolt'
import VideocamIcon from '@mui/icons-material/Videocam'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { useNavigate } from 'react-router-dom'
import MeetingPreview from '../components/MeetingPreview'

const heroHighlights = ['HD Meetings', 'AI Notes', 'Screen Sharing', 'End-to-End Encryption']
const trustedBy = ['Stripe', 'Notion', 'Linear', 'Zoom', 'Pitch']

const featureItems = [
  {
    icon: BoltOutlinedIcon,
    title: 'One-click meetings',
    description: 'Launch a secure call in seconds with an elegant interface and instant join links.'
  },
  {
    icon: CalendarTodayOutlinedIcon,
    title: 'Smart collaboration',
    description: 'Share notes, files, and outcomes without scattered tabs or friction.'
  },
  {
    icon: GroupOutlinedIcon,
    title: 'Reliable sync',
    description: 'Dependable audio and video that keeps every team aligned, even across time zones.'
  }
]

const whyItems = [
  {
    icon: LockOutlinedIcon,
    title: 'Secure',
    description: 'End-to-end encryption and meeting controls for every call.'
  },
  {
    icon: BoltOutlinedIcon,
    title: 'Fast join',
    description: 'Instant meeting access with one click and minimal setup.'
  },
  {
    icon: GroupOutlinedIcon,
    title: 'Team friendly',
    description: 'Built for collaborative workflows and easy coordination.'
  }
]

const whyStats = [
  { value: '99.9%', label: 'Uptime', icon: BoltOutlinedIcon },
  { value: '50K+', label: 'Meetings', icon: GroupOutlinedIcon },
  { value: '24/7', label: 'Support', icon: CalendarTodayOutlinedIcon },
  { value: '256-bit', label: 'Encryption', icon: LockOutlinedIcon }
]

const faqs = [
  { question: 'Can I use EasyMeet for external clients?', answer: 'Yes — invite guests with secure links, no account required.' },
  { question: 'What is included in AI summaries?', answer: 'Meeting highlights, action items, and key timestamps are generated automatically.' },
  { question: 'Does it work on mobile?', answer: 'Yes, the interface adapts beautifully to browser-based phones and tablets.' }
]

const floatVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
}

export default function LandingPage() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMd = useMediaQuery(theme.breakpoints.up('md'))

  return (    <Box sx={{ minHeight: '100%', background: 'radial-gradient(circle at top left, rgba(99,102,241,0.18), transparent 24%), radial-gradient(circle at bottom right, rgba(59,130,246,0.14), transparent 28%), #FAFBFD', color: 'text.primary' }}>
      <Box component={motion.section} initial="hidden" animate="visible" variants={floatVariant} sx={{ pt: { xs: 5, sm: 7, lg: 9 }, pb: { xs: 5, sm: 7, lg: 9 } }}>
        <Container maxWidth="xl" sx={{ maxWidth: 1280, px: { xs: 3, sm: 4, md: 5 } }}>
          <Grid container spacing={{ xs: 4, lg: 6 }} alignItems="center">
            <Grid size={{ xs: 12, lg: 5.2 }}>
              <Stack spacing={3} sx={{ maxWidth: 620, alignItems: { xs: 'center', md: 'flex-start' }, textAlign: { xs: 'center', md: 'left' } }}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2, px: 2.5, py: 1, borderRadius: '8px', bgcolor: 'rgba(109,74,255,0.08)', color: 'primary.main', fontWeight: 700, letterSpacing: 0.8, fontSize: 12.5, width: 'fit-content' }}>
                  <BoltOutlinedIcon sx={{ fontSize: 18 }} />
                  Premium meetings for fast-moving teams.
                </Box>

                <Typography variant="h1" component="h1" sx={{ letterSpacing: '-0.04em', maxWidth: 540 }}>
                  A premium meeting experience that feels effortless.
                </Typography>

                <Typography variant="body1" sx={{ maxWidth: 480, color: 'text.secondary' }}>
                  EasyMeet delivers secure calls, live collaboration, and AI-powered notes inside a clean modern workspace.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ width: '100%' }}>
                  <Button
                    onClick={() => navigate('/auth')}
                    variant="contained"
                    sx={{
                      width: { xs: '100%', sm: 'auto' },
                      minHeight: 48,
                      px: 4,
                      py: 1.5,
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #6D4AFF, #8B5CF6)',
                      boxShadow: '0 16px 40px rgba(109,74,255,0.12)',
                      textTransform: 'none',
                      fontWeight: 700,
                      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 22px 50px rgba(109,74,255,0.16)' }
                    }}
                  >
                    Create workspace
                  </Button>
                  <Button
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                    variant="outlined"
                    sx={{
                      width: { xs: '100%', sm: 'auto' },
                      minHeight: 48,
                      px: 4,
                      py: 1.5,
                      borderRadius: '10px',
                      borderColor: 'rgba(109,74,255,0.2)',
                      color: 'text.primary',
                      textTransform: 'none',
                      fontWeight: 700,
                      '&:hover': { borderColor: 'rgba(109,74,255,0.4)', backgroundColor: 'rgba(109,74,255,0.04)' }
                    }}
                  >
                    Watch demo
                  </Button>
                </Stack>

                {/* Customer Count & Avatar Stack */}
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ pt: 0.5 }}>
                  <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 30, height: 30, fontSize: 11, border: '2px solid #fff' } }}>
                    <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&h=60&q=80" />
                    <Avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&h=60&q=80" />
                    <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&h=60&q=80" />
                    <Avatar src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=60&h=60&q=80" />
                  </AvatarGroup>
                  <Typography sx={{ fontSize: 13.5, color: '#64748B', fontWeight: 600 }}>
                    Loved by <span style={{ color: '#6C4CFD', fontWeight: 800 }}>10,000+</span> teams worldwide
                  </Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, lg: 6.8 }}>
              <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', mt: { xs: 0, lg: -2 } }}>
                <Box sx={{ position: 'absolute', top: { xs: -28, md: -38 }, right: { xs: -12, md: -40 }, width: 180, height: 180, borderRadius: '50%', bgcolor: 'rgba(99,102,241,0.16)', filter: 'blur(110px)', pointerEvents: 'none' }} />
                <Box sx={{ position: 'absolute', bottom: { xs: -18, md: -32 }, left: { xs: -12, md: -40 }, width: 180, height: 160, borderRadius: '50%', bgcolor: 'rgba(79,70,229,0.14)', filter: 'blur(96px)', pointerEvents: 'none' }} />

                <MeetingPreview />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>


      <Box component={motion.section} id="features" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={floatVariant} sx={{ pt: { xs: 5, sm: 7, lg: 9 }, pb: { xs: 5, sm: 7, lg: 9 }, background: '#fff' }}>
        <Container maxWidth="xl" sx={{ maxWidth: 1280, px: { xs: 3, sm: 4, md: 5 } }}>
          <Box sx={{ maxWidth: 720, mx: 'auto', textAlign: 'center', mb: 4 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>Features</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 17, lineHeight: 1.75 }}>
              Everything you need for secure meetings, real-time collaboration, and reliable team communication.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } }}>
            {featureItems.map((feature) => {
              const Icon = feature.icon
              return (
                <Box
                  key={feature.title}
                  sx={{
                    height: 230,
                    p: 3,
                    borderRadius: '20px',
                    bgcolor: '#fff',
                    border: '1px solid rgba(15,23,42,0.06)',
                    boxShadow: '0 12px 40px rgba(15,23,42,0.03)',
                    transition: 'all 240ms cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 20px 48px rgba(15,23,42,0.07)',
                      borderColor: 'rgba(109,74,255,0.15)'
                    }
                  }}
                >
                  <Box sx={{ width: 44, height: 44, borderRadius: '10px', display: 'grid', placeItems: 'center', bgcolor: 'rgba(109,74,255,0.06)', color: '#6D4AFF' }}>
                    <Icon sx={{ fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: 19, mt: 1, mb: 0.5, color: '#0F172A' }}>{feature.title}</Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 14.5, lineHeight: 1.6 }}>{feature.description}</Typography>
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Container>
      </Box>

      <Box component={motion.section} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={floatVariant} sx={{ pt: { xs: 5, sm: 7, lg: 9 }, pb: { xs: 5, sm: 7, lg: 9 } }}>
        <Container maxWidth="xl" sx={{ maxWidth: 1280, px: { xs: 3, sm: 4, md: 5 } }}>
          <Box sx={{ maxWidth: 760, mx: 'auto', textAlign: 'center', mb: 4 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>Why Choose EasyMeet</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 17, lineHeight: 1.75 }}>
              Built for fast, secure, and effortless meetings without the clutter.
            </Typography>
          </Box>

          <Stack spacing={3} sx={{ mb: 4 }}>
            {[
              { 
                title: "Zero Setup Required", 
                description: "No downloads or installations required. Start meetings in one click right from your browser.", 
                stat: "1-Click Host", 
                icon: BoltIcon, 
                bg: 'rgba(108, 76, 253, 0.05)', 
                color: '#6C4CFD' 
              },
              { 
                title: "HD Video & Audio Streams", 
                description: "Ultra-low latency audio and crystal-clear video streaming powered by WebRTC technology.", 
                stat: "99.9% Uptime", 
                icon: VideocamIcon, 
                bg: 'rgba(14, 165, 233, 0.05)', 
                color: '#0EA5E9' 
              },
              { 
                title: "AI Companion Integration", 
                description: "Summarize action items, capture live transcripts, and draft follow-ups automatically.", 
                stat: "100% Automated", 
                icon: AutoAwesomeIcon, 
                bg: 'rgba(16, 185, 129, 0.05)', 
                color: '#10B981' 
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Box
                  key={item.title}
                  component={motion.div}
                  whileHover={{ y: -3, scale: 1.005 }}
                  transition={{ duration: 0.2 }}
                  sx={{
                    p: 2.5,
                    borderRadius: '20px',
                    bgcolor: '#fff',
                    border: '1px solid rgba(15,23,42,0.06)',
                    boxShadow: '0 12px 32px rgba(15, 23, 42, 0.02)',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'flex-start', md: 'center' },
                    justifyContent: 'space-between',
                    gap: 3,
                    transition: 'all 240ms ease',
                    '&:hover': {
                      boxShadow: '0 16px 40px rgba(15, 23, 42, 0.04)',
                      borderColor: 'rgba(108, 76, 253, 0.15)'
                    }
                  }}
                >
                  <Stack direction="row" spacing={2.5} alignItems="center" sx={{ flex: 1 }}>
                    <Box sx={{ width: 46, height: 46, borderRadius: '12px', display: 'grid', placeItems: 'center', bgcolor: item.bg, color: item.color, flexShrink: 0 }}>
                      <Icon sx={{ fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: 18, color: '#0F172A', mb: 0.5 }}>{item.title}</Typography>
                      <Typography sx={{ color: '#64748B', fontSize: 14.5, lineHeight: 1.55, maxWidth: 680 }}>{item.description}</Typography>
                    </Box>
                  </Stack>
                  <Chip 
                    label={item.stat} 
                    size="small" 
                    sx={{ 
                      bgcolor: item.bg, 
                      color: item.color, 
                      fontWeight: 800, 
                      fontSize: 11.5,
                      px: 1.2,
                      py: 1.8,
                      borderRadius: '8px',
                      alignSelf: { xs: 'flex-start', md: 'center' }
                    }} 
                  />
                </Box>
              )
            })}
          </Stack>

          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' } }}>
            {whyStats.map((stat) => {
              const StatIcon = stat.icon;
              return (
                <Box 
                  key={stat.label} 
                  sx={{ 
                    p: 2.5, 
                    borderRadius: '20px', 
                    border: '1px solid rgba(15,23,42,0.06)', 
                    bgcolor: '#fff', 
                    boxShadow: '0 12px 32px rgba(15,23,42,0.02)', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between', 
                    minHeight: 120,
                    transition: 'all 240ms ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 16px 40px rgba(15, 23, 42, 0.05)',
                      borderColor: 'rgba(108, 76, 253, 0.15)'
                    }
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                    <Typography sx={{ fontWeight: 900, fontSize: 28, color: '#0F172A', letterSpacing: -0.5 }}>{stat.value}</Typography>
                    <StatIcon sx={{ color: 'rgba(108, 76, 253, 0.6)', fontSize: 20 }} />
                  </Stack>
                  <Typography sx={{ color: '#64748B', mt: 1, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{stat.label}</Typography>
                </Box>
              )
            })}
          </Box>
        </Container>
      </Box>

      {/* FAQs Section */}
      <Box component={motion.section} id="faq" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={floatVariant} sx={{ pt: { xs: 5, sm: 7, lg: 9 }, pb: { xs: 5, sm: 7, lg: 9 }, background: '#fff' }}>
        <Container maxWidth="xl" sx={{ maxWidth: 1280, px: { xs: 3, sm: 4, md: 5 } }}>
          <Box sx={{ maxWidth: 900, mx: 'auto' }}>
            <Typography variant="h2" sx={{ fontWeight: 800, textAlign: 'center', mb: 5 }}>Frequently asked questions</Typography>
            <Stack spacing={2}>
              {faqs.map((item) => (
                <Accordion 
                  key={item.question} 
                  elevation={0} 
                  sx={{ 
                    borderRadius: '12px', 
                    border: '1px solid rgba(15,23,42,0.06)',
                    transition: 'all 240ms cubic-bezier(0.16, 1, 0.3, 1)',
                    '&:hover': {
                      borderColor: 'rgba(108, 76, 253, 0.25)',
                      boxShadow: '0 8px 24px rgba(108, 76, 253, 0.03)',
                      bgcolor: '#FAFBFD'
                    },
                    '&::before': { display: 'none' }
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'text.secondary' }} />}>
                    <Typography sx={{ fontWeight: 700, fontSize: 16.5, color: '#0F172A' }}>{item.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0, pb: 2.5 }}>
                    <Typography sx={{ color: 'text.secondary', fontSize: 15, lineHeight: 1.6 }}>{item.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Contact & CTA Newsletter Section */}
      <Box component={motion.section} id="cta" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={floatVariant} sx={{ pt: { xs: 4, sm: 5, lg: 6 }, pb: { xs: 5, sm: 7, lg: 9 } }}>
        <Container maxWidth="xl" sx={{ maxWidth: 1280, px: { xs: 3, sm: 4, md: 5 } }}>
          <Paper
            sx={{
              p: { xs: 3.5, sm: 5, md: 6 },
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(15,23,42,0.18)'
            }}
          >
            <Box sx={{ position: 'absolute', top: -100, right: -100, width: 240, height: 240, borderRadius: '50%', bgcolor: 'rgba(109,74,255,0.15)', filter: 'blur(80px)' }} />
            <Box sx={{ position: 'absolute', bottom: -100, left: -100, width: 240, height: 240, borderRadius: '50%', bgcolor: 'rgba(6,182,212,0.12)', filter: 'blur(80px)' }} />

            <Stack spacing={3.5} alignItems="center" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
              <Box>
                <Typography sx={{ fontWeight: 900, mb: 1.5, color: '#fff', fontSize: { xs: '2rem', md: '2.5rem' }, letterSpacing: -0.8 }}>
                  Ready to level up your team communication?
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 15.5, maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}>
                  Join thousands of fast-moving companies using EasyMeet for high-quality audio, video, and collaborative notes.
                </Typography>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%', maxWidth: 500, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  placeholder="Enter your email address"
                  variant="outlined"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.06)',
                    input: { color: '#fff', py: 0 },
                    '& .MuiOutlinedInput-root': {
                      height: 48,
                      borderRadius: '10px',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&.Mui-focused fieldset': { borderColor: '#6D4AFF' }
                    }
                  }}
                />
                <Button
                  onClick={() => alert("Subscription request submitted (mock)")}
                  variant="contained"
                  sx={{
                    width: { xs: '100%', sm: 'auto' },
                    height: 48,
                    px: 4,
                    borderRadius: '10px',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #6D4AFF, #8B5CF6)',
                    color: '#fff',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 12px 30px rgba(109,74,255,0.22)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5B3FE6, #7C3AED)'
                    }
                  }}
                >
                  Start Free Trial
                </Button>
              </Stack>

              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                No credit card required. Cancel anytime.
              </Typography>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </Box>
  )
}
