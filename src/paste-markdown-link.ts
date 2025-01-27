import {insertText} from './text'

export function install(el: HTMLElement): void {
  el.addEventListener('paste', onPaste)
}

export function uninstall(el: HTMLElement): void {
  el.removeEventListener('paste', onPaste)
}

function onPaste(event: ClipboardEvent) {
  const transfer = event.clipboardData
  if (!transfer || !hasPlainText(transfer)) return

  const field = event.currentTarget
  if (!(field instanceof HTMLTextAreaElement)) return

  const text = transfer.getData('text/plain')
  if (!text) return

  if (isWithinLink(field)) return

  event.stopPropagation()
  event.preventDefault()

  const selectedText = field.value.substring(field.selectionStart, field.selectionEnd)

  insertText(field, linkify(selectedText, text), {addNewline: false})
}

function hasPlainText(transfer: DataTransfer): boolean {
  return Array.from(transfer.types).includes('text/plain')
}

function isWithinLink(textarea: HTMLTextAreaElement): boolean {
  const selectionStart = textarea.selectionStart || 0

  if (selectionStart > 1) {
    const previousChars = textarea.value.substring(selectionStart - 2, selectionStart)
    return previousChars === ']('
  } else {
    return false
  }
}

function linkify(selectedText: string, text: string): string {
  return selectedText.length && isURL(text) ? `[${selectedText}](${text})` : text
}

function isURL(url: string): boolean {
  return /^https?:\/\//i.test(url)
}
