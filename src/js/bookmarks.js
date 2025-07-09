/* exported
    renderBookmarks
    reRenderBookmarks
    validateBookmarks
    filterFolders
*/

function renderBookmarks(folders) {
  const root = document.getElementById('root')
  if (!root) {
    console.warn("can't get #root element:", root)
    return
  }
  root.innerHTML = ''
  for (const [id, folder] of Object.entries(folders)) {
    const folderBlock = tpl.folder({ title: folder.title, id })
    if (!folderBlock) {
      console.warn("can't get folder template for:")
      console.log(id, folder)
      continue
    }
    root.prepend(folderBlock)

    const bookmarksBlock = document.getElementById(consts.folder_bookmarks(id))
    for (const bookmark of folder.bookmarks) {
      bookmarksBlock.appendChild(tpl.bookmark(bookmark))
    }
  }
}

async function reRenderBookmarks(callbacks = undefined) {
  const bookmarksRoot = await browser.bookmarks.getTree()
  if (!validateBookmarks(bookmarksRoot)) return
  renderBookmarks(filterFolders(bookmarksRoot[0].children))
  if (callbacks) {
    for (const callback of callbacks) {
      callback()
    }
  }
}

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
      // Skip toolbar
      if (
        bookmarkNode.id === 'toolbar_____' ||
        (bookmarkNode.hasOwnProperty('folderType') &&
          bookmarkNode.folderType === 'bookmarks-bar')
      )
        continue
      if (!bookmarkNode.hasOwnProperty('type')) {
        if (bookmarkNode.hasOwnProperty('children')) {
          folders[bookmarkNode.id] = {
            title: bookmarkNode.title,
            bookmarks: new Array(),
          }
          iterateOver(bookmarkNode.children)
        } else {
          folders[bookmarkNode.parentId].bookmarks.push(bookmarkNode)
        }
      } else {
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
            break
        }
      }
    }
  }

  iterateOver(bookmarksArray)
  for (const [id, folder] of Object.entries(folders))
    if (!folder.bookmarks.length) delete folders[id]

  return folders
}
