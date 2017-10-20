import * as React from 'react'

import { observer } from 'mobx-react'
import store from '../store'

import * as F from '../models/Formula'
import * as Q from '../queries'
import * as T from '../types'

import Id from '../models/Id'

const tryConvertFormula = (q: string) => {
  if (!q) { return }

  try {
    const f = F.fromJSON(JSON.parse(q))
    return F.mapProperty(id => store.properties.find(Id('P', id))!, f)
  } catch (e) {
    return
  }
}

export type Props = T.RouterProps

class NotFound extends React.Component<Props, {}> {
  componentWillMount() {
    const path = this.props.router.location.pathname

    // Redirect cached URLs
    if (path.match(/search/)) {
      const q = this.props.router.location.query.q
      let newPath = '/spaces'
      if (q) {
        const f = tryConvertFormula(q)
        if (f) {
          newPath += `?q=${encodeURIComponent(F.toString(f))}`
        }
      }
      return this.props.router.push(newPath)
    }

    let m = path.match(/spaces\/(\d+)/)
    if (m) {
      const space = store.spaces.find(Id('S', m[1]))
      if (space) {
        return this.props.router.push(`/spaces/${space.uid}`)
      }
    }

    // FIXME
    // Redirect traits by id to their canonical URL
    // m = path.match(/traits\/(\d+)/)
    // if (m) {
    //   const trait = this.props.findTrait(Id('T', m[1]))
    //   if (trait) {
    //     return this.props.router.push(`/spaces/${trait.space.uid}/properties/${trait.property.uid}`)
    //   }
    // }

    // FIXME: report to Rollbar
    // this.props.report(path)
  }

  render() {
    const path = this.props.router.location.pathname

    return (
      <div className="jumbotron">
        <h1>404: Page Not Found</h1>
        <p>You appear to be looking for <code>{path}</code>, but we don't know how to find that.</p>
        <p>
          You can press the back button to head back where you were, or
          {' '}
          <a href="https://github.com/jamesdabbs/pi-base-viewer/issues">report this</a>
          {' '}
          if you think it's a bug.
          </p>
      </div>
    )
  }
}

export default NotFound
