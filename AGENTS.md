# Agent Guidelines

This document outlines the coding standards and best practices that all AI agents must follow when contributing to this project.

## TypeScript Standards

- **No `any` Keyword**: The use of the `any` type is strictly prohibited. Always provide proper type definitions or use `unknown` if the type is truly dynamic, followed by proper type narrowing.
- **Strict Typing**: Ensure all functions have return types and all variables are appropriately typed.

## General Practices

- **Use Bun**: Use `bun` for all package management and script execution.
- **Husky Hooks**: Always ensure Husky hooks (pre-commit linting and pre-push testing) are respected.
- **Biome**: Use Biome for formatting and linting as configured in `biome.json`.
- **No Linter Suppression**: Do not use `biome-ignore` or similar suppression comments. Fix the root cause of linting errors instead.