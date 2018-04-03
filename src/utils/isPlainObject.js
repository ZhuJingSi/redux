/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
export default function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false

  let proto = obj
  /**
   * Object.getPrototypeOf 和 object.__proto__ 差不多，
   * 只是 Object.getPrototypeOf 是标准用法，只读方法也更安全
   */
  /**
   * 这段逻辑是找到 obj 的原型链尽头，看是否与直接上一层的 prototype 一致
   * 若一致，说明该对象由 Object 构造函数创建
   */
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }

  return Object.getPrototypeOf(obj) === proto
}
