/**
 * 使用方式是，在选择rom后，选择对应用户的记忆卡！
 *
 * 当第一次加载rom 时，进行rom 的存储，并且创建一份default的记忆卡
 */

/**
 * defineRomObject
 * @typedef Rom Rom存储
 * @property {string} md5 这里代码控制不能重复，因为重复了就没必要再存一份了
 * @property {string} name
 * @property {string} arrayBuffer 存储文件的 arrayBuffer
 */

/**
 * defineMemoObject
 * @typedef Memo Memo存储
 * @property {string} key memo key
 * @property {string} rKey ROM md5
 * @property {string} uName 用户名
 * @property {string} arrayBuffer 存储文件的 arrayBuffer
 */

class GbaController extends IdbTools {
  static DEFAULT_ROOM_UNAME = "#default";

  /**
   * 存储rom
   * @param {ArrayBuffer} buffer 
   * @returns {Rom} 返回存储的rom
   */
  addRom(buffer) {
    const md5 = "";
    // 创建名为 default 的记忆卡
    this.createDefaultMemo(md5, GbaController.DEFAULT_ROOM_UNAME);
  }

  /**
   * 删除rom
   * @param {string} rKey ROM md5
   */
  delRom(rKey) { }

  /**
   * 按名称查询rom
   * @param {string} name rom名 模糊查询
   * @returns {Promise<Rom[]>}
   */
  async queryRomByName(name) {
    await this.initialization

    const transaction = this.db.transaction(["roms"], "readonly");

    if (!name) {
      return this.#queryAllRom(transaction)
    }


    const objectStore = transaction.objectStore('roms')

    // 使用游标
    const request = objectStore.openCursor();

    return new Promise((resolve, reject) => {
      let result = []

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.name.indexOf(name)) {
            result.push(cursor.value)
          }
          cursor.continue();
        } else {
          // no more results
        }
      };
      transaction.oncomplete = () => resolve(result)
      transaction.onerror = () => reject()
    })
  }

  /**
   * 更新记忆卡
   * 1.定时调用更新记忆卡
   * 2.用户手动调用
   * @param {string} rKey ROM md5
   * @param {string} uName 用户名
   */
  updateMemo(rKey, uName) { }

  /**
   * 按Rom key和用户名创建记忆卡
   * @param {string} rKey ROM md5
   * @param {string} uName 用户名
   */
  createUserMemo(rKey, uName) { }

  /**
   * 删除memo
   * @param {string} rKey ROM md5
   */
  delRom(rKey) { }

  /**
   * 
   */
  #toMd5() {

  }

  #queryAllRom(transaction) {
    const romOS = transaction.objectStore('roms')
    return new Promise((resolve, reject) => {
      let result = []
      const request = romOS.getAll()
      request.onsuccess = function (event) {
        result = event.target.result
      }
      transaction.oncomplete = () => resolve(result)
      transaction.onerror = () => reject()
    })
  }
}