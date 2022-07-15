export function isEmpty(value: any): boolean {
  return value === null || value === undefined || value === ''
}

export function isNotEmpty(value: any): boolean {
  return !isEmpty(value)
}

export function copyToClipboard(idName: string): void {
  const copyText: HTMLInputElement = document.getElementById(
    idName
  ) as HTMLInputElement
  if (copyText === null) {
    return
  }
  copyText.select()
  // For mobile devices
  copyText.setSelectionRange(0, 99999)
  document.execCommand('copy')
  // alert('Copied: ' + copyText.value)
}

export function breakLines(message: string): string {
  return message.replace(/(?:\r\n|\r|\n)/g, '<br>')
}

export function htmlspecialcharsJs(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function disableButtons(index: number, prefixes: Array<string>): void {
  prefixes.forEach((prefix) => {
    const buttonElement = document.getElementById(
      prefix + index
    )! as HTMLButtonElement
    buttonElement.disabled = true
  })
}

export function hideTips(selector: string): void {
  const elements: NodeListOf<HTMLElement> = document.querySelectorAll(selector)
  elements.forEach((element) => {
    element.style.display = 'none'
  })
}

export function toggleVisibilityBySelector(
  event: Event,
  selector: string
): void {
  event.preventDefault()
  const elements: NodeListOf<HTMLElement> = document.querySelectorAll(selector)
  elements.forEach((element) => {
    if (element.style.display == 'none') {
      element.style.display = ''
    } else {
      element.style.display = 'none'
    }
  })
}