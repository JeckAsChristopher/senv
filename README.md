# SENV — Secure Environment for Node.js

SENV is a secure environment manager for Node.js that stores environment variables in an encrypted binary file (`.senv`). It prevents accidental leaks of `.env` files and ensures secrets are only available in memory at runtime.

---

## Features

* Binary `.senv` file with magic header (`SENV`).
* Password-based encryption using AES.
* Automatic password prompt when decrypting.
* In-memory decryption only.
* Anti-memory wipe helpers to clear sensitive buffers.
* CLI utilities for encrypting, testing, and restoring.
* MIT license.

---

## Quick Demo

```bash
$ node dist/index.js
Finding .env in current directory...
.env Found..
Enter Password:
Confirm Password:
.env encrypted and locked on .senv
```

When running a script that requires SENV:

```bash
Configuring .senv...
Enter Password:
(If wrong → stop running)
(If correct → continue with environment loaded in memory)
```

---


## How `.senv` Works

* **Magic Header:** first 4 bytes = `SENV`.
* **IV / salt:** next 16 bytes.
* **Payload:** AES-encrypted binary blob.
* Payload = raw text from `.env`, encrypted.

---

## Usage

### 1. Encrypt `.env` → `.senv`

```bash
node dist/index.js
```

Prompts for password and creates `.senv`.

### 2. Test `.senv` Integrity

```bash
node test/test.js
```

Checks if `.senv` can be decrypted with password.

### 3. Run Scripts with `.senv`

Any script importing SENV will automatically prompt for password. If password is wrong, execution stops.

---

## Security Notes

* **Passwords derive encryption keys** — keep them secret.
* **No plaintext `.env` is kept** unless explicitly restored.
* **In-memory only** — decrypted values should be wiped after use.
* **.senv is safe to store** (cloud, git), but protect your password.

---

## License

SENV is released under the **MIT License**. See `LICENSE.md`.
