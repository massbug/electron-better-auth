import React from 'react'
import {
  DiCss3,
  DiDocker,
  DiGit,
  DiGo,
  DiHtml5,
  DiJava,
  DiJavascript1,
  DiMysql,
  DiPhp,
  DiPython,
  DiReact,
  DiRuby,
  DiRust,
  DiSass,
  DiSwift,
} from 'react-icons/di'

const extensionToIcon: Record<string, React.ComponentType<any>> = {
  // JavaScript / TypeScript
  js: DiJavascript1,
  jsx: DiReact,
  tsx: DiReact,
  ts: DiJavascript1,
  // Python
  py: DiPython,
  // 其他主流语言
  java: DiJava,
  go: DiGo,
  rs: DiRust,
  php: DiPhp,
  rb: DiRuby,
  swift: DiSwift,
  // Web 前端
  html: DiHtml5,
  htm: DiHtml5,
  css: DiCss3,
  scss: DiSass,
  sass: DiSass,
  less: DiCss3,
  // 配置文件 / 数据格式
  json: DiJavascript1,
  md: DiReact,
  sql: DiMysql,
}

// 特殊文件名匹配（无扩展名或特殊规则）
const filenameToIcon: Record<string, React.ComponentType<any>> = {
  'dockerfile': DiDocker,
  'docker-compose.yml': DiDocker,
  'docker-compose.yaml': DiDocker,
  '.gitignore': DiGit,
  '.gitattributes': DiGit,
  '.dockerignore': DiDocker,
  'makefile': DiGo, // 示例
}

interface FileIconProps {
  extension?: string // 如 '.ts' 或 'ts'
  filename?: string // 完整文件名，如 'Dockerfile'
  size?: number | string
  className?: string
}

export const FileIcon: React.FC<FileIconProps> = ({
  extension = '',
  filename = '',
  size = 16,
  className,
}) => {
  let IconComponent: React.ComponentType<any> | undefined

  // 优先匹配完整文件名（转小写）
  if (filename) {
    const lowerFilename = filename.toLowerCase()
    IconComponent = filenameToIcon[lowerFilename]
  }

  // 如果文件名没匹配到，再尝试扩展名
  if (!IconComponent && extension) {
    const ext = extension.replace(/^\./, '').toLowerCase()
    IconComponent = extensionToIcon[ext]
  }

  // 如果都没匹配到，返回 null
  if (!IconComponent) {
    return null
  }

  return <IconComponent size={size} className={className} aria-hidden="true" />
}
