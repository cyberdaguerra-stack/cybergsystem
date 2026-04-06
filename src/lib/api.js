const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function request(method, path, body) {
  const token = localStorage.getItem('cg_token')
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    })
    
    const data = await res.json().catch(() => ({}))
    
    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem('cg_user')
        localStorage.removeItem('cg_token')
        window.location.href = '/login'
      }
      throw new ApiError(data.message ?? `Erro ${res.status}`, res.status)
    }
    
    return data
  } catch (err) {
    if (err instanceof ApiError) throw err
    throw new ApiError('Erro de conexão com servidor. Verifique a sua ligação.', 0)
  }
}

export const api = {
  get:    (path)       => request('GET',    path),
  post:   (path, body) => request('POST',   path, body),
  put:    (path, body) => request('PUT',    path, body),
  patch:  (path, body) => request('PATCH',  path, body),
  delete: (path)       => request('DELETE', path),
  base:   () => BASE,
}
