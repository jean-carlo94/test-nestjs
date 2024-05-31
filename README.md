<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Proyecto API con NestJS y TypeORM

Este proyecto es una API desarrollada utilizando [NestJS](https://nestjs.com/) junto con [TypeORM](https://typeorm.io/). La API está diseñada para gestionar clases, estudiantes y profesores.

## Estructura del Proyecto

La estructura del proyecto es la siguiente:

```
  src/
    ├── common/
    │   ├── constants/
    │   ├── dto/
    │   ├── interfaces/
    │   └── repositories/
    ├── config/
    │   └── database/
    │       ├── config.data.source.ts
    │       ├── entities.ts
    │       └── index.ts
    ├── modules/
    │   ├── classes/
    │   ├── students/
    │   └── teachers/
    │       ├── automappers/
    │       ├── controllers/
    │       ├── dto/
    │       ├── entities/
    │       ├── repositories/
    │       └── services/
    │       └── teachers.module.ts
    ├── app.module.ts
    └── main.ts
  test/
  .env
  .eslintrc.js
  .gitignore
  .prettierrc
  nest-cli.json
  package.json
  pnpm-lock.yaml
  README.md
  tsconfig.build.json
  tsconfig.json
```

## Requisitos

- Node.js (>=20.x)
- PNPM (se recomienda en lugar de npm o yarn)

## Configuración del Proyecto

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/jean-carlo94/test-nestjs.git
   cd test-nestjs
   ```

2. **Instala las dependencias:**

   ```bash
   pnpm install
   ```

3. **Configura las variables de entorno:**

   Crea un archivo `.env` en la raíz del proyecto y configura las siguientes variables:

   ```plaintext
    PORT=3008
    DB_NAME=nombre_base_datos
    DB_HOST=localhost
    DB_PORT=3306
    DB_ROOT_PASSWORD=contraseña
    DB_USERNAME=usuario
    DB_PASSWORD=contraseña
   ```

## Ejecución del Proyecto

1. **Compilar el proyecto:**

   ```bash
   pnpm run build
   ```

2. **Iniciar la aplicación:**

   ```bash
   pnpm run start
   ```

   Para ejecutar en modo de desarrollo con recarga en caliente:

   ```bash
   pnpm run start:dev
   ```

## Testing

Para ejecutar los tests, utiliza el siguiente comando:

```bash
pnpm run test
```

## Estructura de Carpetas

- **common/**: Contiene constantes, DTOs, interfaces y repositorios comunes utilizados en todo el proyecto.
- **config/**: Contiene la configuración de la base de datos.
- **modules/**: Contiene los módulos de la aplicación (clases, estudiantes y profesores).
- **test/**: Contiene las pruebas del proyecto.

## Módulos

### Estructura de módulo

- **automappers/**: Contiene configuraciones para el mapeo automático de objetos.
- **controllers/**: Contiene los controladores de la API relacionados.
- **dto/**: Contiene los Data Transfer Objects relacionados.
- **entities/**: Contiene las entidades de la base de datos relacionadas.
- **repositories/**: Contiene los repositorios de datos para interactuar con la base de datos.
- **services/**: Contiene los servicios que encapsulan la lógica de negocio.
- **module.module.ts**: Define el módulo y sus dependencias.

## Contribuciones

Si deseas contribuir a este proyecto, por favor sigue estos pasos:

1. Haz un fork del proyecto.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza los cambios necesarios y haz commit (`git commit -am 'Agrega nueva funcionalidad'`).
4. Empuja los cambios a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Stay in touch

- Author - [Jean Carlo Urrego](https://jeandeveloper.netlify.app/)

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo `LICENSE` para obtener más detalles.