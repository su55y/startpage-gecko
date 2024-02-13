/* global consts */ // consts.js
/* global tpl */ // template.js
/* global storage */ //storage.js

/* exported
  toggleThemeDialog
  applyColors
*/

var tempColors

function applyColors(colors) {
  const colorsStyleId = 'colors-style'
  document.getElementById(colorsStyleId)?.remove()
  const colorsStyle = document.createElement('style')
  colorsStyle.id = colorsStyleId
  colorsStyle.innerHTML = ':root {'
  for (const [key, value] of Object.entries(colors)) {
    colorsStyle.innerHTML += `--${key}: ${value};`
  }
  colorsStyle.innerHTML += '}'
  document.body.append(colorsStyle)
}

function updateTempColors({ id, value }) {
  tempColors[id] = value
  applyColors(tempColors)
}

function themeChanged() {
  for (const [id, value] of Object.entries(storage.load().colors)) {
    if (!tempColors[id]) return 1
    if (tempColors[id] !== value) return 1
  }
}

function newSaveButton() {
  const saveBtn = document.createElement('button')
  saveBtn.classList.add(...['btn-theme-dialog', 'btn-save-theme'])
  saveBtn.classList
  saveBtn.innerText = 'save'
  saveBtn.addEventListener('click', () => {
    storage.update(tempColors)
    saveBtn.remove()
  })
  return saveBtn
}

function newCancelButton() {
  const cancelButton = document.createElement('button')
  cancelButton.classList.add(...['btn-theme-dialog', 'btn-cancel-theme'])
  cancelButton.innerText = 'cancel'
  cancelButton.addEventListener('click', () => {
    tempColors = storage.load().colors
    applyColors(tempColors)
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
    console.warn("can't get buttons block")
    return
  }
  buttonsBlock.innerHTML = ''
  buttonsBlock.appendChild(newSaveButton())
  buttonsBlock.appendChild(newCancelButton())
}

function toggleThemeDialog() {
  console.log('toogle theme dialog handler')
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

  if (tempColors !== undefined && themeChanged()) {
    addButtons()
  } else {
    tempColors = storage.load().colors
  }

  for (const [id, value] of Object.entries(tempColors).reverse()) {
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
