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

function main() {
  browser.bookmarks.getTree((bookmarksRoot) => {
    if (!validateBookmarks(bookmarksRoot)) return

    const folders = filterFolders(bookmarksRoot[0].children)
    renderBookmarks(folders)
    startListeningButtons({
      btn_theme: toggleThemeDialog,
      btn_remove: () => toggleRemoveMode(folders),
    })
    storage.init()
    applyColorscheme(storage.load().colors)
  })
}

main()
