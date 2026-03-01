# chrome-data-encrypt — AES-256 Encryption for Extensions
> **Built by [Zovo](https://zovo.one)** | `npm i chrome-data-encrypt`

AES-256-GCM via Web Crypto, PBKDF2 key derivation, encrypted storage wrapper, and secure deletion.

```typescript
import { DataEncrypt } from 'chrome-data-encrypt';
const enc = new DataEncrypt();
const salt = await enc.deriveKey('user-password');
await enc.encryptAndStore('secrets', { apiKey: 'sk_live_...' });
const data = await enc.decryptFromStorage('secrets');
```
MIT License
