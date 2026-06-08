'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current
    if (!cursor || !follower) return

    let mouseX = 0, mouseY = 0
    let followerX = 0, followerY = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      cursor.style.left = mouseX + 'px'
      cursor.style.top = mouseY + 'px'
    }

    const onEnterLink = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2.5)'
      cursor.style.opacity = '0.4'
      follower.style.transform = 'translate(-50%, -50%) scale(1.5)'
    }

    const onLeaveLink = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)'
      cursor.style.opacity = '1'
      follower.style.transform = 'translate(-50%, -50%) scale(1)'
    }

    let animFrame: number
    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.1
      followerY += (mouseY - followerY) * 0.1
      follower.style.left = followerX + 'px'
      follower.style.top = followerY + 'px'
      animFrame = requestAnimationFrame(animateFollower)
    }

    document.addEventListener('mousemove', onMove)
    animFrame = requestAnimationFrame(animateFollower)

    const links = document.querySelectorAll('a, button, [data-cursor]')
    links.forEach(el => {
      el.addEventListener('mouseenter', onEnterLink)
      el.addEventListener('mouseleave', onLeaveLink)
    })

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(animFrame)
    }
  }, [])

  return (
    <>
      <div
        ref={cursorRef}
        className="cursor"
        style={{ transition: 'transform 0.2s, opacity 0.2s' }}
      />
      <div
        ref={followerRef}
        className="cursor-follower"
      />
    </>
  )
}
