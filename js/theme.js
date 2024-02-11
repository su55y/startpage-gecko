/* global consts */ // consts.js
/* global tpl */ // template.js

/* exported
  toggleThemeDialog
*/

function toggleThemeDialog() {
  console.log('toogle theme dialog handler')
  if (document.getElementById(consts.theme_dialog_block_id)) {
    document.getElementById(consts.theme_dialog_block_id)?.remove()
  } else {
    const themeDialogBlock = tpl.theme_dialog()
    if (!themeDialogBlock) {
      console.warn(`can't load theme_dialog from tpl (${tpl})`)
      return
    }
    document.body.prepend(themeDialogBlock)
    document
      .getElementById(consts.theme_dialog_close_id)
      ?.addEventListener('click', () => themeDialogBlock.remove())
    handleModalAreaClick()
  }
}
