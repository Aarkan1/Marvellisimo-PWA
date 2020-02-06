let dbPromise = idb.open("marvels-store", 1, function(db) {
  if (!db.objectStoreNames.contains("marvels")) {
    db.createObjectStore("marvels", { keyPath: "id" });
  }
  if (!db.objectStoreNames.contains("user-data")) {
    db.createObjectStore("user-data", { keyPath: "uid" });
  }
  if (!db.objectStoreNames.contains("recieved-messages")) {
    db.createObjectStore("recieved-messages", { keyPath: "id" });
  }
});

class IDB {
  static async write(store, data) {
    let db = await dbPromise;
    let tx = db.transaction(store, "readwrite");
    let st = tx.objectStore(store);
    st.put(data);
    return tx.complete;
  }

  static async readAll(store) {
    let db = await dbPromise;
    let tx = db.transaction(store, "readonly");
    let st = tx.objectStore(store);
    return st.getAll();
  }

  static async clearAll(store) {
    let db = await dbPromise;
    let tx = db.transaction(store, "readwrite");
    let st = tx.objectStore(store);
    st.clear();
    return tx.complete;
  }

  static async read(store, id) {
    let db = await dbPromise;
    let tx = db.transaction(store, "readonly");
    let st = tx.objectStore(store);
    return st.get(id);
  }

  static async delete(store, id) {
    let db = await dbPromise;
    let tx = db.transaction(store, "readwrite");
    let st = tx.objectStore(store);
    st.delete(id);
    console.log("Deleted item with id:", id);
    return tx.complete;
  }
}

function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}