<p align="center">
  <a href="https://nexthire.shop" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NextHire Logo" /></a>
</p>

# NextHire Backend

The robust, scalable core of the NextHire recruitment platform, built with **NestJS**, **TypeScript**, and **MongoDB**. This project adheres to **Clean Architecture** principles and enforces high code quality standards.

## 🚀 Teck Stack

- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Language**: TypeScript (Strict Mode)
- **Runtime & Package Manager**: [Bun](https://bun.sh/)
- **Database**: MongoDB with Mongoose
- **Linting & Formatting**: [Biome](https://biomejs.dev/)
- **Automation**: Husky (Git Hooks)
- **Observability**: OpenTelemetry
- **Environment**: Linux/Unix

## 🏗️ Architecture

This project follows **Clean Architecture / Domain-Driven Design (DDD)**:

- **src/domain**: Core entities, value objects, and business rules (No dependencies).
- **src/application**: Use cases, DTOs, and interface definitions for ports.
- **src/infrastructure**: Database implementations (Mongoose), external services, and adapters.
- **src/presentation**: Controllers, request handlers, and public interfaces.
- **src/modules**: NestJS module configurations and dependency injection.

## 🛠️ Project Setup

### Prerequisites
- [Bun](https://bun.sh/docs/installation) (latest)
- [MongoDB](https://www.mongodb.com/) (local or cloud)

### Installation
```bash
$ bun install
```

### Environment Configuration
Create a `.env` file in the root directory based on `.env.example`:
```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/nexthire
...
```

## 🏃 Execution

```bash
# development mode (with hot reload)
$ bun run start:dev

# production mode
$ bun run start:prod
```

## 🛡️ Code Quality & Standards

We enforce a **Zero-Error** and **Zero-Warning** policy.

### Guidelines
- **No `any`**: The `any` keyword is strictly prohibited. Use specific types or `unknown`.
- **No Linter Suppression**: `biome-ignore` comments are disallowed. Fix the root cause instead.
- **UI Locking**: Do not modify core UI/Animate-UI components if imported.
- Refer to [AGENTS.md](./AGENTS.md) for detailed coding standards.

### Automated Checks
This project uses **Husky** to automate quality checks:
- **Pre-commit**: Runs `bun run lint` (Biome check and format).
- **Pre-push**: Runs `bun run test` (Unit/Integration tests).

## 🧪 Testing

```bash
# unit tests
$ bun run test

# e2e tests
$ bun run test:e2e

# test coverage
$ bun run test:cov
```

## 📄 License

NextHire Backend is [MIT licensed](./LICENSE).
