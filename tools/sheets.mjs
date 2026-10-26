// Habit tracker printables: one SVG per language, layout and paper, drawn in millimetres.
// Writes the web previews (system font, Caprasimo embedded for the year), the PDFs (Roboto and Caprasimo,
// printed by headless Chrome so they stay vector) and anchors.json, the points the page labels on each sheet.
//
//   node tools/sheets.mjs            everything
//   node tools/sheets.mjs --svg      only the SVGs and anchors (no Chrome)
import { mkdirSync, writeFileSync, readFileSync, rmSync, mkdtempSync, statSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'qt')
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
export const YEAR = 2027

// Portrait sizes; the month layout turns the paper to landscape.
export const PAPER = { a4: { w: 210, h: 297 }, letter: { w: 215.9, h: 279.4 } }
export const LAYOUTS = ['year', 'month', 'chain']
export const landscape = (layout) => layout === 'month'
export const size = (layout, paper) => landscape(layout) ? { w: PAPER[paper].h, h: PAPER[paper].w } : PAPER[paper]
// Habits on the year sheet: as many 53 x 7 grids as the paper holds.
export const YEAR_HABITS = { a4: 6, letter: 5 }
export const MONTH_ROWS = 14

export const L = {
  en: {
    title: 'Habit Tracker',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    weekdays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'], // Sunday first
    habit: 'Habit', total: 'Total', why: 'Why it matters',
    done: 'Filled: done', skip: "Dot: skipped, it doesn't break the streak",
    file: { stem: 'habit-tracker', year: 'year', month: 'monthly', chain: 'one-habit', a4: 'a4', letter: 'letter' },
  },
  es: {
    title: 'Mis hábitos',
    months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    short: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    weekdays: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    habit: 'Hábito', total: 'Total', why: 'Por qué me importa',
    done: 'Relleno: hecho', skip: 'Punto: día saltado, no rompe la racha',
    file: { stem: 'habit-tracker', year: 'ano', month: 'mensual', chain: 'un-habito', a4: 'a4', letter: 'carta' },
  },
  pt: {
    title: 'Meus hábitos',
    months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    short: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    weekdays: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    habit: 'Hábito', total: 'Total', why: 'Por que importa',
    done: 'Pintado: feito', skip: 'Ponto: dia pulado, não quebra a sequência',
    file: { stem: 'habit-tracker', year: 'ano', month: 'mensal', chain: 'um-habito', a4: 'a4', letter: 'carta' },
  },
}

// Spain and the UK print on A4 and start the week on Monday; the US, Mexico and Brazil on Sunday.
export const mondayFirst = (lang, paper) => paper === 'a4' && lang !== 'pt'

export const pdfName = (lang, layout, paper) => {
  const f = L[lang].file
  return `${f.stem}-${YEAR}-${lang === 'en' ? '' : lang + '-'}${f[layout]}-${f[paper]}.pdf`
}

const daysIn = (y, m) => new Date(Date.UTC(y, m + 1, 0)).getUTCDate()
const r = (n) => Math.round(n * 100) / 100
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

const INK = '#2E2A24'
const MUTED = '#6F695E'
const LINE = '#B9B1A4'
const FAINT = '#DDD6CA'
const SHADE = '#F3EFE8'
const M = 14 // page margin
const HEAD = 22
const FOOT = 9

// The running stitch around each block: the quilt's seam, light enough to vanish in a photocopy.
const stitch = (x, y, w, h) => `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" rx="2" class="st"/>`
const weekIndex = (d, mon) => (mon ? (d + 6) % 7 : d) // column of a weekday, Monday or Sunday first

// Year: the app's own grid, 53 weeks by 7 days per habit, several habits per sheet.
function year(x0, y0, w, h, lang, paper, anchors) {
  const out = []
  const mon = mondayFirst(lang, paper)
  const n = YEAR_HABITS[paper]
  const labW = 5
  const pad = 3
  const first = weekIndex(new Date(Date.UTC(YEAR, 0, 1)).getUTCDay(), mon)
  const cols = Math.ceil((first + 365) / 7)
  const cp = (w - 2 * pad - labW) / cols
  // Blocks hug their grid; what the paper has left goes between them.
  const blockH = 10.2 + 7 * cp + pad
  const blockGap = (h - n * blockH) / (n - 1)
  const gap = Math.min(0.5, cp * 0.15)
  const c = cp - gap
  const wd = mon ? [...L[lang].weekdays.slice(1), L[lang].weekdays[0]] : L[lang].weekdays
  for (let b = 0; b < n; b++) {
    const by = y0 + b * (blockH + blockGap)
    out.push(stitch(x0, by, w, blockH))
    const nameY = by + 5.2
    out.push(`<text x="${r(x0 + pad)}" y="${r(nameY)}" class="lab">${esc(L[lang].habit)}</text>`)
    out.push(`<line x1="${r(x0 + pad + 16)}" y1="${r(nameY + 0.6)}" x2="${r(x0 + w - pad)}" y2="${r(nameY + 0.6)}" class="ln"/>`)
    const gy = by + 10.2
    const gx = x0 + pad + labW
    for (const i of mon ? [0, 2, 4, 6] : [1, 3, 5]) out.push(`<text x="${r(gx - 1.6)}" y="${r(gy + i * cp + c / 2 + 0.75)}" class="wd" text-anchor="end">${wd[i]}</text>`)
    for (let d = 0; d < 365; d++) {
      const date = new Date(Date.UTC(YEAR, 0, 1 + d))
      const i = first + d
      const x = gx + Math.floor(i / 7) * cp
      const y = gy + (i % 7) * cp
      const m = date.getUTCMonth()
      const day = date.getUTCDate()
      if (day === 1) out.push(`<text x="${r(x)}" y="${r(gy - 1.3)}" class="mo">${esc(L[lang].short[m])}</text>`)
      out.push(`<rect x="${r(x)}" y="${r(y)}" width="${r(c)}" height="${r(c)}" rx="0.5" class="c"/>`)
      if (b === 0 && d === 0) anchors.jan1 = [x + c / 2, y + c / 2]
      if (b === 0 && m === 3 && day === 1) anchors.monthStart = [x + c / 2, y + c / 2]
    }
    if (b === 0) anchors.habits = [x0 + w * 0.42, nameY]
  }
  return out.join('')
}

// Month: one landscape page per month, a row per habit, a column per day, weekends shaded.
function month(m, x0, y0, w, h, lang, paper, anchors) {
  const out = []
  const mon = mondayFirst(lang, paper)
  const nameW = 52
  const totW = 12
  const headH = 9
  const days = daysIn(YEAR, m)
  const cw = (w - nameW - totW) / 31
  const rh = (h - headH) / MONTH_ROWS
  const wd = L[lang].weekdays
  out.push(stitch(x0 - 2, y0 - 2, w + 4, h + 4))
  for (let d = 1; d <= days; d++) {
    const dow = new Date(Date.UTC(YEAR, m, d)).getUTCDay()
    const x = x0 + nameW + (d - 1) * cw
    if (dow === 0 || dow === 6) out.push(`<rect x="${r(x)}" y="${r(y0)}" width="${r(cw)}" height="${r(h)}" class="sh"/>`)
    out.push(`<text x="${r(x + cw / 2)}" y="${r(y0 + 3.6)}" class="dn">${d}</text>`)
    out.push(`<text x="${r(x + cw / 2)}" y="${r(y0 + 7.2)}" class="wd">${wd[dow]}</text>`)
  }
  out.push(`<text x="${r(x0 + 1)}" y="${r(y0 + 6)}" class="lab">${esc(L[lang].habit)}</text>`)
  out.push(`<text x="${r(x0 + w - totW / 2)}" y="${r(y0 + 6)}" class="lab" text-anchor="middle">${esc(L[lang].total)}</text>`)
  for (let i = 0; i <= MONTH_ROWS; i++) {
    const y = y0 + headH + i * rh
    out.push(`<line x1="${r(x0)}" y1="${r(y)}" x2="${r(x0 + w)}" y2="${r(y)}" class="${i === 0 ? 'ln2' : 'ln'}"/>`)
  }
  for (let d = 0; d <= days; d++) {
    const x = x0 + nameW + d * cw
    out.push(`<line x1="${r(x)}" y1="${r(y0 + headH)}" x2="${r(x)}" y2="${r(y0 + h)}" class="ln"/>`)
  }
  out.push(`<line x1="${r(x0 + w - totW)}" y1="${r(y0 + headH)}" x2="${r(x0 + w - totW)}" y2="${r(y0 + h)}" class="ln"/>`)
  if (m === 0) {
    anchors.days = [x0 + nameW + 9.5 * cw, y0 + 4]
    anchors.rows = [x0 + 10, y0 + headH + 5.5 * rh]
    anchors.total = [x0 + w - totW / 2, y0 + headH + 2.5 * rh]
  }
  void mon
  return out.join('')
}

// One habit, the whole year: twelve calendar months to fill in, the chain you don't want to break.
function chain(x0, y0, w, h, lang, paper, anchors) {
  const out = []
  const lineH = 18
  out.push(`<text x="${r(x0)}" y="${r(y0 + 5)}" class="lab">${esc(L[lang].habit)}</text>`)
  out.push(`<line x1="${r(x0 + 16)}" y1="${r(y0 + 5.6)}" x2="${r(x0 + w)}" y2="${r(y0 + 5.6)}" class="ln"/>`)
  out.push(`<text x="${r(x0)}" y="${r(y0 + 13)}" class="lab">${esc(L[lang].why)}</text>`)
  out.push(`<line x1="${r(x0 + 34)}" y1="${r(y0 + 13.6)}" x2="${r(x0 + w)}" y2="${r(y0 + 13.6)}" class="ln"/>`)
  anchors.line = [x0 + 40, y0 + 5]
  const top = y0 + lineH
  const cols = 3
  const rows = 4
  const gapX = 7
  const gapY = 6
  const bw = (w - gapX * (cols - 1)) / cols
  const bh = (h - lineH - gapY * (rows - 1)) / rows
  const mon = mondayFirst(lang, paper)
  const wd = mon ? [...L[lang].weekdays.slice(1), L[lang].weekdays[0]] : L[lang].weekdays
  const nameH = 6.5
  const wdH = 4.2
  const pad = 2.6
  const cellP = Math.min((bw - 2 * pad) / 7, (bh - nameH - wdH - pad) / 6)
  const gap = 0.9
  const c = cellP - gap
  for (let m = 0; m < 12; m++) {
    const bx = x0 + (m % cols) * (bw + gapX)
    const by = top + Math.floor(m / cols) * (bh + gapY)
    out.push(stitch(bx, by, bw, bh))
    const gx = bx + (bw - 7 * cellP + gap) / 2
    out.push(`<text x="${r(gx)}" y="${r(by + 5)}" class="mon">${esc(L[lang].months[m])}</text>`)
    for (let i = 0; i < 7; i++) out.push(`<text x="${r(gx + i * cellP + c / 2)}" y="${r(by + nameH + 3)}" class="wd">${wd[i]}</text>`)
    const offset = weekIndex(new Date(Date.UTC(YEAR, m, 1)).getUTCDay(), mon)
    for (let d = 1; d <= daysIn(YEAR, m); d++) {
      const i = offset + d - 1
      const x = gx + (i % 7) * cellP
      const y = by + nameH + wdH + Math.floor(i / 7) * cellP
      out.push(`<rect x="${r(x)}" y="${r(y)}" width="${r(c)}" height="${r(c)}" rx="0.8" class="c"/>`)
      out.push(`<text x="${r(x + 0.8)}" y="${r(y + 2.2)}" class="cd">${d}</text>`)
      if (m === 0 && d === 1) anchors.jan1 = [x + c / 2, y + c / 2]
    }
    if (m === 0) anchors.weekdays = [gx + 0.5 * cellP, by + nameH + 2]
  }
  return out.join('')
}

const CAPRASIMO = `data:font/woff2;base64,${readFileSync(join(ROOT, 'qt/caprasimo.woff2')).toString('base64')}`

// One sheet. The month layout returns twelve pages; the others one.
export function sheet({ lang, layout, paper, font }) {
  const { w, h } = size(layout, paper)
  const anchors = {}
  const top = M + HEAD
  const bottom = h - M - FOOT
  const family = font === 'roboto' ? 'Roboto, sans-serif' : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, system-ui, sans-serif'
  const legend = `<g transform="translate(${M} ${r(h - M - 3.2)})"><rect x="0" y="-2.4" width="3" height="3" rx="0.5" class="c d"/><text x="4.4" y="0.2" class="ft">${esc(L[lang].done)}</text>
<rect x="${r(6 + L[lang].done.length * 1.25)}" y="-2.4" width="3" height="3" rx="0.5" class="c"/><circle cx="${r(7.5 + L[lang].done.length * 1.25)}" cy="-0.9" r="0.55" class="dot"/><text x="${r(10.4 + L[lang].done.length * 1.25)}" y="0.2" class="ft">${esc(L[lang].skip)}</text></g>`
  const page = (body, heading) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}mm" height="${h}mm" viewBox="0 0 ${w} ${h}" font-family='${family}'>
<style>
@font-face{font-family:Caprasimo;src:url(${CAPRASIMO}) format("woff2")}
text{fill:${INK};font-variant-numeric:tabular-nums}
.yr{font-family:Caprasimo;font-size:15px}
.mh{font-family:Caprasimo;font-size:11px}
.tt{font-size:3.4px;font-weight:600;letter-spacing:0.2px}
.lab{font-size:2.7px;font-weight:600;fill:${MUTED}}
.mo{font-size:2.1px;font-weight:600;fill:${MUTED}}
.mon{font-size:2.8px;font-weight:700}
.wd{font-size:1.9px;font-weight:600;text-anchor:middle;fill:${MUTED}}
.dn{font-size:2.3px;font-weight:600;text-anchor:middle}
.cd{font-size:1.6px;fill:${MUTED}}
.ft{font-size:2.3px;fill:${MUTED}}
.c{fill:#fff;stroke:${LINE};stroke-width:0.2}
.c.d{fill:${LINE}}
.dot{fill:${INK}}
.sh{fill:${SHADE}}
.ln{stroke:${FAINT};stroke-width:0.25}
.ln2{stroke:${LINE};stroke-width:0.3}
.st{fill:none;stroke:${LINE};stroke-width:0.3;stroke-dasharray:1.4 1}
</style>
<rect width="${w}" height="${h}" fill="#fff"/>
${heading}
${body}
${legend}
<text x="${w - M}" y="${h - M + 0.2}" class="ft" text-anchor="end">Quilt: Habit Tracker  .  quilt.baltajmn.dev</text>
</svg>`
  const head = (big, small) => `<text x="${M - 0.6}" y="${M + 13}" class="${big === String(YEAR) ? 'yr' : 'mh'}">${esc(big)}</text>
<text x="${w - M}" y="${M + 12.5}" class="tt" text-anchor="end">${esc(small)}</text>`
  let pages
  if (layout === 'year') pages = [page(year(M, top, w - 2 * M, bottom - top, lang, paper, anchors), head(String(YEAR), L[lang].title))]
  else if (layout === 'chain') pages = [page(chain(M, top, w - 2 * M, bottom - top, lang, paper, anchors), head(String(YEAR), L[lang].title))]
  else pages = L[lang].months.map((name, m) => page(month(m, M + 2, top + 2, w - 2 * M - 4, bottom - top - 4, lang, paper, anchors), head(name, `${L[lang].title}  ${YEAR}`)))
  for (const k in anchors) anchors[k] = [r((anchors[k][0] / w) * 100), r((anchors[k][1] / h) * 100)]
  return { pages, anchors }
}

function chrome(args) {
  const profile = mkdtempSync(join(tmpdir(), 'qt-chrome-'))
  try {
    execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--user-data-dir=${profile}`, ...args], { stdio: 'ignore' })
  } finally {
    rmSync(profile, { recursive: true, force: true })
  }
}

function printable(pages, layout, paper) {
  const { w, h } = size(layout, paper)
  return `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Roboto;src:url("${join(ROOT, 'tools/fonts/Roboto.ttf')}");font-weight:100 900}
@page{size:${w}mm ${h}mm;margin:0}html,body{margin:0}svg{display:block;width:${w}mm;height:${h}mm;break-after:page}
</style>${pages.join('\n')}`
}

// Only when run, not when build.mjs or og.mjs import the shared names.
if (process.argv[1] === fileURLToPath(import.meta.url)) generate()

function generate() {
  const svgOnly = process.argv.includes('--svg')
  mkdirSync(join(OUT, 'sheets'), { recursive: true })
  mkdirSync(join(OUT, 'pdf'), { recursive: true })
  const tmp = mkdtempSync(join(tmpdir(), 'qt-'))
  const anchors = {}
  const sizes = {}
  for (const lang of Object.keys(L)) {
    for (const layout of LAYOUTS) {
      for (const paper of Object.keys(PAPER)) {
        const web = sheet({ lang, layout, paper, font: 'system' })
        writeFileSync(join(OUT, 'sheets', `${lang}-${layout}-${paper}.svg`), web.pages[0])
        anchors[`${lang}-${layout}-${paper}`] = web.anchors
        if (svgOnly) continue
        const { pages } = sheet({ lang, layout, paper, font: 'roboto' })
        const html = join(tmp, `${lang}-${layout}-${paper}.html`)
        writeFileSync(html, printable(pages, layout, paper))
        const pdf = join(OUT, 'pdf', pdfName(lang, layout, paper))
        chrome(['--no-pdf-header-footer', `--print-to-pdf=${pdf}`, `file://${html}`])
        sizes[pdfName(lang, layout, paper)] = statSync(pdf).size
        if (paper === 'a4') {
          // A4 at 150 dpi (landscape for the month), for sharing and the OG cards.
          const px = landscape(layout) ? [1754, 1240] : [1240, 1754]
          const one = join(tmp, `${lang}-${layout}-one.html`)
          writeFileSync(one, printable(pages.slice(0, 1), layout, paper).replace(/svg\{display:block;width:[^;]+;height:[^;]+;/, 'svg{display:block;width:100vw;height:auto;'))
          chrome([`--window-size=${px[0]},${px[1]}`, `--screenshot=${join(OUT, 'sheets', `${lang}-${layout}.png`)}`, `file://${one}`])
        }
      }
    }
  }
  writeFileSync(join(OUT, 'sheets', 'anchors.json'), JSON.stringify(anchors, null, 1) + '\n')
  if (!svgOnly) writeFileSync(join(OUT, 'pdf', 'sizes.json'), JSON.stringify(sizes, null, 1) + '\n')
  rmSync(tmp, { recursive: true, force: true })
  console.log(svgOnly ? 'svg ok' : `ok: ${Object.keys(sizes).length} pdf`)
}
