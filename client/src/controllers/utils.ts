import * as _ from 'lodash'

export default class Utils {
    static wait = async (ms: number) => new Promise((r) => setTimeout(r, ms))

    static findIdInObj = (obj, id) => {
        const key = _.findKey(obj, (arr) => arr.includes(id))
        return key ? parseInt(key, 10) : 1
    }
}