# Contributing to Stoop

Thank you for your interest in contributing to Stoop! This document provides guidelines for contributing to the project.

## Development Setup

1. Clone the repository
2. Install dependencies: `bun install`
3. Run tests: `bun test`
4. Build: `bun run build`

## Code Quality

Before committing, ensure:

- ✅ **Linting passes**: `bun run lint` (runs ESLint with auto-fix)
- ✅ **Build succeeds**: `bun run build` (builds all packages)
- ✅ **TypeScript compiles**: Type checking is included in the build step
- ✅ **Tests pass**: `bun test` (runs all test suites)

## Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/) format. Since this is a monorepo, include the package name in the scope.

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `chore`: Maintenance tasks (build, deps, etc.)
- `test`: Test additions or changes
- `style`: Code style changes (formatting, etc.)

### Scope

Use the package name as the scope:

- `stoop` - Main stoop package
- `stoop-ui` - UI components package
- `stoop-swc` - SWC compiler package
- `website` - Documentation website

### Examples

```bash
fix(stoop): handle vendor prefixes in CSS property names
feat(stoop-ui): add new Button variant
refactor(stoop): move stringification to dedicated module
docs(website): update installation guide
chore: update dependencies
```

## Pull Requests

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all checks pass (lint, build, tests)
4. Submit a PR with a clear description
5. Ensure commit messages follow the conventional commits format

## Releasing

1. **Update CHANGELOG.md** with new version entry
2. **Commit all changes** - Ensure clean git tree before publishing
3. **Bump version** in `package.json` for package(s) being released
4. **Build and publish stoop** (if releasing):
   ```bash
   cd packages/stoop && bun run build && npm publish --otp=<code>
   ```
5. **Build and publish stoop-ui** (if releasing):
   ```bash
   cd packages/stoop-ui && bun run build && npm publish --otp=<code>
   ```
6. **Tag release**: `git tag v<version> <commit-hash>` (e.g., `git tag v0.5.0`)

**Notes:** Build before publishing. Must be logged into npm. Publish in dependency order: `stoop` first, then `stoop-ui`.

## Questions?

Feel free to open an issue for questions or discussions.
