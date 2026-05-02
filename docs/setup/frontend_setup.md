## Angular Setup

### Tech Stack
- Angular CLI: 20.3.24
- Angular: 20.3.x
- Node.js: 20.x (LTS)
- npm: 10.x
- Build system: Vite (Angular default)
- Rendering: SPA (NO SSR)

### Prerequisites
Make sure you have installed:
- Node.js v20 LTS
- npm v10+

Check versions:
```
node -v
```
```
npm -v
```

### Installation
#### Navigate to project
```
cd frontend  
```
#### Install Angular CLI
```
npm install -g @angular/cli@20.3.24
```
#### Install dependencies
```
npm install
```
  - select `tailwindcss`  
#### Install required packages
```
npm install @tailwindcss/postcss`
```
```
npm install zone.js
```
```
npx ng serve --proxy-config proxy.conf.json
```

### Tech stack
- Test runner: `Vitest`
- DOM environment: `jsdom`
- Assertion library: built-in (expect)
- UI (optional): `@vitest/ui`

#### Installation
```
npm install -D vitest jsdom @vitest/ui
```

### Run the project
```
npx ng serve
```

### App URL
```
http://localhost:4200/
```
