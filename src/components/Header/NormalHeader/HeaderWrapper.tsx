import React from 'react'

export default function HeaderWrapper() {
  return (
    <div>
      <Header onSearchQueryChange={(query) => setSearchQuery(query)} />
    </div>
  )
}
