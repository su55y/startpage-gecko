/* exported
    renderBookmarks
    reRenderBookmarks
    validateBookmarks
    filterFolders
*/

/* global storage */ //storage.js

function dragEnter(evt, el) {
  evt.preventDefault()
  el.classList.add('hovered')
}

function dragOver(evt) {
  evt.preventDefault()
}

function dragLeave(el) {
  el.classList.remove('hovered')
}

function dragEnd(folder) {
  folder.classList.remove('dragged')
}

function changeOrder(movedId, shiftId, oldOrder) {
  const newOrder = []
  for (const id of oldOrder) {
    if (id !== movedId) newOrder.push(id)
    if (id === shiftId) newOrder.push(movedId)
  }
  return newOrder
}

async function drop(evt, folderToShift) {
  evt.target.classList.remove('hovered')
  const targer_folder = evt.target.dataset?.target_folder_id
  if (targer_folder === undefined) {
    console.log('unknown target')
    return
  }
  let order = storage.loadOrder()
  if (!order) {
    const bookmarksRoot = await browser.bookmarks.getTree()
    if (!validateBookmarks(bookmarksRoot)) return
    order = Object.keys(filterFolders(bookmarksRoot[0].children)).reverse()
  }
  order = changeOrder(targer_folder, folderToShift.id, order)
  storage.updateOrder(order)
  reRenderBookmarks()
  setTimeout(() => {
    document
      .getElementById(folderToShift.id)
      .scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, 0)
}

function handleFolderDrag(folder) {
  setTimeout(() => {
    folder.classList.add('dragged')
  }, 0)
  document.querySelectorAll('.folder').forEach((f) => {
    const existing = f.nextElementSibling
    if (existing && existing.classList.contains('dropzone')) {
      existing.remove()
    }
    const e = document.createElement('div')
    e.className = 'dropzone'
    e.id = `d${f.id}`
    e.dataset.target_folder_id = folder.id
    e.addEventListener('dragover', dragOver)
    e.addEventListener('dragenter', (evt) => dragEnter(evt, e))
    e.addEventListener('dragleave', () => dragLeave(e))
    e.addEventListener('drop', (evt) => drop(evt, f))
    f.insertAdjacentElement('afterend', e)
  })
}

function renderBookmarks(folders) {
  const root = document.getElementById('root')
  if (!root) {
    console.warn("can't get #root element:", root)
    return
  }
  root.innerHTML = ''

  let order = storage.loadOrder()
  if (!order) {
    order = Object.keys(folders).reverse()
  } else {
    const currentOrder = new Set(order)
    const newFolders = Object.keys(folders).filter((k) => !currentOrder.has(k))
    if (newFolders.length) {
      order.push(...newFolders)
      storage.updateOrder(order)
    }
  }

  for (const id of order) {
    if (!(id in folders)) continue
    const { bookmarks, title } = folders[id]
    const folderBlock = tpl.folder({ title, id })
    if (!folderBlock) {
      console.warn(`can't get folder template for: #${id} '${title}'`)
      continue
    }
    root.append(folderBlock)
    folderBlock.setAttribute('draggable', 'true')
    folderBlock.addEventListener('dragstart', () =>
      handleFolderDrag(folderBlock)
    )
    folderBlock.addEventListener('dragend', () => dragEnd(folderBlock))

    const bookmarksBlock = document.getElementById(consts.folder_bookmarks(id))
    for (const bookmark of bookmarks) {
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
