/**
 * This file contains helper functions for working with the IndexedDB database
 * in a PWA application.
 *
 * Main functionalities:
 * - Opening or creating the "pwa-db" database with object stores:
 *   - "clients" (stores client data)
 *   - "products" (stores product data)
 *   - "orders" (stores order data)
 *   - "users" (stores user data)
 * - Adding, updating, deleting, and retrieving data from these stores.
 * - Converting Blob objects to base64.
 *
 * This file is intended for local data storage and processing in offline mode.
 */

const DB_NAME = "pwa-db";
const DB_VERSION = 1;
const CLIENTS_STORE = "clients";
const PRODUCTS_STORE = "products";
const ORDERS_STORE = "orders";
const USER_STORE = "users";

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
      if (!db.objectStoreNames.contains(ORDERS_STORE)) {
        db.createObjectStore(ORDERS_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(USER_STORE)) {
        db.createObjectStore(USER_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const getStore = (db, storeName, mode = "readonly") => {
  return db.transaction(storeName, mode).objectStore(storeName);
};

export const addUserDB = async (user) => {
  const db = await openDB();
  const store = getStore(db, "users", "readwrite");
  return new Promise((resolve, reject) => {
    const request = store.put(user);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getUserFromDB = async () => {
  const db = await openDB();
  const store = getStore(db, "users", "readonly");
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result[0]);
    request.onerror = () => reject(request.error);
  });
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
    const request = store.put(client);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const deleteClientFromDB = async (id) => {
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

export const clearProducts = async () => {
  const db = await openDB();
  const store = getStore(db, PRODUCTS_STORE, "readwrite");
  return new Promise((resolve, reject) => {
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result); // reader.result - это base64
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

  export const addProductDB = async (product) => {
    const db = await openDB();
    const store = getStore(db, PRODUCTS_STORE, "readwrite");
    return new Promise((resolve, reject) => {
      const request = store.add(product);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };
  
  export const updateProductDB = async (product) => {
    const db = await openDB();
    const store = getStore(db, PRODUCTS_STORE, "readwrite");
    return new Promise((resolve, reject) => {
      const request = store.put(product);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };
  
  export const deleteProductDB = async (id) => {
    const db = await openDB();
    const store = getStore(db, PRODUCTS_STORE, "readwrite");
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  export const getAllOrders = async () => {
    const db = await openDB();
    const store = getStore(db, ORDERS_STORE);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  export const addOrder = async (order) => {
    const db = await openDB();
    const store = getStore(db, ORDERS_STORE, "readwrite");
    return new Promise((resolve, reject) => {
      const request = store.put(order);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  export const deleteOrderFromDB = async (id) => {
    const db = await openDB();
    const store = getStore(db, ORDERS_STORE, "readwrite");
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };