export default class Utils {
    static wait = async (ms: number) => new Promise((r) => setTimeout(r, ms))

}