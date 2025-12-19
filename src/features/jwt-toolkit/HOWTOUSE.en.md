# How to use the JWT Debugger

JSON Web Token (JWT) is an open standard that defines a compact and self-contained way for securely transmitting information between parties as a JSON object.

### 1. Paste your Token
Find the multi-line textarea on the left and paste your encoded JWT token. It usually looks like a long string of characters separated by two dots (`.`).

### 2. Inspect the Result
The tool will automatically split the token and decode it into two main parts:
- **Header**: Contains metadata about the type of token and the hashing algorithm used (e.g., HS256, RS256).
- **Payload**: Contains the "claims" or the actual data stored in the token (e.g., user ID, roles, expiration time).

### 3. Security Note
- **Local Processing**: This tool runs entirely in your browser. Your token is **never** sent to any server.
- **Sensitive Data**: Even though it's local, be cautious when handling tokens containing highly sensitive private information in shared environments.
