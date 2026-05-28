import { useEffect, useState } from 'react'
import type { Routine, RoutineFormData } from '../../types/routine'
import { DAY_PRESETS, WEEKDAY_LABELS } from '../../types/routine'
import { ColorPicker } from '../common/ColorPicker'
import { ReminderSelect } from '../common/ReminderSelect'
import { resolveFormColor } from '../../data/colorPalette'
import { DEFAULT_REMINDER_MINUTES, normalizeReminderMinutes, type ReminderMinutes } from '../../data/reminders'
import '../modals/EventModal.css'
import './RoutineModal.css'

interface RoutineModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: RoutineFormData) => void | Promise<void>
  onDelete?: () => void | Promise<void>
  editingRoutine?: Routine | null
}

export function RoutineModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  editingRoutine,
}: RoutineModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState('08:00')
  const [durationInput, setDurationInput] = useState('30')
  const [durationError, setDurationError] = useState<string | null>(null)
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([...DAY_PRESETS.everyDay])
  const [color, setColor] = useState<string>(() => resolveFormColor())
  const [reminderMinutesBefore, setReminderMinutesBefore] = useState<ReminderMinutes>(
    DEFAULT_REMINDER_MINUTES,
  )
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTitle(editingRoutine?.title ?? '')
      setDescription(editingRoutine?.description ?? '')
      setStartTime(editingRoutine?.startTime ?? '08:00')
      setDurationInput(String(editingRoutine?.durationMinutes ?? 30))
      setDurationError(null)
      setDaysOfWeek(editingRoutine?.daysOfWeek ?? [...DAY_PRESETS.everyDay])
      setColor(resolveFormColor(editingRoutine?.color))
      setReminderMinutesBefore(
        normalizeReminderMinutes(editingRoutine?.reminderMinutesBefore),
      )
    }
  }, [isOpen, editingRoutine])

  if (!isOpen) return null

  const toggleDay = (iso: number) => {
    setDaysOfWeek((prev) =>
      prev.includes(iso) ? prev.filter((d) => d !== iso) : [...prev, iso].sort((a, b) => a - b),
    )
  }

  const applyPreset = (days: readonly number[]) => {
    setDaysOfWeek([...days])
  }

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    if (raw === '' || /^\d+$/.test(raw)) {
      setDurationInput(raw)
      setDurationError(null)
    }
  }

  const handleDurationBlur = () => {
    if (durationInput === '') {
      setDurationInput('0')
    }
  }

  const validateDuration = (): number | null => {
    const duration = durationInput === '' ? 0 : Number.parseInt(durationInput, 10)
    if (!Number.isFinite(duration) || duration <= 0) {
      setDurationError('Укажите длительность больше 0 минут')
      return null
    }
    if (duration < 5 || duration > 720) {
      setDurationError('Длительность — от 5 до 720 минут')
      return null
    }
    return duration
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || daysOfWeek.length === 0 || submitting) return

    const durationMinutes = validateDuration()
    if (durationMinutes === null) return

    setSubmitting(true)
    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        startTime,
        durationMinutes,
        daysOfWeek,
        color,
        reminderMinutesBefore,
      })
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal routine-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="routine-modal-title"
      >
        <div className="modal-header">
          <h2 id="routine-modal-title">
            {editingRoutine ? 'Редактировать рутину' : 'Новая рутина'}
          </h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-field">
            <label htmlFor="routine-title">Название</label>
            <input
              id="routine-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Подъём, Обед, Зал"
              autoFocus
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="routine-description">Описание</label>
            <textarea
              id="routine-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Необязательно"
              rows={2}
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="routine-time">Время</label>
              <input
                id="routine-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="routine-duration">Длительность (мин)</label>
              <input
                id="routine-duration"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={durationInput}
                onChange={handleDurationChange}
                onBlur={handleDurationBlur}
                aria-invalid={durationError ? true : undefined}
                aria-describedby={durationError ? 'routine-duration-error' : undefined}
              />
              {durationError && (
                <p id="routine-duration-error" className="form-error" role="alert">
                  {durationError}
                </p>
              )}
            </div>
          </div>

          <ColorPicker value={color} onChange={setColor} />

          <ReminderSelect
            value={reminderMinutesBefore}
            onChange={setReminderMinutesBefore}
          />

          <div className="form-field">
            <label>Дни недели</label>
            <div className="day-presets">
              <button type="button" onClick={() => applyPreset(DAY_PRESETS.everyDay)}>
                Каждый день
              </button>
              <button type="button" onClick={() => applyPreset(DAY_PRESETS.weekdays)}>
                Будни
              </button>
              <button type="button" onClick={() => applyPreset(DAY_PRESETS.weekend)}>
                Выходные
              </button>
            </div>
            <div className="day-chips" role="group" aria-label="Дни недели">
              {WEEKDAY_LABELS.map(({ iso, label }) => (
                <button
                  key={iso}
                  type="button"
                  className={['day-chip', daysOfWeek.includes(iso) && 'day-chip--active']
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => toggleDay(iso)}
                  aria-pressed={daysOfWeek.includes(iso)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            {onDelete && (
              <button type="button" className="btn-danger" onClick={onDelete}>
                Удалить
              </button>
            )}
            <div className="modal-actions-right">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Отмена
              </button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Сохранение...' : editingRoutine ? 'Сохранить' : 'Создать'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
