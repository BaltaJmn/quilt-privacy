// OG cards (1200 x 630): the title on the cream backing and a patch with a made-up year of habits
// (an illustration, not anyone's year). Renders with headless Chrome.
import { writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { YEAR } from './sheets.mjs'
import { COMPARE, HUB } from './compare.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
// [title, line under it] per card and language.
const CARDS = {
  print: { en: [`Habit Tracker ${YEAR}`, 'Free printables, A4 and US Letter'], es: [`Habit tracker ${YEAR}`, 'Plantillas gratis para imprimir'], pt: [`Planilha de hábitos ${YEAR}`, 'Modelos grátis para imprimir'] },
  maker: { en: ['Online habit tracker', 'Free, no sign-up'], es: ['Habit tracker online', 'Gratis, sin registro'], pt: ['Habit tracker online', 'Grátis, sem cadastro'] },
  hub: { en: [HUB.en.h1, 'Price, ads, accounts, platforms'], es: [HUB.es.h1, 'Precio, anuncios, cuenta, plataformas'] },
}
for (const [id, c] of Object.entries(COMPARE)) {
  CARDS[`vs-${id}`] = Object.fromEntries(Object.keys(c.path).map((l) => [l, [l === 'es' ? `Alternativa a ${c.others[0]}` : `${c.others[0]} alternative`, l === 'es' ? 'Quilt, comparada con datos' : 'Quilt, compared honestly']]))
}
const THREADS = ['#F0AFBE', '#A2C3E9', '#9CD3C7', '#D9AFE6']
let seed = 5
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
const grids = THREADS.map((t) => {
  let run = 0
  return `<div class="g">${Array.from({ length: 26 * 7 }, () => {
    run = rnd() < 0.09 ? 3 : Math.max(0, run - 1)
    return `<i${run ? '' : ` style="background:${t}"`}></i>`
  }).join('')}</div>`
}).join('')

mkdirSync(join(ROOT, 'qt/og'), { recursive: true })
const tmp = mkdtempSync(join(tmpdir(), 'qt-og-'))
for (const [kind, langs] of Object.entries(CARDS)) {
  for (const [lang, [title, sub]] of Object.entries(langs)) {
    const html = join(tmp, `${kind}-${lang}.html`)
    writeFileSync(html, `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Caprasimo;src:url("${join(ROOT, 'qt/caprasimo.woff2')}")}
@font-face{font-family:Roboto;src:url("${join(ROOT, 'tools/fonts/Roboto.ttf')}");font-weight:100 900}
html,body{margin:0;width:1200px;height:630px;background:#FBF8F3;font-family:Roboto;color:#2E2A24;overflow:hidden}
.t{position:absolute;left:72px;top:84px;width:520px}
h1{margin:0;font:400 66px/1.04 Caprasimo}
p{margin:26px 0 0;font-size:30px;color:#5E574B}
.brand{position:absolute;left:72px;bottom:60px;font-size:22px;color:#5E574B;display:flex;align-items:center;gap:12px}
.brand img{width:36px;height:36px}
.patch{position:absolute;right:56px;top:56px;width:480px;height:518px;background:#EDDC98;border-radius:22px;padding:40px 36px;box-sizing:border-box;display:grid;gap:22px;align-content:center}
.patch:after{content:'';position:absolute;inset:10px;border:2px dashed rgb(46 42 36/.4);border-radius:14px}
.g{display:grid;grid-template-columns:repeat(26,1fr);grid-template-rows:repeat(7,1fr);grid-auto-flow:column;gap:3px;height:84px}
.g i{border-radius:2px;background:rgb(251 248 243/.7)}
</style>
<div class="t"><h1>${title}</h1><p>${sub}</p></div>
<div class="brand"><img src="${join(ROOT, 'qt/icon.svg')}">Quilt: Habit Tracker &amp; Streaks</div>
<div class="patch">${grids}</div>`)
    const profile = mkdtempSync(join(tmpdir(), 'qt-chrome-'))
    execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--user-data-dir=${profile}`, '--window-size=1200,630',
      `--screenshot=${join(ROOT, `qt/og/${kind}-${lang}.png`)}`, `file://${html}`], { stdio: 'ignore' })
    rmSync(profile, { recursive: true, force: true })
  }
}
rmSync(tmp, { recursive: true, force: true })
console.log('og ok')
