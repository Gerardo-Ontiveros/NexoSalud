<a name="readme-top"></a>

<div align="center">

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Issues][issues-shield]][issues-url]

<a href="http://www.nexosalud.reexxy.com/" target="_blank" rel="noopener noreferrer">
    <img width="300px" src="" alt="NexoSalud Logo" width="800">
</a>

## NexoSalud

NexoSalud es una aplicación web moderna desarrollada en React enfocada en optimizar la administración de centros de salud a través de una experiencia de usuario intuitiva y accesible.

Este sistema centraliza la información hospitalaria permitiendo gestionar pacientes, personal médico y agendas de citas de manera fluida. Está construido utilizando Ant Design para garantizar una interfaz limpia y profesional, e incluye dashboards interactivos para la visualización de datos administrativos.

</div>

<details>

<summary>Tabla de contenidos</summary>

- [NexoSalud](#NexoSalud)
- [Planteamiento del problema](#planteamiento-del-problema)
- [Caracteristicas principales](#caracteristicas-principales)
- [Capturas de pantalla de NexoSalud](#caputras-de-pantalla-de-nexosalud)
- [Flujo de NexoSalud](#flujo-de-nexosalud)
- [Para empezar](#para-empezar)
  - [Prerequisitos](#prerequisitos)
  - [Instalación](#instalación)
- [Contribuir al proyecto](#contribuir-al-proyecto)
- [Stack](#stack)

</details>

## Planteamiento del problema
La gestión de pacientes y citas en muchos centros de salud se realiza de forma ineficiente (papel o sistemas anticuados y difíciles de usar). Esto provoca pérdida de información, tiempos de espera prolongados y frustración en el personal. El problema principal a resolver es la falta de una interfaz centralizada, intuitiva y accesible que agilice estas tareas.

Usuarios de la plataforma (Arquetipos/Personas):

Personal Administrativo / Recepción: Necesitan agendar citas rápidamente y registrar nuevos pacientes sin fricciones.

Personal Médico: Requieren ver su agenda del día y acceder al historial de sus pacientes de forma clara y sin distracciones.

Administradores del Hospital: Necesitan dashboards con métricas generales (citas atendidas, médicos activos) para la toma de decisiones.

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

## Caracteristicas principales
- Gestión Integral: Módulos de control para pacientes, médicos y citas médicas.

- Dashboards Administrativos: Visualización rápida de métricas clave del hospital.

- Rutas Protegidas: Sistema de autenticación (Login y Layout privado) para la seguridad de la información.

- Accesibilidad Prioritaria (a11y): Implementación de un panel de accesibilidad global que permite al usuario modificar el tamaño de la tipografía y alternar el contraste de la pantalla, garantizando una herramienta usable para todo el personal.

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

### Caputras de pantalla de NexoSalud

<div align="center">
<img src=".png" alt="Captura de pantalla NexoSalud" >
</div>

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

### Flujo de NexoSalud

<div align="center">
<img src="https://imgur.com/0MUGohR.png" alt="Flujo de trailix" >
</div>

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

### Diseño de NexoSalud
<div align="center">
<img src=".png" alt="Prototipado de trailix" >
</div>

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

### Diagrama Base de Datos

<div align="center">
<img src=".png" alt="Diagrama Base de Datos" >
</div>

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

### Estructura del Proyecto
```text
NexoSalud/
├── client/                # Código fuente frontend
│   ├── src/
│   └── package.json    
├── server/                # Código fuente backend
│   ├── src/  
│   └── package.json   
├── .gitignore          # Archivos ignorados por Git
├── package.json        # Dependencias y scripts
└── README.md           # Documentación
```

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

## Para empezar

### Prerequisitos

- NVM (recomendado para asegurar versión de Node) ver [documentacion oficial](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)

```sh
nvm install 24.14.0
nvm use 24.10.0
```

> Si quieres automatizar el proceso, puedes crear un script siguiendo la [documentación oficial](https://github.com/nvm-sh/nvm?tab=readme-ov-file#calling-nvm-use-automatically-in-a-directory-with-a-nvmrc-file)

- PNPM

```sh
    npm install -g pnpm
```

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

### Instalación

1. Clona el repositorio

   ```sh
   git clone https://github.com/Gerardo-Ontiveros/NexoSalud.git
   ```

2. Instala lo paquetes de npm

   ```sh
   pnpm install
   ```

3. Ejecuta el proyecto

   ```sh
   pnpm run start
   ```

4. Autenticación para uso de API
   - Crea un archivo llamado `env.local` y copia el contenido de [.env.demo](.env.demo) en él.
   - Reemplaza el texto copiado de demo en `.env.local` con las credenciales que te otorgaron.

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

## Contribuir al proyecto

Aqui tienes una guia rapida para contribuir de manera correcta al proyecto:

1. Haz un [_fork_](https://github.com/Gerardo-Ontiveros/NexoSalud/fork) del proyecto
2. Clona tu [_fork_](https://github.com/Gerardo-Ontiveros/NexoSalud/fork) (`git clone <URL del fork>`).
3. Añade el repositorio original como remoto (`git remote add upstream <URL del repositorio original>`).
4. Crea tu Rama de funcionalidad (`git switch -c tipo/nombre`).
5. Realiza tus cambios (`git commit 'tipo: caracteristica`).
6. Haz un Push a la Rama (`git push origin tipo/nombre`).
7. Abre una [_pull requeset_](https://github.com/Gerardo-Ontiveros/NexoSalud/pulls).

Consulta [guia de contribuición](https://github.com/Gerardo-Ontiveros/NexoSalud/blob/master/CONTRIBUTING.md) para saber como puedes empezar a colaborar de mejor manera.

**Contribuidores:**

[![Contribuidores](https://contrib.rocks/image?repo=Gerardo-Ontiveros/NexoSalud&max=10&colums=20)](https://github.com/Gerardo-Ontiveros/NexoSalud/graphs/contributors)

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

## Stack

- [![React][react-badge]][react-url] - The library for web and native user interfaces.
- [![Typescript][typescript-badge]][typescript-url] - JavaScript with syntax for types.
- [![Tailwind CSS][tailwind-badge]][tailwind-url] - A utility-first CSS framework for rapidly building custom designs.
- [![ExpressJS][express-badge]][express-url] - Fast, unopinionated, minimalist web framework for Node.js
<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

[react-url]: https://react.dev/
[typescript-url]: https://www.typescriptlang.org/
[tailwind-url]: https://tailwindcss.com/
[express-url]: https://expressjs.com/
[react-badge]: https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black&style=for-the-badge
[typescript-badge]: https://img.shields.io/badge/Typescript-007ACC?style=for-the-badge&logo=typescript&logoColor=white&color=blue
[tailwind-badge]: https://img.shields.io/badge/Tailwind-ffffff?style=for-the-badge&logo=tailwindcss&logoColor=38bdf8
[express-badge]: https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=fff&style=for-the-badge
[contributors-shield]: https://img.shields.io/github/contributors/Gerardo-Ontiveros/NexoSalud?style=for-the-badge
[contributors-url]: https://github.com/Gerardo-Ontiveros/NexoSalud/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Gerardo-Ontiveros/NexoSalud?style=for-the-badge
[forks-url]: https://github.com/Gerardo-Ontiveros/NexoSalud/network/members
[issues-shield]: https://img.shields.io/github/issues/Gerardo-Ontiveros/NexoSalud?style=for-the-badge
[issues-url]: https://github.com/Gerardo-Ontiveros/NexoSalud/issues
