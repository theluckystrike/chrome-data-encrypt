# chrome-data-encrypt — AES-256 Encryption for Extensions

[![npm version](https://img.shields.io/npm/v/chrome-data-encrypt)](https://npmjs.com/package/chrome-data-encrypt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Chrome Web Extension](https://img.shields.io/badge/Chrome-Web%20Extension-orange.svg)](https://developer.chrome.com/docs/extensions/)
[![Discord](https://img.shields.io/badge/Discord-Zovo-blueviolet.svg?logo=discord)](https://discord.gg/zovo)
[![Website](https://img.shields.io/badge/Website-zovo.one-blue)](https://zovo.one)

> **Built by [Zovo](https://zovo.one)** | `npm i chrome-data-encrypt`

AES-256-GCM encryption for Chrome extensions via Web Crypto API, with PBKDF2 key derivation, encrypted storage wrapper, and secure deletion.

Part of the [Zovo](https://zovo.one) family of Chrome extension utilities.

## Features

- **AES-256-GCM**: Military-grade encryption
- **PBKDF2 Key Derivation**: Secure password-based keys
- **Encrypted Storage**: Store encrypted data in chrome.storage
- **Secure Deletion**: Wipe sensitive data securely
- **Zero Dependencies**: Uses native Web Crypto API

## Installation

```bash
npm install chrome-data-encrypt
```

## Quick Start

```typescript
import { DataEncrypt } from 'chrome-data-encrypt';

const enc = new DataEncrypt();

// Derive key from password
const salt = await enc.deriveKey('user-password');

// Encrypt and store data
await enc.encryptAndStore('secrets', { apiKey: 'sk_live_...' });

// Decrypt stored data
const data = await enc.decryptFromStorage('secrets');
```

## API Reference

### Methods

```typescript
// Derive encryption key from password
deriveKey(password: string, iterations?: number): Promise<CryptoKey>;

// Encrypt data
encrypt(data: object | string, key?: CryptoKey): Promise<EncryptedData>;

// Decrypt data
decrypt(encrypted: EncryptedData, key?: CryptoKey): Promise<any>;

// Encrypt and store in chrome.storage
encryptAndStore(key: string, data: object | string): Promise<void>;

// Decrypt from chrome.storage
decryptFromStorage(key: string): Promise<any>;

// Generate random encryption key
generateKey(): Promise<CryptoKey>;

// Secure deletion
secureDelete(key: string): Promise<void>;
```

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/encryption-improvement`
3. **Make** your changes
4. **Test** your changes
5. **Commit** your changes: `git commit -m 'Add new feature'`
6. **Push** to the branch: `git push origin feature/encryption-improvement`
7. **Submit** a Pull Request

## See Also

### Related Zovo Repositories

- [chrome-extension-starter-mv3](https://github.com/theluckystrike/chrome-extension-starter-mv3) - Production-ready MV3 starter template
- [chrome-storage-plus](https://github.com/theluckystrike/chrome-storage-plus) - Type-safe storage wrapper
- [zovo-types-webext](https://github.com/theluckystrike/zovo-types-webext) - TypeScript type definitions

### Zovo Chrome Extensions

- [Zovo Tab Manager](https://chrome.google.com/webstore/detail/zovo-tab-manager) - Manage tabs efficiently

Visit [zovo.one](https://zovo.one) for more information.

## License

MIT — [Zovo](https://zovo.one)
