import { THEMES, type Theme } from '../../data/themes'
import { useTheme } from '../../context/ThemeContext'
import './ThemeSelect.css'

export function ThemeSelect() {
  const { theme, setTheme } = useTheme()

  return (
    <label className="theme-select-wrap">
      <span className="theme-select-label">Тема</span>
      <select
        className="theme-select"
        value={theme}
        onChange={(e) => setTheme(e.target.value as Theme)}
        aria-label="Выбор темы оформления"
      >
        {THEMES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </select>
    </label>
  )
}
