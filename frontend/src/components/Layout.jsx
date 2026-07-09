import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import DashboardNavbar from './DashboardNavbar'
import { Box } from '@mui/material'
import { useLocation } from 'react-router-dom'

export default function Layout({ children }) {
  const location = useLocation()
  const path = location.pathname

  const isLandingPath = path === '/'
  const isAuthPath = path === '/auth' || path === '/forgot-password'
  const isDashboardPath = path === '/home' || path === '/history'
  
  const isMeetingPath = !isLandingPath && !isAuthPath && !isDashboardPath

  if (isMeetingPath) {
    return <Box component="main" sx={{ minHeight: '100vh', width: '100vw', overflow: 'hidden' }}>{children}</Box>
  }

  if (isAuthPath) {
    return <Box component="main" sx={{ minHeight: '100vh', bgcolor: '#F8FAFC' }}>{children}</Box>
  }

  if (isDashboardPath) {
    return (
      <>
        <DashboardNavbar />
        <Box component="main" sx={{ minHeight: 'calc(100vh - 80px)', bgcolor: '#F8FAFC' }}>
          {children}
        </Box>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ minHeight: '100vh', overflowX: 'hidden' }}>
        <div className="container">{children}</div>
      </Box>
      <Footer />
    </>
  )
}
