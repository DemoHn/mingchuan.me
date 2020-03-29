import React from 'react'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-light.css'

//// styles
const $globalStyle = `
.ql-snow.ql-toolbar,
.ql-snow.ql-container {        
  border: none !important;
  font-size: 15px;
}
  
.ql-snow.ql-container {
  font-size: 16px;
  color: black;
  line-height: 1.2;
}

.ql-snow .ql-editor {
  height: 500px;
  overflow-y: auto;
}

.ql-snow p {
  margin-bottom: 1em;
}

.sql-snow pre {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

pre.ql-syntax {
  font-size: 13px;
  background-color: #f0f5ffaa !important;
  color: #111 !important;
}

pre.ql-syntax * {
  font-family: Monaco, Consolas, Courier New, monospace;
}
`

//// options
hljs.configure({
  // optionally configure hljs
  languages: ['javascript', 'ruby', 'python', 'C', 'C++'],
})

const $quillToolbar = {
  modules: {
    toolbar: [
      [{ font: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }],
    ],
    syntax: {
      highlight: text => hljs.highlightAuto(text).value,
    } // Include syntax module
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
    console.log(ReactQuill)
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
