import React from 'react'
import Relay from 'react-relay'

import Implication from './Implication'
import Markdown    from './Markdown'
import Tex         from './Tex'
import U           from './U'

class Theorem extends React.Component {
  render() {
    const t = this.props.viewer.theorems[0]
    const h = this.props.universe.hydrateTheorem(t.name)

    return (
      <div>
        <h1>
          <Implication theorem={h} link={true}/>
        </h1>
        <Tex><Markdown text={t.description}/></Tex>
      </div>
    )
  }
}

export default Relay.createContainer(U(Theorem), {
  initialVariables: {
    theoremId: null
  },
  fragments: {
    viewer: (vars) => {
      if (!vars.theoremId) { return '' }

      return Relay.QL`
        fragment on Viewer {
          theorems(uid: $theoremId) {
            uid
            name
            description
          }
        }
      `
    }
  }
})
