import { useEffect, useState } from 'react'

import './Toast.css'

interface ToastProps {
  duration?: number
  message?: string | null
}

const Toast: React.FC<ToastProps> = ({ message, duration = 3000 }) => {
  const [show, setShow] = useState(!!message)

  useEffect(() => {
    setShow(!!message)
    if (!message) return

    const timer = setTimeout(() => setShow(false), duration)
    return () => clearTimeout(timer)
  }, [duration, message, setShow])

  if (!show) return null

  return (
    <div className="toast">
      <span>{message}</span>
    </div>
  )
}

export default Toast
