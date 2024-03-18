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

function handleKeybindings(e) {
  if (e.ctrlKey) return
  switch (e.key) {
    case 't':
      if (removeState) toggleRemoveMode()
      toggleThemeDialog()
      break
    case 'Escape':
      if (removeState) toggleRemoveMode()
      document.getElementById(consts.theme_dialog_block_id)?.remove()
      break
    case 'r':
      if (!removeState) {
        document.getElementById(consts.theme_dialog_block_id)?.remove()
        browser.bookmarks.getTree((bookmarksRoot) => {
          toggleRemoveMode(filterFolders(bookmarksRoot[0].children))
        })
      } else {
        toggleRemoveMode()
      }
      break
  }
}

function main() {
  browser.bookmarks.getTree((bookmarksRoot) => {
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
  })
}

main()
