/* global consts */ // consts.js

/* exported
  toggleRemoveMode
*/

var removeState = false

function toggleRemoveMode(folders, setState = undefined) {
  if (removeState) {
    window.location.reload()
    return
  }
  removeState = true

  for (const [id, folder] of Object.entries(folders)) {
    const titleBlock = document.getElementById(consts.folder_title(id))
    titleBlock.appendChild(newRemoveFolderBtn(id, folder.title))

    for (const bookmark of folder.bookmarks) {
      const bookmarkBlock = document.getElementById(bookmark.id)
      if (!bookmarkBlock) {
        console.warn(`can't get bookmark block #${bookmark.id}`)
        continue
      }
      bookmarkBlock.classList.add('bookmark-remove')
      if (!bookmarkBlock.hasAttribute('href')) {
        console.warn(`'href' attribute not found in:`)
        console.log(bookmarkBlock)
      } else {
        bookmarkBlock.setAttribute('href', '#')
      }
      bookmarkBlock.addEventListener('click', () => {
        browser.bookmarks
          .remove(bookmark.id)
          .then(() => bookmarkBlock.remove())
          .catch((e) => console.warn(`bookmarks.remove exception: ${e}`))
      })
    }
  }
}

function newRemoveFolderBtn(id, title) {
  const btn = document.createElement('span')
  btn.innerText = 'X'
  btn.title = `remove ${title}`
  btn.className = 'btn-remove-folder'
  btn.addEventListener('click', () => {
    browser.bookmarks
      .removeTree(id)
      .then(() => document.getElementById(id)?.remove())
      .catch((e) => console.warn(`bookmarks.removeTree exception: ${e}`))
  })
  btn.addEventListener('mouseover', () => {
    document.getElementById(id).classList.add('folder-remove')
  })
  btn.addEventListener('mouseout', () => {
    document.getElementById(id).classList.remove('folder-remove')
  })
  return btn
}
