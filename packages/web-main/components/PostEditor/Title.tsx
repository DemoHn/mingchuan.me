import React, { useState, useCallback } from 'react'
import styled from 'styled-components'

//// styles
const TitleBar = styled.div`
  display: flex;
  border-bottom: 1px solid #e3e3e3;
  align-items: center;
  width: 100%;
  height: 60px;
  padding-left: 20px;
`

const MaxLengthBar = styled.div<{ valid: boolean }>`
  flex-shrink: 0;
  padding: 0 10px;
  font-size: 14px;
  color: ${p => (p.valid ? '#888' : '#fa541c')};
`

const TypeBar = styled.div`
  flex-shrink: 1;
  border-left: 1px dashed #dedede;
  padding-left: 20px;
  padding-right: 20px;

  font-size: 21px;
  color: #bababa;
`

const TitleInput = styled.input`
  font-size: 24px;
  line-height: 1;
  width: 100%;
  display: block;
  outline: none;
  border: none;

  &::placeholder {
    opacity: 0.6;
  }
`
//// texts
const $texts = {
  titlePlaceholder: '在此输入标题...',
}

//// props
export interface TitleProps {
  type: string
  title: string
  maxTitleLength?: number
  onChange: (text: string) => any
}

const Title: React.FC<TitleProps> = props => {
  const { type, title, onChange, maxTitleLength } = props
  const [valid, setValid] = useState(true)

  const handleTextChange = useCallback(e => {
    const text = e.target.value
    if (maxTitleLength && text.length >= maxTitleLength) {
      setValid(false)
    } else {
      setValid(true)
    }

    if (valid) {
      onChange(text)
    }
  }, [])

  const optionalProps = maxTitleLength
    ? {
        maxLength: maxTitleLength,
      }
    : {}
  return (
    <TitleBar>
      <TitleInput
        placeholder={$texts.titlePlaceholder}
        onChange={handleTextChange}
        {...optionalProps}
      />
      {maxTitleLength ? (
        <MaxLengthBar valid={valid}>
          {title.length} / {maxTitleLength}
        </MaxLengthBar>
      ) : null}
      <TypeBar>{type.toUpperCase()}</TypeBar>
    </TitleBar>
  )
}

export default Title
