import { REMINDER_LABELS, type ReminderMinutes } from '../../data/reminders'
import './ReminderSelect.css'

interface ReminderSelectProps {
  value: ReminderMinutes
  onChange: (value: ReminderMinutes) => void
}

export function ReminderSelect({ value, onChange }: ReminderSelectProps) {
  return (
    <div className="form-field">
      <label htmlFor="reminder-select">Напоминание</label>
      <select
        id="reminder-select"
        className="reminder-select"
        value={value === null ? '' : String(value)}
        onChange={(e) => {
          const raw = e.target.value
          onChange(raw === '' ? null : Number(raw) as ReminderMinutes)
        }}
      >
        <option value="">Без напоминания</option>
        {Object.entries(REMINDER_LABELS).map(([mins, label]) => (
          <option key={mins} value={mins}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
