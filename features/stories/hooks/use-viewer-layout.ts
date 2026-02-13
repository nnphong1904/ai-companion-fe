"use client"

import { useEffect, useRef, useState } from "react"

const MD_BREAKPOINT = 768

export function useViewerLayout(isOpen: boolean) {
  const measureRef = useRef<HTMLDivElement>(null)
  const [cardWidth, setCardWidth] = useState(0)
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Reset state when closed
  if (!isOpen && isVisible) setIsVisible(false)
  if (!isOpen && isDesktop !== null) setIsDesktop(null)

  // Detect layout on open + listen for resize
  useEffect(() => {
    if (!isOpen) return
    function onResize() {
      setIsDesktop(window.innerWidth >= MD_BREAKPOINT)
      if (measureRef.current) setCardWidth(measureRef.current.offsetWidth)
    }
    window.addEventListener("resize", onResize)
    // Fire once immediately to set initial value
    onResize()
    return () => window.removeEventListener("resize", onResize)
  }, [isOpen])

  // Measure card width + trigger entrance animation
  useEffect(() => {
    if (!isOpen || isDesktop === null) return
    requestAnimationFrame(() => {
      if (measureRef.current) setCardWidth(measureRef.current.offsetWidth)
      requestAnimationFrame(() => setIsVisible(true))
    })
  }, [isOpen, isDesktop])

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  return { isDesktop, isVisible, cardWidth, measureRef }
}
