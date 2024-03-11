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

    // for (const bookmark of folder.bookmarks) {
    //   document
    //     .getElementById(bookmark.id)
    //     .appendChild(newRemoveBookmarkBtn(bookmark))
    // }
  }
}

function newRemoveFolderBtn(id, title) {
  const btn = document.createElement('span')
  btn.innerText = 'X'
  btn.title = `remove ${title}`
  btn.className = 'btn-remove-folder'
  btn.addEventListener('click', () => {
    console.log(`new remove folder '${id}' callback`)
  })
  btn.addEventListener('mouseover', () => {
    document.getElementById(id).classList.add('folder-remove')
  })
  btn.addEventListener('mouseout', () => {
    document.getElementById(id).classList.remove('folder-remove')
  })
  return btn
}

function newRemoveBookmarkBtn({ id, title }) {
  const btn = document.createElement('span')
  btn.innerText = 'X'
  btn.title = `remove ${title}`
  btn.className = 'btn-remove-bookmark'
  btn.addEventListener('click', () => {
    console.log(`new remove bookmark '${id}' callback`)
  })
  btn.addEventListener('mouseover', () => {
    document.getElementById(id).classList.add('bookmark-remove')
  })
  btn.addEventListener('mouseout', () => {
    document.getElementById(id).classList.remove('bookmark-remove')
  })
  return btn
}
