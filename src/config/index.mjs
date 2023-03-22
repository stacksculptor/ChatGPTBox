import { defaults } from 'lodash-es'
import Browser from 'webextension-polyfill'
import { isMobile } from '../utils/is-mobile.mjs'

/**
 * @typedef {object} Model
 * @property {string} value
 * @property {string} desc
 */
/**
 * @type {Object.<string,Model>}
 */
export const Models = {
  chatgptFree35: { value: 'text-davinci-002-render-sha', desc: 'ChatGPT (Web)' },
  chatgptPlus4: { value: 'gpt-4', desc: 'ChatGPT (Web, GPT-4)' },
  chatgptApi35: { value: 'gpt-3.5-turbo', desc: 'ChatGPT (GPT-3.5-turbo)' },
  chatgptApi4_8k: { value: 'gpt-4', desc: 'ChatGPT (GPT-4-8k)' },
  chatgptApi4_32k: { value: 'gpt-4-32k', desc: 'ChatGPT (GPT-4-32k)' },
  gptApiDavinci: { value: 'text-davinci-003', desc: 'GPT-3.5' },
  chatglm6bInt4: { value: 'chatglm-6b-int4', desc: 'ChatGLM-6B-Int4' },
}

export const chatgptWebModelKeys = ['chatgptFree35', 'chatgptPlus4']
export const gptApiModelKeys = ['gptApiDavinci']
export const chatgptApiModelKeys = ['chatgptApi35', 'chatgptApi4_8k', 'chatgptApi4_32k']
export const customApiModelKeys = ['chatglm6bInt4']

export const TriggerMode = {
  always: 'Always',
  questionMark: 'When query ends with question mark (?)',
  manually: 'Manually',
}

export const ThemeMode = {
  light: 'Light',
  dark: 'Dark',
  auto: 'Auto',
}

export const maxResponseTokenLength = 1000

/**
 * @typedef {typeof defaultConfig} UserConfig
 */
export const defaultConfig = {
  // general

  /** @type {keyof TriggerMode}*/
  triggerMode: 'manually',
  /** @type {keyof ThemeMode}*/
  themeMode: 'auto',
  /** @type {keyof Models}*/
  modelName: 'chatgptFree35',
  apiKey: '',
  preferredLanguage: navigator.language.substring(0, 2),
  insertAtTop: isMobile(),
  lockWhenAnswer: false,

  // advanced

  customChatGptWebApiUrl: 'https://chat.openai.com',
  customChatGptWebApiPath: '/backend-api/conversation',
  customOpenAiApiUrl: 'https://api.openai.com',
  customModelApiUrl: 'http://localhost:8000/chat/completions',
  siteRegex: 'match nothing',
  userSiteRegexOnly: false,
  inputQuery: '',
  appendQuery: '',
  prependQuery: '',

  // others

  activeSelectionTools: ['translate', 'summary', 'polish', 'sentiment', 'divide', 'code', 'ask'],
  activeSiteAdapters: [
    'bilibili',
    'github',
    'gitlab',
    'quora',
    'reddit',
    'youtube',
    'zhihu',
    'stackoverflow',
  ],
  accessToken: '',
  tokenSavedOn: 0,

  // unchangeable

  userLanguage: navigator.language.substring(0, 2),
  selectionTools: [
    'translate',
    'translateBidi',
    'summary',
    'polish',
    'sentiment',
    'divide',
    'code',
    'ask',
  ],
  selectionToolsDesc: [
    'Translate',
    'Translate (Bidirectional)',
    'Summary',
    'Polish',
    'Sentiment Analysis',
    'Divide Paragraphs',
    'Code Explain',
    'Ask',
  ],
  // importing configuration will result in gpt-3-encoder being packaged into the output file
  siteAdapters: [
    'bilibili',
    'github',
    'gitlab',
    'quora',
    'reddit',
    'youtube',
    'zhihu',
    'stackoverflow',
  ],
}

export function isUsingApiKey(config) {
  return (
    gptApiModelKeys.includes(config.modelName) || chatgptApiModelKeys.includes(config.modelName)
  )
}

export function isUsingCustomModel(config) {
  return customApiModelKeys.includes(config.modelName)
}

/**
 * get user config from local storage
 * @returns {Promise<UserConfig>}
 */
export async function getUserConfig() {
  const options = await Browser.storage.local.get(Object.keys(defaultConfig))

  // version compatibility
  if (options.modelName === 'chatgptFree') options.modelName = 'chatgptFree35'
  else if (options.modelName === 'chatgptApi') options.modelName = 'chatgptApi35'
  else if (options.modelName === 'gptDavinci') options.modelName = 'gptApiDavinci'

  return defaults(options, defaultConfig)
}

/**
 * set user config to local storage
 * @param {Partial<UserConfig>} value
 */
export async function setUserConfig(value) {
  await Browser.storage.local.set(value)
}

export async function setAccessToken(accessToken) {
  await setUserConfig({ accessToken, tokenSavedOn: Date.now() })
}

const TOKEN_DURATION = 30 * 24 * 3600 * 1000

export async function clearOldAccessToken() {
  const duration = Date.now() - (await getUserConfig()).tokenSavedOn
  if (duration > TOKEN_DURATION) {
    await setAccessToken('')
  }
}
