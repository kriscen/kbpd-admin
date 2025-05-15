import pkg from '../../package.json'

export function projectSign(text: string, project?: string, version?: string) {
  const projectName = project || pkg.name
  const projectVersion = version || pkg.version

  return `${projectName}-${projectVersion}-${text}`
}

/**
 * 判断是否为 HTTP URL
 * @param url 要判断的 URL
 * @returns 如果 URL 以 http:// 或 https:// 开头，则返回 true，否则返回 false
 */
export function isHttpUrl(url: string) {
  return /^https?:\/\//.test(url)
}
