import CryptoJS from 'crypto-js';

// Encrypts - This is the "brain" of the app that handles the AES encryption
export const sealNote = (text: string) => {
      // Generate a high-entropy random key that stays in the URL hash
      const key = CryptoJS.lib.WordArray.random(16).toString();
      const encrypted = CryptoJS.AES.encrypt(text, key).toString();
      return { encrypted, key };
};

// Decrypts - This is the "brain" of the app that handles the AES decryption
export const openNote = (cipherText: string, key: string) => {
      try {
            const bytes = CryptoJS.AES.decrypt(cipherText, key);
            return bytes.toString(CryptoJS.enc.Utf8);
      } catch (e) {
            return null; // Handle wrong keys or corrupted data
      }
};