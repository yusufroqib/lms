import React from 'react'
import CallList from './CallList'

const Recordings = () => {
  return (
    <section className="flex size-full flex-col p-6 gap-10 text-white">
    <h1 className="text-3xl font-bold">Recordings</h1>

    <CallList type="recordings" />
  </section>
  )
}

export default Recordings