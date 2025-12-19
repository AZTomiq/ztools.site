# How to use Base64 & Hash Toolkit

This toolkit provides essential cryptographic and encoding utilities for developers.

### 1. Base64 Encoding/Decoding
- **Encode**: Converts plain text into a Base64 string. Useful for embedding data in URLs or basic authentication headers.
- **Decode**: Reverts a Base64 string back to original plain text.

### 2. MD5 (Message Digest 5)
- Generates a 128-bit hash value.
- Common use: Integrity checks for files or legacy password hashing (though not recommended for secure passwords anymore).

### 3. SHA-256 (Secure Hash Algorithm 256-bit)
- Part of the SHA-2 family.
- Generates a fixed 256-bit (64 characters hex) hash.
- Standard for modern cryptographic security, digital signatures, and blockchain.

### 4. Privacy Note
All calculations are performed **locally** in your browser using the Web Crypto API or built-in JavaScript functions. Your data is never sent to any server.
