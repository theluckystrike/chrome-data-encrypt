/**
 * Data Encrypt — AES-256-GCM encryption via Web Crypto API
 */
export class DataEncrypt {
    private key: CryptoKey | null = null;

    /** Derive key from password */
    async deriveKey(password: string, salt?: Uint8Array): Promise<Uint8Array> {
        const enc = new TextEncoder();
        const s = salt || crypto.getRandomValues(new Uint8Array(16));
        const baseKey = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
        this.key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: s as unknown as ArrayBuffer, iterations: 100000, hash: 'SHA-256' }, baseKey, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
        return s;
    }

    /** Generate a random key */
    async generateKey(): Promise<void> {
        this.key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
    }

    /** Encrypt string data */
    async encrypt(plaintext: string): Promise<string> {
        if (!this.key) throw new Error('Key not initialized. Call deriveKey() or generateKey() first.');
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const enc = new TextEncoder();
        const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv as unknown as ArrayBuffer }, this.key, enc.encode(plaintext) as unknown as ArrayBuffer);
        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(iv); combined.set(new Uint8Array(encrypted), iv.length);
        return btoa(String.fromCharCode(...combined));
    }

    /** Decrypt string data */
    async decrypt(ciphertext: string): Promise<string> {
        if (!this.key) throw new Error('Key not initialized.');
        const data = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));
        const iv = data.slice(0, 12);
        const encrypted = data.slice(12);
        const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv as unknown as ArrayBuffer }, this.key, encrypted as unknown as ArrayBuffer);
        return new TextDecoder().decode(decrypted);
    }

    /** Encrypt and store in chrome.storage */
    async encryptAndStore(storageKey: string, data: any): Promise<void> {
        const json = JSON.stringify(data);
        const encrypted = await this.encrypt(json);
        await chrome.storage.local.set({ [storageKey]: encrypted });
    }

    /** Decrypt from chrome.storage */
    async decryptFromStorage<T>(storageKey: string): Promise<T | null> {
        const result = await chrome.storage.local.get(storageKey);
        if (!result[storageKey]) return null;
        const json = await this.decrypt(result[storageKey]);
        return JSON.parse(json);
    }

    /** Securely delete by overwriting */
    async secureDelete(storageKey: string): Promise<void> {
        await chrome.storage.local.set({ [storageKey]: crypto.getRandomValues(new Uint8Array(64)).toString() });
        await chrome.storage.local.remove(storageKey);
    }
}
