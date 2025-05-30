# Bitkub SDK

[![npm version](https://img.shields.io/npm/v/@arbit-x/bitkub-sdk.svg)](https://www.npmjs.com/package/@arbit-x/bitkub-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A modern TypeScript SDK for the Bitkub Exchange API, providing both REST and WebSocket interfaces for cryptocurrency trading and market data.

A TypeScript SDK for the Bitkub Exchange API, providing both REST and WebSocket interfaces for cryptocurrency trading and market data.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Development](#development)
- [Next Steps](#next-steps)
- [Known Issues](#known-issues)
- [Future Considerations](#future-considerations)
- [Notes](#notes)
- [License](#license)

---

## Overview

**Bitkub SDK** is a TypeScript SDK that simplifies interaction with the Bitkub exchange API. It provides easy-to-use methods for both REST and WebSocket endpoints, enabling developers to access market data and trading features with minimal setup.

---

## Features

- Fetch available market symbols
- Basic error handling
- TypeScript type definitions
- Configurable API and WebSocket URLs
- Support for authenticated requests (API key/secret)
- Order book, ticker, trading history, real-time data, trading actions

---

## Installation
```bash
npm install @arbit-x/bitkub-sdk
```

---

## Usage

```typescript
import { BitkubSDK } from '@arbit-x/bitkub-sdk';

const bitkubSDK = new BitkubSDK({
  baseUrl: "https://api.bitkub.com",
  baseWsUrl: "wss://api.bitkub.com/websocket-api",
  apiKey: "your-api-key",
  apiSecret: "your-api-secret"
});

// Fetch market symbols
const marketSymbols = await bitkubSDK.fetchMarketSymbols();
```

---

## Development

### Build & Development

- **Build:**  
  `npm run build` — Compiles TypeScript to `dist/`
- **Clean:**  
  `npm run clean` — Cleans the `dist` directory
- **Lint:**  
  `npm run lint` — Runs ESLint
- **Format:**  
  `npm run format` — Formats code with Prettier

### Testing & Quality (Planned)

- Set up Jest/Mocha
- Add unit and integration tests
- Set up CI/CD and code coverage

---

## License

MIT

## Author
SainyTK
Creator and maintainer of @arbit-x/bitkub-sdk
Feel free to reach out for questions, suggestions, or contributions!

