// Helper function to map Postgres codes to standard HTTP statuses
function getHttpStatus(pgCode: string): number {
  switch (pgCode) {
    case '42501': return 403 // RLS violation / Permission Denied
    case '23505': return 409 // Duplicate key / Conflict
    case '23503': return 400 // Foreign key violation / Bad Request
    case 'PGRST116': return 404 // .single() row not found
    default: return 500 // Generic server error fallback
  }
}