"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import type { Message } from "../chat-section"

export function useChatScroll(messages: Message[], isLoading: boolean) {
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const isUserScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()
  const [showScrollButton, setShowScrollButton] = useState(false)

  // Check if user is near bottom
  const checkScrollPosition = useCallback(() => {
    const container = chatContainerRef.current
    if (!container) return

    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100
    setShowScrollButton(!isNearBottom)
  }, [])

  // Track user scrolling and scroll position
  useEffect(() => {
    const container = chatContainerRef.current
    if (!container) return

    const handleScroll = () => {
      isUserScrollingRef.current = true
      checkScrollPosition()

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      // Reset user scrolling flag after 1 second of no scrolling
      scrollTimeoutRef.current = setTimeout(() => {
        isUserScrollingRef.current = false
      }, 1000)
    }

    container.addEventListener("scroll", handleScroll, { passive: true })

    // Initial check
    checkScrollPosition()

    return () => {
      container.removeEventListener("scroll", handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [checkScrollPosition])

  // Auto-scroll to bottom when new messages arrive or during streaming
  useEffect(() => {
    const container = chatContainerRef.current
    if (!container) return

    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100

    // Always scroll during loading (streaming) or if user is near bottom
    if (isLoading || isNearBottom || messages.length <= 2) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: isLoading ? "smooth" : "smooth",
      })
    }
  }, [messages, isLoading])

  const scrollToBottom = useCallback(() => {
    const container = chatContainerRef.current
    if (container) {
      isUserScrollingRef.current = false // Reset user scrolling flag
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [])

  return {
    chatContainerRef,
    scrollToBottom,
    showScrollButton,
  }
}
