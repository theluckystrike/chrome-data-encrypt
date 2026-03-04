# chrome-data-encrypt

> Client-side AES-256 encryption for Chrome extensions — Web Crypto API, key derivation, encrypted storage wrapper, and secure deletion for MV3.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Install

```bash
npm install chrome-data-encrypt
```

## Usage

```js
import { DataEncrypt } from 'chrome-data-encrypt';

const vault = new DataEncrypt();

// Derive a key from a password (PBKDF2 with 100k iterations)
const salt = await vault.deriveKey('my-secret-password');

// Or generate a random AES-256 key
await vault.generateKey();

// Encrypt and decrypt strings
const ciphertext = await vault.encrypt('sensitive data');
const plaintext = await vault.decrypt(ciphertext);
// => 'sensitive data'

// Encrypt an object and store it directly in chrome.storage.local
await vault.encryptAndStore('userProfile', { name: 'Jane', email: 'jane@test.com' });

// Decrypt from chrome.storage.local
const profile = await vault.decryptFromStorage('userProfile');
// => { name: 'Jane', email: 'jane@test.com' }

// Securely delete a storage key (overwrite then remove)
await vault.secureDelete('userProfile');
```

## API

### `DataEncrypt`

#### `new DataEncrypt()`

Creates a new encryption instance. A key must be initialized via `deriveKey()` or `generateKey()` before calling `encrypt` or `decrypt`.

#### `vault.deriveKey(password: string, salt?: Uint8Array): Promise<Uint8Array>`

Derives an AES-256-GCM key from the given password using PBKDF2 with SHA-256 and 100,000 iterations. If no `salt` is provided, a random 16-byte salt is generated. Returns the salt (save it to re-derive the same key later).

#### `vault.generateKey(): Promise<void>`

Generates a random AES-256-GCM key using the Web Crypto API.

#### `vault.encrypt(plaintext: string): Promise<string>`

Encrypts the plaintext string using AES-256-GCM with a random 12-byte IV. Returns a base64-encoded string containing the IV prepended to the ciphertext. Throws if no key has been initialized.

#### `vault.decrypt(ciphertext: string): Promise<string>`

Decrypts a base64-encoded ciphertext string produced by `encrypt()`. Extracts the IV from the first 12 bytes and decrypts the remainder. Throws if no key has been initialized.

#### `vault.encryptAndStore(storageKey: string, data: any): Promise<void>`

Serializes `data` to JSON, encrypts it, and stores the ciphertext in `chrome.storage.local` under the given `storageKey`.

#### `vault.decryptFromStorage<T>(storageKey: string): Promise<T | null>`

Reads the ciphertext from `chrome.storage.local` at the given `storageKey`, decrypts it, and parses the JSON result. Returns `null` if the key does not exist in storage.

#### `vault.secureDelete(storageKey: string): Promise<void>`

Overwrites the storage key with 64 bytes of random data before removing it, reducing the chance of data recovery.

## License

MIT
