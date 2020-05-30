import React, { useEffect } from 'react'
import { Jumbotron, Spinner } from 'react-bootstrap'
import { matchPath } from 'react-router'
import { useHistory, useLocation } from 'react-router-dom'

import { useStore } from '../../hooks'
import * as paths from '../../paths'
import { useErrorHandler } from '../../errors'

export default function NotFound() {
  const store = useStore()
  const { error } = useErrorHandler()
  const history = useHistory()
  const location = useLocation()

  const loaded = store.spaces.size > 0

  let redirect: string | null = null

  const match = matchPath<{ id: string }>(location.pathname, { path: "/theorems/:id" })
  if (match && match.params.id.startsWith('I')) {
    redirect = `/theorems/${match.params.id.replace('I', 'T')}`
  }

  useEffect(
    () => {
      if (loaded) {
        error(new Error('Not Found'), { location, redirect })

        if (redirect) { history.push(redirect) }
      }
    },
    [error, location, history, redirect, loaded]
  )

  if (!loaded) {
    return (
      <>
        <Spinner animation="border" role="status" />
        {' '}
        Loading ...
      </>
    )
  }

  const issueUrl = paths.viewerIssues({
    title: `Could not find \`${location.pathname + location.search}\``,
    body: 'If possible, add a description of how you got to this page, and what you\'d expect to find here.'
  })

  return (
    <Jumbotron>
      <h1>404 Not Found</h1>
      <p>
        You appear to be looking for
        {' '}
        <code>{location.pathname}</code>,
        but no matching page was found.
      </p>
      <p>
        If this is a bug, please help out by <a href={issueUrl}>reporting it</a>.
      </p>
    </Jumbotron>
  )
}