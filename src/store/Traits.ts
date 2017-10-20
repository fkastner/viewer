import * as I from 'immutable'
import { action, computed, observable } from 'mobx'

import Collection from './Collection'
import * as T from '../types'

class Traits {
    @observable map: Map<T.Id, Map<T.Id, boolean>>

    spaces: Collection<T.Id, T.Space>
    properties: Collection<T.Id, T.Property>

    constructor(spaces: Collection<T.Id, T.Space>, properties: Collection<T.Id, T.Property>) {
        this.spaces = spaces
        this.properties = properties
        this.map = new Map()
    }

    @computed get values(): I.Map<T.Id, I.Map<T.Id, boolean>> {
        return I.fromJS(this.map)
    }

    check(space: T.Id, property: T.Id) {
        const traits = this.map.get(space)
        if (!traits) { return undefined }
        return traits.get(property)
    }

    @action add(trait: { space: T.Id, property: T.Id, value: boolean }) {
        const { space, property, value } = trait
        if (!this.map.has(space)) {
            this.map.set(space, new Map())
        }
        this.map.get(space)!.set(property, value)
    }
}

export default Traits
