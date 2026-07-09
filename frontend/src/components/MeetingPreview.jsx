import React from 'react'
import { Box, Paper, Avatar, Typography, Stack, Chip, IconButton } from '@mui/material'
import { motion } from 'framer-motion'
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import CallEndIcon from '@mui/icons-material/CallEnd';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TranslateIcon from '@mui/icons-material/Translate';
import InfoIcon from '@mui/icons-material/Info';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import ChatIcon from '@mui/icons-material/Chat';

export default function MeetingPreview() {
  return (
    <motion.div 
      initial={{ y: 15, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ duration: 0.7, ease: 'easeOut' }}
      style={{ width: '100%' }}
    >
      {/* Redesigned Glassmorphism Meeting Window */}
      <Paper 
        elevation={0} 
        sx={{ 
          width: '100%',
          borderRadius: '24px', 
          p: { xs: 2, sm: 2.5 }, 
          background: 'rgba(255, 255, 255, 0.72)', 
          backdropFilter: 'blur(24px)', 
          WebkitBackdropFilter: 'blur(24px)', 
          border: '1px solid rgba(255, 255, 255, 0.45)',
          boxShadow: '0 25px 70px rgba(30, 41, 59, 0.05)',
          overflow: 'hidden'
        }}
      >
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2.5}>
          
          {/* Left Column (70% on large viewports) */}
          <Box sx={{ flex: { xs: '1 1 auto', lg: 2.3 }, display: 'flex', flexDirection: 'column' }}>
            
            {/* Top Toolbar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.8 }}>
              <Stack direction="row" spacing={1.2} alignItems="center">
                <Box 
                  sx={{ 
                    width: 6, 
                    height: 6, 
                    borderRadius: '50%', 
                    bgcolor: '#10B981',
                    animation: 'pulseGreen 2s infinite ease-in-out',
                    '@keyframes pulseGreen': {
                      '0%': { transform: 'scale(0.9)', opacity: 0.5 },
                      '50%': { transform: 'scale(1.2)', opacity: 1 },
                      '100%': { transform: 'scale(0.9)', opacity: 0.5 }
                    }
                  }} 
                />
                <Typography sx={{ fontWeight: 800, fontSize: 14, color: '#111827', letterSpacing: -0.1 }}>
                  Product Sync
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.2} alignItems="center">
                <Chip 
                  label="Recording ON" 
                  size="small" 
                  sx={{ 
                    bgcolor: 'rgba(239, 68, 68, 0.08)', 
                    color: '#EF4444', 
                    fontWeight: 800,
                    fontSize: 9.5,
                    height: 20,
                    borderRadius: '6px',
                    '& .MuiChip-label': { px: 0.8 },
                    animation: 'pulseRed 1.8s infinite ease-in-out',
                    '@keyframes pulseRed': {
                      '0%': { opacity: 0.7 },
                      '50%': { opacity: 1 },
                      '100%': { opacity: 0.7 }
                    }
                  }} 
                />
                <Typography sx={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>
                  00:12:34
                </Typography>
              </Stack>
            </Box>

            {/* 2x2 Participant Grid */}
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: 1.2, 
                height: { xs: 190, sm: 220 } 
              }}
            >
              {[
                { 
                  name: 'Alex (Host)', 
                  speaking: true, 
                  camera: true, 
                  muted: false,
                  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&h=180&q=80' 
                },
                { 
                  name: 'Maya (Share)', 
                  speaking: false, 
                  camera: true, 
                  muted: false,
                  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&h=180&q=80' 
                },
                { 
                  name: 'Sam', 
                  speaking: false, 
                  camera: false, 
                  muted: true,
                  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80',
                  bg: 'linear-gradient(135deg, #1E293B, #0F172A)' 
                },
                { 
                  name: 'Tori', 
                  speaking: false, 
                  camera: true, 
                  muted: false,
                  image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&h=180&q=80' 
                }
              ].map((p) => (
                <Box 
                  key={p.name}
                  sx={{ 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    position: 'relative', 
                    background: p.camera ? `url(${p.image})` : p.bg, 
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'grid', 
                    placeItems: 'center',
                    border: p.speaking ? '2px solid #10B981' : '1px solid rgba(255,255,255,0.06)',
                    boxShadow: p.speaking ? '0 0 12px rgba(16,185,129,0.25)' : 'none',
                    transition: 'all 240ms ease',
                    animation: p.speaking ? 'speakingPulse 2s infinite ease-in-out' : 'none',
                    '@keyframes speakingPulse': {
                      '0%': { borderColor: 'rgba(16,185,129,0.7)' },
                      '50%': { borderColor: 'rgba(16,185,129,1)' },
                      '100%': { borderColor: 'rgba(16,185,129,0.7)' }
                    },
                    '&::before': p.camera ? {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)',
                      zIndex: 1
                    } : {}
                  }}
                >
                  {!p.camera && (
                    <Avatar 
                      src={p.avatar} 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        border: '2px solid rgba(255,255,255,0.12)',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)' 
                      }} 
                    />
                  )}
                  
                  {/* Name Tag & Status Indicators */}
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      bottom: 8, 
                      left: 8, 
                      bgcolor: 'rgba(15, 23, 42, 0.72)', 
                      backdropFilter: 'blur(8px)',
                      borderRadius: '5px', 
                      px: 0.8, 
                      py: 0.3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.6,
                      zIndex: 2,
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    <Typography sx={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>{p.name}</Typography>
                    {p.speaking && (
                      <Box sx={{ display: 'flex', gap: 0.2, alignItems: 'center' }}>
                        <span style={{ width: 1.5, height: 5, backgroundColor: '#10B981', display: 'inline-block', borderRadius: 1 }} />
                        <span style={{ width: 1.5, height: 8, backgroundColor: '#10B981', display: 'inline-block', borderRadius: 1 }} />
                        <span style={{ width: 1.5, height: 5, backgroundColor: '#10B981', display: 'inline-block', borderRadius: 1 }} />
                      </Box>
                    )}
                    {p.muted && <MicOffIcon sx={{ fontSize: 10, color: '#EF4444' }} />}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Bottom Floating Controls */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 1.2, 
                py: 0.8, 
                px: 1.5,
                borderRadius: '12px',
                bgcolor: 'rgba(15, 23, 42, 0.78)',
                backdropFilter: 'blur(12px)',
                width: 'fit-content',
                mx: 'auto',
                mt: 1.5,
                border: '1px solid rgba(255, 255, 255, 0.09)',
                boxShadow: '0 6px 24px rgba(15, 23, 42, 0.12)'
              }}
            >
              <IconButton size="small" sx={{ width: 28, height: 28, color: '#fff', bgcolor: 'rgba(255,255,255,0.08)', '&:hover': { bgcolor: 'rgba(255,255,255,0.18)' } }}>
                <MicIcon sx={{ fontSize: 14 }} />
              </IconButton>
              <IconButton size="small" sx={{ width: 28, height: 28, color: '#fff', bgcolor: 'rgba(255,255,255,0.08)', '&:hover': { bgcolor: 'rgba(255,255,255,0.18)' } }}>
                <VideocamIcon sx={{ fontSize: 14 }} />
              </IconButton>
              <IconButton size="small" sx={{ width: 28, height: 28, color: '#fff', bgcolor: 'rgba(255,255,255,0.08)', '&:hover': { bgcolor: 'rgba(255,255,255,0.18)' } }}>
                <ScreenShareIcon sx={{ fontSize: 14 }} />
              </IconButton>
              <IconButton size="small" sx={{ width: 28, height: 28, color: '#fff', bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' } }}>
                <CallEndIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>

          </Box>
          
          {/* Right Column - Sidebar (30% on large viewports) */}
          <Box sx={{ flex: { xs: '1 1 auto', lg: 1 }, display: 'flex', flexDirection: 'column', height: { xs: 'auto', sm: 220 } }}>
            <Box 
              sx={{ 
                p: 2, 
                borderRadius: '12px', 
                bgcolor: 'rgba(255, 255, 255, 0.45)', 
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 6px 20px rgba(15, 23, 42, 0.01)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {/* Header */}
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <AutoAwesomeIcon sx={{ color: '#6C4CFD', fontSize: 14 }} />
                  <Typography sx={{ fontSize: 9.5, fontWeight: 800, color: 'rgba(15, 23, 42, 0.4)', textTransform: 'uppercase', letterSpacing: 0.6 }}>
                    AI Companion
                  </Typography>
                  <Chip 
                    label="Live" 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(108, 76, 253, 0.08)', 
                      color: '#6C4CFD', 
                      fontWeight: 800, 
                      fontSize: 8, 
                      height: 14,
                      borderRadius: '3px',
                      '& .MuiChip-label': { px: 0.5 }
                    }} 
                  />
                </Stack>
                <Typography sx={{ fontSize: 12, fontWeight: 800, color: '#111827', mb: 1 }}>
                  Design Sync & Q3 Goals
                </Typography>
              </Box>

              {/* Action items list */}
              <Box sx={{ borderTop: '1px solid rgba(15, 23, 42, 0.06)', pt: 1.2 }}>
                <Typography sx={{ fontSize: 8.5, fontWeight: 800, color: 'rgba(15, 23, 42, 0.4)', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.8 }}>
                  Real-time notes
                </Typography>
                <Stack spacing={0.8}>
                  {[
                    "Alex is presenting the landing page.",
                    "Maya: assigned design assets review.",
                    "Transcript draft saved automatically."
                  ].map((text, idx) => (
                    <Stack key={idx} direction="row" spacing={1} alignItems="flex-start">
                      <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#6C4CFD', mt: 0.6, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: 10, color: '#64748B', lineHeight: 1.3 }}>
                        {text}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Box>

        </Stack>
      </Paper>
    </motion.div>
  )
}
