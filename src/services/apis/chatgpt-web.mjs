// web version

import { fetchSSE } from '../../utils/fetch-sse.mjs'
import { isEmpty } from 'lodash-es'
import { chatgptWebModelKeys, getUserConfig, Models } from '../../config/index.mjs'
import { pushRecord, setAbortController } from './shared.mjs'
import Browser from 'webextension-polyfill'
import { v4 as uuidv4 } from 'uuid'
import { t } from 'i18next'

async function request(token, method, path, data) {
  const apiUrl = (await getUserConfig()).customChatGptWebApiUrl
  const response = await fetch(`${apiUrl}/backend-api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  const responseText = await response.text()
  console.debug(`request: ${path}`, responseText)
  return { response, responseText }
}

export async function sendMessageFeedback(token, data) {
  await request(token, 'POST', '/conversation/message_feedback', data)
}

export async function setConversationProperty(token, conversationId, propertyObject) {
  await request(token, 'PATCH', `/conversation/${conversationId}`, propertyObject)
}

export async function deleteConversation(token, conversationId) {
  if (conversationId) await setConversationProperty(token, conversationId, { is_visible: false })
}

export async function sendModerations(token, question, conversationId, messageId) {
  await request(token, 'POST', `/moderations`, {
    conversation_id: conversationId,
    input: question,
    message_id: messageId,
    model: 'text-moderation-playground',
  })
}

export async function getModels(token) {
  const response = JSON.parse((await request(token, 'GET', '/models')).responseText)
  if (response.models) return response.models.map((m) => m.slug)
}

export async function getRequirementsToken(accessToken) {
  const response = JSON.parse(
    (await request(accessToken, 'POST', '/sentinel/chat-requirements')).responseText,
  )
  if (response.token) {
    return response.token
  }
}

export async function getArkoseToken(config) {
  if (!config.chatgptArkoseReqUrl)
    throw new Error(
      t('Please login at https://chat.openai.com first') +
        '\n\n' +
        t(
          "Please keep https://chat.openai.com open and try again. If it still doesn't work, type some characters in the input box of chatgpt web page and try again.",
        ),
    )
  const arkoseToken = await fetch(
    config.chatgptArkoseReqUrl + '?' + config.chatgptArkoseReqParams,
    {
      method: 'POST',
      body: config.chatgptArkoseReqForm,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    },
  )
    .then((resp) => resp.json())
    .then((resp) => resp.token)
    .catch(() => null)
  if (!arkoseToken)
    throw new Error(
      t('Failed to get arkose token.') +
        '\n\n' +
        t(
          "Please keep https://chat.openai.com open and try again. If it still doesn't work, type some characters in the input box of chatgpt web page and try again.",
        ),
    )
  return arkoseToken
}

export async function isNeedWebsocket(accessToken) {
  return (await request(accessToken, 'GET', '/accounts/check/v4-2023-04-27')).responseText.includes(
    'shared_websocket',
  )
}

export async function sendWebsocketConversation(accessToken, options) {
  const apiUrl = (await getUserConfig()).customChatGptWebApiUrl
  const response = await fetch(`${apiUrl}/backend-api/conversation`, options).then((r) => r.json())
  console.debug(`request: ws /conversation`, response)
  return { conversationId: response.conversation_id, wsRequestId: response.websocket_request_id }
}

export async function stopWebsocketConversation(accessToken, conversationId, wsRequestId) {
  await request(accessToken, 'POST', '/stop_conversation', {
    conversation_id: conversationId,
    websocket_request_id: wsRequestId,
  })
}

/**
 * @type {WebSocket}
 */
let websocket
/**
 * @type {Date}
 */
let expires_at
let wsCallbacks = []

export async function registerWebsocket(accessToken) {
  if (websocket && new Date() < expires_at - 300000) return

  const response = JSON.parse(
    (await request(accessToken, 'POST', '/register-websocket')).responseText,
  )
  let resolve
  if (response.wss_url) {
    websocket = new WebSocket(response.wss_url)
    websocket.onopen = () => {
      console.debug('global websocket opened')
      resolve()
    }
    websocket.onclose = () => {
      websocket = null
      expires_at = null
      console.debug('global websocket closed')
    }
    websocket.onmessage = (event) => {
      wsCallbacks.forEach((cb) => cb(event))
    }
    expires_at = new Date(response.expires_at)
  }
  return new Promise((r) => (resolve = r))
}

/**
 * @param {Runtime.Port} port
 * @param {string} question
 * @param {Session} session
 * @param {string} accessToken
 */
export async function generateAnswersWithChatgptWebApi(port, question, session, accessToken) {
  const { controller, cleanController } = setAbortController(
    port,
    () => {
      if (session.wsRequestId)
        stopWebsocketConversation(accessToken, session.conversationId, session.wsRequestId)
    },
    () => {
      if (session.autoClean) deleteConversation(accessToken, session.conversationId)
    },
  )

  const config = await getUserConfig()
  let arkoseError
  const [models, requirementsToken, arkoseToken, useWebsocket] = await Promise.all([
    getModels(accessToken).catch(() => undefined),
    getRequirementsToken(accessToken).catch(() => undefined),
    getArkoseToken(config).catch((e) => {
      arkoseError = e
    }),
    isNeedWebsocket(accessToken).catch(() => undefined),
  ])
  console.debug('models', models)
  const selectedModel = Models[session.modelName].value
  const usedModel =
    models && models.includes(selectedModel) ? selectedModel : Models[chatgptWebModelKeys[0]].value
  console.debug('usedModel', usedModel)
  const needArkoseToken = !usedModel.includes(Models[chatgptWebModelKeys[0]].value)
  if (arkoseError && needArkoseToken) throw arkoseError

  let cookie
  let oaiDeviceId
  if (Browser.cookies && Browser.cookies.getAll) {
    cookie = (await Browser.cookies.getAll({ url: 'https://chat.openai.com/' }))
      .map((cookie) => {
        return `${cookie.name}=${cookie.value}`
      })
      .join('; ')
    oaiDeviceId = (
      await Browser.cookies.get({
        url: 'https://openai.com/',
        name: 'oai-did',
      })
    ).value
  }

  const url = `${config.customChatGptWebApiUrl}${config.customChatGptWebApiPath}`
  session.messageId = uuidv4()
  session.wsRequestId = uuidv4()
  if (session.parentMessageId == null) {
    session.parentMessageId = uuidv4()
  }
  const options = {
    method: 'POST',
    signal: controller.signal,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...(cookie && { Cookie: cookie }),
      'Openai-Sentinel-Arkose-Token': arkoseToken || '',
      'Openai-Sentinel-Chat-Requirements-Token': requirementsToken || '',
      'Oai-Device-Id': oaiDeviceId,
      'Oai-Language': 'en-US',
    },
    body: JSON.stringify({
      action: 'next',
      conversation_id: session.conversationId || undefined,
      messages: [
        {
          id: session.messageId,
          author: {
            role: 'user',
          },
          content: {
            content_type: 'text',
            parts: [question],
          },
        },
      ],
      conversation_mode: {
        kind: 'primary_assistant',
      },
      force_paragen: false,
      force_rate_limit: false,
      suggestions: [],
      model: usedModel,
      parent_message_id: session.parentMessageId,
      timezone_offset_min: new Date().getTimezoneOffset(),
      history_and_training_disabled: config.disableWebModeHistory,
      websocket_request_id: session.wsRequestId,
    }),
  }

  let answer = ''
  let generationPrefixAnswer = ''
  let generatedImageUrl = ''

  if (useWebsocket) {
    await registerWebsocket(accessToken)
    const wsCallback = async (event) => {
      let wsData
      try {
        wsData = JSON.parse(event.data)
      } catch (error) {
        console.debug('json error', error)
        return
      }
      if (wsData.type === 'http.response.body') {
        let body
        try {
          body = atob(wsData.body).replace(/^data:/, '')
          const data = JSON.parse(body)
          console.debug('ws message', data)
          if (wsData.conversation_id === session.conversationId) {
            handleMessage(data)
          }
        } catch (error) {
          if (body && body.trim() === '[DONE]') {
            console.debug('ws message', '[DONE]')
            if (wsData.conversation_id === session.conversationId) {
              finishMessage()
              wsCallbacks = wsCallbacks.filter((cb) => cb !== wsCallback)
            }
          } else {
            console.debug('json error', error)
          }
        }
      }
    }
    wsCallbacks.push(wsCallback)
    const { conversationId, wsRequestId } = await sendWebsocketConversation(accessToken, options)
    session.conversationId = conversationId
    session.wsRequestId = wsRequestId
    port.postMessage({ session: session })
  } else {
    await fetchSSE(url, {
      ...options,
      onMessage(message) {
        console.debug('sse message', message)
        if (message.trim() === '[DONE]') {
          finishMessage()
          return
        }
        let data
        try {
          data = JSON.parse(message)
        } catch (error) {
          console.debug('json error', error)
          return
        }
        handleMessage(data)
      },
      async onStart() {
        // sendModerations(accessToken, question, session.conversationId, session.messageId)
      },
      async onEnd() {
        port.postMessage({ done: true })
        cleanController()
      },
      async onError(resp) {
        cleanController()
        if (resp instanceof Error) throw resp
        if (resp.status === 403) {
          throw new Error('CLOUDFLARE')
        }
        const error = await resp.json().catch(() => ({}))
        throw new Error(
          !isEmpty(error) ? JSON.stringify(error) : `${resp.status} ${resp.statusText}`,
        )
      },
    })
  }

  function handleMessage(data) {
    if (data.error) {
      throw new Error(data.error)
    }

    if (data.conversation_id) session.conversationId = data.conversation_id
    if (data.message?.id) session.parentMessageId = data.message.id

    const respAns = data.message?.content?.parts?.[0]
    const contentType = data.message?.content?.content_type
    if (contentType === 'text' && respAns) {
      answer =
        generationPrefixAnswer +
        (generatedImageUrl && `\n\n![](${generatedImageUrl})\n\n`) +
        respAns
    } else if (contentType === 'code' && data.message?.status === 'in_progress') {
      const generationText = '\n\n' + t('Generating...')
      if (answer && !answer.endsWith(generationText)) generationPrefixAnswer = answer
      answer = generationPrefixAnswer + generationText
    } else if (
      contentType === 'multimodal_text' &&
      respAns?.content_type === 'image_asset_pointer'
    ) {
      const imageAsset = respAns?.asset_pointer || ''
      if (imageAsset) {
        fetch(
          `${config.customChatGptWebApiUrl}/backend-api/files/${imageAsset.replace(
            'file-service://',
            '',
          )}/download`,
          {
            credentials: 'include',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              ...(cookie && { Cookie: cookie }),
            },
          },
        ).then((r) => r.json().then((json) => (generatedImageUrl = json?.download_url)))
      }
    }

    if (answer) {
      port.postMessage({ answer: answer, done: false, session: null })
    }
  }

  function finishMessage() {
    pushRecord(session, question, answer)
    console.debug('conversation history', { content: session.conversationRecords })
    port.postMessage({ answer: answer, done: true, session: session })
  }
}
