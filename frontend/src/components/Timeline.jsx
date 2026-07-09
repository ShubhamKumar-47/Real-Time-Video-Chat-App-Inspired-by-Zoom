import React from 'react'
import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material'

export default function Timeline({ items = [] }) {
  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.9)' }}>
      <Typography sx={{ fontWeight: 800, mb: 1 }}>Activity</Typography>
      <List>
        {items.map((it, idx) => (
          <ListItem key={idx} sx={{ py: 1 }}>
            <ListItemText primary={it.title} secondary={it.time} />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}
