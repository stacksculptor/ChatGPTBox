import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { updateRefHeight } from '../../utils'
import { useTranslation } from 'react-i18next'
import { getUserConfig } from '../../config/index.mjs'

export function InputBox({ onSubmit, enabled, port, reverseResizeDir }) {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const reverseDivRef = useRef(null)
  const inputRef = useRef(null)
  const resizedRef = useRef(false)

  const virtualInputRef = reverseResizeDir ? reverseDivRef : inputRef

  useEffect(() => {
    inputRef.current.focus()

    const onResizeY = () => {
      if (virtualInputRef.current.h !== virtualInputRef.current.offsetHeight) {
        virtualInputRef.current.h = virtualInputRef.current.offsetHeight
        if (!resizedRef.current) {
          resizedRef.current = true
          virtualInputRef.current.style.maxHeight = ''
        }
      }
    }
    virtualInputRef.current.h = virtualInputRef.current.offsetHeight
    virtualInputRef.current.addEventListener('mousemove', onResizeY)
  }, [])

  useEffect(() => {
    if (!resizedRef.current) {
      if (!reverseResizeDir) {
        updateRefHeight(inputRef)
        virtualInputRef.current.h = virtualInputRef.current.offsetHeight
        virtualInputRef.current.style.maxHeight = '160px'
      }
    }
  })

  useEffect(() => {
    if (enabled)
      getUserConfig().then((config) => {
        if (config.focusAfterAnswer) inputRef.current.focus()
      })
  }, [enabled])

  const handleKeyDownOrClick = (e) => {
    e.stopPropagation()
    if (e.type === 'click' || (e.keyCode === 13 && e.shiftKey === false)) {
      if (enabled) {
        e.preventDefault()
        if (!value) return
        onSubmit(value)
        setValue('')
      } else {
        e.preventDefault()
        port.postMessage({ stop: true })
      }
    }
  }

  return (
    <div className="input-box">
      <div
        ref={reverseDivRef}
        style={
          reverseResizeDir && {
            transform: 'rotateX(180deg)',
            resize: 'vertical',
            overflow: 'hidden',
            minHeight: '160px',
          }
        }
      >
        <textarea
          dir="auto"
          ref={inputRef}
          disabled={false}
          className="interact-input"
          style={
            reverseResizeDir
              ? { transform: 'rotateX(180deg)', resize: 'none' }
              : { resize: 'vertical', minHeight: '70px' }
          }
          placeholder={
            enabled
              ? t('Type your question here\nEnter to send, shift + enter to break line')
              : t('Type your question here\nEnter to stop generating\nShift + enter to break line')
          }
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDownOrClick}
        />
      </div>
      <button
        className="submit-button"
        style={{
          backgroundColor: enabled ? '#30a14e' : '#cf222e',
        }}
        onClick={handleKeyDownOrClick}
      >
        {enabled ? t('Ask') : t('Stop')}
      </button>
    </div>
  )
}

InputBox.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  enabled: PropTypes.bool.isRequired,
  reverseResizeDir: PropTypes.bool,
  port: PropTypes.object.isRequired,
}

export default InputBox
