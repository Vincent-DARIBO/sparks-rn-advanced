import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { createMMKV } from 'react-native-mmkv';

const queryCacheStorage = createMMKV({ id: 'query-cache' });

export const queryPersister = createSyncStoragePersister({
  storage: {
    getItem: (key) => queryCacheStorage.getString(key) ?? null,
    setItem: (key, value) => queryCacheStorage.set(key, value),
    removeItem: (key) => {
      queryCacheStorage.remove(key);
    },
  },
});
