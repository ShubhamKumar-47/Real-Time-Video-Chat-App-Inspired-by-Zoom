import React, { useContext, useState, useEffect } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import { Box, Grid, Typography, Button, TextField, Stack, Paper, Avatar, Chip } from '@mui/material'
import StatCard from '../components/StatCard'
import { AuthContext } from '../contexts/AuthContext'
import { motion } from 'framer-motion'

function HomeComponent() {
  const navigate = useNavigate()
  const { addToUserHistory, userData, getHistoryOfUser } = useContext(AuthContext)
  const [meetingCode, setMeetingCode] = useState('')
  const [history, setHistory] = useState([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getHistoryOfUser()
        setHistory(data || [])
      } catch (err) {
        console.error("Failed to load history metrics:", err)
      }
    }
    fetchStats()
  }, [])

  const todayStr = new Date().toDateString()
  const todaysMeetingsCount = history.filter(m => new Date(m.date).toDateString() === todayStr).length
  const estimatedHours = (history.length * 0.4).toFixed(1) + 'h'
  const meetingMinutes = history.length * 24

  const stats = [
    { title: "Today's Meetings", value: todaysMeetingsCount.toString() },
    { title: 'Total Meetings', value: history.length.toString() },
    { title: 'Estimated Hours', value: estimatedHours },
    { title: 'Meeting Minutes', value: meetingMinutes.toString() }
  ]

  const upcomingMeetings = [
    { name: 'Product Review', time: 'Today · 5:00 PM', participants: 5 },
    { name: 'Design Sync', time: 'Tomorrow · 10:00 AM', participants: 4 },
    { name: 'Quarterly Planning', time: 'Fri · 2:00 PM', participants: 8 }
  ]

  const recentMeetings = [
    { name: 'Team Standup', date: 'Today', duration: '18m', status: 'Completed' },
    { name: 'UX Review', date: 'Jul 3', duration: '42m', status: 'Completed' },
    { name: 'Marketing Sync', date: 'Jul 2', duration: '27m', status: 'Completed' }
  ]

  const generateMeetingCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const part1 = Array.from({length: 3}, () => chars[Math.floor(Math.random() * 26)]).join('');
    const part2 = Array.from({length: 4}, () => chars[Math.floor(Math.random() * 26)]).join('');
    const part3 = Array.from({length: 3}, () => chars[Math.floor(Math.random() * 26)]).join('');
    return `${part1}-${part2}-${part3}`;
  }

  const handleStartMeeting = async () => {
    const code = generateMeetingCode();
    await addToUserHistory(code);
    navigate(`/${code}`);
  }

  const handleJoinMeeting = async () => {
    if (!meetingCode.trim()) return
    await addToUserHistory(meetingCode.trim())
    navigate(`/${meetingCode.trim()}`)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 5 }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Paper sx={{ p: { xs: 4, md: 5 }, borderRadius: '16px', bgcolor: '#fff', border: '1px solid rgba(15,23,42,0.05)', boxShadow: '0 10px 30px rgba(15,23,42,0.02)' }}>
            <Stack spacing={3}>
              <Box>
                <Typography sx={{ fontSize: { xs: 28, md: 34 }, fontWeight: 900, lineHeight: 1.05, color: '#0F172A' }}>Welcome back, {userData?.name || 'User'} 👋</Typography>
                <Typography sx={{ mt: 1, color: '#64748B', fontSize: 16 }}>Enter a meeting code to join instantly or host a new sync.</Typography>
              </Box>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  placeholder="Enter meeting code (e.g. abc-defg-hij)"
                  value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                  variant="outlined"
                  sx={{ 
                    bgcolor: '#F8FAFC', 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: '10px', 
                      '& fieldset': { borderColor: 'rgba(15,23,42,0.1)' } 
                    } 
                  }}
                />
                <Button
                  onClick={handleJoinMeeting}
                  variant="contained"
                  sx={{ 
                    width: { xs: '100%', md: 'auto' },
                    minHeight: 48,
                    borderRadius: '10px', 
                    py: 1.5, 
                    px: 4, 
                    fontWeight: 800, 
                    background: 'linear-gradient(135deg, #6D4AFF, #8B5CF6)', 
                    boxShadow: '0 10px 25px rgba(109,74,255,0.2)',
                    whiteSpace: 'nowrap',
                    '&:hover': { background: 'linear-gradient(135deg, #5B3FE6, #7C3AED)' } 
                  }}
                >
                  Join Meeting
                </Button>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
                <Button 
                  onClick={handleStartMeeting} 
                  variant="outlined" 
                  sx={{ 
                    width: { xs: '100%', sm: 'auto' },
                    minHeight: 48,
                    borderRadius: '10px', 
                    py: 1.4, 
                    px: 3,
                    color: '#0F172A', 
                    borderColor: 'rgba(15,23,42,0.12)', 
                    fontWeight: 700, 
                    minWidth: 160,
                    '&:hover': { bgcolor: 'rgba(109,74,255,0.04)', borderColor: '#6D4AFF' }
                  }}
                >
                  Start Meeting
                </Button>
                <Button 
                  onClick={() => navigate('/history')} 
                  variant="outlined" 
                  sx={{ 
                    width: { xs: '100%', sm: 'auto' },
                    minHeight: 48,
                    borderRadius: '10px', 
                    py: 1.4, 
                    px: 3,
                    color: '#0F172A', 
                    borderColor: 'rgba(15,23,42,0.12)', 
                    fontWeight: 700, 
                    minWidth: 160,
                    '&:hover': { bgcolor: 'rgba(109,74,255,0.04)', borderColor: '#6D4AFF' }
                  }}
                >
                  Schedule Sync
                </Button>
                <Button 
                  onClick={() => navigate('/history')} 
                  variant="outlined" 
                  sx={{ 
                    width: { xs: '100%', sm: 'auto' },
                    minHeight: 48,
                    borderRadius: '10px', 
                    py: 1.4, 
                    px: 3,
                    color: '#0F172A', 
                    borderColor: 'rgba(15,23,42,0.12)', 
                    fontWeight: 700, 
                    minWidth: 160,
                    '&:hover': { bgcolor: 'rgba(109,74,255,0.04)', borderColor: '#6D4AFF' }
                  }}
                >
                  Meeting History
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Grid container spacing={3}>
            {stats.map((stat) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    borderRadius: '16px', 
                    bgcolor: '#fff', 
                    border: '1px solid rgba(15,23,42,0.05)', 
                    boxShadow: '0 8px 30px rgba(15,23,42,0.01)',
                    transition: 'all 200ms ease', 
                    '&:hover': { 
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 36px rgba(15,23,42,0.05)'
                    } 
                  }}
                >
                  <Typography sx={{ color: '#64748B', fontSize: 11, fontWeight: 800, letterSpacing: 0.8, textTransform: 'uppercase' }}>{stat.title}</Typography>
                  <Typography sx={{ mt: 1.5, fontSize: 32, fontWeight: 900, color: '#0F172A' }}>{stat.value}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Stack spacing={3}>
            <Typography sx={{ fontWeight: 900, fontSize: { xs: 22, md: 26 }, color: '#0F172A' }}>Upcoming Meetings</Typography>
            <Grid container spacing={3}>
              {upcomingMeetings.map((meeting) => (
                <Grid size={{ xs: 12, md: 4 }} key={meeting.name}>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      borderRadius: '16px', 
                      bgcolor: '#fff', 
                      border: '1px solid rgba(15,23,42,0.05)', 
                      transition: 'transform 180ms ease, box-shadow 180ms ease', 
                      '&:hover': { 
                        transform: 'translateY(-4px)',
                        boxShadow: '0 16px 40px rgba(15,23,42,0.06)'
                      } 
                    }}
                  >
                    <Stack spacing={2.5}>
                      <Box>
                        <Typography sx={{ fontWeight: 800, fontSize: 18, color: '#0F172A' }}>{meeting.name}</Typography>
                        <Typography sx={{ color: '#64748B', mt: 0.5, fontSize: 14 }}>{meeting.time}</Typography>
                      </Box>
                      <Stack direction="row" spacing={-0.8}>
                        {Array.from({ length: meeting.participants }).map((_, index) => (
                          <Avatar 
                            key={index} 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              fontSize: 12, 
                              bgcolor: index % 2 === 0 ? '#6D4AFF' : '#06B6D4', 
                              color: '#fff', 
                              border: '2px solid #fff',
                              fontWeight: 700 
                            }}
                          >
                            {String.fromCharCode(65 + index)}
                          </Avatar>
                        ))}
                      </Stack>
                      <Button 
                        onClick={() => navigate(`/${generateMeetingCode()}`)}
                        variant="contained" 
                        sx={{ 
                          borderRadius: '10px', 
                          py: 1.2, 
                          fontWeight: 700,
                          background: '#6D4AFF', 
                          '&:hover': { background: '#5B3FE6' } 
                        }}
                      >
                        Join Room
                      </Button>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Stack spacing={3}>
            <Typography sx={{ fontWeight: 900, fontSize: { xs: 22, md: 26 }, color: '#0F172A' }}>Recent Meetings</Typography>
            <Grid container spacing={3}>
              {recentMeetings.map((meeting) => (
                <Grid size={{ xs: 12, md: 4 }} key={meeting.name}>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      borderRadius: '16px', 
                      bgcolor: '#fff', 
                      border: '1px solid rgba(15,23,42,0.05)', 
                      transition: 'transform 180ms ease, box-shadow 180ms ease', 
                      '&:hover': { 
                        transform: 'translateY(-4px)',
                        boxShadow: '0 16px 40px rgba(15,23,42,0.06)'
                      } 
                    }}
                  >
                    <Stack spacing={2}>
                      <Typography sx={{ fontWeight: 800, color: '#0F172A' }}>{meeting.name}</Typography>
                      <Typography sx={{ color: '#64748B', fontSize: 14 }}>{meeting.date} · {meeting.duration}</Typography>
                      <Chip 
                        label={meeting.status} 
                        sx={{ 
                          borderRadius: '8px', 
                          bgcolor: 'rgba(34,197,94,0.1)', 
                          color: '#22C55E', 
                          fontWeight: 700, 
                          width: 'fit-content',
                          fontSize: 12
                        }} 
                      />
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </motion.div>
      </Box>
    </Box>
  )
}

export default withAuth(HomeComponent)
