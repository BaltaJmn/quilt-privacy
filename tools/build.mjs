// Builds the Quilt web pages: habit tracker printables and online tracker (en, es, pt), the comparison
// pages and their index (en, es), sitemap.xml and robots.txt. The privacy policy (index.html) and the terms
// are hand-written and keep their URLs. The pages are plain files committed to the repo; run this after
// changing a text here or in compare.mjs.
//
//   node tools/sheets.mjs && node tools/build.mjs && node tools/og.mjs && node tools/check.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { YEAR, PAPER, LAYOUTS, landscape, size, pdfName, mondayFirst } from './sheets.mjs'
import { COMPARE, CHECKED, HUB } from './compare.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://quilt.baltajmn.dev'
const ANCHORS = JSON.parse(readFileSync(join(ROOT, 'qt/sheets/anchors.json'), 'utf8'))
const SIZES = JSON.parse(readFileSync(join(ROOT, 'qt/pdf/sizes.json'), 'utf8'))
const TODAY = new Date().toISOString().slice(0, 10)
// Cloudflare and browsers keep CSS and JS for a while: the URL changes when the file does.
const v = (p) => `${p}?v=${createHash('md5').update(readFileSync(join(ROOT, p))).digest('hex').slice(0, 8)}`

// Campaign tokens: the app has no analytics, so the stores are the only place a web install shows up.
const APPLE_PT = '129564006' // provider ID of the developer account, as App Store Connect puts it in its campaign links
const play = (c) => `https://play.google.com/store/apps/details?id=com.baltajmn.habit&referrer=${encodeURIComponent(`utm_source=quilt.baltajmn.dev&utm_medium=web&utm_campaign=${c}`)}`
const apple = (c) => `https://apps.apple.com/app/apple-store/id6819302953?pt=${APPLE_PT}&ct=${c}&mt=8`

const PAGES = {
  print: { en: '/habit-tracker/', es: '/es/habit-tracker-para-imprimir/', pt: '/pt/planilha-de-habitos/' },
  maker: { en: '/online-habit-tracker/', es: '/es/habit-tracker-online/', pt: '/pt/habit-tracker-online/' },
  hub: { en: HUB.en.path, es: HUB.es.path },
}
const LOCALE = { en: 'en_US', es: 'es_ES', pt: 'pt_BR' }
const LANG_NAME = { en: 'English', es: 'Español', pt: 'Português' }
// The habit colors of the app, as threads on a day square: the same in light and dark.
const THREADS = ['#F0AFBE', '#F5C39B', '#EDDC98', '#B6D6AB', '#9CD3C7', '#A2C3E9', '#B4B8EC', '#D9AFE6']

const T = {
  en: {
    print: {
      title: `Printable Habit Tracker ${YEAR}: Free PDF, A4 and US Letter`,
      desc: `Free ${YEAR} habit tracker printables: the whole year for several habits, month by month, or one habit all year. PDF in A4 and US Letter, no sign-up.`,
      h1: 'Habit Tracker',
      lede: `Three free habit tracker printables for ${YEAR}. Every day is a square: fill it in when you did the habit, put a dot when you skipped it on purpose. By December the whole year is on one sheet.`,
      layout: 'Layout',
      layouts: { year: 'Year at a glance', month: 'Month by month', chain: 'One habit, all year' },
      paper: 'Paper',
      papers: { a4: 'A4', letter: 'US Letter' },
      download: 'Download PDF',
      meta: (pages, kb) => `${pages === 1 ? '1 page' : `${pages} pages`}, ${kb} KB. Print at 100%.`,
      alt: (l, p) => `Preview of the ${YEAR} habit tracker printable: ${l}, ${p}`,
      notes: {
        year: [['habits', { a4: 'Six habits, a year grid each', letter: 'Five habits, a year grid each' }], ['jan1', `January 1, ${YEAR} is a Friday`], ['monthStart', 'Each label marks where its month begins']],
        month: [['days', 'Every day numbered, weekends shaded'], ['rows', '14 rows, one habit each'], ['total', 'Count the month here']],
        chain: [['line', 'Write the habit and why it matters'], ['weekdays', { a4: 'Weeks start on Monday', letter: 'Weeks start on Sunday' }], ['jan1', 'A square a day, a dot when you skip']],
      },
      makerH: 'Prefer to tick it on screen?',
      makerP: 'The online tracker works like the sheet: a row for each habit, a square for each day. Tap once for done, twice for skipped, and come back tomorrow: it stays saved in this browser.',
      makerBtn: 'Open the online tracker',
      mini: ['Read', 'Walk', 'Water', 'Stretch'],
      miniNote: 'Two weeks in the online tracker',
      appH: 'Or keep the quilt on your phone',
      appP1: 'Quilt is a habit tracker built on this same grid. Each habit is a full year of squares, so you see the month you slipped and the weeks you did not.',
      appP2: 'Skipped days (ill, away, resting) do not break the streak. No account and no ads; free for 3 habits, with every widget.',
      appAlt: 'Quilt on iPhone: five habits, each with its year of squares',
      ideasH: `Habit ideas for ${YEAR}`,
      ideasP: 'Start with two or three. A habit you can still do on a bad day lasts longer than a big one.',
      ideas: [
        ['rose', 'Health', ['Drink 8 glasses of water', 'Vitamins', 'In bed by 11', 'No phone at dinner']],
        ['peach', 'Move', ['8,000 steps', 'Stretch 10 minutes', 'Workout', 'Take the stairs']],
        ['sky', 'Learn', ['Read 10 pages', 'Practice a language', 'Practice an instrument', 'One lesson']],
        ['lilac', 'Mind', ['Journal 3 lines', 'Meditate 5 minutes', 'One good thing today', 'Screens off at 10']],
        ['butter', 'Home and money', ['Make the bed', 'Tidy 10 minutes', 'Write down what you spend', 'Cook at home']],
        ['mint', 'People', ['Call or text someone', 'Say thank you', 'Walk the dog', 'Plan something nice', 'Read to the kids']],
      ],
      stepsH: 'How to use a habit tracker',
      steps: [
        ['Pick two or three habits', 'Small enough to do on a bad day. Write them on the sheet, one per row or grid.'],
        ['Fill a square each evening', 'Same time every day. Keep the sheet where you will see it: on the fridge, by the bed.'],
        ['A dot for a skipped day', 'Ill, travelling, a planned rest: a dot says you skipped it on purpose. It does not break the streak.'],
        ['Look back once a month', 'Count the squares. Empty runs show what got in the way; the full weeks show what worked.'],
      ],
      filesH: `All the ${YEAR} printables`,
      filesP: 'Free to print for yourself, your class or your family. PDF, ready for A4 or US Letter.',
    },
    maker: {
      title: 'Free Online Habit Tracker: Tick Your Days, No Sign-Up',
      desc: 'A free online habit tracker: a row for each habit, a square for each day. Tap for done, again for skipped. No sign-up, saved only in your browser.',
      h1: 'Online habit tracker',
      howH: 'How it works',
      how: [
        ['A tap a day', 'Tap a square once for done and twice for skipped; a third tap clears it. Skipped days do not break the streak.'],
        ['It stays in this browser', "Nothing is uploaded and there's no account. Your habits are saved on this device, in this browser, until you delete them or clear your browsing data."],
        ['See the year, export it', 'The Year view shows each habit as a full year of squares. Export PNG draws it on white, ready to share or print.'],
      ],
      paperLink: `Prefer paper? Print the ${YEAR} habit trackers`,
      appH: 'Want it on your phone?',
      appP: 'Quilt keeps the same year grids on your phone, with home screen widgets and a reminder for each habit.',
    },
    ui: {
      prevM: 'Previous month', nextM: 'Next month', prevY: 'Previous year', nextY: 'Next year',
      month: 'Month', year: 'Year', export: 'Export PNG', add: 'Add a habit', today: 'Today',
      total: 'Total', edit: 'Edit habit', name: 'Name', color: 'Color', save: 'Done', remove: 'Delete habit',
      confirmRemove: 'Delete "{name}" and every day ticked for it?',
      done: 'done', skipped: 'skipped', empty: 'not marked',
      streak: (n) => `${n}-day streak`, count: (n) => `${n} ${n === 1 ? 'day' : 'days'} done`,
      hint: 'Tap a square: once for done, twice for skipped, three times to clear.',
      yearHint: 'The year view is for looking. To mark days, open Month or tap the name of a month.',
      help: 'Keyboard: arrow keys move, Enter or Space marks the day.',
      saved: 'Saved in this browser only. Clearing your browsing data erases it.',
      noStorage: "This browser isn't saving: export a PNG before you leave.",
      starters: ['Read', 'Walk', 'Drink water'],
      untitled: 'New habit',
      sheetTitle: 'Habit Tracker',
      file: 'habit-tracker',
      openMonth: (m) => `Open ${m}`,
    },
    nav: { print: 'Printables', maker: 'Online tracker', hub: 'Alternatives', privacy: 'Privacy', terms: 'Terms' },
    footer: 'Quilt: Habit Tracker & Streaks, by Baltasar Jiménez.',
  },
  es: {
    print: {
      title: `Habit tracker ${YEAR} para imprimir: plantilla PDF gratis`,
      desc: `Plantillas gratis de habit tracker ${YEAR} para imprimir: el año entero de varios hábitos, mes a mes o un hábito todo el año. PDF en A4 y carta, sin registro.`,
      h1: 'Habit tracker',
      lede: `Tres plantillas gratis para registrar tus hábitos en ${YEAR}. Cada día es un cuadrado: lo rellenas si cumpliste el hábito y le pones un punto si lo saltaste a propósito. En diciembre tienes el año entero en una hoja.`,
      layout: 'Diseño',
      layouts: { year: 'El año de un vistazo', month: 'Mes a mes', chain: 'Un hábito todo el año' },
      paper: 'Papel',
      papers: { a4: 'A4', letter: 'Carta' },
      download: 'Descargar PDF',
      meta: (pages, kb) => `${pages === 1 ? '1 página' : `${pages} páginas`}, ${kb} KB. Imprime al 100 %.`,
      alt: (l, p) => `Vista previa de la plantilla de hábitos ${YEAR}: ${l}, ${p}`,
      notes: {
        year: [['habits', { a4: 'Seis hábitos, una rejilla del año cada uno', letter: 'Cinco hábitos, una rejilla del año cada uno' }], ['jan1', `El 1 de enero de ${YEAR} es viernes`], ['monthStart', 'Cada etiqueta marca dónde empieza su mes']],
        month: [['days', 'Cada día numerado, fines de semana sombreados'], ['rows', '14 filas, una por hábito'], ['total', 'Aquí cuentas el mes']],
        chain: [['line', 'Escribe el hábito y por qué te importa'], ['weekdays', { a4: 'La semana empieza en lunes', letter: 'La semana empieza en domingo' }], ['jan1', 'Un cuadrado al día, un punto si lo saltas']],
      },
      makerH: '¿Prefieres marcarlo en pantalla?',
      makerP: 'El habit tracker online funciona como la hoja: una fila por hábito y un cuadrado por día. Toca una vez para hecho, dos para saltado, y vuelve mañana: se queda guardado en este navegador.',
      makerBtn: 'Abrir el habit tracker online',
      mini: ['Leer', 'Pasear', 'Agua', 'Estirar'],
      miniNote: 'Dos semanas en el habit tracker online',
      appH: 'O lleva la colcha en el móvil',
      appP1: 'Quilt es una app de hábitos hecha sobre esta misma rejilla. Cada hábito es un año entero de cuadrados: ves el mes en que flojeaste y las semanas en que no.',
      appP2: 'Los días saltados (enfermo, de viaje, descansando) no rompen la racha. Sin cuenta y sin anuncios; gratis con 3 hábitos y todos los widgets.',
      appAlt: 'Quilt en el iPhone: cinco hábitos, cada uno con su año de cuadrados',
      ideasH: `Ideas de hábitos para ${YEAR}`,
      ideasP: 'Empieza con dos o tres. Un hábito que puedes cumplir hasta en un mal día dura más que uno grande.',
      ideas: [
        ['rose', 'Salud', ['Beber 8 vasos de agua', 'Vitaminas', 'En la cama a las 11', 'Sin móvil en la cena']],
        ['peach', 'Moverse', ['8.000 pasos', 'Estirar 10 minutos', 'Entrenar', 'Subir por las escaleras']],
        ['sky', 'Aprender', ['Leer 10 páginas', 'Practicar un idioma', 'Practicar un instrumento', 'Una clase']],
        ['lilac', 'Mente', ['Escribir 3 líneas', 'Meditar 5 minutos', 'Algo bueno de hoy', 'Pantallas fuera a las 10']],
        ['butter', 'Casa y dinero', ['Hacer la cama', 'Ordenar 10 minutos', 'Apuntar lo que gastas', 'Cocinar en casa']],
        ['mint', 'Personas', ['Llamar o escribir a alguien', 'Dar las gracias', 'Sacar al perro', 'Planear algo bonito', 'Leer con los peques']],
      ],
      stepsH: 'Cómo usar un habit tracker',
      steps: [
        ['Elige dos o tres hábitos', 'Pequeños, para cumplirlos hasta en un mal día. Escríbelos en la hoja, uno por fila o por rejilla.'],
        ['Rellena un cuadrado cada noche', 'A la misma hora. Deja la hoja donde la veas: en la nevera, junto a la cama.'],
        ['Un punto para un día saltado', 'Enfermo, de viaje, un descanso previsto: el punto dice que lo saltaste a propósito. No rompe la racha.'],
        ['Mira atrás una vez al mes', 'Cuenta los cuadrados. Los huecos enseñan qué se cruzó; las semanas llenas, qué funcionó.'],
      ],
      filesH: `Todas las plantillas de ${YEAR}`,
      filesP: 'Gratis para imprimir en casa, en clase o en familia. En PDF, listas para A4 o carta.',
    },
    maker: {
      title: 'Habit tracker online gratis: marca tus días sin registro',
      desc: 'Un habit tracker online y gratis: una fila por hábito, un cuadrado por día. Toca para hecho, otra vez para saltado. Sin registro, guardado solo en tu navegador.',
      h1: 'Habit tracker online',
      howH: 'Cómo funciona',
      how: [
        ['Un toque al día', 'Toca un cuadrado una vez para hecho y dos para saltado; el tercer toque lo borra. Los días saltados no rompen la racha.'],
        ['Se queda en este navegador', 'No se sube nada y no hay cuenta. Tus hábitos se guardan en este dispositivo, en este navegador, hasta que los borres tú o borres los datos de navegación.'],
        ['Mira el año y expórtalo', 'La vista Año enseña cada hábito como un año entero de cuadrados. Exportar PNG lo dibuja sobre blanco, para compartirlo o imprimirlo.'],
      ],
      paperLink: `¿Prefieres papel? Imprime las plantillas de ${YEAR}`,
      appH: '¿Lo quieres en el móvil?',
      appP: 'Quilt guarda las mismas rejillas del año en tu móvil, con widgets en la pantalla de inicio y un recordatorio para cada hábito.',
    },
    ui: {
      prevM: 'Mes anterior', nextM: 'Mes siguiente', prevY: 'Año anterior', nextY: 'Año siguiente',
      month: 'Mes', year: 'Año', export: 'Exportar PNG', add: 'Añadir un hábito', today: 'Hoy',
      total: 'Total', edit: 'Editar hábito', name: 'Nombre', color: 'Color', save: 'Listo', remove: 'Borrar hábito',
      confirmRemove: '¿Borrar "{name}" y todos sus días marcados?',
      done: 'hecho', skipped: 'saltado', empty: 'sin marcar',
      streak: (n) => `racha de ${n} ${n === 1 ? 'día' : 'días'}`, count: (n) => `${n} ${n === 1 ? 'día hecho' : 'días hechos'}`,
      hint: 'Toca un cuadrado: una vez para hecho, dos para saltado, tres para borrarlo.',
      yearHint: 'La vista Año es para mirar. Para marcar días, abre Mes o toca el nombre de un mes.',
      help: 'Teclado: las flechas te mueven, Intro o Espacio marca el día.',
      saved: 'Guardado solo en este navegador. Si borras los datos de navegación, se pierde.',
      noStorage: 'Este navegador no está guardando: exporta un PNG antes de salir.',
      starters: ['Leer', 'Pasear', 'Beber agua'],
      untitled: 'Hábito nuevo',
      sheetTitle: 'Mis hábitos',
      file: 'mis-habitos',
      openMonth: (m) => `Abrir ${m}`,
    },
    nav: { print: 'Plantillas', maker: 'Tracker online', hub: 'Alternativas', privacy: 'Privacidad', terms: 'Términos' },
    footer: 'Quilt: Habit Tracker & Streaks, de Baltasar Jiménez.',
  },
  pt: {
    print: {
      title: `Planilha de hábitos ${YEAR} para imprimir: PDF grátis`,
      desc: `Planilha de hábitos ${YEAR} grátis para imprimir (habit tracker): o ano inteiro de vários hábitos, mês a mês ou um hábito o ano todo. PDF em A4 e carta.`,
      h1: 'Planilha de hábitos',
      lede: `Três modelos grátis de habit tracker para ${YEAR}. Cada dia é um quadradinho: pinte quando cumprir o hábito e faça um ponto quando pular de propósito. Em dezembro, o ano inteiro cabe numa folha.`,
      layout: 'Modelo',
      layouts: { year: 'O ano numa folha', month: 'Mês a mês', chain: 'Um hábito o ano todo' },
      paper: 'Papel',
      papers: { a4: 'A4', letter: 'Carta' },
      download: 'Baixar PDF',
      meta: (pages, kb) => `${pages === 1 ? '1 página' : `${pages} páginas`}, ${kb} KB. Imprima em 100%.`,
      alt: (l, p) => `Prévia da planilha de hábitos ${YEAR}: ${l}, ${p}`,
      notes: {
        year: [['habits', { a4: 'Seis hábitos, uma grade do ano para cada', letter: 'Cinco hábitos, uma grade do ano para cada' }], ['jan1', `1º de janeiro de ${YEAR} é uma sexta-feira`], ['monthStart', 'Cada rótulo marca onde o mês começa']],
        month: [['days', 'Todos os dias numerados, fins de semana sombreados'], ['rows', '14 linhas, uma por hábito'], ['total', 'Some o mês aqui']],
        chain: [['line', 'Escreva o hábito e por que ele importa'], ['weekdays', { a4: 'A semana começa no domingo', letter: 'A semana começa no domingo' }], ['jan1', 'Um quadradinho por dia, um ponto quando pular']],
      },
      makerH: 'Prefere marcar na tela?',
      makerP: 'O habit tracker online funciona como a folha: uma linha por hábito, um quadradinho por dia. Toque uma vez para feito, duas para pulado, e volte amanhã: fica salvo neste navegador.',
      makerBtn: 'Abrir o habit tracker online',
      mini: ['Ler', 'Caminhar', 'Água', 'Alongar'],
      miniNote: 'Duas semanas no habit tracker online',
      appH: 'Ou leve a colcha no celular',
      appP1: 'O Quilt é um app de hábitos feito sobre esta mesma grade. Cada hábito é um ano inteiro de quadradinhos: você vê o mês em que vacilou e as semanas em que não.',
      appP2: 'Dias pulados (doente, viajando, descansando) não quebram a sequência. Sem conta e sem anúncios; grátis com 3 hábitos e todos os widgets.',
      appAlt: 'Quilt no iPhone: cinco hábitos, cada um com seu ano de quadradinhos',
      ideasH: `Ideias de hábitos para ${YEAR}`,
      ideasP: 'Comece com dois ou três. Um hábito que dá para cumprir até num dia ruim dura mais que um grande.',
      ideas: [
        ['rose', 'Saúde', ['Beber 8 copos de água', 'Vitaminas', 'Na cama às 23h', 'Sem celular no jantar']],
        ['peach', 'Movimento', ['8.000 passos', 'Alongar 10 minutos', 'Treinar', 'Ir pela escada']],
        ['sky', 'Aprender', ['Ler 10 páginas', 'Praticar um idioma', 'Praticar um instrumento', 'Uma aula']],
        ['lilac', 'Mente', ['Escrever 3 linhas', 'Meditar 5 minutos', 'Uma coisa boa de hoje', 'Telas desligadas às 22h']],
        ['butter', 'Casa e dinheiro', ['Arrumar a cama', 'Organizar 10 minutos', 'Anotar os gastos', 'Cozinhar em casa']],
        ['mint', 'Pessoas', ['Ligar ou mandar mensagem para alguém', 'Agradecer', 'Passear com o cachorro', 'Planejar algo legal', 'Ler com as crianças']],
      ],
      stepsH: 'Como usar uma planilha de hábitos',
      steps: [
        ['Escolha dois ou três hábitos', 'Pequenos, para cumprir até num dia ruim. Escreva na folha, um por linha ou por grade.'],
        ['Pinte um quadradinho toda noite', 'Sempre no mesmo horário. Deixe a folha onde você veja: na geladeira, perto da cama.'],
        ['Um ponto para um dia pulado', 'Doente, viajando, um descanso planejado: o ponto diz que você pulou de propósito. Não quebra a sequência.'],
        ['Olhe para trás uma vez por mês', 'Conte os quadradinhos. Os buracos mostram o que atrapalhou; as semanas cheias, o que funcionou.'],
      ],
      filesH: `Todos os modelos de ${YEAR}`,
      filesP: 'Grátis para imprimir em casa, na escola ou em família. Em PDF, prontos para A4 ou carta.',
    },
    maker: {
      title: 'Habit tracker online grátis: marque seus dias sem cadastro',
      desc: 'Um habit tracker online e grátis: uma linha por hábito, um quadradinho por dia. Toque para feito, de novo para pulado. Sem cadastro, salvo só no seu navegador.',
      h1: 'Habit tracker online',
      howH: 'Como funciona',
      how: [
        ['Um toque por dia', 'Toque num quadradinho uma vez para feito e duas para pulado; o terceiro toque apaga. Dias pulados não quebram a sequência.'],
        ['Fica neste navegador', 'Nada é enviado e não há conta. Seus hábitos ficam salvos neste aparelho, neste navegador, até você apagar ou limpar os dados de navegação.'],
        ['Veja o ano e exporte', 'A visão Ano mostra cada hábito como um ano inteiro de quadradinhos. Exportar PNG desenha tudo sobre fundo branco, pronto para compartilhar ou imprimir.'],
      ],
      paperLink: `Prefere papel? Imprima as planilhas de ${YEAR}`,
      appH: 'Quer no celular?',
      appP: 'O Quilt guarda as mesmas grades do ano no seu celular, com widgets na tela inicial e um lembrete para cada hábito.',
    },
    ui: {
      prevM: 'Mês anterior', nextM: 'Próximo mês', prevY: 'Ano anterior', nextY: 'Próximo ano',
      month: 'Mês', year: 'Ano', export: 'Exportar PNG', add: 'Adicionar um hábito', today: 'Hoje',
      total: 'Total', edit: 'Editar hábito', name: 'Nome', color: 'Cor', save: 'Pronto', remove: 'Apagar hábito',
      confirmRemove: 'Apagar "{name}" e todos os dias marcados?',
      done: 'feito', skipped: 'pulado', empty: 'sem marca',
      streak: (n) => `sequência de ${n} ${n === 1 ? 'dia' : 'dias'}`, count: (n) => `${n} ${n === 1 ? 'dia feito' : 'dias feitos'}`,
      hint: 'Toque num quadradinho: uma vez para feito, duas para pulado, três para apagar.',
      yearHint: 'A visão Ano é para olhar. Para marcar dias, abra Mês ou toque no nome de um mês.',
      help: 'Teclado: as setas se movem, Enter ou Espaço marca o dia.',
      saved: 'Salvo só neste navegador. Se você limpar os dados de navegação, ele se perde.',
      noStorage: 'Este navegador não está salvando: exporte um PNG antes de sair.',
      starters: ['Ler', 'Caminhar', 'Beber água'],
      untitled: 'Hábito novo',
      sheetTitle: 'Meus hábitos',
      file: 'meus-habitos',
      openMonth: (m) => `Abrir ${m}`,
    },
    nav: { print: 'Modelos', maker: 'Tracker online', hub: 'Alternativas', privacy: 'Privacidade', terms: 'Termos' },
    footer: 'Quilt: Habit Tracker & Streaks, de Baltasar Jiménez.',
  },
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const kb = (n) => Math.round(n / 1024)
const svgIcon = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`
const ICON = {
  download: svgIcon('<path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19.5h14"/>'),
  arrow: svgIcon('<path d="M5 12h14m0 0-5.5-5.5M19 12l-5.5 5.5"/>'),
  prev: svgIcon('<path d="m14.5 6-6 6 6 6"/>'),
  next: svgIcon('<path d="m9.5 6 6 6-6 6"/>'),
  plus: svgIcon('<path d="M12 5v14M5 12h14"/>'),
}

function head(lang, key, t, paths) {
  const url = SITE + paths[lang]
  const alts = Object.keys(paths).map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE + paths[l]}">`).join('\n')
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}">
<link rel="canonical" href="${url}">
${alts}
<link rel="alternate" hreflang="x-default" href="${SITE + paths.en}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Quilt">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(t.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/qt/og/${key}-${lang}.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${LOCALE[lang]}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#FBF8F3" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#17150F" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/qt/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/qt/icon-180.png">
<link rel="preload" href="/qt/caprasimo.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${v('/qt/qt.css')}">`
}

function header(lang, current, paths) {
  const t = T[lang]
  const langs = Object.keys(paths).map((l) =>
    `<a href="${paths[l]}" hreflang="${l}" lang="${l}"${l === lang ? ' aria-current="page"' : ''}><span aria-hidden="true">${l.toUpperCase()}</span><span class="sr">${LANG_NAME[l]}</span></a>`).join('')
  const link = (href, label, on) => `<a href="${href}"${on ? ' aria-current="page"' : ''}>${esc(label)}</a>`
  return `<header class="wrap top">
<a class="brand" href="${PAGES.print[lang]}"><img src="/qt/icon.svg" alt="" width="32" height="32">Quilt</a>
<nav aria-label="Quilt">
${link(PAGES.print[lang], t.nav.print, current === 'print')}
${link(PAGES.maker[lang], t.nav.maker, current === 'maker')}
${PAGES.hub[lang] ? link(PAGES.hub[lang], t.nav.hub, current === 'hub' || current.startsWith('vs-')) : ''}
</nav>
<span class="langs">${langs}</span>
</header>`
}

function stores(campaign) {
  return `<div class="stores">
<a class="btn" data-store="play" href="${esc(play(campaign))}">Google Play ${ICON.arrow}</a>
<a class="btn" data-store="apple" href="${esc(apple(campaign))}">App Store ${ICON.arrow}</a>
</div>`
}

// Each phone sees only its own store; a computer sees both.
const STORE_JS = `<script>(function(){var u=navigator.userAgent||"",a=/Android/i.test(u),i=/iPhone|iPad|iPod/i.test(u)||(/Macintosh/i.test(u)&&navigator.maxTouchPoints>1);document.querySelectorAll("[data-store]").forEach(function(e){if((a&&e.dataset.store==="apple")||(i&&e.dataset.store==="play"))e.hidden=true})})()</script>`

// A visitor who arrives with utm_* (a social post, a newsletter) takes that origin to the store instead of
// the page's own web campaign, so the consoles tell the channels apart. Values are cut to [a-z0-9_-], 40 chars.
const UTM_JS = `<script>(function(){var q=new URLSearchParams(location.search),c=function(v){return(v||"").toLowerCase().replace(/[^a-z0-9_-]/g,"").slice(0,40)},s=c(q.get("utm_source"));if(!s)return;var m=c(q.get("utm_medium"))||"referral",n=c(q.get("utm_campaign"))||"none";
document.querySelectorAll('[data-store="play"]').forEach(function(e){var x=new URL(e.href);x.searchParams.set("referrer","utm_source="+s+"&utm_medium="+m+"&utm_campaign="+n);e.href=x});
document.querySelectorAll('[data-store="apple"]').forEach(function(e){var x=new URL(e.href);x.searchParams.set("ct",(s+"-"+n).slice(0,40));e.href=x})})()</script>`

function footer(lang) {
  const t = T[lang]
  return `<footer><div class="wrap"><span>${esc(t.footer)}</span><nav aria-label="${esc(t.nav.privacy)}">
<a href="${PAGES.print[lang]}">${t.nav.print}</a><a href="${PAGES.maker[lang]}">${t.nav.maker}</a>${PAGES.hub[lang] ? `<a href="${PAGES.hub[lang]}">${t.nav.hub}</a>` : ''}<a href="/${lang === 'es' ? '#es' : ''}">${t.nav.privacy}</a><a href="/terms.html">${t.nav.terms}</a></nav></div></footer>`
}

const appJson = (lang) => ({
  '@type': 'MobileApplication',
  name: 'Quilt: Habit Tracker & Streaks',
  operatingSystem: 'Android, iOS',
  applicationCategory: 'LifestyleApplication',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  installUrl: play(`qt-ld-${lang}`),
  sameAs: ['https://play.google.com/store/apps/details?id=com.baltajmn.habit', 'https://apps.apple.com/app/id6819302953'],
})

const phone = (lang) => `<img class="phone" src="/qt/img/app-${lang === 'es' ? 'es' : 'en'}.webp" alt="${esc(T[lang].print.appAlt)}" width="720" height="1309" loading="lazy">`

// Two weeks of four habits in the online tracker: drawn from fixed marks, today is the 10th (the last day
// a phone shows).
const MINI = [
  ['rose', 'ddddsddddd'],
  ['sky', 'dd dd ddd '],
  ['mint', 'dddddddddd'],
  ['lilac', 'd s d dd d'],
]
function mini(lang) {
  const t = T[lang].print
  const tones = { rose: 0, sky: 5, mint: 4, lilac: 7 }
  const head = Array.from({ length: 14 }, (_, i) => `<span class="h${i >= 10 ? ' x' : ''}">${i + 1}</span>`).join('')
  const rows = MINI.map(([tone, marks], r) => `<span class="n">${esc(t.mini[r])}</span>${Array.from({ length: 14 }, (_, i) => {
    const m = marks[i]
    const cls = [m === 'd' ? 'd' : m === 's' ? 's' : '', i === 9 ? 'today' : '', i >= 10 ? 'x' : ''].filter(Boolean).join(' ')
    return `<i${cls ? ` class="${cls}"` : ''} style="--t:${THREADS[tones[tone]]}"></i>`
  }).join('')}`).join('')
  return `<div class="mini" role="img" aria-label="${esc(t.miniNote)}"><span></span>${head}${rows}</div>`
}

function printPage(lang) {
  const t = T[lang].print
  const notesFor = (layout, paper) => t.notes[layout].map(([a, text]) => {
    const [x, y] = ANCHORS[`${lang}-${layout}-${paper}`][a]
    return { x, y, text: typeof text === 'string' ? text : text[paper] }
  })
  const file = (layout, paper) => {
    const name = pdfName(lang, layout, paper)
    return { href: `/qt/pdf/${name}`, name, kb: kb(SIZES[name]) }
  }
  const data = {}
  for (const l of LAYOUTS) for (const p of Object.keys(PAPER)) {
    const f = file(l, p)
    const { w, h } = size(l, p)
    data[`${l}-${p}`] = { ...f, svg: `/qt/sheets/${lang}-${l}-${p}.svg`, notes: notesFor(l, p), alt: t.alt(t.layouts[l], t.papers[p]), ratio: `${w} / ${h}`, wide: landscape(l), meta: t.meta(l === 'month' ? 12 : 1, f.kb) }
  }
  const first = data['year-a4']
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      appJson(lang),
      {
        '@type': 'HowTo',
        name: t.stepsH,
        inLanguage: lang,
        tool: [{ '@type': 'HowToTool', name: 'Printer' }, { '@type': 'HowToTool', name: 'Pen' }],
        step: t.steps.map(([name, text], i) => ({ '@type': 'HowToStep', position: i + 1, name, text })),
      },
    ],
  }
  const seg = (name, legend, opts, checked) => `<fieldset class="seg"><legend>${esc(legend)}</legend><div class="opts">${Object.entries(opts).map(([val, label]) =>
    `<label><input type="radio" name="${name}" value="${val}"${val === checked ? ' checked' : ''}><span>${esc(label)}</span></label>`).join('')}</div></fieldset>`
  const pins = (notes) => notes.map((n, i) => `<span class="pin" style="--x:${n.x}%;--y:${n.y}%" aria-hidden="true">${i + 1}</span>`).join('')
  const strip = (notes) => notes.map((n) => `<li>${esc(n.text)}</li>`).join('')
  const ideas = t.ideas.map(([tone, name, list]) => `<li class="patch ${tone}"><h3>${esc(name)}</h3><ul>${list.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></li>`).join('\n')
  const files = LAYOUTS.map((l) => `<tr><td>${esc(t.layouts[l])}</td>${Object.keys(PAPER).map((p) => {
    const f = file(l, p)
    return `<td><a href="${f.href}" download="${f.name}">${esc(t.papers[p])}</a> <small>${f.kb} KB</small></td>`
  }).join('')}</tr>`).join('\n')
  return `${head(lang, 'print', t, PAGES.print)}
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
${header(lang, 'print', PAGES.print)}
<main>
<div class="wrap">
<section class="block hero">
<div class="patch butter">
<h1>${esc(t.h1)} <span class="numeral">${YEAR}</span></h1>
<p class="lede">${esc(t.lede)}</p>
<form id="pick">
${seg('layout', t.layout, t.layouts, 'year')}
${seg('paper', t.paper, t.papers, 'a4')}
<div class="dl">
<a class="btn primary" id="dl" href="${first.href}" download="${first.name}">${ICON.download}${esc(t.download)}</a>
<span class="label" id="meta">${esc(first.meta)}</span>
</div>
</form>
</div>
<div class="patch linen sheet-patch">
<span class="paper" id="paper" style="aspect-ratio:${first.ratio}"><img id="svg" src="${first.svg}" alt="${esc(first.alt)}" width="420" height="594" fetchpriority="high"><span id="pins">${pins(first.notes)}</span></span>
</div>
<div class="patch mint strip"><ol id="notes">${strip(first.notes)}</ol></div>
</section>
</div>

<section class="band"><div class="wrap block pair">
<div class="patch peri">
<h2>${esc(t.makerH)}</h2>
<p>${esc(t.makerP)}</p>
${mini(lang)}
<p style="margin-top:24px"><a class="btn primary" href="${PAGES.maker[lang]}">${esc(t.makerBtn)} ${ICON.arrow}</a></p>
</div>
<div class="patch sage app-patch">
<div class="copy">
<h2>${esc(t.appH)}</h2>
<p>${esc(t.appP1)}</p>
<p>${esc(t.appP2)}</p>
${stores(`qt-print-${lang}`)}
</div>
${phone(lang)}
</div>
</div></section>

<section class="band"><div class="wrap">
<h2>${esc(t.ideasH)}</h2>
<p>${esc(t.ideasP)}</p>
<ul class="ideas">
${ideas}
</ul>
</div></section>

<section class="band"><div class="wrap">
<h2>${esc(t.stepsH)}</h2>
<ol class="steps">${t.steps.map(([h, p]) => `<li><h3>${esc(h)}</h3><p>${esc(p)}</p></li>`).join('')}</ol>
</div></section>

<section class="band"><div class="wrap">
<h2>${esc(t.filesH)}</h2>
<p>${esc(t.filesP)}</p>
<table class="files"><thead><tr><th scope="col">${esc(t.layout)}</th>${Object.keys(PAPER).map((p) => `<th scope="col">${esc(t.papers[p])}</th>`).join('')}</tr></thead>
<tbody>
${files}
</tbody></table>
</div></section>
</main>
${footer(lang)}
<script>(function(){var D=${JSON.stringify(data)};var f=document.getElementById("pick"),img=document.getElementById("svg"),paper=document.getElementById("paper"),a=document.getElementById("dl"),meta=document.getElementById("meta"),pins=document.getElementById("pins"),notes=document.getElementById("notes");
function e(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;")}
function show(){var d=D[f.layout.value+"-"+f.paper.value];img.src=d.svg;img.alt=d.alt;paper.style.aspectRatio=d.ratio;paper.classList.toggle("wide",d.wide);a.href=d.href;a.setAttribute("download",d.name);meta.textContent=d.meta;
pins.innerHTML=d.notes.map(function(n,i){return '<span class="pin" style="--x:'+n.x+'%;--y:'+n.y+'%" aria-hidden="true">'+(i+1)+"</span>"}).join("");
notes.innerHTML=d.notes.map(function(n){return "<li>"+e(n.text)+"</li>"}).join("")}
f.addEventListener("change",show);var r=((navigator.language||"").split("-")[1]||"").toUpperCase();if(${JSON.stringify(['US', 'CA', 'MX', 'PH', 'CL', 'CO', 'VE', 'GT', 'CR', 'PA', 'DO', 'SV', 'HN', 'NI', 'PR', 'BR'])}.indexOf(r)>=0)f.paper.value="letter";if(f.layout.value!=="year"||f.paper.value!=="a4")show()})()</script>
${UTM_JS}
${STORE_JS}
</body>
</html>
`
}

function makerPage(lang) {
  const t = T[lang].maker
  const ui = T[lang].ui
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: t.h1,
        url: SITE + PAGES.maker[lang],
        inLanguage: lang,
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      },
      appJson(lang),
    ],
  }
  // Functions don't travel as JSON: the maker gets the plural forms already split.
  const strings = { ...ui, streak: [ui.streak(1), ui.streak(2)], count: [ui.count(1), ui.count(2)], openMonth: ui.openMonth('{m}') }
  return `${head(lang, 'maker', t, PAGES.maker)}
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script type="application/json" id="t">${JSON.stringify({ lang, threads: THREADS, mondayFirst: lang !== 'pt' && !/^en/.test(lang), ...strings }).replace(/</g, '\\u003c')}</script>
<script src="${v('/qt/maker.js')}" defer></script>
</head>
<body>
${header(lang, 'maker', PAGES.maker)}
<main>
<section class="wrap tool" aria-labelledby="h1">
<div class="toolbar">
<h1 id="h1">${esc(t.h1)}</h1>
<div class="when">
<button class="icon-btn" id="prev" type="button" aria-label="${esc(ui.prevM)}">${ICON.prev}</button>
<output id="when" aria-live="polite"></output>
<button class="icon-btn" id="next" type="button" aria-label="${esc(ui.nextM)}">${ICON.next}</button>
</div>
<div class="views" role="group"><button type="button" id="vm" aria-pressed="true">${esc(ui.month)}</button><button type="button" id="vy" aria-pressed="false">${esc(ui.year)}</button></div>
<button class="btn" id="export" type="button">${ICON.download}${esc(ui.export)}</button>
</div>
<div class="patch peri board">
<div id="view" aria-describedby="help"></div>
<p class="status" id="status">${esc(ui.hint)}</p>
<p class="status" id="help">${esc(ui.help)} ${esc(ui.saved)}</p>
</div>
<p class="sr" id="live" aria-live="polite"></p>
<noscript><p>JavaScript is needed for the online tracker. <a href="${PAGES.print[lang]}">${esc(t.paperLink)}</a></p></noscript>
<div class="edit" id="edit" popover>
<form id="editf" method="dialog">
<label for="ename">${esc(ui.name)}</label>
<input type="text" id="ename" maxlength="40" autocomplete="off">
<fieldset class="swatches"><legend>${esc(ui.color)}</legend>${THREADS.map((c, i) => `<label><input type="radio" name="color" value="${i}" aria-label="${i + 1}"><span style="--t:${c}"></span></label>`).join('')}</fieldset>
<div class="row"><button class="btn danger" type="button" id="eremove">${esc(ui.remove)}</button><button class="btn primary" type="submit">${esc(ui.save)}</button></div>
</form>
</div>
</section>

<section class="band"><div class="wrap">
<h2>${esc(t.howH)}</h2>
<ol class="steps" style="grid-template-columns:repeat(3,minmax(0,1fr))">${t.how.map(([h, p]) => `<li><h3>${esc(h)}</h3><p>${esc(p)}</p></li>`).join('')}</ol>
<p style="margin-top:32px"><a href="${PAGES.print[lang]}">${esc(t.paperLink)}</a></p>
</div></section>

<section class="band"><div class="wrap block pair">
<div class="patch sage app-patch" style="grid-column:1/-1;border-radius:var(--r)">
<div class="copy">
<h2>${esc(t.appH)}</h2>
<p>${esc(t.appP)}</p>
${stores(`qt-maker-${lang}`)}
</div>
${phone(lang)}
</div>
</div></section>
</main>
${footer(lang)}
${UTM_JS}
${STORE_JS}
</body>
</html>
`
}

// --- Comparison pages (texts and sources in compare.mjs) ------------------------------------------
const CMP = {
  en: {
    checked: (d) => `Checked on ${d}`,
    fitUs: 'Quilt fits if', fitThem: (n) => `${n} fits if`,
    sampleH: 'Three habits in Quilt',
    sampleP: 'Every day of the year is a square. These are examples.',
    sampleKey: ['Done', 'Skipped', 'Not yet'],
    sampleHabits: ['Read 10 pages', 'Walk', 'Stretch'],
    sourcesH: 'How this was checked',
    sourcesP: (d) => `Everything said here about other apps comes from their own store pages, websites, help pages and source code, read on ${d}. Prices change by country and over time; the store shows the current one.`,
    tm: (n) => `${n} ${n.includes(' and ') || n.includes(', ') ? 'are trademarks of their owners' : 'is a trademark of its owner'}. Quilt is not affiliated with ${n.includes(' and ') || n.includes(', ') ? 'them' : 'it'}.`,
    fix: (m) => `Spotted something out of date? Write to <a href="mailto:${m}">${m}</a> and it gets fixed.`,
    appH: 'Try Quilt for a week',
    appP: 'Add the habits you track now and tick a week. If it is not for you, there is no account to close and nothing to cancel.',
    more: 'More comparisons', paper: `Prefer paper? The free ${YEAR} habit tracker printables`,
    and: ' and ', app: 'App', line: 'What it is', price: 'Price', account: 'Account', platforms: 'Platforms', read: 'Read the comparison',
  },
  es: {
    checked: (d) => `Comprobado el ${d}`,
    fitUs: 'Quilt te encaja si', fitThem: (n) => `${n} te encaja si`,
    sampleH: 'Tres hábitos en Quilt',
    sampleP: 'Cada día del año es un cuadrado. Son ejemplos.',
    sampleKey: ['Hecho', 'Saltado', 'Aún no'],
    sampleHabits: ['Leer 10 páginas', 'Pasear', 'Estirar'],
    sourcesH: 'Cómo se ha comprobado',
    sourcesP: (d) => `Todo lo que se dice aquí de otras apps sale de sus fichas en las tiendas, sus webs, sus páginas de ayuda y su código, leídos el ${d}. Los precios cambian según el país y con el tiempo; la tienda enseña el actual.`,
    tm: (n) => `${n} ${n.includes(' y ') || n.includes(', ') ? 'son marcas de sus dueños' : 'es una marca de su dueño'}. Quilt no tiene relación con ${n.includes(' y ') || n.includes(', ') ? 'ellas' : 'ella'}.`,
    fix: (m) => `¿Ves algo desactualizado? Escribe a <a href="mailto:${m}">${m}</a> y se corrige.`,
    appH: 'Prueba Quilt una semana',
    appP: 'Añade los hábitos que llevas ahora y marca una semana. Si no es para ti, no hay cuenta que cerrar ni nada que cancelar.',
    more: 'Más comparativas', paper: `¿Prefieres papel? Las plantillas gratis de hábitos ${YEAR}`,
    and: ' y ', app: 'App', line: 'Qué es', price: 'Precio', account: 'Cuenta', platforms: 'Plataformas', read: 'Leer la comparativa',
  },
}
const CONTACT = 'baltajmn@gmail.com'
const LOCALE_DATE = { en: 'en-US', es: 'es-ES', pt: 'pt-BR' }
const fmtDate = (lang) => new Intl.DateTimeFormat(LOCALE_DATE[lang], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(CHECKED + 'T12:00:00Z'))
const MARK = {
  yes: '<svg class="mk" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4.5 10.5 3.5 3.5 7.5-8"/></svg>',
  no: '<svg class="mk no" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5.5 10h9"/></svg>',
}
const cell = (c) => c.startsWith('+ ') ? `${MARK.yes}<span>${esc(c.slice(2))}</span>` : c.startsWith('- ') ? `${MARK.no}<span>${esc(c.slice(2))}</span>` : `<span>${esc(c)}</span>`

// The example habits beside each comparison: the year of CHECKED up to that day, mostly done, a week away
// in August skipped. Seeded, so every page and every build draws the same year.
function sampleYear(lang) {
  const c = CMP[lang]
  const y = +CHECKED.slice(0, 4)
  const today = new Date(CHECKED + 'T00:00:00Z')
  const jan1 = new Date(Date.UTC(y, 0, 1))
  const mon = mondayFirst(lang, lang === 'en' ? 'letter' : 'a4')
  const lead = mon ? (jan1.getUTCDay() + 6) % 7 : jan1.getUTCDay()
  const days = (Date.UTC(y + 1, 0, 1) - jan1) / 864e5
  const months = new Intl.DateTimeFormat(LOCALE_DATE[lang], { month: 'short', timeZone: 'UTC' })
  let seed = 11
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  const grid = (gaps, labels) => {
    const cells = Array.from({ length: lead }, () => '<i class="pad"></i>')
    const ms = []
    let run = 0
    for (let d = 0; d < days; d++) {
      const date = new Date(jan1.getTime() + d * 864e5)
      if (labels && date.getUTCDate() === 1) ms.push(`<span class="m" style="grid-column:${Math.floor((lead + d) / 7) + 1}">${esc(months.format(date).replace('.', ''))}</span>`)
      let cls = ''
      if (date <= today) {
        const away = date.getUTCMonth() === 7 && date.getUTCDate() >= 10 && date.getUTCDate() <= 16
        run = rnd() < gaps ? 3 : Math.max(0, run - 1)
        cls = away ? 'skip' : run ? '' : 'done'
        if (+date === +today) cls += ' today'
      }
      cells.push(`<i${cls.trim() ? ` class="${cls.trim()}"` : ''}></i>`)
    }
    return `${labels ? `<div class="ym">${ms.join('')}</div>` : ''}<div class="yc">${cells.join('')}</div>`
  }
  const habits = [[0, 0.07], [5, 0.16], [4, 0.11]]
  return `<figure class="sample">
<h2>${esc(c.sampleH)}</h2>
<p>${esc(c.sampleP)}</p>
${habits.map(([tone, gaps], i) => `<div class="yh" style="--t:${THREADS[tone]}"><h3><i></i>${esc(c.sampleHabits[i])}</h3><div class="yg" aria-hidden="true" style="--cols:${Math.ceil((lead + days) / 7)}">${grid(gaps, i === 0)}</div></div>`).join('\n')}
<figcaption><span style="--t:${THREADS[0]}"><i></i>${esc(c.sampleKey[0])}</span><span><i class="s"></i>${esc(c.sampleKey[1])}</span><span><i class="e"></i>${esc(c.sampleKey[2])}</span></figcaption>
</figure>`
}

function sourcesBand(lang, sources, names, others) {
  const c = CMP[lang]
  const date = fmtDate(lang)
  return `<section class="band" id="sources"><div class="wrap sources">
<h2>${esc(c.sourcesH)}</h2>
<p>${esc(c.sourcesP(date))}</p>
<ul>${sources.map(([label, href]) => `<li><a href="${esc(href)}" rel="nofollow noopener">${esc(label)}</a></li>`).join('')}</ul>
<p class="note">${esc(c.tm(names))} ${c.fix(CONTACT)}</p>
${others.length ? `<h3>${esc(c.more)}</h3>
<ul class="more">${others.map(([href, label]) => `<li><a href="${href}">${esc(label)}</a></li>`).join('')}<li><a href="${PAGES.print[lang]}">${esc(c.paper)}</a></li></ul>` : `<p><a href="${PAGES.print[lang]}">${esc(c.paper)}</a></p>`}
</div></section>`
}

function appBand(lang, campaign) {
  const c = CMP[lang]
  return `<section class="band"><div class="wrap block pair">
<div class="patch sage app-patch" style="grid-column:1/-1;border-radius:var(--r)">
<div class="copy">
<h2>${esc(c.appH)}</h2>
<p>${esc(c.appP)}</p>
${stores(campaign)}
</div>
${phone(lang)}
</div>
</div></section>`
}

function comparePage(id, lang) {
  const P = COMPARE[id]
  const t = P[lang]
  const c = CMP[lang]
  const kind = `vs-${id}`
  const names = P.others.join(c.and)
  const cols = ['Quilt', ...P.others]
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      appJson(lang),
      { '@type': 'WebPage', name: t.title, url: SITE + P.path[lang], inLanguage: lang, dateModified: CHECKED, about: appJson(lang).name },
    ],
  }
  const table = `<div class="vs-wrap"><table class="vs"><thead><tr><td></td>${cols.map((n, i) => `<th scope="col"${i === 0 ? ' class="ours"' : ''}>${i === 0 ? '<img src="/qt/icon.svg" alt="" width="22" height="22">' : ''}${esc(n)}</th>`).join('')}</tr></thead>
<tbody>
${t.rows.map(([what, ...cells]) => `<tr><th scope="row">${esc(what)}</th>${cells.map((x, i) => `<td data-app="${esc(cols[i])}"${i === 0 ? ' class="ours"' : ''}>${cell(x)}</td>`).join('')}</tr>`).join('\n')}
</tbody></table></div>`
  const others = [[PAGES.hub[lang], HUB[lang].h1], ...Object.keys(COMPARE).filter((k) => k !== id && COMPARE[k].path[lang]).map((k) => [COMPARE[k].path[lang], COMPARE[k][lang].h1])]
  return `${head(lang, kind, t, P.path)}
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
${header(lang, kind, P.path)}
<main>
<div class="wrap">
<section class="block cmp-hero">
<div class="patch butter">
<h1>${esc(t.h1)}</h1>
<p class="lede">${esc(t.lede)}</p>
${stores(`qt-${kind}-${lang}`)}
<p class="checked"><a class="label" href="#sources">${esc(c.checked(fmtDate(lang)))}</a></p>
</div>
<div class="patch linen">
${sampleYear(lang)}
</div>
</section>
</div>

<section class="band"><div class="wrap block fit">
<div class="patch sage"><h2>${esc(c.fitUs)}</h2><ul>${t.fitUs.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
<div class="patch linen"><h2>${esc(c.fitThem(P.others[0]))}</h2><ul>${t.fitThem.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
</div></section>

<section class="band" id="table"><div class="wrap">
<h2>${esc(t.tableH)}</h2>
${table}
</div></section>

<section class="band"><div class="wrap">
<h2>${esc(t.betterH)}</h2>
<ul class="better">${t.better.map(([h, p]) => `<li><h3>${esc(h)}</h3><p>${esc(p)}</p></li>`).join('')}</ul>
</div></section>

<section class="band"><div class="wrap faq">
<h2>${esc(t.faqH)}</h2>
${t.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n')}
</div></section>

${appBand(lang, `qt-${kind}-${lang}`)}

${sourcesBand(lang, t.sources, names, others)}
</main>
${footer(lang)}
${UTM_JS}
${STORE_JS}
</body>
</html>
`
}

function hubPage(lang) {
  const H = HUB[lang]
  const c = CMP[lang]
  const ids = Object.keys(COMPARE).filter((k) => COMPARE[k].path[lang])
  const others = ids.flatMap((k) => COMPARE[k].others)
  const names = others.length > 1 ? `${others.slice(0, -1).join(', ')}${c.and}${others.at(-1)}` : others[0]
  const sources = [...new Map(ids.flatMap((k) => COMPARE[k][lang].sources).map((s) => [s[1], s])).values()]
  const row = (name, hub, link) => `<tr><th scope="row">${link ? `<a href="${link}">${esc(name)}</a>` : `<img src="/qt/icon.svg" alt="" width="22" height="22"> ${esc(name)}`}</th>
<td data-app="${esc(c.line)}"${link ? '' : ' class="ours"'}><span>${esc(hub.line)}</span></td>
<td data-app="${esc(c.price)}"${link ? '' : ' class="ours"'}><span>${esc(hub.price)}</span></td>
<td data-app="${esc(c.account)}"${link ? '' : ' class="ours"'}><span>${esc(hub.account)}</span></td>
<td data-app="${esc(c.platforms)}"${link ? '' : ' class="ours"'}><span>${esc(hub.platforms)}</span></td></tr>`
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      appJson(lang),
      { '@type': 'WebPage', name: H.title, url: SITE + H.path, inLanguage: lang, dateModified: CHECKED },
    ],
  }
  return `${head(lang, 'hub', H, PAGES.hub)}
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
${header(lang, 'hub', PAGES.hub)}
<main>
<div class="wrap">
<section class="block cmp-hero">
<div class="patch butter">
<h1>${esc(H.h1)}</h1>
<p class="lede">${esc(H.lede)}</p>
${stores(`qt-hub-${lang}`)}
<p class="checked"><a class="label" href="#sources">${esc(c.checked(fmtDate(lang)))}</a></p>
</div>
<div class="patch linen">
${sampleYear(lang)}
</div>
</section>
</div>

<section class="band" id="table"><div class="wrap">
<h2>${esc(H.tableH)}</h2>
<div class="vs-wrap"><table class="vs hub"><thead><tr><th scope="col">${esc(c.app)}</th><th scope="col">${esc(c.line)}</th><th scope="col">${esc(c.price)}</th><th scope="col">${esc(c.account)}</th><th scope="col">${esc(c.platforms)}</th></tr></thead>
<tbody>
${row('Quilt', H.quilt)}
${ids.map((k) => row(COMPARE[k].others[0], COMPARE[k][lang].hub, COMPARE[k].path[lang])).join('\n')}
</tbody></table></div>
</div></section>

<section class="band"><div class="wrap">
<h2>${esc(c.more)}</h2>
<ul class="better two">${ids.map((k) => `<li><h3><a href="${COMPARE[k].path[lang]}">${esc(COMPARE[k][lang].h1)}</a></h3><p>${esc(COMPARE[k][lang].hub.line)}</p></li>`).join('')}</ul>
</div></section>

${appBand(lang, `qt-hub-${lang}`)}

${sourcesBand(lang, sources, names, [])}
</main>
${footer(lang)}
${UTM_JS}
${STORE_JS}
</body>
</html>
`
}

const write = (path, html) => {
  const dir = join(ROOT, path)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
}
for (const lang of Object.keys(T)) {
  write(PAGES.print[lang], printPage(lang))
  write(PAGES.maker[lang], makerPage(lang))
}
for (const lang of Object.keys(PAGES.hub)) write(PAGES.hub[lang], hubPage(lang))
for (const id of Object.keys(COMPARE)) for (const lang of Object.keys(COMPARE[id].path)) write(COMPARE[id].path[lang], comparePage(id, lang))

// sitemap.xml with the language alternates of each page, and the policy pages as they are.
const urls = []
for (const paths of [...Object.values(PAGES), ...Object.values(COMPARE).map((c) => c.path)]) {
  for (const lang of Object.keys(paths)) {
    const alts = Object.keys(paths).map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${SITE + paths[l]}"/>`).join('') +
      `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE + paths.en}"/>`
    urls.push(`<url><loc>${SITE + paths[lang]}</loc><lastmod>${TODAY}</lastmod>${alts}</url>`)
  }
}
for (const p of ['/', '/terms.html']) urls.push(`<url><loc>${SITE + p}</loc></url>`)
writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`)
writeFileSync(join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`)
console.log('ok')
