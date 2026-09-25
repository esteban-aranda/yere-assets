// Proxy de solo lectura para paraguay.pmtiles: agrega CORS y reenvía Range,
// que GitHub Releases no soporta directamente para fetch() desde navegador/WebView.

const UPSTREAM =
  'https://github.com/esteban-aranda/yere-assets/releases/download/paraguay-basemap-2026-01-12/paraguay.pmtiles'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Range',
  'Access-Control-Expose-Headers': 'Content-Range, Content-Length, Accept-Ranges',
}

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS })
    }

    const upstreamHeaders = {}
    const range = request.headers.get('Range')
    if (range) upstreamHeaders.Range = range

    const upstreamRes = await fetch(UPSTREAM, { headers: upstreamHeaders })

    const headers = new Headers(upstreamRes.headers)
    for (const [k, v] of Object.entries(CORS_HEADERS)) headers.set(k, v)

    return new Response(upstreamRes.body, {
      status: upstreamRes.status,
      headers,
    })
  },
}
