import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';

import path from 'path';

import express from 'express';
import {createProxyMiddleware} from 'http-proxy-middleware';

import {MySequence} from './sequence';

export {ApplicationConfig};

export class ApiGatewayApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.sequence(MySequence);

    this.static('/', path.join(__dirname, '../public'));

    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });

    this.component(RestExplorerComponent);

    // =========================
    // EXPRESS PROXY
    // =========================

    const inventoryTarget =
      process.env.INVENTORY_SERVICE_URL || 'http://bookstore-api:3000';

    const orderTarget =
      process.env.ORDER_SERVICE_URL || 'http://order-service:3001';

    const paymentTarget =
      process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3002';

    const expressApp = express();

    // INVENTORY
    expressApp.use(
      '/inventory',
      createProxyMiddleware({
        target: inventoryTarget,
        changeOrigin: true,
        pathRewrite: {
          '^/inventory': '',
        },
      }),
    );

    // ORDERS
    expressApp.use(
      '/orders',
      createProxyMiddleware({
        target: orderTarget,
        changeOrigin: true,
      }),
    );

    // PAYMENTS
    expressApp.use(
      '/payments',
      createProxyMiddleware({
        target: paymentTarget,
        changeOrigin: true,
      }),
    );

    // MONTER EXPRESS DANS LOOPBACK
    this.mountExpressRouter('/' , expressApp);

    this.projectRoot = __dirname;

    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}