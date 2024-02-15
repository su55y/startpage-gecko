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

function newButton(btnClass, innerText) {
  const btn = document.createElement('button')
  btn.classList.add(...['btn-theme-dialog', btnClass])
  btn.innerText = innerText
  return btn
}

function newSaveButton() {
  const saveBtn = newButton('btn-save-theme', 'save')
  saveBtn.addEventListener('click', () => {
    storage.update(colorscheme)
    document.getElementById(consts.theme_dialog_block_id).remove()
    toggleThemeDialog()
  })
  return saveBtn
}

function newCancelButton() {
  const cancelButton = newButton('btn-cancel-theme', 'cancel')
  cancelButton.addEventListener('click', () => {
    colorscheme = storage.load().colors
    applyColorscheme(colorscheme)
    document.getElementById(consts.theme_dialog_block_id).remove()
    toggleThemeDialog()
  })
  return cancelButton
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
  buttonsBlock.appendChild(newSaveButton())
  buttonsBlock.appendChild(newCancelButton())
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

  if (colorscheme !== undefined && themeChanged()) {
    addButtons()
  } else {
    colorscheme = storage.load().colors
  }

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

  document
    .getElementById(consts.theme_dialog_close_id)
    ?.addEventListener('click', () => themeDialogBlock.remove())

  handleModalAreaClick()
}
