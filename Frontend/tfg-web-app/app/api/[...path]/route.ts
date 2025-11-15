import { NextRequest, NextResponse } from "next/server";

// URL del backend (accesible desde el servidor Next.js dentro del cluster)
const BACKEND_URL = process.env.BACKEND_URL || "http://backend:4000";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, "GET");
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, "POST");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, "PUT");
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, "PATCH");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, "DELETE");
}

async function proxyRequest(
  request: NextRequest,
  path: string[],
  method: string
) {
  try {
    // Construir la URL del backend
    const pathString = path.join("/");
    const searchParams = request.nextUrl.searchParams.toString();
    const queryString = searchParams ? `?${searchParams}` : "";
    const backendUrl = `${BACKEND_URL}/${pathString}${queryString}`;

    // Preparar headers
    const headers: HeadersInit = {};

    // Copiar headers relevantes (Authorization, Content-Type, etc.)
    const headersToProxy = [
      "authorization",
      "content-type",
      "accept",
      "accept-language",
    ];

    headersToProxy.forEach((headerName) => {
      const value = request.headers.get(headerName);
      if (value) {
        headers[headerName] = value;
      }
    });

    // Preparar el body para métodos que lo soportan
    let body: string | undefined;
    if (["POST", "PUT", "PATCH"].includes(method)) {
      try {
        const text = await request.text();
        body = text || undefined;
      } catch (e) {
        // Si no hay body, continuar sin él
      }
    }

    // Hacer la petición al backend
    const response = await fetch(backendUrl, {
      method,
      headers,
      body,
    });

    // Leer la respuesta
    const data = await response.text();

    // Copiar headers de respuesta relevantes
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      // Copiar todos los headers excepto algunos que Next.js maneja automáticamente
      if (!["connection", "keep-alive", "transfer-encoding"].includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    // Retornar la respuesta con el mismo status code
    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Error proxying request:", error);
    return NextResponse.json(
      { error: "Failed to proxy request to backend" },
      { status: 500 }
    );
  }
}
