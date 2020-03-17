import defaultSettings from '@/settings'

const title = defaultSettings.title || '瓦力助手'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
