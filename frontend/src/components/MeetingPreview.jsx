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
          p: { xs: 2.5, sm: 3 }, 
          background: 'rgba(255, 255, 255, 0.72)', 
          backdropFilter: 'blur(24px)', 
          WebkitBackdropFilter: 'blur(24px)', 
          border: '1px solid rgba(255, 255, 255, 0.45)',
          boxShadow: '0 30px 80px rgba(30, 41, 59, 0.07)',
          overflow: 'hidden'
        }}
      >
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3.5}>
          
          {/* Left Column (70% on large viewports) */}
          <Box sx={{ flex: { xs: '1 1 auto', lg: 2.3 }, display: 'flex', flexDirection: 'column' }}>
            
            {/* Top Toolbar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box 
                  sx={{ 
                    width: 7, 
                    height: 7, 
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
                <Typography sx={{ fontWeight: 800, fontSize: 15, color: '#111827', letterSpacing: -0.1 }}>
                  Product Sync
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="center">
                <Chip 
                  label="Recording ON" 
                  size="small" 
                  sx={{ 
                    bgcolor: 'rgba(239, 68, 68, 0.08)', 
                    color: '#EF4444', 
                    fontWeight: 800,
                    fontSize: 10,
                    height: 22,
                    borderRadius: '6px',
                    '& .MuiChip-label': { px: 1 },
                    animation: 'pulseRed 1.8s infinite ease-in-out',
                    '@keyframes pulseRed': {
                      '0%': { opacity: 0.7 },
                      '50%': { opacity: 1 },
                      '100%': { opacity: 0.7 }
                    }
                  }} 
                />
                <Typography sx={{ fontSize: 11.5, color: '#64748B', fontWeight: 700 }}>
                  00:12:34
                </Typography>
              </Stack>
            </Box>

            {/* 2x2 Participant Grid */}
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: 1.5, 
                height: { xs: 220, sm: 260 } 
              }}
            >
              {[
                { 
                  name: 'Alex (Host)', 
                  speaking: true, 
                  camera: true, 
                  muted: false,
                  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=320&h=240&q=80' 
                },
                { 
                  name: 'Maya (Share)', 
                  speaking: false, 
                  camera: true, 
                  muted: false,
                  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=320&h=240&q=80' 
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
                  image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=320&h=240&q=80' 
                }
              ].map((p) => (
                <Box 
                  key={p.name}
                  sx={{ 
                    borderRadius: '16px', 
                    overflow: 'hidden', 
                    position: 'relative', 
                    background: p.camera ? `url(${p.image})` : p.bg, 
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'grid', 
                    placeItems: 'center',
                    border: p.speaking ? '2px solid #10B981' : '1px solid rgba(255,255,255,0.06)',
                    boxShadow: p.speaking ? '0 0 16px rgba(16,185,129,0.3)' : 'none',
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
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 100%)',
                      zIndex: 1
                    } : {}
                  }}
                >
                  {!p.camera && (
                    <Avatar 
                      src={p.avatar} 
                      sx={{ 
                        width: 46, 
                        height: 46, 
                        border: '2px solid rgba(255,255,255,0.15)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)' 
                      }} 
                    />
                  )}
                  
                  {/* Name Tag & Status Indicators */}
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      bottom: 10, 
                      left: 10, 
                      bgcolor: 'rgba(15, 23, 42, 0.72)', 
                      backdropFilter: 'blur(8px)',
                      borderRadius: '6px', 
                      px: 1, 
                      py: 0.4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.8,
                      zIndex: 2,
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{p.name}</Typography>
                    {p.speaking && (
                      <Box sx={{ display: 'flex', gap: 0.2, alignItems: 'center' }}>
                        <span style={{ width: 2, height: 6, backgroundColor: '#10B981', display: 'inline-block', borderRadius: 1 }} />
                        <span style={{ width: 2, height: 10, backgroundColor: '#10B981', display: 'inline-block', borderRadius: 1 }} />
                        <span style={{ width: 2, height: 6, backgroundColor: '#10B981', display: 'inline-block', borderRadius: 1 }} />
                      </Box>
                    )}
                    {p.muted && <MicOffIcon sx={{ fontSize: 11, color: '#EF4444' }} />}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Bottom Floating Controls */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 1.5, 
                py: 1, 
                px: 2,
                borderRadius: '14px',
                bgcolor: 'rgba(15, 23, 42, 0.78)',
                backdropFilter: 'blur(12px)',
                width: 'fit-content',
                mx: 'auto',
                mt: 2.2,
                border: '1px solid rgba(255, 255, 255, 0.09)',
                boxShadow: '0 8px 32px rgba(15, 23, 42, 0.16)'
              }}
            >
              <IconButton size="small" sx={{ width: 32, height: 32, color: '#fff', bgcolor: 'rgba(255,255,255,0.08)', '&:hover': { bgcolor: 'rgba(255,255,255,0.18)' } }}>
                <MicIcon sx={{ fontSize: 15 }} />
              </IconButton>
              <IconButton size="small" sx={{ width: 32, height: 32, color: '#fff', bgcolor: 'rgba(255,255,255,0.08)', '&:hover': { bgcolor: 'rgba(255,255,255,0.18)' } }}>
                <VideocamIcon sx={{ fontSize: 15 }} />
              </IconButton>
              <IconButton size="small" sx={{ width: 32, height: 32, color: '#fff', bgcolor: 'rgba(255,255,255,0.08)', '&:hover': { bgcolor: 'rgba(255,255,255,0.18)' } }}>
                <ScreenShareIcon sx={{ fontSize: 15 }} />
              </IconButton>
              <IconButton size="small" sx={{ width: 32, height: 32, color: '#fff', bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' } }}>
                <CallEndIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Box>

          </Box>
          
          {/* Right Column - Sidebar (30% on large viewports) */}
          <Box sx={{ flex: { xs: '1 1 auto', lg: 1 }, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {[
              { 
                label: 'AI Summary', 
                value: 'Action items & decisions', 
                desc: 'Auto-synthesizing key notes.', 
                icon: AutoAwesomeIcon, 
                color: '#6C4CFD', 
                bg: 'rgba(108, 76, 253, 0.06)' 
              },
              { 
                label: 'Live Transcript', 
                value: 'Real-time Captions', 
                desc: 'Voice captioning enabled.', 
                icon: TranslateIcon, 
                color: '#0EA5E9', 
                bg: 'rgba(14, 165, 233, 0.06)' 
              },
              { 
                label: 'Meeting Status', 
                value: 'Active Host Session', 
                desc: 'Secure peer stream active.', 
                icon: InfoIcon, 
                color: '#64748B', 
                bg: 'rgba(100, 116, 139, 0.06)' 
              },
              { 
                label: 'Connection Quality', 
                value: '99.9% Excellent', 
                desc: 'Ultra-low network lag.', 
                icon: SignalCellularAltIcon, 
                color: '#10B981', 
                bg: 'rgba(16, 185, 129, 0.06)' 
              },
              { 
                label: 'Unread Messages', 
                value: '3 updates waiting', 
                desc: 'New posts in group chat.', 
                icon: ChatIcon, 
                color: '#8B5CF6', 
                bg: 'rgba(139, 92, 246, 0.06)' 
              }
            ].map((card) => {
              const Icon = card.icon;
              return (
                <Box 
                  key={card.label}
                  sx={{ 
                    p: 1.8, 
                    borderRadius: '14px', 
                    bgcolor: 'rgba(255, 255, 255, 0.4)', 
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 8px 30px rgba(15, 23, 42, 0.015)',
                    transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.8,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.95)',
                      transform: 'translateY(-2px) scale(1.02)',
                      boxShadow: '0 16px 40px rgba(30, 41, 59, 0.05)',
                      borderColor: 'rgba(108, 76, 253, 0.2)'
                    }
                  }}
                >
                  <Box sx={{ width: 34, height: 34, borderRadius: '8px', display: 'grid', placeItems: 'center', bgcolor: card.bg, color: card.color, flexShrink: 0, mt: 0.25 }}>
                    <Icon sx={{ fontSize: 18 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 10, fontWeight: 800, color: 'rgba(15, 23, 42, 0.4)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                      {card.label}
                    </Typography>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 800, color: '#111827', mt: 0.25 }}>
                      {card.value}
                    </Typography>
                    <Typography sx={{ fontSize: 10.5, color: '#64748B', mt: 0.25, lineHeight: 1.4 }}>
                      {card.desc}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>

        </Stack>
      </Paper>
    </motion.div>
  )
}
