chrome.sidePanel.setOptions({ enabled: true })
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })

const REMINDER_ENABLED = false

chrome.alarms.create('EVERY_FIVE_MINUTES', {
  periodInMinutes: .5
})

chrome.alarms.onAlarm.addListener((data) => {
  if (!REMINDER_ENABLED) {
    return
  }

  if (data.name === 'EVERY_FIVE_MINUTES') {
    chrome.tabs.query({ active: true, currentWindow : true}, tabs => {
      if (tabs.length >= 0) {
        sendMessageTo(tabs[0]['id'], 'start_play', {})
      }
    })
  }
})

listenMessage('open-panel', (data, sender) => {
  chrome.sidePanel.open({ tabId: sender.tab.id, windowId: sender.tab.windowId }, () => {})
})

chrome.runtime.onMessageExternal.addListener((data, sender, callback) => {
  if (callback) {
    callback({ isConnected: true })
  }
})

if (chrome.runtime.onInstalled) {
  chrome.runtime.onInstalled.addListener(async (details) => {
    const { reason } = details

    const INSTALL = chrome.runtime.OnInstalledReason.INSTALL
    if (reason === INSTALL) {
      await setLocal('installId', `${Date.now()}:${getRandomArbitrary(10000, 99999).toFixed(0)}`)

      const data = await cookieGet('utm', 'https://quizerplay.com')
      const value = data ? data.value : null
      if (!value) {
        return null
      }

      await setLocal('utm', value)
    }
  })
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min
}

/**
 * Returns chrome storage value for provided key.
 *
 * @param {string} key
 * @param {*} [defaultValue]
 * @returns {Promise<*>}
 */
function getLocal(key, defaultValue = null) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get([key], response => {
        const res = objectPath.get(response, [key], defaultValue)
        resolve(res)
      })
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Sets chrome storage item value.
 *
 * @param {string} key
 * @param {*} value
 * @returns {Promise<void>}
 */
function setLocal(key, value) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, resolve)
  })
}

/**
 *
 * @param {string} name
 * @param {string} url
 * @returns {Promise<Object|null>}
 */
async function cookieGet(name, url) {
  return new Promise((resolve) => {
    chrome.cookies.get({ name, url }, resolve)
  })
}

function sendMessageTo(tabId, type, data, responseCallback, extra = {}) {
  chrome.tabs.sendMessage(tabId, { type, data, ...extra }, (...payload) => {
    const lastError = chrome.runtime.lastError
    if (!responseCallback) {
      return
    }

    if (!lastError) {
      return responseCallback(...payload)
    }

    const message = String(lastError.message)
    const msg1 = 'The message port closed before a response was received'
    const msg2 = 'Could not establish connection. Receiving end does not exist.'
    if (!message.startsWith(msg1) || message.startsWith(msg2)) {
      responseCallback(...payload)
    }
  })
}

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
