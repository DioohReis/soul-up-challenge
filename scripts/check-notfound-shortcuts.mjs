// Regression check: the 404 page must offer shortcuts to Painel, Experiência and FAQ,
// and every shortcut must point to a route that App.tsx declares.
import { readFileSync } from 'node:fs'
import { createServer } from 'vite'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'

const server = await createServer({
  root: process.cwd(),
  appType: 'custom',
  logLevel: 'silent',
  server: { middlewareMode: true, hmr: false },
})

try {
  const { NotFound } = await server.ssrLoadModule('/src/pages/NotFound.tsx')
  const html = renderToStaticMarkup(
    React.createElement(MemoryRouter, { initialEntries: ['/pagina-que-nao-existe'] },
      React.createElement(NotFound)),
  )

  const appSource = readFileSync('src/App.tsx', 'utf8')
  const declaredRoutes = [...appSource.matchAll(/path="([^"]+)"/g)].map(match => match[1])

  const expected = [
    { href: '/painel', label: 'Painel' },
    { href: '/experiencia', label: 'Experiência' },
    { href: '/faq', label: 'FAQ' },
  ]

  for (const { href, label } of expected) {
    const link = new RegExp(`<a[^>]*href="${href}"[^>]*>${label}</a>`)
    if (!link.test(html)) {
      throw new Error(`Missing 404 shortcut "${label}" linking to ${href}`)
    }
    if (!declaredRoutes.includes(href)) {
      throw new Error(`Shortcut ${href} has no matching route in src/App.tsx`)
    }
  }

  console.log('404 shortcuts OK: Painel, Experiência, FAQ render and resolve to declared routes')
} finally {
  await server.close()
}
