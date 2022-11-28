# Busket ShoppingList.ts file

Submodule Git for the ShoppingList.ts file. In /web and /backend place this file in the /src directory under the
shoppinglist folder.

## Developing
If you want to work on this file independently add a `uuid.d.ts` file and put this into it:
```ts
export function v4(): string;
export as namespace uuid;
```

to suppress typescript lib errors place a file called `tsconfig.json` in the root dir and put this into it:
```json
{
  "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true
  }
}
```
