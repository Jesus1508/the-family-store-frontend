# The Family Store — Frontend

Tienda en línea de moda (ropa, calzado, bolsos, belleza y cuidado personal),
con panel administrativo para gestionar el catálogo. React + Vite + Tailwind +
react-router-dom.

## Instalación

```bash
npm install
cp .env.example .env
```

Ajusta `VITE_API_URL` en `.env` si el backend no corre en
`http://localhost:5001/api`.

## Desarrollo

```bash
npm run dev
```

- Storefront: `http://localhost:5174/`
- Panel admin: `http://localhost:5174/admin/login`

El usuario admin se crea desde el backend (`npm run create-admin`), no hay
registro público.

## Build de producción

```bash
npm run build
```

El build usa `base: '/the-family-store/'` (ver `vite.config.js`), pensado para
desplegarse bajo esa subruta del dominio del portafolio vía un redirect proxy
de Netlify.
