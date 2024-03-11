/* global validateBookmarks, filterFolders */ //bookmarks.js
/* global toggleThemeDialog, applyColorscheme */ //theme.js
/* global toggleRemoveMode */ //remove.js
/* global consts */ // consts.js
/* global storage */ //storage.js

function startListeningButtons(callbacks) {
  for (const btn of document.querySelectorAll('div[id^=btn_]')) {
    if (callbacks.hasOwnProperty(btn.id))
      btn.addEventListener('click', callbacks[btn.id])
  }
}

function renderBookmarks(folders) {
  for (const [id, folder] of Object.entries(folders)) {
    const folderBlock = tpl.folder({ title: folder.title, id })
    if (!folderBlock) {
      console.warn("can't get folder template for:")
      console.log(id, folder)
      continue
    }
    document.getElementById('root').prepend(folderBlock)

    const bookmarksBlock = document.getElementById(consts.folder_bookmarks(id))
    for (const bookmark of folder.bookmarks) {
      bookmarksBlock.appendChild(tpl.bookmark(bookmark))
    }
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
