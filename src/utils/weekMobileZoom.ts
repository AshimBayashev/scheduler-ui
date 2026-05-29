export type WeekMobileZoom = 'overview' | 'detail'

export const MOBILE_WEEK_ZOOM_KEY = 'scheduler-week-mobile-zoom'

/** Компактная сетка: вся неделя на экране */
export const MOBILE_WEEK_HOUR_HEIGHT_OVERVIEW = 48

/** Читаемые колонки с горизонтальным скроллом */
export const MOBILE_WEEK_DAY_WIDTH_DETAIL = 96

export function readWeekMobileZoom(): WeekMobileZoom {
  if (typeof sessionStorage === 'undefined') return 'overview'
  return sessionStorage.getItem(MOBILE_WEEK_ZOOM_KEY) === 'detail' ? 'detail' : 'overview'
}

export function writeWeekMobileZoom(zoom: WeekMobileZoom) {
  sessionStorage.setItem(MOBILE_WEEK_ZOOM_KEY, zoom)
}
