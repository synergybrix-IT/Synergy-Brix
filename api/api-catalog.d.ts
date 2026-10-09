declare function handler(request: Request): Response
declare function handler(
  request: import('node:http').IncomingMessage,
  response: import('node:http').ServerResponse,
): void

export default handler
