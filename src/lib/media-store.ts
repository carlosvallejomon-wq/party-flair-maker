/**
 * Almacén de archivos pesados (mp3 subidos) en IndexedDB.
 * localStorage solo admite ~5 MB y rechaza los audios; IndexedDB
 * permite cientos de MB, así el mp3 sobrevive al recargar la página.
 */

const DB_NOMBRE = "invitacion-media";
const ALMACEN = "archivos";

function abrir(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const pedido = indexedDB.open(DB_NOMBRE, 1);
    pedido.onupgradeneeded = () => {
      if (!pedido.result.objectStoreNames.contains(ALMACEN)) {
        pedido.result.createObjectStore(ALMACEN);
      }
    };
    pedido.onsuccess = () => resolve(pedido.result);
    pedido.onerror = () => reject(pedido.error);
  });
}

export async function guardarMedia(clave: string, dataUrl: string): Promise<void> {
  const db = await abrir();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(ALMACEN, "readwrite");
      tx.objectStore(ALMACEN).put(dataUrl, clave);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

export async function cargarMedia(clave: string): Promise<string | null> {
  const db = await abrir();
  try {
    return await new Promise<string | null>((resolve, reject) => {
      const tx = db.transaction(ALMACEN, "readonly");
      const pedido = tx.objectStore(ALMACEN).get(clave);
      pedido.onsuccess = () => resolve((pedido.result as string | undefined) ?? null);
      pedido.onerror = () => reject(pedido.error);
    });
  } finally {
    db.close();
  }
}

export async function borrarMedia(clave: string): Promise<void> {
  const db = await abrir();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(ALMACEN, "readwrite");
      tx.objectStore(ALMACEN).delete(clave);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}
