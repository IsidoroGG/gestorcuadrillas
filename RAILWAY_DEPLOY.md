# Guía de Despliegue en Railway

Esta guía te ayudará a subir tu aplicación (Backend Node.js + Base de Datos PostgreSQL) a Railway.

## 1. Preparación del Proyecto
Asegúrate de que tienes la siguiente estructura de carpetas:
- `/` (La carpeta raíz con tu `index.html`)
- `/server` (La carpeta con el código del backend que acabo de crear)

## 2. Crear Repositorio en GitHub
Railway despliega desde GitHub.
1. Crea un **nuevo repositorio** en GitHub.
2. Sube todo el contenido de tu carpeta `Prueba` (incluyendo `server/` e `index.html`).

## 3. Crear Proyecto en Railway
1. Ve a [railway.app](https://railway.app/).
2. Haz clic en **"New Project"** -> **"Deploy from GitHub repo"**.
3. Selecciona el repositorio que acabas de subir.
4. **IMPORTANTE**: Railway detectará la carpeta raíz. Como tu backend está en `/server`, necesitamos configurar el "Root Directory".
    - Ve a **Settings** del servicio en Railway.
    - Busca **Root Directory** y cámbialo a `/server`.
    - (Alternativa: Si subiste solo la carpeta `server` como raíz del repo, déjalo vacío).

## 4. Añadir Base de Datos
1. En tu proyecto de Railway, haz clic en **"New"** -> **"Database"** -> **"Add PostgreSQL"**.
2. Espera a que se cree.

## 5. Conectar Backend y Base de Datos
1. Ve a tu servicio de **backend (Node.js)** en Railway.
2. Ve a la pestaña **Variables**.
3. Añade una nueva variable:
    - Nombre: `DATABASE_URL`
    - Valor: `${{Postgres.DATABASE_URL}}` (Railway te sugerirá autocompletar esto vinculándolo a tu DB).
4. Railway redeplegará tu aplicación automáticamente.

## 6. Crear las Tablas (Schema)
Necesitamos ejecutar el SQL para crear las tablas.
1. Copia el contenido del archivo `database_final.txt` que te generé antes. (Nota: Está en tus artifacts, o puedes abrirlo desde `database_final.txt` si lo copié a tu carpeta).
2. En Railway, haz clic en tu servicio **PostgreSQL**.
3. Ve a la pestaña **Data** -> **Query**.
4. Pega el SQL y ejecútalo.

## 7. Conectar tu Frontend (`index.html`)
1. Copia el **Dominio Público** de tu servicio Backend en Railway (lo encontrarás en Settings -> Networking -> Public Domain).
    - Ejemplo: `https://cofrade-backend-production.up.railway.app`
2. Abre tu aplicación `index.html`.
3. Ve a **Configuración**.
4. En "Conexión Backend", pega la URL.
5. Haz clic en **Guardar**.

¡Listo! Tu aplicación ahora usa tu propio servidor y base de datos en Railway.
