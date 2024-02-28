/* global consts */ // consts.js
/* global tpl */ // template.js
/* global storage */ //storage.js

/* exported
  toggleThemeDialog
  applyColorscheme
*/

var colorscheme

function applyColorscheme(colors) {
  document.getElementById(consts.colorscheme_style_element_id)?.remove()
  const colorsStyle = document.createElement('style')
  colorsStyle.id = consts.colorscheme_style_element_id
  colorsStyle.innerHTML = ':root {'
  for (const [key, value] of Object.entries(colors)) {
    colorsStyle.innerHTML += `--${key}: ${value};`
  }
  colorsStyle.innerHTML += '}'
  document.body.append(colorsStyle)
}

function updateTempColors({ id, value }) {
  colorscheme[id] = value
  applyColorscheme(colorscheme)
}

function themeChanged() {
  for (const [id, value] of Object.entries(storage.load().colors)) {
    if (!colorscheme[id]) return 1
    if (colorscheme[id] !== value) return 1
  }
}

function addButtons() {
  const buttonsBlock = document.getElementById(
    consts.theme_dialog_buttons_block_id
  )
  if (!buttonsBlock) {
    console.warn("can't get theme dialog buttons block")
    return
  }
  buttonsBlock.innerHTML = ''
  buttonsBlock.appendChild(tpl.theme_dialog_buttons())
  document
    .getElementById(consts.theme_dialog_button_save)
    ?.addEventListener('click', () => {
      storage.update(colorscheme)
      document.getElementById(consts.theme_dialog_block_id).remove()
      toggleThemeDialog()
    })
  document
    .getElementById(consts.theme_dialog_button_cancel)
    ?.addEventListener('click', () => {
      colorscheme = storage.load().colors
      applyColorscheme(colorscheme)
      document.getElementById(consts.theme_dialog_block_id).remove()
      toggleThemeDialog()
    })
}

function toggleThemeDialog() {
  if (document.getElementById(consts.theme_dialog_block_id)) {
    document.getElementById(consts.theme_dialog_block_id).remove()
    return
  }

  const themeDialogBlock = tpl.theme_dialog()
  if (!themeDialogBlock) {
    console.warn(`can't load theme_dialog from tpl (${tpl})`)
    return
  }

  document.body.prepend(themeDialogBlock)

  const themeSelect = document.getElementById(consts.theme_dialog_select)
  if (!themeSelect) {
    console.warn(`can't get select#'${consts.theme_dialog_select}'`)
    return
  }

  if (colorscheme !== undefined && themeChanged()) {
    addButtons()
  } else {
    colorscheme = storage.load().colors
  }

  const drawColors = () => {
    document.getElementById(consts.theme_dialog_colors_id).innerHTML = ''
    for (const [id, value] of Object.entries(colorscheme).reverse()) {
      document.getElementById(consts.theme_dialog_colors_id).prepend(
        tpl.color_input({
          new_color_id: id,
          new_color_value: value,
        })
      )
      document.getElementById(id)?.addEventListener('change', (e) => {
        updateTempColors(e.target)
        addButtons()
      })
    }
  }
  drawColors()

  for (const theme in storage.themePresets) {
    const themeOption = document.createElement('option')
    themeOption.value = theme
    themeOption.innerText = theme
    themeSelect.append(themeOption)
  }
  themeSelect.addEventListener(
    'input',
    (e) => {
      if (e.target.id !== consts.theme_dialog_select) return
      colorscheme = storage.themePresets[e.target.value] || colorscheme
      applyColorscheme(colorscheme)
      drawColors()
    },
    false
  )

  document
    .getElementById(consts.theme_dialog_close_id)
    ?.addEventListener('click', () => themeDialogBlock.remove())

  handleModalAreaClick()
}
