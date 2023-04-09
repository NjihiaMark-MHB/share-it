
export async function GET(request: Request) {
  const newHeaders = new Headers();
  newHeaders.set('Content-Type', 'application/json');

  return new Response( JSON.stringify({"message": 'Hello world!'}) , {
    status: 202,
    headers: newHeaders
  });
}
