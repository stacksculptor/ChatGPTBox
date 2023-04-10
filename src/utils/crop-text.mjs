// MIT License
//
// Copyright (c) 2023 josStorer
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { encode } from '@nem035/gpt-3-encoder'

// TODO add model support
export function cropText(
  text,
  maxLength = 3900 - 1000,
  startLength = 400,
  endLength = 300,
  tiktoken = true,
) {
  const splits = text.split(/[,，。?？!！;；]/).map((s) => s.trim())
  const splitsLength = splits.map((s) => (tiktoken ? encode(s).length : s.length))
  const length = splitsLength.reduce((sum, length) => sum + length, 0)

  const cropLength = length - startLength - endLength
  const cropTargetLength = maxLength - startLength - endLength
  const cropPercentage = cropTargetLength / cropLength
  const cropStep = Math.max(0, 1 / cropPercentage - 1)

  if (cropStep === 0) return text

  let croppedText = ''
  let currentLength = 0
  let currentIndex = 0
  let currentStep = 0

  for (; currentIndex < splits.length; currentIndex++) {
    if (currentLength + splitsLength[currentIndex] + 1 <= startLength) {
      croppedText += splits[currentIndex] + ','
      currentLength += splitsLength[currentIndex] + 1
    } else if (currentLength + splitsLength[currentIndex] + 1 + endLength <= maxLength) {
      if (currentStep < cropStep) {
        currentStep++
      } else {
        croppedText += splits[currentIndex] + ','
        currentLength += splitsLength[currentIndex] + 1
        currentStep = currentStep - cropStep
      }
    } else {
      break
    }
  }

  let endPart = ''
  let endPartLength = 0
  for (let i = splits.length - 1; endPartLength + splitsLength[i] <= endLength; i--) {
    endPart = splits[i] + ',' + endPart
    endPartLength += splitsLength[i] + 1
  }
  currentLength += endPartLength
  croppedText += endPart

  console.log(
    `maxLength: ${maxLength}\n` +
      // `croppedTextLength: ${tiktoken ? encode(croppedText).length : croppedText.length}\n` +
      `desiredLength: ${currentLength}\n` +
      `content: ${croppedText}`,
  )
  return croppedText
}
