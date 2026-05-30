import { useEffect, type RefObject } from 'react'

function shouldSubmitOnEnter(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  if (tag === 'TEXTAREA' || tag === 'BUTTON' || tag === 'A') return false
  if (target.isContentEditable) return false
  return true
}

export function useModalKeyboardShortcuts(
  isOpen: boolean,
  onClose: () => void,
  formRef: RefObject<HTMLFormElement | null>,
) {
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Enter' || event.defaultPrevented) return
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
      if (!shouldSubmitOnEnter(event.target)) return

      event.preventDefault()
      formRef.current?.requestSubmit()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose, formRef])
}
