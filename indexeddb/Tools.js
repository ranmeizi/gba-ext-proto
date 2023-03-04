class IdbTools {
  static dbName = "extension-gba";
  static version = 1;
  /**
   * @type {IDBDatabase}
   */
  db = null;

  migrate = new MigrateVersion();

  initialization = Promise.reject();

  constructor() {
    this.initialization = this.init();
  }

  async init() {
    const request = indexedDB.open(IdbTools.dbName, IdbTools.version);

    request.onupgradeneeded = this.onUpgrade;

    return new Promise((resolve, reject) => {
      // 打开成功
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onerror = (e) => {
        reject();
      };
    });
  }

  onUpgrade = (event) => {
    this.migrate[versions[IdbTools.version]](event);
  };
}
