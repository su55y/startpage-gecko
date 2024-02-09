/* exported
    validateBookmarks
    filterFolders
*/

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
