// Online habit tracker: a row per habit, a square per day; tap for done, again for skipped, again to clear.
// Everything stays in localStorage under KEY. The page passes its strings and the habit colors in #t.
;(function () {
  'use strict'
  var T = JSON.parse(document.getElementById('t').textContent)
  var KEY = 'quilt-tracker-v1'
  var DONE = 1
  var SKIP = 2
  var view = document.getElementById('view')
  var when = document.getElementById('when')
  var status = document.getElementById('status')
  var live = document.getElementById('live')
  var prev = document.getElementById('prev')
  var next = document.getElementById('next')
  var vm = document.getElementById('vm')
  var vy = document.getElementById('vy')
  var edit = document.getElementById('edit')
  var ename = document.getElementById('ename')
  var editf = document.getElementById('editf')
  var now = new Date()
  var today = key(now.getFullYear(), now.getMonth(), now.getDate())
  var cur = { y: now.getFullYear(), m: now.getMonth() }
  var mode = 'month'
  var focus = { d: now.getDate(), h: 1 }
  var editing = null
  var PLUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>'

  function pad(n) { return (n < 10 ? '0' : '') + n }
  function key(y, m, d) { return y + '-' + pad(m + 1) + '-' + pad(d) }
  function daysIn(y, m) { return new Date(y, m + 1, 0).getDate() }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;') }
  function fmt(opts, date) { return new Intl.DateTimeFormat(T.lang, opts).format(date) }

  // --- State ---------------------------------------------------------------------------------------
  var state
  var canSave = true
  try {
    state = JSON.parse(localStorage.getItem(KEY))
  } catch (e) {
    canSave = false
  }
  if (!state || !Array.isArray(state.habits)) {
    state = { v: 1, habits: T.starters.map(function (name, i) { return { id: 'h' + (i + 1), name: name, color: [0, 5, 4][i] } }), marks: {} }
  }
  function save() {
    if (!canSave) return
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch (e) {
      canSave = false
      status.textContent = T.noStorage
    }
  }
  if (!canSave) status.textContent = T.noStorage
  function marks(h) { return state.marks[h.id] || (state.marks[h.id] = {}) }
  function color(h) { return T.threads[h.color % T.threads.length] }

  // Current streak: done days back from today (or from the last day of a past year), skipped days
  // neither count nor break it, and today unmarked doesn't break it either: the day isn't over.
  function streak(h, y) {
    var mk = marks(h)
    var d = y < now.getFullYear() ? new Date(y, 11, 31) : new Date(now)
    if (!mk[key(d.getFullYear(), d.getMonth(), d.getDate())]) d.setDate(d.getDate() - 1)
    var n = 0
    for (var i = 0; i < 3660; i++) {
      var v = mk[key(d.getFullYear(), d.getMonth(), d.getDate())]
      if (v === DONE) n++
      else if (v !== SKIP) break
      d.setDate(d.getDate() - 1)
    }
    return n
  }
  function countIn(h, prefix) {
    var mk = marks(h)
    var n = 0
    for (var k in mk) if (mk[k] === DONE && k.indexOf(prefix) === 0) n++
    return n
  }
  function plural(forms, n) { return (n === 1 ? forms[0] : forms[1]).replace(/\d+/, n) }

  // --- Month ---------------------------------------------------------------------------------------
  function dayLabel(h, y, m, d, v) {
    return h.name + ', ' + fmt({ weekday: 'long', day: 'numeric', month: 'long' }, new Date(y, m, d)) + ': ' + (v === DONE ? T.done : v === SKIP ? T.skipped : T.empty)
  }
  function renderMonth() {
    var y = cur.y
    var m = cur.m
    var days = daysIn(y, m)
    var n = state.habits.length
    if (focus.d > days) focus.d = days
    if (focus.h > n) focus.h = Math.max(1, n)
    var out = ['<div class="mx" role="grid" aria-label="' + esc(fmt({ month: 'long', year: 'numeric' }, new Date(y, m, 1))) + '" style="--days:' + days + ';--n:' + Math.max(n, 1) + '">']
    out.push('<span style="--d:0;--h:0"></span>')
    for (var d = 1; d <= days; d++) {
      var date = new Date(y, m, d)
      var we = date.getDay() === 0 || date.getDay() === 6
      out.push('<span class="dh' + (we ? ' we' : '') + (key(y, m, d) === today ? ' now' : '') + '" style="--d:' + d + ';--h:0"><b>' + d + '</b>' + esc(fmt({ weekday: 'narrow' }, date)) + '</span>')
    }
    out.push('<span class="th" style="--d:' + (days + 1) + ';--h:0">' + esc(T.total) + '</span>')
    state.habits.forEach(function (h, i) {
      var r = i + 1
      var mk = marks(h)
      out.push('<button type="button" class="hn" data-edit="' + h.id + '" style="--d:0;--h:' + r + ';--t:' + color(h) + '" aria-label="' + esc(T.edit + ': ' + h.name) + '"><i></i><span>' + esc(h.name) + '</span></button>')
      for (var d = 1; d <= days; d++) {
        var k = key(y, m, d)
        var v = mk[k]
        var wd = new Date(y, m, d).getDay()
        var cls = 'day' + (v === DONE ? ' done' : v === SKIP ? ' skip' : '') + (k === today ? ' today' : '') + (k > today ? ' future' : '') + (wd === 0 || wd === 6 ? ' we' : '')
        var tab = r === focus.h && d === focus.d ? '0' : '-1'
        out.push('<button type="button" class="' + cls + '" data-h="' + r + '" data-d="' + d + '" tabindex="' + tab + '" style="--d:' + d + ';--h:' + r + ';--t:' + color(h) + '" aria-label="' + esc(dayLabel(h, y, m, d, v)) + '"></button>')
      }
      out.push('<span class="tot" data-tot="' + r + '" style="--d:' + (days + 1) + ';--h:' + r + '">' + countIn(h, key(y, m, 1).slice(0, 8)) + '</span>')
    })
    out.push('<div class="add-row" style="--n:' + n + '"><button type="button" class="add" id="addh">' + PLUS + '<span>' + esc(T.add) + '</span></button></div>')
    out.push('</div>')
    view.innerHTML = out.join('')
    when.textContent = fmt({ month: 'long', year: 'numeric' }, new Date(y, m, 1))
    prev.setAttribute('aria-label', T.prevM)
    next.setAttribute('aria-label', T.nextM)
  }

  function mark(btn) {
    var r = +btn.dataset.h
    var d = +btn.dataset.d
    var h = state.habits[r - 1]
    var k = key(cur.y, cur.m, d)
    var mk = marks(h)
    var v = mk[k] === DONE ? SKIP : mk[k] === SKIP ? 0 : DONE
    if (v) mk[k] = v
    else delete mk[k]
    save()
    btn.classList.remove('done', 'skip', 'sew')
    if (v === DONE) {
      void btn.offsetWidth // restart the sewing animation
      btn.classList.add('done', 'sew')
    } else if (v === SKIP) btn.classList.add('skip')
    var label = dayLabel(h, cur.y, cur.m, d, v)
    btn.setAttribute('aria-label', label)
    live.textContent = label
    view.querySelector('[data-tot="' + r + '"]').textContent = countIn(h, k.slice(0, 8))
  }

  // --- Year ----------------------------------------------------------------------------------------
  function renderYear() {
    var y = cur.y
    var jan1 = new Date(y, 0, 1)
    var lead = T.mondayFirst ? (jan1.getDay() + 6) % 7 : jan1.getDay()
    var total = (new Date(y + 1, 0, 1) - jan1) / 864e5
    var out = ['<div class="yv">']
    state.habits.forEach(function (h) {
      var mk = marks(h)
      var cells = []
      var labels = []
      for (var i = 0; i < lead; i++) cells.push('<i class="pad"></i>')
      for (var d = 0; d < total; d++) {
        var date = new Date(y, 0, 1 + d)
        var k = key(y, date.getMonth(), date.getDate())
        if (date.getDate() === 1) {
          var name = fmt({ month: 'short' }, date).replace('.', '')
          labels.push('<button type="button" class="m" data-month="' + date.getMonth() + '" style="grid-column:' + (Math.floor((lead + d) / 7) + 1) + '" aria-label="' + esc(T.openMonth.replace('{m}', fmt({ month: 'long' }, date))) + '">' + esc(name) + '</button>')
        }
        var v = mk[k]
        var cls = (v === DONE ? 'done' : v === SKIP ? 'skip' : '') + (k === today ? ' today' : '')
        cells.push('<i' + (cls.trim() ? ' class="' + cls.trim() + '"' : '') + '></i>')
      }
      var s = streak(h, y)
      var c = countIn(h, y + '-')
      out.push('<section class="yh" style="--t:' + color(h) + '"><header><h3><i></i>' + esc(h.name) + '</h3><small>' + esc(plural(T.count, c)) + (s ? ' . ' + esc(plural(T.streak, s)) : '') + '</small></header><div class="yg" style="--cols:' + Math.ceil((lead + total) / 7) + '"><div class="ym">' + labels.join('') + '</div><div class="yc">' + cells.join('') + '</div></div></section>')
    })
    out.push('<div><button type="button" class="add" id="addh" style="max-width:280px">' + PLUS + '<span>' + esc(T.add) + '</span></button></div>')
    out.push('</div>')
    view.innerHTML = out.join('')
    when.textContent = String(y)
    prev.setAttribute('aria-label', T.prevY)
    next.setAttribute('aria-label', T.nextY)
  }

  function render() {
    if (mode === 'month') renderMonth()
    else renderYear()
    if (canSave) status.textContent = mode === 'month' ? T.hint : T.yearHint
    vm.setAttribute('aria-pressed', String(mode === 'month'))
    vy.setAttribute('aria-pressed', String(mode === 'year'))
  }

  // --- Editing habits ------------------------------------------------------------------------------
  function openEdit(id) {
    editing = state.habits.filter(function (h) { return h.id === id })[0]
    if (!editing) return
    ename.value = editing.name
    editf.color.value = String(editing.color)
    edit.showPopover()
    ename.focus()
    ename.select()
  }
  ename.addEventListener('input', function () {
    if (editing) editing.name = ename.value.trim() || T.untitled
    save()
  })
  editf.addEventListener('change', function (e) {
    if (editing && e.target.name === 'color') editing.color = +e.target.value
    save()
  })
  editf.addEventListener('submit', function (e) {
    e.preventDefault()
    edit.hidePopover()
  })
  edit.addEventListener('toggle', function (e) {
    if (e.newState === 'closed') {
      editing = null
      render()
    }
  })
  document.getElementById('eremove').addEventListener('click', function () {
    if (!editing || !confirm(T.confirmRemove.replace('{name}', editing.name))) return
    delete state.marks[editing.id]
    state.habits = state.habits.filter(function (h) { return h !== editing })
    save()
    edit.hidePopover()
  })
  function addHabit() {
    var used = state.habits.map(function (h) { return h.color })
    var free = T.threads.map(function (_, i) { return i }).filter(function (i) { return used.indexOf(i) < 0 })
    var id = 'h' + Date.now().toString(36)
    state.habits.push({ id: id, name: T.untitled, color: free.length ? free[0] : state.habits.length % T.threads.length })
    save()
    render()
    openEdit(id)
  }

  // --- Events --------------------------------------------------------------------------------------
  view.addEventListener('click', function (e) {
    var t = e.target.closest('button')
    if (!t) return
    if (t.classList.contains('day')) {
      focus = { d: +t.dataset.d, h: +t.dataset.h }
      mark(t)
    } else if (t.dataset.edit) openEdit(t.dataset.edit)
    else if (t.id === 'addh') addHabit()
    else if (t.dataset.month) {
      cur.m = +t.dataset.month
      mode = 'month'
      render()
    }
  })
  // Arrow keys move between days (left, right) and habits (up, down), whichever way the grid is drawn.
  view.addEventListener('keydown', function (e) {
    var t = e.target
    if (!t.classList || !t.classList.contains('day')) return
    var d = +t.dataset.d
    var h = +t.dataset.h
    var moves = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1], Home: [1 - d, 0], End: [99, 0] }
    var mv = moves[e.key]
    if (!mv) return
    e.preventDefault()
    var days = daysIn(cur.y, cur.m)
    var nd = Math.min(days, Math.max(1, d + mv[0]))
    var nh = Math.min(state.habits.length, Math.max(1, h + mv[1]))
    var el = view.querySelector('.day[data-d="' + nd + '"][data-h="' + nh + '"]')
    if (!el) return
    t.tabIndex = -1
    el.tabIndex = 0
    el.focus()
    focus = { d: nd, h: nh }
  })
  function step(dir) {
    if (mode === 'month') {
      cur.m += dir
      if (cur.m < 0) { cur.m = 11; cur.y-- }
      if (cur.m > 11) { cur.m = 0; cur.y++ }
    } else cur.y += dir
    render()
  }
  prev.addEventListener('click', function () { step(-1) })
  next.addEventListener('click', function () { step(1) })
  vm.addEventListener('click', function () { mode = 'month'; render() })
  vy.addEventListener('click', function () { mode = 'year'; render() })
  window.addEventListener('storage', function (e) {
    if (e.key !== KEY) return
    try { state = JSON.parse(e.newValue) || state } catch (err) {}
    render()
  })

  // --- Export: every habit's year on white, as a PNG ------------------------------------------------
  document.getElementById('export').addEventListener('click', function () {
    var y = cur.y
    var W = 1400
    var M = 64
    var cols = 54
    var cp = (W - 2 * M) / cols
    var c = cp - 4
    var blockH = 64 + 7 * cp
    var H = 170 + state.habits.length * (blockH + 26) + 40
    var cv = document.createElement('canvas')
    cv.width = W
    cv.height = H
    var g = cv.getContext('2d')
    var jan1 = new Date(y, 0, 1)
    var lead = T.mondayFirst ? (jan1.getDay() + 6) % 7 : jan1.getDay()
    var total = (new Date(y + 1, 0, 1) - jan1) / 864e5
    var sans = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    function draw() {
      g.fillStyle = '#FBF8F3'
      g.fillRect(0, 0, W, H)
      g.fillStyle = '#2E2A24'
      g.font = '64px Caprasimo, Georgia, serif'
      g.fillText(String(y), M, 110)
      g.font = '600 26px ' + sans
      g.textAlign = 'right'
      g.fillText(T.sheetTitle, W - M, 104)
      g.textAlign = 'left'
      state.habits.forEach(function (h, i) {
        var top = 170 + i * (blockH + 26)
        var mk = marks(h)
        g.fillStyle = color(h)
        g.beginPath()
        g.roundRect(M, top + 2, 20, 20, 5)
        g.fill()
        g.fillStyle = '#2E2A24'
        g.font = '700 22px ' + sans
        g.fillText(h.name, M + 32, top + 20)
        var w = g.measureText(h.name).width
        g.font = '500 18px ' + sans
        g.fillStyle = '#5E574B'
        g.fillText(plural(T.count, countIn(h, y + '-')), M + 48 + w, top + 20)
        for (var d = 0; d < total; d++) {
          var date = new Date(y, 0, 1 + d)
          var col = Math.floor((lead + d) / 7)
          var row = (lead + d) % 7
          var x = M + col * cp
          var yy = top + 58 + row * cp
          if (date.getDate() === 1) {
            g.fillStyle = '#5E574B'
            g.font = '500 15px ' + sans
            g.fillText(fmt({ month: 'short' }, date).replace('.', ''), x, top + 50)
          }
          var v = mk[key(y, date.getMonth(), date.getDate())]
          g.fillStyle = v === DONE ? color(h) : '#EFE9DE'
          g.beginPath()
          g.roundRect(x, yy, c, c, 4)
          g.fill()
          if (v === SKIP) {
            g.fillStyle = '#2E2A24'
            g.beginPath()
            g.arc(x + c / 2, yy + c / 2, c / 6, 0, Math.PI * 2)
            g.fill()
          }
        }
      })
      g.fillStyle = '#5E574B'
      g.font = '500 16px ' + sans
      g.textAlign = 'right'
      g.fillText('Quilt: Habit Tracker . quilt.baltajmn.dev', W - M, H - 28)
      cv.toBlob(function (blob) {
        var a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = T.file + '-' + y + '.png'
        document.body.appendChild(a)
        a.click()
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove() }, 1000)
      })
    }
    document.fonts.load('64px Caprasimo').then(draw, draw)
  })

  render()
})()
