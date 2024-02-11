/* exported
  storage
*/

const THEME_STORAGE_KEY = 'start_page_theme'
const DEFAULT_THEME_STORAGE = JSON.stringify({
  colors: {
    bg: '#282828',
    bg1: '#3c3836',
    bg2: '#504945',
    fg: '#ebdbb2',
    fgd: '#d5c4a1',
    fgw: '#f2e5bc',
    red: '#cc241d',
  },
})

const init = () => {
  window.localStorage.getItem(THEME_STORAGE_KEY) ||
    window.localStorage.setItem(THEME_STORAGE_KEY, DEFAULT_THEME_STORAGE)
}

const load = () =>
  JSON.parse(
    window.localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME_STORAGE
  )

const updateColors = (colors) =>
  window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ colors }))

const storage = {
  init,
  load,
  update: updateColors,
}
