# chrome-data-encrypt

Client-side AES-256-GCM encryption for Chrome extensions. Uses the Web Crypto API for key derivation, encrypted storage, and secure deletion. Built for Manifest V3.

INSTALL

```
npm install chrome-data-encrypt
```

QUICK START

```js
import { DataEncrypt } from 'chrome-data-encrypt';

const vault = new DataEncrypt();

// derive a key from a passphrase (PBKDF2, 100k iterations, SHA-256)
const salt = await vault.deriveKey('my-secret-password');

// or generate a random AES-256-GCM key
await vault.generateKey();

// encrypt and decrypt a string
const ciphertext = await vault.encrypt('sensitive data');
const plaintext = await vault.decrypt(ciphertext);

// store encrypted data in chrome.storage.local
await vault.encryptAndStore('profile', { name: 'Jane', email: 'jane@example.com' });

// retrieve and decrypt from storage
const profile = await vault.decryptFromStorage('profile');

// securely wipe a storage key (overwrite with random bytes, then remove)
await vault.secureDelete('profile');
```

API

DataEncrypt is the single export. Create an instance, initialize a key, then encrypt or decrypt.

new DataEncrypt()

Creates an encryption instance. No key is set yet. You must call deriveKey or generateKey before any encrypt/decrypt operation.

vault.deriveKey(password, salt?)

Derives an AES-256-GCM key from a password string using PBKDF2 with SHA-256 and 100,000 iterations. If salt is omitted, a random 16-byte salt is generated. Returns a Promise<Uint8Array> containing the salt. Store the salt so you can re-derive the same key later.

vault.generateKey()

Generates a random AES-256-GCM key via crypto.subtle.generateKey. Returns Promise<void>.

vault.encrypt(plaintext)

Encrypts a string with AES-256-GCM using a random 12-byte IV. The IV is prepended to the ciphertext and the whole thing is base64-encoded. Returns Promise<string>. Throws if no key is initialized.

vault.decrypt(ciphertext)

Decrypts a base64 string produced by encrypt. Splits the IV from the first 12 bytes and decrypts the rest. Returns Promise<string>. Throws if no key is initialized.

vault.encryptAndStore(storageKey, data)

Serializes data to JSON, encrypts it, and writes the ciphertext to chrome.storage.local under storageKey. Returns Promise<void>.

vault.decryptFromStorage<T>(storageKey)

Reads ciphertext from chrome.storage.local at storageKey, decrypts it, and parses the JSON result. Returns Promise<T | null>. Returns null when the key does not exist in storage.

vault.secureDelete(storageKey)

Overwrites the storage key with 64 bytes of random data, then removes it. This reduces the chance of data recovery from storage. Returns Promise<void>.

HOW IT WORKS

All cryptographic operations run through the Web Crypto API (crypto.subtle), which is available in Chrome extension service workers and content scripts. No external dependencies are needed.

Key derivation uses PBKDF2 with 100,000 iterations and SHA-256. Encryption uses AES-256-GCM with a fresh 12-byte IV per call. The IV is stored alongside the ciphertext so decryption is self-contained.

Storage operations wrap chrome.storage.local. The secure delete path writes random noise over the key before removing it, making casual forensic recovery harder.

LICENSE

MIT. See LICENSE file.

CONTRIBUTING

Fork the repo, make a branch, open a pull request. Keep changes focused and tests passing.

---

Built at zovo.one
