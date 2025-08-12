# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

# How to Run and Build the App

## Run in DEV mode

```bash
npm run dev           # Start React (Vite dev server)
npm run dev:electron  # Start Electron (the app window will load from localhost:5173)
```

<!-- > **Note:**
>
> - You should open 2 terminals and run both commands in parallel.
> - Or use an automatic script (if available):
>   ```bash
>   npm run dev:all
>   ``` -->

## Build and Run PRODUCT (production)

```bash
npm run build         # Build both React and Electron
npx electron-builder  # Package the app into an installer (dmg, zip, ...)
```

- After building, the installer files will be in the `dist/` or `dist/mac-arm64/` folder.
- You can run the `.app` file directly or share the `.dmg` file with Mac users.

---
