import React from 'react'
import { Paper, Typography, Box } from '@mui/material'
import { motion } from 'framer-motion'

export default function StatCard({ title, value, icon }) {
  return (
    <motion.div whileHover={{ y: -6 }} style={{ height: '100%' }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(6px)', minWidth: 160 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: 2, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg,#6D4AFF,#8B5CF6)', color: '#fff' }}>{icon}</Box>
          <Box>
            <Typography sx={{ fontSize: 12, color: 'rgba(15,23,42,0.6)', fontWeight: 700 }}>{title}</Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 900, color: '#0F172A' }}>{value}</Typography>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  )
}
