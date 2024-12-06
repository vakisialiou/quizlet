
const btn = document.createElement('div')
btn.style.position = 'fixed'
btn.style.bottom = '8px'
btn.style.right = '8px'
btn.style.padding = '8px'
btn.innerHTML = 'Start play'

btn.setAttribute('data-visible', 'false')
btn.addEventListener('click', () => {
  btn.setAttribute('data-visible', 'false')
  document.body.removeChild(btn)
  sendBackgroundMessage('open-panel', {})
})

listenMessage('start_play', () => {
  if (btn.getAttribute('data-visible') === 'true') {
    return
  }

  btn.setAttribute('data-visible', 'true')
  document.body.appendChild(btn)
})

function listenMessage(type, callback, async = false) {
  const func = (request, sender, sendResponse) => {
    if (request.type === type) {
      callback(request.data, sender, sendResponse)
      return async
    }
  }
  chrome.runtime.onMessage.addListener(func)
  return func
}

/**
 * Send message to background script.
 *
 * @param {string} type
 * @param {Object} [data]
 * @param {Function} [responseCallback]
 */
function sendBackgroundMessage(type, data, responseCallback) {
  chrome.runtime.sendMessage({type, data}, (...payload) => {
    const msg = 'The message port closed before a response was received'
    if (!chrome.runtime.lastError || String(chrome.runtime.lastError.message).startsWith(msg)) {
      if (responseCallback) {
        responseCallback(...payload)
      }
    }
  })
}
