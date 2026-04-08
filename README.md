<<<<<<< HEAD
# Portfolio Personal — Full Stack Developer

> *"Sin experiencia previa como desarrollador, en 3 meses he desplegado aplicaciones reales para clientes reales."*

---

## 🧭 Sobre este proyecto

Este portfolio no es solo un escaparate — es en sí mismo un proyecto full stack que forma parte del portfolio que presenta. Construido con React + Express + MongoDB, demuestra el mismo stack enseñado en el Máster en Desarrollo Full Stack, con el objetivo de afianzar los conocimientos adquiridos y presentar un producto completo, robusto y escalable.

---

## 👤 Perfil

Desarrollador Full Stack con perfil híbrido:

- Titulación en Desarrollo de Aplicaciones Multiplataforma (DAM)
- 8 años de experiencia en producto digital como Account Manager, gestionando y publicando más de 2.000 webs para clientes autónomos
- Formación complementaria en diseño y ciberseguridad
- Máster en Desarrollo Full Stack
- 5 aplicaciones desplegadas en producción en 3 meses

**Herramientas de trabajo:** Desarrollo con asistencia de IA (Claude Code), con capacidad de defender y explicar el código al 80% — decisiones de arquitectura, tradeoffs, y mejoras futuras.

---

## 🗂️ Proyectos presentados

### 1. Ahorcado Bilingüe
**Mi primer contacto con React**

Juego del ahorcado en español e inglés con un diccionario de más de 15.000 palabras. Sin backend. Proyecto de iniciación que demuestra el punto de partida.

- **Stack:** React puro
- **Estado:** Desplegado

---

### 2. Mazarife Cultural — mazarife.es
**App en producción para un cliente real**

Web/app para la asociación cultural de Mazarife. Panel de control completo con sistema de roles y usuarios. En funcionamiento activo con usuarios reales.

- **Stack:** React + Express + Supabase
- **Estado:** En producción → [mazarife.es](https://mazarife.es)
- **Destacado:** Cliente real, usuarios reales, roles y permisos

---

### 3. RFG Construcción
**Web con posicionamiento SEO para empresa de construcción**

Aplicación web para empresa de construcción con foco en SEO local y panel de control para gestión autónoma de obras y contenido.

- **Stack:** Next.js + Supabase
- **Estado:** Desplegado → [rfg-khaki.vercel.app](https://rfg-khaki.vercel.app) *(dominio propio próximamente)*
- **Destacado:** SSR para SEO, panel de administración para el cliente

---

### 4. Nextapa
**App colaborativa — proyecto de fin de máster**

Buscador de tapas por proximidad, con funcionalidades completas para usuarios y establecimientos. Concepto e idea originales, ~75% del desarrollo.

- **Stack:** React + Express + MongoDB
- **Estado:** Desplegado → [nextapa.netlify.app](https://nextapa.netlify.app)
- **Funcionalidades:**
  - Búsqueda por nombre, precio y proximidad geolocalizada
  - Registro de usuarios y establecimientos
  - Horarios y carta de tapas
  - Valoraciones y comentarios
  - Panel admin, panel hostelero
  - Mensajería interna
  - Cupones de descuento

---

### 5. CaminoSantiago.app ⭐ Proyecto estrella
**Guía completa del Camino Francés**

La aplicación más compleja del portfolio. Guía digital del Camino de Santiago con información de etapas, albergues, puntos de interés y múltiples idiomas.

- **Stack:** Next.js (v1) → migración a Hono planificada para v2
- **Estado:** En producción → [caminosantiago.app](https://caminosantiago.app)
- **Destacado:** Arquitectura planificada para escalabilidad, multidioma, complejidad técnica y de contenido

---

### 6. Este portfolio
**El portfolio como proyecto full stack**

El propio portfolio es presentado como un proyecto más — con su arquitectura, sus decisiones técnicas y su panel de administración. Una forma de demostrar criterio de desarrollo, no solo código.

- **Stack:** Vite + React + Express + MongoDB
- **Funcionalidades:**
  - i18n (español / inglés con toggle)
  - Panel de admin con CRUD de proyectos
  - Formulario de contacto guardado en Mongo
  - Analytics de visitas por proyecto
  - Modo demo para paneles de admin de otros proyectos

---

## 🛠️ Stack del portfolio

| Capa | Tecnología |
|------|------------|
| Frontend | Vite + React + JavaScript |
| Backend | Express + JavaScript |
| Base de datos | MongoDB + Mongoose |
| Internacionalización | react-i18next |
| Autenticación | JWT (panel admin) |
| Deploy Frontend | Vercel |
| Deploy Backend | Render |

---

## 🏗️ Arquitectura

```
portfolio/
├── client/                  # Vite + React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── sections/        # Secciones de la landing (Hero, About, Projects, Contact)
│   │   ├── pages/           # Admin panel
│   │   ├── i18n/            # Traducciones ES/EN
│   │   └── hooks/
└── server/                  # Express + Mongoose
    ├── models/              # Project, Message, PageView
    ├── routes/              # API REST
    ├── middleware/          # Auth JWT
    └── seed/                # Datos demo
```

### Modelos de datos

**Project** — título (es/en), descripción (es/en), stack, urls (demo, repo, admin demo), orden, visible

**Message** — nombre, email, mensaje, leído, fecha

**PageView** — slug del proyecto, contador, última visita

---

## 🎯 Estructura de la landing

1. **Hero** — Nombre, título, frase impacto, números clave, links a GitHub y LinkedIn
2. **Sobre mí** — Historia, stack tecnológico con iconos, formación
3. **Proyectos** — Cards de menor a mayor complejidad, con preview, tech stack y links
4. **El portfolio como proyecto** — Caso de estudio: arquitectura, decisiones, panel admin
5. **Contacto** — Formulario guardado en MongoDB

---

## 🔐 Panel de administración

Ruta `/admin` protegida con JWT.

- CRUD de proyectos (editar contenido sin tocar código)
- Bandeja de mensajes de contacto (leídos/no leídos)
- Dashboard de visitas por proyecto
- **Modo demo:** usuario `demo@portfolio.com` con JWT de solo lectura y datos seed ficticios — para que reclutadores exploren el admin sin acceder a producción

---

## 🗺️ Fases de desarrollo

### Fase 1 — El portfolio (ahora)
Scaffold completo, diseño, todas las secciones, panel admin básico. Listo para mandar CVs.

### Fase 2 — Demos por proyecto (en paralelo a la búsqueda de empleo)
Entorno demo aislado para CaminoSantiago y Nextapa primero, luego Mazarife. Badge visible "Modo demo — datos ficticios".

### Fase 3 — Pulido y extras
Analytics propios, mejoras de rendimiento, posible blog técnico.

---

## 💡 Decisiones de arquitectura destacadas

**¿Por qué React + Express + Mongo y no Next.js?**
El objetivo es afianzar el stack del máster. Los otros proyectos ya usan Supabase o prescinden de backend propio. Este portfolio cierra el círculo demostrando dominio del stack completo aprendido.

**¿Por qué un panel admin en el portfolio?**
Para poder actualizar proyectos, leer mensajes de contacto y ver analytics sin tocar código en producción. Y para presentarlo como funcionalidad demostrable en entrevistas.

**¿Por qué modo demo en lugar de acceso directo al admin de producción?**
Separación de entornos. Los proyectos desplegados tienen usuarios y datos reales. El modo demo permite explorar todas las funcionalidades con datos ficticios sin riesgo.

---

## 📬 Contacto

- GitHub: [github.com/usuario]
- LinkedIn: [linkedin.com/in/usuario]
- Email: [email]
- Web: [dominio del portfolio — por confirmar]

---

*Portfolio construido con React + Express + MongoDB · Desarrollado con asistencia de Claude Code*
=======
# 🧮 Calculadora en React

Este proyecto es una calculadora desarrollada con **React**, creada como ejercicio práctico para afianzar los conceptos fundamentales del framework, poniendo el foco en la gestión del estado, la separación de responsabilidades y el comportamiento de la interfaz de usuario.

## ✨ Características principales

- Arquitectura basada en **componentes reutilizables** (`Calculator`, `Display`, `OperationDisplay`, `Keyboard`, `Button`, `Title`).
- Gestión del estado mediante **useState**, controlando:
  - Valor actual del display
  - Valor previo de la operación
  - Operador seleccionado
  - Estado de nueva operación
- Lógica de cálculo implementada sin `eval` ni `Function`, usando una función explícita y segura.
- Control de errores básicos, como la división por cero.
- Soporte correcto para números decimales, evitando múltiples puntos.
- Reinicio automático de la operación al comenzar un nuevo cálculo tras pulsar `=`.

## 🖥️ Interfaz y experiencia de usuario

- Diseño limpio y moderno, con estilos personalizados en CSS.
- Animaciones suaves en la aparición de los dígitos del display.
- Display secundario integrado visualmente para mostrar la operación completa.
- Teclado responsivo con botones especiales (cero y igual a doble ancho).
- Imagen decorativa integrada en el diseño mediante `z-index`, aportando personalidad sin interferir con la interacción.
- Layout centrado y adaptado a distintos tamaños de pantalla.

## 🎯 Objetivo del proyecto

El objetivo principal de esta calculadora no es solo funcionar correctamente, sino **servir como herramienta de aprendizaje**, entendiendo cómo fluye la información en React, cómo se comunican los componentes mediante props y cómo el estado determina el renderizado de la interfaz.

El proyecto se ha desarrollado de forma progresiva, priorizando soluciones claras y comprensibles frente a implementaciones innecesariamente complejas.

## 🚀 Tecnologías usadas

- React
- JavaScript 
- CSS 

---

Proyecto realizado con fines educativos y de práctica en React.
>>>>>>> f51db07dccc41c74bfa2b1bc1f2a80c6258fd583
