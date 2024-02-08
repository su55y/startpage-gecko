function validateBookmarks(bookmarks) {
  const fail = () => {
    console.warn('Unexpected bookmarks structure')
    console.log(bookmarks)
  }
  if (bookmarks.length != 1) {
    fail()
    return 0
  }
  if (
    !bookmarks[0].hasOwnProperty('id') ||
    !bookmarks[0].hasOwnProperty('children')
  ) {
    fail()
    return 0
  }
  return 1
}

function filterFolders(bookmarksArray) {
  const folders = {}
  const BookmarkNodeType = {
    Folder: 'folder',
    Bookmark: 'bookmark',
    Separator: 'separator',
  }

  function iterateOver(bookmarksRoot) {
    for (const bookmarkNode of bookmarksRoot) {
      if (!bookmarkNode.hasOwnProperty('type')) continue
      switch (bookmarkNode.type) {
        case BookmarkNodeType.Folder:
          folders[bookmarkNode.id] = {
            title: bookmarkNode.title,
            bookmarks: new Array(),
          }
          iterateOver(bookmarkNode.children)
          break
        case BookmarkNodeType.Bookmark:
          folders[bookmarkNode.parentId].bookmarks.push(bookmarkNode)
          break
        case BookmarkNodeType.Separator:
          // not include
          break
      }
    }
  }

  iterateOver(bookmarksArray)

  return folders
}

function renderBookmarks(folders) {
  for (const [id, folder] of Object.entries(folders)) {
    const folderDiv = document.createElement('div')
    folderDiv.id = id
    folderDiv.className = 'folder'

    const folderTitle = document.createElement('h3')
    folderTitle.innerText = folder.title
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
