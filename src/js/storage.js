/* exported
  storage
*/

const nord = {
  bg: '#2e3440', // nord0
  bg2: '#3b4252', // nord1

  fg: '#e5e9f0', // nord5
  fg2: '#d8dee9', // nord4

  red: '#bf616a', // nord11
}

const gruvbox = {
  bg: '#282828',
  bg2: '#3c3836',

  fg: '#ebdbb2',
  fg2: '#fbf1c7',

  red: '#cc241d',
}

const FOLDERS_ORDER_STORAGE_KEY = 'start_page_folders_order'
const THEME_STORAGE_KEY = 'start_page_theme'
const DEFAULT_THEME_STORAGE = JSON.stringify({
  colors: nord,
})

const init = () => {
  window.localStorage.getItem(THEME_STORAGE_KEY) ||
    window.localStorage.setItem(THEME_STORAGE_KEY, DEFAULT_THEME_STORAGE)
}

const loadColors = () =>
  JSON.parse(
    window.localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME_STORAGE
  )

const loadOrder = () => {
  const rawOrder = window.localStorage.getItem(FOLDERS_ORDER_STORAGE_KEY)
  if (rawOrder) return JSON.parse(rawOrder)
}

const updateColors = (colors) =>
  window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ colors }))

const updateOrder = (newOrder) =>
  window.localStorage.setItem(
    FOLDERS_ORDER_STORAGE_KEY,
    JSON.stringify(newOrder)
  )

const storage = {
  init,
  loadColors,
  loadOrder,
  update: updateColors,
  updateOrder,
  themePresets: { nord, gruvbox },
}
