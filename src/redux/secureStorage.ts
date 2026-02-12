// secureStorage.ts
import secureLocalStorage from "react-secure-storage";

const secureStorage = {
  getItem: (key: string): Promise<string | null> => {
    return Promise.resolve(secureLocalStorage.getItem(key) as string | null);
  },
  setItem: (key: string, value: string): Promise<void> => {
    secureLocalStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string): Promise<void> => {
    secureLocalStorage.removeItem(key);
    return Promise.resolve();
  },
};

export default secureStorage;
