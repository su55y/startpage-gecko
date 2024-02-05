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

function filterBookmarks(bookmarksArray) {
  const BookmarkNodeType = {
    Folder: 'folder',
    Bookmark: 'bookmark',
    Separator: 'separator',
  }
  const folders = {},
    bookmarks = []

  function iterateOver(bookmarksRoot) {
    for (const bookmarkNode of bookmarksRoot) {
      if (!bookmarkNode.hasOwnProperty('type')) continue
      switch (bookmarkNode.type) {
        case BookmarkNodeType.Folder:
          folders[bookmarkNode.id] = bookmarkNode.title
          iterateOver(bookmarkNode.children)
          break
        case BookmarkNodeType.Bookmark:
          bookmarks.push(bookmarkNode)
          break
      }
    }
  }
  iterateOver(bookmarksArray)
  return [folders, bookmarks]
}

function main() {
  browser.bookmarks.getTree((bookmarksRoot) => {
    if (!validateBookmarks(bookmarksRoot)) return
    const [folders, bookmarks] = filterBookmarks(bookmarksRoot[0].children)
    for (const bookmark of bookmarks) {
      console.log(`${bookmark.title}: ${folders[bookmark.parentId]}`)
    }
  })
}

main()
