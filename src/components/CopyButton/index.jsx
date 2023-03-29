import { useState } from 'react'
import { CheckIcon, CopyIcon } from '@primer/octicons-react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

CopyButton.propTypes = {
  contentFn: PropTypes.func.isRequired,
  size: PropTypes.number.isRequired,
  className: PropTypes.string,
}

function CopyButton({ className, contentFn, size }) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const onClick = () => {
    navigator.clipboard
      .writeText(contentFn())
      .then(() => setCopied(true))
      .then(() =>
        setTimeout(() => {
          setCopied(false)
        }, 600),
      )
  }

  return (
    <span
      title={t('Copy')}
      className={`gpt-util-icon ${className ? className : ''}`}
      onClick={onClick}
    >
      {copied ? <CheckIcon size={size} /> : <CopyIcon size={size} />}
    </span>
  )
}

export default CopyButton
