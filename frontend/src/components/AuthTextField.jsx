import React from 'react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

export default function AuthTextField({ icon: Icon, InputProps, sx, ...props }) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      InputLabelProps={{ shrink: true }}
      sx={{
        '& .MuiOutlinedInput-root': {
          height: 56,
          borderRadius: '10px',
          backgroundColor: '#F8FAFC',
          border: '1px solid rgba(15,23,42,0.08)',
          boxShadow: 'inset 0 1px 2px rgba(15,23,42,0.06)',
          '& fieldset': { borderColor: 'transparent' },
          '&:hover fieldset': { borderColor: 'rgba(109,76,255,0.24)' },
          '&.Mui-focused fieldset': { borderColor: '#6D4AFF', boxShadow: '0 0 0 4px rgba(109,74,255,0.12)' },
          '& input': { px: 1.5 },
        },
        '& .MuiInputLabel-root': {
          color: 'rgba(15,23,42,0.72)',
          fontWeight: 600,
        },
        '& .MuiFormHelperText-root': {
          color: 'rgba(15,23,42,0.6)',
          marginLeft: 0,
        },
        ...sx,
      }}
      InputProps={{
        startAdornment: Icon ? (
          <InputAdornment position="start" sx={{ mr: 0 }}>
            <Icon sx={{ color: '#6D4AFF', opacity: 0.9 }} />
          </InputAdornment>
        ) : null,
        ...InputProps,
      }}
      {...props}
    />
  )
}
