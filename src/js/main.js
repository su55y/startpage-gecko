/* global consts */ // consts.js
/* global renderBookmarks, validateBookmarks, filterFolders */ //bookmarks.js
/* global toggleThemeDialog, applyColorscheme */ //theme.js
/* global toggleRemoveMode, removeState */ //remove.js
/* global storage */ //storage.js

function startListeningButtons(callbacks) {
  for (const btn of document.querySelectorAll('div[id^=btn_]')) {
    if (callbacks.hasOwnProperty(btn.id))
      btn.addEventListener('click', callbacks[btn.id])
  }
}

async function handleKeybindings(e) {
  console.log(e)
  if (e.ctrlKey) return
  switch (e.key) {
    case 'T':
      if (removeState) await toggleRemoveMode()
      toggleThemeDialog()
      break
    case 'Escape':
      if (removeState) await toggleRemoveMode()
      document.getElementById(consts.theme_dialog_block_id)?.remove()
      break
    case 'R':
      if (!removeState) {
        document.getElementById(consts.theme_dialog_block_id)?.remove()
        const bookmarksRoot = await browser.bookmarks.getTree()
        await toggleRemoveMode(filterFolders(bookmarksRoot[0].children))
      } else {
        await toggleRemoveMode()
      }
      break
  }
}

async function main() {
  const bookmarksRoot = await browser.bookmarks.getTree()
  if (!validateBookmarks(bookmarksRoot)) return

  const folders = filterFolders(bookmarksRoot[0].children)
  renderBookmarks(folders)
  startListeningButtons({
    btn_theme: toggleThemeDialog,
    btn_remove: () => toggleRemoveMode(folders),
  })
  document.addEventListener('keyup', handleKeybindings)
  storage.init()
  applyColorscheme(storage.load().colors)
}

main()
