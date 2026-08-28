---
hide:
  - toc
---

<p align="center"><em>Modern, component-driven UI library for the Workflow Orchestrator. Built with Next.js, TypeScript, and React.</em></p>

<p align="center">
    <a href="https://www.npmjs.com/package/@orchestrator-ui/orchestrator-ui-components" target="_blank">
    <img src="https://img.shields.io/npm/v/@orchestrator-ui/orchestrator-ui-components?color=%2334D058&label=npm%20package" alt="NPM Version">
    </a>
    <a href="https://www.npmjs.com/package/@orchestrator-ui/orchestrator-ui-components" target="_blank">
    <img src="https://img.shields.io/npm/dm/@orchestrator-ui/orchestrator-ui-components?label=npm%20downloads" alt="NPM Downloads">
    </a>
    <a href="https://github.com/workfloworchestrator/orchestrator-ui-library" target="_blank">
    <img src="https://img.shields.io/github/stars/workfloworchestrator/orchestrator-ui-library?style=flat-square&logo=github" alt="GitHub Stars">
    </a>
    <a href="https://discord.gg/fQkQn5ajFR" target="_blank">
    <img alt="Discord" src="https://img.shields.io/discord/1295834294270558280?style=flat-square&logo=discord&label=discord">
    </a>
</p>

<br>

__The Orchestrator UI Library is a collection of reusable React components and pages built for the
[Workflow Orchestrator Programme](https://www.workfloworchestrator.org). Developed by [SURF](https://www.surf.nl) and the community, it enables 
rapid development of modern frontends for service orchestration.__

## What is this library?

The **Orchestrator UI Library** provides a collection of production-ready, accessible React components and complete
pages designed to work seamlessly with the [Orchestrator Core](../../orchestrator-core/) backend.
It abstracts away the complexity of connecting to the orchestrator engine, allowing you to focus on building user experiences.

## Key Features

- **Modern React Components**: Built with React 18+, TypeScript, and Next.js for type-safe development
- **Fully Composable**: Use individual components or complete pages, mix and match as needed
- **Usability**: Designed with UX in mind, with support for light and dark modes
- **Production-Ready**: Used in production environments by WFO programme members and continuously QA tested

## What's Included?

The library exposes three main packages:

### **@orchestrator-ui/orchestrator-ui-components**

The heart of the library. A collection of reusable React components and pages for building orchestrator frontends.
Includes:

- Pages for managing subscriptions, workflows, and products
- Form components for user input
- Data display components (tables, lists, cards)
- Workflow visualization components
- Authentication and permission helpers

All components are prefixed with `Wfo` for easy identification.

### **@orchestrator-ui/eslint-config-custom**

Shared ESLint configuration for consistent code quality across projects.
Helps enforce code standards used in the Orchestrator ecosystem.

### **@orchestrator-ui/tsconfig**

Shared TypeScript configuration ensuring type safety and consistency. 
Provides a baseline configuration that can be extended for specific project needs.

## Getting Started

### Install the components package

```bash
npm install @orchestrator-ui/orchestrator-ui-components
```

### Use it in your app

```tsx
import { WfoSubscriptionList } from '@orchestrator-ui/orchestrator-ui-components';

export default function SubscriptionsPage() {
  return <WfoSubscriptionList />;
}
```

For a complete example, check out the [example-orchestrator-ui](https://github.com/workfloworchestrator/example-orchestrator-ui) repository.

## Technology Stack

- **[React](https://react.dev)**: A JavaScript library for building user interfaces
- **[Next.js](https://nextjs.org)**:  The React framework for production
- **[TypeScript](https://www.typescriptlang.org)**: JavaScript with syntax for types
- **[Turbo](https://turbo.build)**: High-performance build system for JavaScript and TypeScript
- **[EUI (Elastic UI)](https://eui.elastic.co)**: Flexible, accessible component library
- **[Pydantic Forms UI](https://github.com/workfloworchestrator/pydantic-forms-ui)**: Type safe web forms generated from [Pydantic Forms](../../pydantic-forms/) JSON schema

## Why Next.js and TypeScript?

We chose Next.js because it provides everything needed for modern web applications — from routing to server-side rendering to API routes. TypeScript ensures that as your orchestrator grows in complexity, the codebase remains maintainable and type-safe.

This means you get:

- **Static type checking**: Catch errors before they reach production
- **Excellent developer experience**: IDE autocompletion and refactoring tools
- **Built-in optimizations**: Automatic code splitting, image optimization, and more
- **Easy authentication**: NextAuth integration for secure user management

## Community & Support

- 💬 **Questions?** Join us on [Discord](https://discord.gg/fQkQn5ajFR)
- 🐛 **Found a bug?** [Open an issue](https://github.com/workfloworchestrator/orchestrator-ui-library/issues)
- 🤝 **Want to contribute?** [Read our contributing guide](development/monorepo.md)
- 📖 **Architecture decisions?** Check out our [ADRs](decisions/records.md)
