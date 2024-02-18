/* exported
  storage
*/

const nord = {
  bg: '#2e3440', // nord0
  bg1: '#3b4252', // nord1
  bg2: '#434c5e', // nord2

  fg: '#e5e9f0', // nord5
  fgd: '#d8dee9', // nord4
  fgw: '#eceff4', // nord6

  red: '#bf616a', // nord11
}

const THEME_STORAGE_KEY = 'start_page_theme'
const DEFAULT_THEME_STORAGE = JSON.stringify({
  colors: nord,
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
