// ============ 辅助函数 ============
// 从文件名提取扩展名
export function getFileExtension(fileName: string): string {
  const match = fileName.match(/\.([^.]+)$/)
  return match ? match[0] : ''
}

// 从文件名提取基础名（不含扩展名）
export function getBaseName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, '')
}

// 获取 Monaco Editor 语言标识符
export function getMonacoLanguage(fileName: string): string {
  const ext = getFileExtension(fileName).toLowerCase()
  const languageMap: Record<string, string> = {
    '.py': 'python',
    '.tsx': 'typescript',
    '.ts': 'typescript',
    '.jsx': 'javascript',
    '.js': 'javascript',
    '.json': 'json',
    '.md': 'markdown',
    '.css': 'css',
    '.html': 'html',
    '.yml': 'yaml',
    '.yaml': 'yaml',
  }
  return languageMap[ext] || 'plaintext'
}
