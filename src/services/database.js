// db.js
const DB_NAME = "pwa-db";
const DB_VERSION = 1;
const CLIENTS_STORE = "clients";
const PRODUCTS_STORE = "products";

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(CLIENTS_STORE)) {
        db.createObjectStore(CLIENTS_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(PRODUCTS_STORE)) {
        db.createObjectStore(PRODUCTS_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const getStore = (db, storeName, mode = "readonly") => {
  return db.transaction(storeName, mode).objectStore(storeName);
};

export const getAllClients = async () => {
  const db = await openDB();
  const store = getStore(db, CLIENTS_STORE);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const addClient = async (client) => {
  const db = await openDB();
  const store = getStore(db, CLIENTS_STORE, "readwrite");
  return new Promise((resolve, reject) => {
    const request = store.add(client);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const updateClient = async (client) => {
  const db = await openDB();
  const store = getStore(db, CLIENTS_STORE, "readwrite");
  return new Promise((resolve, reject) => {
    const request = store.put(client);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const deleteClient = async (id) => {
  const db = await openDB();
  const store = getStore(db, CLIENTS_STORE, "readwrite");
  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getAllProducts = async () => {
    const db = await openDB();
    const store = getStore(db, PRODUCTS_STORE);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  export const addProduct = async (product) => {
    const db = await openDB();
    const store = getStore(db, PRODUCTS_STORE, "readwrite");
    return new Promise((resolve, reject) => {
      const request = store.add(product);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };
  
  export const updateProduct = async (product) => {
    const db = await openDB();
    const store = getStore(db, PRODUCTS_STORE, "readwrite");
    return new Promise((resolve, reject) => {
      const request = store.put(product);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };
  
  export const deleteProduct = async (id) => {
    const db = await openDB();
    const store = getStore(db, PRODUCTS_STORE, "readwrite");
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

// Аналогичные функции для продуктов...