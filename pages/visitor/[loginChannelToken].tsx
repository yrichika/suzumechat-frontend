import Restricted from '@components/templates/Restricted'
import React from 'react'
import { langMap } from '@lang/visitor/langMap'
import VisitorsLoginRequest from '@components/organisms/VisitorsLoginRequest'
// originally client/request/view
function Visitor() {
  // TODO: get channelName from backend
  const channelName = 'fake channel name'

  return (
    <Restricted langMap={langMap}>
      <main className="container mx-auto">
        <div className="mx-2" data-lang="try-joining-to"></div>
        <h1 className="text-4xl m-3">{channelName}</h1>
        <VisitorsLoginRequest langMap={langMap} />
      </main>
    </Restricted>
  )
}

export default Visitor
