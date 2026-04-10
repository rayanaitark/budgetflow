const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  })

  let data = null
  try {
    data = await response.json()
  } catch {
    // response without json
  }

  if (!response.ok) {
    throw new Error(data?.message || 'Request failed')
  }

  return data
}

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value)
    }
  }

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const api = {
  get: (path, params) => request(`${path}${buildQuery(params)}`),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' })
}
