export const INSTAGRAM_HANDLE = 'meet_editor31'
export const INSTAGRAM_URL = 'https://www.instagram.com/meet_editor31/'

// Contact Email
export const EMAIL = 'meeteditor31@gmail.com'

export const GMAIL_COMPOSE_URL = (
  subject = '',
  body = ''
) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    EMAIL
  )}&su=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`