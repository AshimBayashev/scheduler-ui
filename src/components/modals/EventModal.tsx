import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import type { CalendarEvent, EventFormData } from '../../types/event'
import './EventModal.css'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: EventFormData) => void | Promise<void>
  onDelete?: () => void | Promise<void>
  initialData?: Partial<EventFormData>
  editingEvent?: CalendarEvent | null
}

function toLocalDatetimeString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function fromLocalDatetimeString(value: string): Date {
  return new Date(value)
}

export function EventModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
  editingEvent,
}: EventModalProps) {
  const now = new Date()
  const defaultStart = initialData?.start ?? now
  const defaultEnd = initialData?.end ?? new Date(now.getTime() + 30 * 60 * 1000)

  const [title, setTitle] = useState(initialData?.title ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [startStr, setStartStr] = useState(toLocalDatetimeString(defaultStart))
  const [endStr, setEndStr] = useState(toLocalDatetimeString(defaultEnd))
  const [allDay, setAllDay] = useState(initialData?.allDay ?? false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const start = initialData?.start ?? new Date()
      const end = initialData?.end ?? new Date(start.getTime() + 30 * 60 * 1000)
      setTitle(initialData?.title ?? editingEvent?.title ?? '')
      setDescription(initialData?.description ?? editingEvent?.description ?? '')
      setStartStr(toLocalDatetimeString(start))
      setEndStr(toLocalDatetimeString(end))
      setAllDay(initialData?.allDay ?? editingEvent?.allDay ?? false)
    }
  }, [isOpen, initialData, editingEvent])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || submitting) return
    setSubmitting(true)
    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        start: fromLocalDatetimeString(startStr),
        end: fromLocalDatetimeString(endStr),
        allDay,
      })
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-modal-title"
      >
        <div className="modal-header">
          <h2 id="event-modal-title">
            {editingEvent ? 'Редактировать дело' : 'Новое дело'}
          </h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-field">
            <label htmlFor="event-title">Название</label>
            <input
              id="event-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Завтрак — овсянка"
              autoFocus
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="event-description">Описание</label>
            <textarea
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Дополнительные детали..."
              rows={3}
            />
          </div>

          <label className="form-checkbox">
            <input
              type="checkbox"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
            />
            Весь день
          </label>

          {!allDay && (
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="event-start">Начало</label>
                <input
                  id="event-start"
                  type="datetime-local"
                  value={startStr}
                  onChange={(e) => setStartStr(e.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="event-end">Конец</label>
                <input
                  id="event-end"
                  type="datetime-local"
                  value={endStr}
                  onChange={(e) => setEndStr(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {allDay && initialData?.start && (
            <p className="form-hint">
              {format(fromLocalDatetimeString(startStr), 'd MMMM yyyy', { locale: ru })}
            </p>
          )}

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
                {submitting ? 'Сохранение...' : editingEvent ? 'Сохранить' : 'Создать'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
