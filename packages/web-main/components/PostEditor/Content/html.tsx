import React from 'react'

//// styles
const $globalStyle = `
.ql-snow.ql-toolbar,
.ql-snow.ql-container {        
  border: none !important;
  font-size: 15px;
}
  
.ql-snow.ql-container {
  font-size: 16px;
  line-height: 1.2;
}

.ql-snow .ql-editor {
  height: 500px;
  overflow-y: auto;
}

.ql-snow p {
  margin-bottom: 6px;
}
`

//// options
const $quillToolbar = {
  modules: {
    toolbar: [
      [{ font: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
    ],
  },
}
//// props
export interface QuillEditorProps {
  text: string
  onChange: (text: string) => any
}

const QuillEditor: React.FC<QuillEditorProps> = props => {
  const isClient = typeof window !== 'undefined'
  if (isClient) {
    const ReactQuill = require('react-quill')
    const { text, onChange } = props

    return (
      <main>
        <style>{$globalStyle}</style>
        <ReactQuill
          placeholder=""
          modules={$quillToolbar.modules}
          theme="snow"
          value={text}
          onChange={(text: string) => onChange(text)}
        />
      </main>
    )
  } else {
    return (
      <section>
        <div style={{ height: '500px' }}></div>
      </section>
    )
  }
}

export default QuillEditor
