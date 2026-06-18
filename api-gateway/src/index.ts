import {ApplicationConfig} from '@loopback/core';
import {ApiGatewayApplication} from './application';

export * from './application';

export async function main(
  options: ApplicationConfig = {},
) {
  options.rest = {
    port: +(process.env.PORT ?? 9001),
    host: process.env.HOST ?? '0.0.0.0',
    gracePeriodForClose: 5000,
    openApiSpec: {
      setServersFromRequest: true,
    },
  };

  const app =
    new ApiGatewayApplication(options);

  await app.boot();
  await app.start();

  console.log(
    `API Gateway running at ${app.restServer.url}`,
  );

  return app;
}

if (require.main === module) {
  const config = {
    rest: {
      port: +(process.env.PORT ?? 9001),
      host: process.env.HOST ?? '0.0.0.0',
    },
  };

  main(config).catch(err => {
    console.error(
      'Cannot start the application.',
      err,
    );

    process.exit(1);
  });
}