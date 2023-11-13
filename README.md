<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

Test de microservicio con ACID

## Installation

1. Clonar proyecto
2. Ejecutar

```bash
$ yarn install
```

3. Tener Nest Cli Instalado

```
npm i -g @nestjs/cli
```

4. Levantar RabbitMQ

```
docker-compose up -d
```

5. Clonar el archivo `.env.example` y renomber la copia `.env`
6. LLenar las variables de entorno definida en `.env`

## Ejecutar app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

```

## Uso

Se enviara una solicitud `Get` al endpoint `test/users` lo que devolverá un listado de usuarios.
Luego desde la consola en que se levanto la aplicación se podra ver los usuarios recibidos por el microservicio después de realizar la solicitud.
