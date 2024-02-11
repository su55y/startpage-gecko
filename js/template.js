/* global consts */ // consts.js

/* exported
  tpl
*/

const parseTpl = (tpl, obj) => {
  const rawElm = tpl.replace(/\{\{(\w+)\}\}/g, (_, key) => obj[key] || '')
  return new DOMParser().parseFromString(rawElm, 'text/html').body.firstChild
}

const loadTpl = (id, obj = {}) => {
  const tpl = document.getElementById(id)?.innerHTML
  if (tpl) return parseTpl(tpl, obj)
}

const tpl = {
  theme_dialog: () => loadTpl('theme_dialog', consts),
}
