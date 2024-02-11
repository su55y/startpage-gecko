/* global consts */ // consts.js

/* exported
  handleModalAreaClick
*/

const handleModalAreaClick = () => {
  document.querySelector('.modal-area')?.addEventListener('click', (e) => {
    if (e.target.className !== 'modal-area') return
    document.getElementById(consts.theme_dialog_block_id)?.remove()
  })
}
