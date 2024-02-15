/* global validateBookmarks, filterFolders */ //bookmarks.js
/* global toggleThemeDialog, applyColorscheme */ //theme.js
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

    for (const bookmark of folder.bookmarks) {
      const bookmarkElm = document.createElement('a')
      bookmarkElm.id = bookmark.id
      bookmarkElm.href = bookmark.url
      bookmarkElm.innerText = bookmark.title
      bookmarkElm.className = 'bookmark'
      document.getElementById(id).appendChild(bookmarkElm)
    }
  }
}

function main() {
  browser.bookmarks.getTree((bookmarksRoot) => {
    if (!validateBookmarks(bookmarksRoot)) return

    const folders = filterFolders(bookmarksRoot[0].children)
    renderBookmarks(folders)
    startListeningButtons({ btn_theme: toggleThemeDialog })
    storage.init()
    applyColorscheme(storage.load().colors)
  })
}

main()
