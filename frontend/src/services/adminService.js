import { apiClient } from './api.js'

function unwrap(response) {
  if (!response.success) throw new Error(response.message || 'Admin request failed')
  return response
}

export async function loginAdmin(password) {
  return unwrap(await apiClient.post('/admin/login', { password })).data
}

export async function logoutAdmin() {
  return unwrap(await apiClient.post('/admin/logout', {})).data
}

export async function fetchAdminSession() {
  return unwrap(await apiClient.get('/admin/session')).data
}

export async function fetchAdminResources() {
  return unwrap(await apiClient.get('/admin/resources')).data || []
}

export async function fetchAdminRows(resource, params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value))
  })

  const suffix = query.toString() ? `?${query.toString()}` : ''
  const response = unwrap(await apiClient.get(`/admin/${resource}${suffix}`))
  return {
    rows: response.data || [],
    pagination: response.pagination,
  }
}

export async function createAdminRow(resource, data) {
  return unwrap(await apiClient.post(`/admin/${resource}`, data)).data
}

export async function updateAdminRow(resource, id, data) {
  return unwrap(await apiClient.put(`/admin/${resource}/${encodeURIComponent(id)}`, data)).data
}

export async function deleteAdminRow(resource, id) {
  return unwrap(await apiClient.delete(`/admin/${resource}/${encodeURIComponent(id)}`)).data
}

export async function restoreArchivedRow(archiveId) {
  return unwrap(await apiClient.post(`/admin/archive/${encodeURIComponent(archiveId)}/restore`, {})).data
}

export async function permanentlyDeleteArchivedRow(archiveId) {
  return unwrap(await apiClient.delete(`/admin/archive/${encodeURIComponent(archiveId)}/permanent`)).data
}

export async function importAdminCsv(resource, { filename, csvText }) {
  return unwrap(await apiClient.post(`/admin/${resource}/import-csv`, { filename, csvText })).data
}
