import { useEffect, useState } from 'react'

export function useNexoSpeech(message: string, thinking: boolean) {
  const [enabled, setEnabled] = useState(false)
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(() => {
    if (!enabled || !canSpeak || thinking) {
      return
    }

    const speech = new SpeechSynthesisUtterance(message)
    speech.lang = 'pt-BR'
    speech.rate = 0.95

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(speech)

    return () => window.speechSynthesis.cancel()
  }, [message, thinking, enabled, canSpeak])

  function toggle() {
    setEnabled((value) => !value)
  }

  return {
    enabled,
    canSpeak,
    toggle,
  }
}
