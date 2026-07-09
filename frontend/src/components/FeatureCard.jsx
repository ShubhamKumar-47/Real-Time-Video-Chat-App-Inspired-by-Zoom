import React from 'react'
import { Paper, Typography, Box } from '@mui/material'
import { motion } from 'framer-motion'

export default function FeatureCard({ title, desc, icon }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} style={{ height: '100%' }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <Box sx={{ width: 48, height: 48, borderRadius: 2, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg,#6D4AFF,#8B5CF6)', color: '#fff' }}>{icon}</Box>
          <Box>
            <Typography sx={{ fontWeight: 800 }}>{title}</Typography>
            <Typography sx={{ fontSize: 13, color: 'rgba(15,23,42,0.6)' }}>{desc}</Typography>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  )
}
