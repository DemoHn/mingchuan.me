import Link from 'next/link'
import React from 'react'

const Index: React.FC = () => {
  return (
    <main>
      <section>
        <Link href="/about">
          <a>Go to About Me</a>
        </Link>
      </section>
    </main>
  )
}

export default Index
