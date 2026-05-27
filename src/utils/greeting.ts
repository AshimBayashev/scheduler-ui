/** Эвристика: женские окончания имён для «Доброй ночи» и т.п. */
export function isLikelyFeminineName(name: string): boolean {
  const n = name.trim().toLowerCase()
  if (!n) return false
  if (/[ая]$/u.test(n)) return true
  return /^(анна|мария|елена|ольга|наталья|татьяна|ирина|светлана|юлия|дарья|алина|виктория|полина|ксения|валерия|вероника|екатерина|надежда|людмила|галина|любовь|зоя|инна|алла|раиса|нина|лариса|оксана|марина|софия|софья|вера|надежда)/u.test(
    n,
  )
}

export function getGreeting(hour: number, feminine: boolean): string {
  if (hour >= 5 && hour < 12) return 'Доброе утро'
  if (hour >= 12 && hour < 18) return feminine ? 'Добрый день' : 'Добрый день'
  if (hour >= 18 && hour < 23) return feminine ? 'Добрый вечер' : 'Добрый вечер'
  return feminine ? 'Доброй ночи' : 'Доброй ночи'
}

export function getDisplayName(name: string | null, email: string): string {
  if (name?.trim()) return name.trim()
  const local = email.split('@')[0]
  return local.charAt(0).toUpperCase() + local.slice(1)
}
