var versions = {
  1: "v1",
};

class MigrateVersion {
  v1(event) {
    var db = event.target.result;

    // 创建rom存储 rom
    var romStore = db.createObjectStore("roms", { keyPath: "md5" });

    romStore.createIndex("name", "name", { unique: false });

    // 创建memo存储 memo 记忆卡
    var memoStore = db.createObjectStore("memos", { keyPath: "key" });

    // 使用事务的 oncomplete 事件确保在插入数据前对象仓库已经创建完毕
    
  }
}
