"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export function useConstellationLayout() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 400, h: 300 })
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const measure = useCallback(() => {
    if (containerRef.current) {
      setDims({
        w: containerRef.current.offsetWidth,
        h: containerRef.current.offsetHeight,
      })
    }
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [measure])

  return { containerRef, dims, hoveredId, setHoveredId }
}
