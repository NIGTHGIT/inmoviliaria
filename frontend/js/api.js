(() => {
  const API_BASE = `${window.location.origin}/api`;
  const getSessionId = () => localStorage.getItem('sessionId');
  const buildHeaders = (extra = {}, hasBody = false) => {
    const h = hasBody ? { 'Content-Type': 'application/json' } : {};
    const sid = getSessionId();
    if (sid) h['x-session-id'] = sid;
    return { ...h, ...extra };
  };
  const handleResponse = async (resp) => {
    const ct = resp.headers.get('content-type') || '';
    const payload = ct.includes('application/json') ? await resp.json() : await resp.text();
    if (!resp.ok) {
      const message = payload && payload.message ? payload.message : typeof payload === 'string' ? payload : `HTTP ${resp.status}`;
      throw { status: resp.status, message, data: payload };
    }
    return payload;
  };
  const withParams = (url, params) => {
    if (!params) return url;
    const usp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') usp.append(k, v);
    });
    const sep = url.includes('?') ? '&' : '?';
    const qs = usp.toString();
    return qs ? url + sep + qs : url;
  };
  const apiGet = async (path, opts = {}) => {
    const url = withParams(`${API_BASE}${path}`, opts.params);
    const resp = await fetch(url, { method: 'GET', headers: buildHeaders(opts.headers, false) });
    return handleResponse(resp);
  };
  const apiPost = async (path, body = {}, opts = {}) => {
    const resp = await fetch(`${API_BASE}${path}`, { method: 'POST', headers: buildHeaders(opts.headers, true), body: JSON.stringify(body) });
    return handleResponse(resp);
  };
  const apiPut = async (path, body = {}, opts = {}) => {
    const resp = await fetch(`${API_BASE}${path}`, { method: 'PUT', headers: buildHeaders(opts.headers, true), body: JSON.stringify(body) });
    return handleResponse(resp);
  };
  const apiDelete = async (path, opts = {}) => {
    const resp = await fetch(`${API_BASE}${path}`, { method: 'DELETE', headers: buildHeaders(opts.headers, false) });
    return handleResponse(resp);
  };
  window.api = { get: apiGet, post: apiPost, put: apiPut, delete: apiDelete, base: API_BASE, sessionId: getSessionId };
})();

