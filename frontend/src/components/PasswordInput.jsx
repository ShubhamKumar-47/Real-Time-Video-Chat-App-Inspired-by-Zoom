import React, { useState, useRef, useEffect } from 'react'
import AuthTextField from './AuthTextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

export default function PasswordInput(props) {
  const { value, onChange, id, name, label = 'Password', required = true, autoFocus = false, helperText, error, ...rest } = props
  const [visible, setVisible] = useState(false)
  const inputRef = useRef(null)

  const toggleVisibility = () => {
    const input = inputRef.current
    const selectionStart = input?.selectionStart
    const selectionEnd = input?.selectionEnd
    setVisible((prev) => !prev)
    window.requestAnimationFrame(() => {
      if (input && selectionStart !== null && selectionEnd !== null) {
        input.focus()
        input.setSelectionRange(selectionStart, selectionEnd)
      }
    })
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.type = visible ? 'text' : 'password'
    }
  }, [visible])

  return (
    <AuthTextField
      id={id}
      name={name}
      label={label}
      type={visible ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      required={required}
      autoFocus={autoFocus}
      helperText={helperText}
      error={error}
      icon={LockOutlinedIcon}
      inputRef={inputRef}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={toggleVisibility} edge="end" size="large" sx={{ color: '#6D4AFF' }}>
              {visible ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...rest}
    />
  )
}
