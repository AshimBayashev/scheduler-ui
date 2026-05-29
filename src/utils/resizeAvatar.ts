const MAX_AVATAR_SIZE = 256
const JPEG_QUALITY = 0.85

export async function resizeAvatar(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Выбери файл изображения')
  }

  if (file.size > 8 * 1024 * 1024) {
    throw new Error('Файл слишком большой (макс. 8 МБ)')
  }

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_AVATAR_SIZE / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Не удалось обработать фото')

  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  return canvas.toDataURL('image/jpeg', JPEG_QUALITY)
}
