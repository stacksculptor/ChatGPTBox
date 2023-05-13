import { getCoreContentText } from '../../utils/get-core-content-text'
import Browser from 'webextension-polyfill'
import { getUserConfig } from '../../config/index.mjs'
import { openUrl } from '../../utils/open-url'

export const config = {
  newChat: {
    label: 'New Chat',
    genPrompt: async () => {
      return ''
    },
  },
  summarizePage: {
    label: 'Summarize Page',
    genPrompt: async () => {
      return `The following is the text content of a web page, analyze the core content and summarize:\n${getCoreContentText()}`
    },
  },
  openConversationPage: {
    label: 'Open Conversation Page',
    action: async (fromBackground) => {
      console.debug('action is from background', fromBackground)
      if (fromBackground) {
        openUrl(Browser.runtime.getURL('IndependentPanel.html'))
      } else {
        Browser.runtime.sendMessage({
          type: 'OPEN_URL',
          data: {
            url: Browser.runtime.getURL('IndependentPanel.html'),
          },
        })
      }
    },
  },
  openConversationWindow: {
    label: 'Open Conversation Window',
    action: async (fromBackground) => {
      console.debug('action is from background', fromBackground)
      if (fromBackground) {
        const config = await getUserConfig()
        const url = Browser.runtime.getURL('IndependentPanel.html')
        const tabs = await Browser.tabs.query({ url: url, windowType: 'popup' })
        if (!config.alwaysCreateNewConversationWindow && tabs.length > 0)
          await Browser.windows.update(tabs[0].windowId, { focused: true })
        else
          await Browser.windows.create({
            url: url,
            type: 'popup',
            width: 500,
            height: 650,
          })
      } else {
        Browser.runtime.sendMessage({
          type: 'OPEN_CHAT_WINDOW',
          data: {},
        })
      }
    },
  },
  closeAllChats: {
    label: 'Close All Chats In This Page',
    action: async (fromBackground) => {
      console.debug('action is from background', fromBackground)
      Browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        Browser.tabs.sendMessage(tabs[0].id, {
          type: 'CLOSE_CHATS',
          data: {},
        })
      })
    },
  },
}
