import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';

import {inject} from '@loopback/core';

export class MySequence implements SequenceHandler {
  constructor(
    @inject(RestBindings.SequenceActions.FIND_ROUTE)
    protected findRoute: FindRoute,

    @inject(RestBindings.SequenceActions.PARSE_PARAMS)
    protected parseParams: ParseParams,

    @inject(RestBindings.SequenceActions.INVOKE_METHOD)
    protected invoke: InvokeMethod,

    @inject(RestBindings.SequenceActions.SEND)
    public send: Send,

    @inject(RestBindings.SequenceActions.REJECT)
    public reject: Reject,
  ) {}

  async handle(context: RequestContext) {
    const {request, response} = context;

    const url = request.url;

    // Proxy Orders
    if (url.startsWith('/orders')) {
      const targetUrl =
        'http://order-service:3001' +
        url.replace('/orders', '');

      const fetchResponse = await fetch(targetUrl);

      const data = await fetchResponse.text();

      response.status(fetchResponse.status);
      response.send(data);
      return;
    }

    // Proxy Payments
    if (url.startsWith('/payments')) {
      const targetUrl =
        'http://payment-service:3002' +
        url.replace('/payments', '');

      const fetchResponse = await fetch(targetUrl);

      const data = await fetchResponse.text();

      response.status(fetchResponse.status);
      response.send(data);
      return;
    }

    // Routes normales LoopBack
    try {
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);

      const result = await this.invoke(route, args);

      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }
}