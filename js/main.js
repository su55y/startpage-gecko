/* global validateBookmarks, filterFolders */ //bookmarks.js

function renderBookmarks(folders) {
  for (const [id, folder] of Object.entries(folders)) {
    const folderDiv = document.createElement('div')
    folderDiv.id = id
    folderDiv.className = 'folder'

    const folderTitle = document.createElement('h3')
    folderTitle.innerText = folder.title
    folderTitle.className = 'folder-title'
    folderDiv.prepend(folderTitle)

    for (const bookmark of folder.bookmarks) {
      const bookmarkElm = document.createElement('a')
      bookmarkElm.id = bookmark.id
      bookmarkElm.href = bookmark.url
      bookmarkElm.innerText = bookmark.title
      bookmarkElm.className = 'bookmark'
      folderDiv.appendChild(bookmarkElm)
    }

    document.getElementById('root').appendChild(folderDiv)
  }
}

function main() {
  browser.bookmarks.getTree((bookmarksRoot) => {
    if (!validateBookmarks(bookmarksRoot)) return

    const folders = filterFolders(bookmarksRoot[0].children)
    for (const [id, folder] of Object.entries(folders))
      if (!folder.bookmarks.length) delete folders[id]

    renderBookmarks(folders)
  })
}

main()
