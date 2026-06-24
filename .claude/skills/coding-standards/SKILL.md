---
name: coding-standards
description: Project coding standards for this repo. Invoke before writing or editing code, and consult when reviewing a diff, to enforce naming conventions and other house rules that go beyond ESLint/Prettier.
---

# Coding standards

Apply these rules when authoring new code or editing existing code in this repo. Treat them as hard rules unless the user explicitly waives one.

## Naming

### Expand short callback parameters to meaningful names

In array methods (`.map`, `.filter`, `.find`, `.some`, `.every`, `.reduce`, `.forEach`, `.flatMap`, `.sort`) and similar higher-order callbacks, the parameter name MUST describe what the element represents. Single-letter abbreviations like `o`, `e`, `i`, `x`, `v`, `p` are not allowed even when the callback body is short.

Pick the name from the element's type or domain meaning, not from the variable being iterated.

**Bad**

```ts
getOptionsFromPathInfo(paths).filter((o) => !preferredValues.has(o.value));
items.map((i) => i.id);
subscriptions.find((s) => s.id === target);
fields.reduce((a, f) => a + f.width, 0);
```

**Good**

```ts
getOptionsFromPathInfo(paths).filter((option) => !preferredValues.has(option.value));
items.map((item) => item.id);
subscriptions.find((subscription) => subscription.id === target);
fields.reduce((total, field) => total + field.width, 0);
```

Exceptions:

- Conventional math/coordinate names (`x`, `y`, `z`) when the value truly is a coordinate.
- Established library conventions where the type itself is a single letter (e.g., a generic `<T>` parameter).

If you spot a violation in code you're already editing, fix it in the same edit. Don't open a separate cleanup pass for unrelated files.

## Applying this skill

When invoked, scan the code you're about to write or have just written for the rules above. If you find a violation in the diff, fix it before reporting the task complete. When reviewing a diff (e.g., during `/code-review`), call out violations as findings.
