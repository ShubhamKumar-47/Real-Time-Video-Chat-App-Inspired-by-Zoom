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
  { value: '99.9%', label: 'Uptime' },
  { value: '50K+', label: 'Meetings' },
  { value: '24/7', label: 'Support' },
  { value: '256-bit', label: 'Encryption' }
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

  return (
    <Box sx={{ minHeight: '100%', background: 'radial-gradient(circle at top left, rgba(99,102,241,0.18), transparent 24%), radial-gradient(circle at bottom right, rgba(59,130,246,0.14), transparent 28%), #F8FAFC', color: 'text.primary' }}>
      <Box component={motion.section} initial="hidden" animate="visible" variants={floatVariant} sx={{ pt: { xs: 6, sm: 8, md: 10 }, pb: { xs: 6, sm: 8, md: 10 } }}>
        <Container maxWidth="xl" sx={{ maxWidth: 1280, px: { xs: 3, sm: 4, md: 5 } }}>
          <Grid container spacing={{ xs: 4, lg: 6 }} alignItems="center">
            <Grid size={{ xs: 12, lg: 5.2 }}>
              <Stack spacing={3} sx={{ maxWidth: 620, alignItems: { xs: 'center', md: 'flex-start' }, textAlign: { xs: 'center', md: 'left' } }}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2, px: 2.5, py: 1, borderRadius: '8px', bgcolor: 'rgba(109,74,255,0.08)', color: 'primary.main', fontWeight: 700, letterSpacing: 0.8, fontSize: 12.5, width: 'fit-content' }}>
                  <BoltOutlinedIcon sx={{ fontSize: 18 }} />
                  Premium meetings for fast-moving teams.
                </Box>

                <Typography variant="h1" component="h1" sx={{ letterSpacing: '-0.04em', maxWidth: 620 }}>
                  A premium meeting experience that feels effortless.
                </Typography>

                <Typography variant="body1" sx={{ maxWidth: 560, color: 'text.secondary' }}>
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
                      boxShadow: '0 16px 40px rgba(109,74,255,0.18)',
                      textTransform: 'none',
                      fontWeight: 700,
                      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 22px 50px rgba(109,74,255,0.24)' }
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
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ pt: 1.5 }}>
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
              <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ position: 'absolute', top: { xs: -28, md: -38 }, right: { xs: -12, md: -40 }, width: 180, height: 180, borderRadius: '50%', bgcolor: 'rgba(99,102,241,0.16)', filter: 'blur(110px)', pointerEvents: 'none' }} />
                <Box sx={{ position: 'absolute', bottom: { xs: -18, md: -32 }, left: { xs: -12, md: -40 }, width: 180, height: 160, borderRadius: '50%', bgcolor: 'rgba(79,70,229,0.14)', filter: 'blur(96px)', pointerEvents: 'none' }} />

                <MeetingPreview />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Trust Section */}
      <Box sx={{ py: 6, bgcolor: '#F8FAFC', borderTop: '1px solid rgba(15,23,42,0.04)', borderBottom: '1px solid rgba(15,23,42,0.04)' }}>
        <Container maxWidth="xl" sx={{ maxWidth: 1280, px: { xs: 3, sm: 4, md: 5 } }}>
          <Stack spacing={3} alignItems="center">
            <Typography sx={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1.5 }}>
              Trusted by the world's most innovative teams
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: { xs: 4, sm: 6, md: 8 }, 
                color: '#64748B' 
              }}
            >
              {[
                { name: 'Google', svg: <svg width="90" height="24" viewBox="0 0 90 24" fill="currentColor" style={{ opacity: 0.65, transition: 'all 0.25s ease' }}><path d="M9.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.96 5.96 0 018.07 12.5a5.96 5.96 0 015.922-6.014c2.25 0 4.153 1.251 5.093 3.11l3.655-3.655C20.443 3.658 17.472 2 13.992 2c-5.5 0-9.98 4.48-9.98 9.98s4.48 9.98 9.98 9.98c5.783 0 9.873-4.103 9.873-9.914 0-.61-.05-1.22-.153-1.761H12.24z"/></svg> },
                { name: 'Microsoft', svg: <svg width="100" height="24" viewBox="0 0 100 24" fill="currentColor" style={{ opacity: 0.65, transition: 'all 0.25s ease' }}><path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z"/></svg> },
                { name: 'Notion', svg: <svg width="90" height="24" viewBox="0 0 90 24" fill="currentColor" style={{ opacity: 0.65, transition: 'all 0.25s ease' }}><path d="M4.6 2.2h14.8c1 .1 1.7.9 1.7 1.9v15.8c0 1-.7 1.8-1.7 1.9H4.6c-1-.1-1.7-.9-1.7-1.9V4.1c0-1 .7-1.8 1.7-1.9zm3.8 3.5c-.4 0-.7.3-.7.7v10.9c0 .4.3.7.7.7h.5c.3 0 .5-.2.6-.5l3.8-6.1v5.9c0 .4.3.7.7.7h.6c.4 0 .7-.3.7-.7V6.4c0-.4-.3-.7-.7-.7h-.5c-.3 0-.5.2-.6.5L10.3 12.3V6.4c0-.4-.3-.7-.7-.7H8.4z"/></svg> },
                { name: 'Slack', svg: <svg width="90" height="24" viewBox="0 0 90 24" fill="currentColor" style={{ opacity: 0.65, transition: 'all 0.25s ease' }}><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.042a2.528 2.528 0 0 1-2.522 2.52H8.823a2.528 2.528 0 0 1-2.52-2.52v-5.042zM8.823 5.043a2.528 2.528 0 0 1 2.52-2.52 2.528 2.528 0 0 1 2.522 2.52v2.52h-2.522a2.528 2.528 0 0 1-2.52-2.52zm0 1.261a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.52 2.522H3.78a2.528 2.528 0 0 1-2.522-2.522V8.824a2.528 2.528 0 0 1 2.522-2.52h5.043zm10.135 3.78a2.528 2.528 0 0 1 2.52-2.522 2.528 2.528 0 0 1 2.522 2.522 2.528 2.528 0 0 1-2.522 2.52h-2.52v-2.52zm-1.262 0a2.528 2.528 0 0 1-2.52 2.52h-5.043a2.528 2.528 0 0 1-2.522-2.52V3.78a2.528 2.528 0 0 1 2.522-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.043zm-3.78 10.135a2.528 2.528 0 0 1-2.52 2.52 2.528 2.528 0 0 1-2.522-2.52v-2.52h2.522a2.528 2.528 0 0 1 2.52 2.52zm0-1.262a2.528 2.528 0 0 1-2.52-2.52v-5.043a2.528 2.528 0 0 1 2.52-2.522h5.043a2.528 2.528 0 0 1 2.522 2.522v5.043a2.528 2.528 0 0 1-2.522 2.52h-5.043z"/></svg> },
                { name: 'Stripe', svg: <svg width="90" height="24" viewBox="0 0 90 24" fill="currentColor" style={{ opacity: 0.65, transition: 'all 0.25s ease' }}><path d="M13.962 2c-3.1 0-5.596 2.222-5.596 5.596 0 3.03 2.1 4.542 5.093 5.42 2.164.633 2.583 1.118 2.583 1.905 0 1-.9 1.543-2.128 1.543-1.8 0-3.355-.7-4.385-1.572L7 17.653c1.6 1.572 4.143 2.52 7.026 2.52 3.483 0 5.962-2.162 5.962-5.748 0-3.235-2.222-4.664-5.275-5.545-1.98-.577-2.433-1.002-2.433-1.731 0-.825.772-1.378 1.954-1.378 1.543 0 2.87.5 3.792 1.25L20.89 4.39C19.245 2.89 16.945 2 13.962 2z"/></svg> },
                { name: 'Zoom', svg: <svg width="90" height="24" viewBox="0 0 90 24" fill="currentColor" style={{ opacity: 0.65, transition: 'all 0.25s ease' }}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.8 13.3c-.66 0-1.2-.54-1.2-1.2v-4.2c0-.66.54-1.2 1.2-1.2h3.6c.66 0 1.2.54 1.2 1.2v4.2c0 .66-.54 1.2-1.2 1.2h-3.6zm6.8-2v-2.6c0-.33.27-.6.6-.6h.8c.33 0 .6.27.6.6v2.6c0 .33-.27.6-.6.6h-.8c-.33 0-.6-.27-.6-.6z"/></svg> }
              ].map((brand) => (
                <Box 
                  key={brand.name}
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:hover svg': {
                      color: '#0F172A',
                      opacity: 0.95
                    }
                  }}
                >
                  {brand.svg}
                </Box>
              ))}
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Highlights Bar */}
      <Box sx={{ borderTop: '1px solid rgba(15,23,42,0.05)', borderBottom: '1px solid rgba(15,23,42,0.05)', bgcolor: '#fff', py: 3.5 }}>
        <Container maxWidth="xl" sx={{ maxWidth: 1280, px: { xs: 3, sm: 4, md: 5 } }}>
          <Grid container spacing={3} justifyContent="center">
            {heroHighlights.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item}>
                <Box sx={{ px: 3, py: 2, borderRadius: '12px', border: '1px solid rgba(15,23,42,0.04)', bgcolor: '#F8FAFC', display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}>{item}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>


      <Box component={motion.section} id="features" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={floatVariant} sx={{ pt: { xs: 6, sm: 8, md: 10 }, pb: { xs: 6, sm: 8, md: 10 }, background: '#fff' }}>
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
                    minHeight: 240,
                    p: 4,
                    borderRadius: '16px',
                    bgcolor: '#fff',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 20px 60px rgba(15,23,42,0.06)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 28px 70px rgba(15,23,42,0.12)'
                    }
                  }}
                >
                  <Box sx={{ width: 52, height: 52, borderRadius: 3, display: 'grid', placeItems: 'center', bgcolor: 'rgba(79,70,229,0.08)', color: 'primary.main' }}>
                    <Icon sx={{ fontSize: 26 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: 24, mt: 3, mb: 1 }}>{feature.title}</Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 15.5, lineHeight: 1.8 }}>{feature.description}</Typography>
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Container>
      </Box>

      <Box component={motion.section} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={floatVariant} sx={{ pt: { xs: 6, sm: 8, md: 10 }, pb: { xs: 6, sm: 8, md: 10 } }}>
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
                  whileHover={{ y: -3, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: '24px',
                    bgcolor: 'rgba(255, 255, 255, 0.72)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.45)',
                    boxShadow: '0 20px 50px rgba(30, 41, 59, 0.03)',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'flex-start', md: 'center' },
                    justifyContent: 'space-between',
                    gap: 3,
                    transition: 'all 240ms ease',
                    '&:hover': {
                      boxShadow: '0 28px 70px rgba(30, 41, 59, 0.05)',
                      borderColor: 'rgba(108, 76, 253, 0.18)',
                      bgcolor: 'rgba(255, 255, 255, 0.95)'
                    }
                  }}
                >
                  <Stack direction="row" spacing={3} alignItems="center" sx={{ flex: 1 }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: '16px', display: 'grid', placeItems: 'center', bgcolor: item.bg, color: item.color, flexShrink: 0 }}>
                      <Icon sx={{ fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: 20, color: '#0F172A', mb: 0.5 }}>{item.title}</Typography>
                      <Typography sx={{ color: '#64748B', fontSize: 15, lineHeight: 1.6, maxWidth: 680 }}>{item.description}</Typography>
                    </Box>
                  </Stack>
                  <Chip 
                    label={item.stat} 
                    size="small" 
                    sx={{ 
                      bgcolor: item.bg, 
                      color: item.color, 
                      fontWeight: 800, 
                      fontSize: 12,
                      px: 1.5,
                      py: 2,
                      borderRadius: '10px',
                      alignSelf: { xs: 'flex-start', md: 'center' }
                    }} 
                  />
                </Box>
              )
            })}
          </Stack>

          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' } }}>
            {whyStats.map((stat) => (
              <Box 
                key={stat.label} 
                sx={{ 
                  p: 3, 
                  borderRadius: '24px', 
                  border: '1px solid rgba(255,255,255,0.45)', 
                  bgcolor: 'rgba(255, 255, 255, 0.72)', 
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 12px 24px rgba(15,23,42,0.015)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  minHeight: 120,
                  transition: 'all 240ms ease',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 16px 32px rgba(15, 23, 42, 0.04)',
                    borderColor: 'rgba(108, 76, 253, 0.15)'
                  }
                }}
              >
                <Typography sx={{ fontWeight: 900, fontSize: 26, color: '#0F172A' }}>{stat.value}</Typography>
                <Typography sx={{ color: '#64748B', mt: 0.5, fontSize: 13.5, fontWeight: 600 }}>{stat.label}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* FAQs Section */}
      <Box component={motion.section} id="faq" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={floatVariant} sx={{ pt: { xs: 6, sm: 8, md: 10 }, pb: { xs: 6, sm: 8, md: 10 }, background: '#fff' }}>
        <Container maxWidth="xl" sx={{ maxWidth: 1280, px: { xs: 3, sm: 4, md: 5 } }}>
          <Box sx={{ maxWidth: 780, mx: 'auto' }}>
            <Typography variant="h2" sx={{ fontWeight: 800, textAlign: 'center', mb: 6 }}>Frequently asked questions</Typography>
            <Stack spacing={2}>
              {faqs.map((item) => (
                <Accordion key={item.question} elevation={0} sx={{ borderRadius: '12px', border: '1px solid rgba(15,23,42,0.08)' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: 700 }}>{item.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={{ color: 'text.secondary' }}>{item.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Contact & CTA Newsletter Section */}
      <Box component={motion.section} id="cta" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={floatVariant} sx={{ pt: { xs: 6, sm: 8, md: 10 }, pb: { xs: 6, sm: 8, md: 10 } }}>
        <Container maxWidth="xl" sx={{ maxWidth: 1280, px: { xs: 3, sm: 4, md: 5 } }}>
          <Paper
            sx={{
              p: { xs: 4, sm: 6, md: 8 },
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 40px 100px rgba(15,23,42,0.18)'
            }}
          >
            <Box sx={{ position: 'absolute', top: -100, right: -100, width: 240, height: 240, borderRadius: '50%', bgcolor: 'rgba(109,74,255,0.15)', filter: 'blur(80px)' }} />
            <Box sx={{ position: 'absolute', bottom: -100, left: -100, width: 240, height: 240, borderRadius: '50%', bgcolor: 'rgba(6,182,212,0.12)', filter: 'blur(80px)' }} />

            <Stack spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
              <Box>
                <Typography sx={{ fontWeight: 900, mb: 2, color: '#fff', fontSize: { xs: '2rem', md: '2.8rem' } }}>
                  Ready to level up your team communication?
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}>
                  Join thousands of fast-moving companies using EasyMeet for high-quality audio, video, and collaborative notes.
                </Typography>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%', maxWidth: 540 }}>
                <TextField
                  fullWidth
                  placeholder="Enter your email address"
                  variant="outlined"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.06)',
                    input: { color: '#fff', py: 1.5 },
                    '& .MuiOutlinedInput-root': {
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
                    minHeight: 48,
                    px: 4,
                    py: 1.5,
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
