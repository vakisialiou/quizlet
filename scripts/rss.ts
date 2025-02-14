import path from 'path'
import RSS from 'rss'
import fs from 'fs'


async function generateRSS(locale: string) {
  const translations = (await import(`../i18n/locales/${locale}.json`)).default.Landing
  const i18n = (key: string) => {
    return (translations[key] || '').replace(/<br\s?\/>/g, '')
  }

  const feed = new RSS({
    language: locale,
    title: i18n('metaTitle'),
    description: i18n('metaDescription'),
    site_url: `https://quizerplay.com/${locale}`,
    feed_url: "https://quizerplay.com/rss",
  })

  const turboContent = `
    <h2>${i18n('section2Head2')}</h2>
    <figure>
      <img src="https://quizerplay.com/_next/image?url=%2Fimages%2Fdemo%2Fsections.webp&w=750&q=75" />
      <figcaption>${i18n('section0Block2Title')}</figcaption>
    </figure>
  `

  feed.item({
    title: i18n('mainTitle'),
    url: `https://quizerplay.com/${locale}`,
    description: i18n('mainDesc1'),
    date: new Date(),
    custom_elements: [
      { "turbo:content": { _cdata: turboContent } },
    ],
  })

  const xml = feed.xml({ indent: true })
    .replace(/<item>/g, '<item turbo="true">')
    .replace(/<language>(.*)<\/language>/g, `<language>${locale}</language>`)
    .replace(/<atom:link[^>]*>/g, '')

  const outputDir =  path.join(process.cwd(), "public/rss/turbo")
  fs.mkdirSync(outputDir, { recursive: true })

  const outputPath = path.join(outputDir, `${locale}.xml`)
  fs.writeFileSync(outputPath, xml)
  return outputPath
}

async function generateAllRSS(locales: string[]) {
  for (let locale of locales) {
    await generateRSS(locale)
  }
}

generateAllRSS(['ru', 'en']).then((outputPath) => {
  console.log("✅ RSS-лента сгенерирована:", outputPath)
})
