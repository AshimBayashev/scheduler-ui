import { COLOR_PALETTE } from '../../data/colorPalette'
import './ColorPicker.css'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
}

export function ColorPicker({ value, onChange, label = 'Цвет' }: ColorPickerProps) {
  return (
    <div className="form-field color-picker">
      <span className="color-picker-label">{label}</span>
      <div className="color-picker-grid" role="radiogroup" aria-label={label}>
        {COLOR_PALETTE.map((color) => (
          <button
            key={color}
            type="button"
            role="radio"
            aria-checked={value === color}
            aria-label={`Цвет ${color}`}
            className={['color-swatch', value === color && 'color-swatch--selected']
              .filter(Boolean)
              .join(' ')}
            style={{ '--swatch-color': color } as React.CSSProperties}
            onClick={() => onChange(color)}
          />
        ))}
      </div>
    </div>
  )
}
