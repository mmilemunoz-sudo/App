const DB_NAME = "remis-mariela";
const STORE_NAME = "sqlite";
const DB_KEY = "main";

function openStore() {
  return new Promise<IDBObjectStore>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const transaction = request.result.transaction(STORE_NAME, "readwrite");
      resolve(transaction.objectStore(STORE_NAME));
    };
  });
}

export async function loadDatabaseBytes() {
  const store = await openStore();

  return new Promise<Uint8Array | null>((resolve, reject) => {
    const request = store.get(DB_KEY);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result ?? null);
  });
}

export async function saveDatabaseBytes(bytes: Uint8Array) {
  const store = await openStore();

  return new Promise<void>((resolve, reject) => {
    const request = store.put(bytes, DB_KEY);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}
