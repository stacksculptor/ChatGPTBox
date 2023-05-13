import Browser from 'webextension-polyfill'
import {
  deleteConversation,
  generateAnswersWithChatgptWebApi,
  sendMessageFeedback,
} from '../services/apis/chatgpt-web'
import { generateAnswersWithBingWebApi } from '../services/apis/bing-web.mjs'
import {
  generateAnswersWithChatgptApi,
  generateAnswersWithGptCompletionApi,
} from '../services/apis/openai-api'
import { generateAnswersWithCustomApi } from '../services/apis/custom-api.mjs'
import { generateAnswersWithAzureOpenaiApi } from '../services/apis/azure-openai-api.mjs'
import { generateAnswersWithWaylaidwandererApi } from '../services/apis/waylaidwanderer-api.mjs'
import { generateAnswersWithPoeWebApi } from '../services/apis/poe-web.mjs'
import {
  azureOpenAiApiModelKeys,
  bingWebModelKeys,
  chatgptApiModelKeys,
  chatgptWebModelKeys,
  customApiModelKeys,
  defaultConfig,
  getUserConfig,
  githubThirdPartyApiModelKeys,
  gptApiModelKeys,
  Models,
  poeWebModelKeys,
  setUserConfig,
} from '../config/index.mjs'
import '../_locales/i18n'
import { openUrl } from '../utils/open-url'
import {
  getBingAccessToken,
  getChatGptAccessToken,
  registerPortListener,
} from '../services/wrappers.mjs'
import { refreshMenu } from './menus.mjs'
import { registerCommands } from './commands.mjs'

function setPortProxy(port, proxyTabId) {
  port.proxy = Browser.tabs.connect(proxyTabId)
  const proxyOnMessage = (msg) => {
    port.postMessage(msg)
  }
  const portOnMessage = (msg) => {
    port.proxy.postMessage(msg)
  }
  const proxyOnDisconnect = () => {
    port.proxy = Browser.tabs.connect(proxyTabId)
  }
  const portOnDisconnect = () => {
    port.proxy.onMessage.removeListener(proxyOnMessage)
    port.onMessage.removeListener(portOnMessage)
    port.proxy.onDisconnect.removeListener(proxyOnDisconnect)
    port.onDisconnect.removeListener(portOnDisconnect)
  }
  port.proxy.onMessage.addListener(proxyOnMessage)
  port.onMessage.addListener(portOnMessage)
  port.proxy.onDisconnect.addListener(proxyOnDisconnect)
  port.onDisconnect.addListener(portOnDisconnect)
}

async function executeApi(session, port, config) {
  console.debug('modelName', session.modelName)
  if (chatgptWebModelKeys.includes(session.modelName)) {
    let tabId
    if (
      config.chatgptTabId &&
      config.customChatGptWebApiUrl === defaultConfig.customChatGptWebApiUrl
    ) {
      const tab = await Browser.tabs.get(config.chatgptTabId).catch(() => {})
      if (tab) tabId = tab.id
    }
    if (tabId) {
      if (!port.proxy) {
        setPortProxy(port, tabId)
        port.proxy.postMessage({ session })
      }
    } else {
      const accessToken = await getChatGptAccessToken()
      await generateAnswersWithChatgptWebApi(port, session.question, session, accessToken)
    }
  } else if (bingWebModelKeys.some((n) => session.modelName.includes(n))) {
    const accessToken = await getBingAccessToken()
    if (session.modelName.includes('bingFreeSydney'))
      await generateAnswersWithBingWebApi(port, session.question, session, accessToken, true)
    else await generateAnswersWithBingWebApi(port, session.question, session, accessToken)
  } else if (gptApiModelKeys.includes(session.modelName)) {
    await generateAnswersWithGptCompletionApi(
      port,
      session.question,
      session,
      config.apiKey,
      session.modelName,
    )
  } else if (chatgptApiModelKeys.includes(session.modelName)) {
    await generateAnswersWithChatgptApi(
      port,
      session.question,
      session,
      config.apiKey,
      session.modelName,
    )
  } else if (customApiModelKeys.includes(session.modelName)) {
    await generateAnswersWithCustomApi(port, session.question, session, '', config.customModelName)
  } else if (azureOpenAiApiModelKeys.includes(session.modelName)) {
    await generateAnswersWithAzureOpenaiApi(port, session.question, session)
  } else if (githubThirdPartyApiModelKeys.includes(session.modelName)) {
    await generateAnswersWithWaylaidwandererApi(port, session.question, session)
  } else if (poeWebModelKeys.includes(session.modelName)) {
    if (session.modelName === 'poeAiWebCustom')
      await generateAnswersWithPoeWebApi(port, session.question, session, config.poeCustomBotName)
    else
      await generateAnswersWithPoeWebApi(
        port,
        session.question,
        session,
        Models[session.modelName].value,
      )
  }
}

Browser.runtime.onMessage.addListener(async (message, sender) => {
  switch (message.type) {
    case 'FEEDBACK': {
      const token = await getChatGptAccessToken()
      await sendMessageFeedback(token, message.data)
      break
    }
    case 'DELETE_CONVERSATION': {
      const token = await getChatGptAccessToken()
      await deleteConversation(token, message.data.conversationId)
      break
    }
    case 'NEW_URL': {
      const newTab = await Browser.tabs.create({
        url: message.data.url,
        pinned: message.data.pinned,
      })
      if (message.data.saveAsChatgptConfig) {
        await setUserConfig({
          chatgptTabId: newTab.id,
          chatgptJumpBackTabId: sender.tab.id,
        })
      }
      break
    }
    case 'SET_CHATGPT_TAB': {
      await setUserConfig({
        chatgptTabId: sender.tab.id,
      })
      break
    }
    case 'ACTIVATE_URL':
      await Browser.tabs.update(message.data.tabId, { active: true })
      break
    case 'OPEN_URL':
      openUrl(message.data.url)
      break
    case 'OPEN_CHAT_WINDOW': {
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
      break
    }
    case 'REFRESH_MENU':
      refreshMenu()
      break
    case 'PIN_TAB': {
      let tabId
      if (message.data.tabId) tabId = message.data.tabId
      else tabId = sender.tab.id

      await Browser.tabs.update(tabId, { pinned: true })
      if (message.data.saveAsChatgptConfig) {
        await setUserConfig({ chatgptTabId: tabId })
      }
      break
    }
  }
})

registerPortListener(async (session, port, config) => await executeApi(session, port, config))
registerCommands()
refreshMenu()
