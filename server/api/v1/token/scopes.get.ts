import { PAT_SCOPES } from '~~/server/utils/token'

/**
 * 获取可用的 PAT scope 列表
 * GET /api/v1/token/scopes
 */
export default defineStandardResponseHandler(async () => {
  const scopes = Object.entries(PAT_SCOPES).map(([key, value]) => ({
    key,
    label: value.label,
    paths: value.paths,
  }))

  return { scopes }
})
