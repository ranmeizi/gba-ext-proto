var versions = {
  1: "v1",
};

class MigrateVersion {
  v1(event) {
    console.log("upgrade");
    var db = event.target.result;

    // 创建rom存储 rom
    var romStore = db.createObjectStore("roms", { keyPath: "md5" });

    // romStore.createIndex("name", "name", { unique: false });

    // 创建memo存储 memo 记忆卡
    var memoStore = db.createObjectStore("memos", {
      keyPath: "id",
      autoIncrement: true,
    });

    memoStore.createIndex("rKey", "rKey", { unique: false });
  }
}
