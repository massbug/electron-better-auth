import { useNavigate } from '@tanstack/react-router'

export function useFileActions() {
  const navigate = useNavigate()

  const navigateToFile = (fileId: string) => {
    navigate({
      to: '/files/$fileId',
      params: { fileId },
    })
  }

  return {
    navigateToFile,
  }
}
