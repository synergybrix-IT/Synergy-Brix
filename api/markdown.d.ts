declare function handler(request: Request): Promise<Response>
declare function handler(
  request: import('node:http').IncomingMessage,
  response: import('node:http').ServerResponse,
): Promise<void>

export default handler
