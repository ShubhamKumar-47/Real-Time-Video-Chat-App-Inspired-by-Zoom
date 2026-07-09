import React, { useContext, useState } from 'react'
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Avatar, Tooltip, Menu, MenuItem } from '@mui/material'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import AddIcon from '@mui/icons-material/Add'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Logo from './Logo'

export default function DashboardNavbar() {
  const { userData, handleLogout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleLogoutClick = () => {
    handleCloseMenu()
    handleLogout()
  }

  const generateMeetingCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const part1 = Array.from({length: 3}, () => chars[Math.floor(Math.random() * 26)]).join('');
    const part2 = Array.from({length: 4}, () => chars[Math.floor(Math.random() * 26)]).join('');
    const part3 = Array.from({length: 3}, () => chars[Math.floor(Math.random() * 26)]).join('');
    return `${part1}-${part2}-${part3}`;
  }

  const handleNewMeeting = () => {
    const code = generateMeetingCode()
    navigate(`/${code}`)
  }

  const userInitial = userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'rgba(255,255,255,0.8)', color: 'text.primary', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(15,23,42,0.04)' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Box onClick={() => navigate('/home')} sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}>
          <Logo size={38} />
          <Typography sx={{ fontWeight: 800, color: '#0F172A' }}>EasyMeet.space</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 3, alignItems: 'center' }}>
            <Typography onClick={() => navigate('/home')} sx={{ cursor: 'pointer', color: 'rgba(15,23,42,0.7)', fontWeight: 600, '&:hover': { color: '#6D4AFF' } }}>Dashboard</Typography>
            <Typography onClick={() => navigate('/history')} sx={{ cursor: 'pointer', color: 'rgba(15,23,42,0.6)', '&:hover': { color: '#6D4AFF' } }}>History</Typography>
          </Box>

          <Tooltip title="Notifications">
            <IconButton>
              <NotificationsNoneOutlinedIcon sx={{ color: 'rgba(15,23,42,0.7)' }} />
            </IconButton>
          </Tooltip>

          <Button variant="contained" onClick={handleNewMeeting} startIcon={<AddIcon />} sx={{ borderRadius: '10px', textTransform: 'none', py: 1.2, px: 2.2, fontWeight: 700, background: 'linear-gradient(135deg,#6D4AFF,#8B5CF6)', boxShadow: '0 12px 30px rgba(109,74,255,0.18)' }}>
            New Meeting
          </Button>

          <Tooltip title="Account settings">
            <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: '#6D4AFF', color: '#fff', fontWeight: 700 }}>{userInitial}</Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            keepMounted
            PaperProps={{
              sx: {
                mt: 1.5,
                boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
                borderRadius: '12px'
              }
            }}
          >
            <MenuItem disabled sx={{ fontWeight: 600 }}>{userData?.name || 'User'}</MenuItem>
            <MenuItem onClick={() => { handleCloseMenu(); navigate('/history'); }}>Meeting History</MenuItem>
            <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
