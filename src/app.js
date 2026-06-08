import { state, addLog, addCombatLog } from './gameState.js'
import { spawnParticles } from './particles.js'

const TABS = [
  { id: 'tu-luyen',  icon: '🧘', label: 'TU LUYỆN' },
  { id: 'bi-canh',   icon: '🌀', label: 'BÍ CẢNH'  },
  { id: 'chien-dau', icon: '⚔️', label: 'CHIẾN ĐẤU' },
  { id: 'cong-phap', icon: '📜', label: 'CÔNG PHÁP' },
  { id: 'tui-do',    icon: '🎒', label: 'TÚI ĐỒ'   },
  { id: 'quan-he',   icon: '🌸', label: 'QUAN HỆ'  },
  { id: 'the-gioi',  icon: '🗺️', label: 'THẾ GIỚI' },
]

export function createApp(root) {
  root.innerHTML = buildShell()
  wireUp(root)
  renderActiveTab('tu-luyen', root)
  startCultivationTick(root)
}

function buildShell() {
  const { player, cultivation } = state
  const pct = cultivation.pct
  return `
<div class="app-header">
  <div class="header-left">
    <div class="game-title">修仙之路</div>
    <div class="player-realm-text">${player.location}</div>
  </div>
  <div class="header-center">
    <div class="cult-bar-labels">
      <span class="cult-bar-realm">${cultivation.realm}</span>
      <span class="cult-bar-pct">${pct}%</span>
    </div>
    <div class="cult-bar-track">
      <div class="cult-bar-fill" id="cult-fill" style="width:${pct}%">
        <div class="cult-bar-shimmer"></div>
      </div>
    </div>
    <div class="cult-bar-nums">${cultivation.xp} / ${cultivation.xpMax} Tu Vi</div>
  </div>
  <div class="header-right">
    <div class="stat-chip">
      <span class="stat-chip-label">CHIẾN LỰC</span>
      <span class="stat-chip-value" id="combat-power-val">${player.combatPower.toLocaleString()}</span>
    </div>
    <div class="stat-chip">
      <span class="stat-chip-label">TUỔI</span>
      <span class="stat-chip-value">${player.age}</span>
    </div>
  </div>
</div>

<nav class="tab-nav">
  ${TABS.map(t => `
    <button class="tab-btn${t.id === 'tu-luyen' ? ' active' : ''}" data-tab="${t.id}">
      <span class="tab-icon">${t.icon}</span>
      <span>${t.label}</span>
    </button>
  `).join('')}
</nav>

<div class="tab-content" id="tab-content">
  ${TABS.map(t => `<div class="tab-pane tab-pane-${t.id}" id="pane-${t.id}"></div>`).join('')}
</div>
`
}

function wireUp(root) {
  root.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab
      root.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      renderActiveTab(tab, root)
    })
  })
}

function renderActiveTab(tabId, root) {
  root.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'))
  const pane = root.querySelector(`#pane-${tabId}`)
  if (!pane) return

  // Only render if empty
  if (!pane.dataset.rendered) {
    pane.dataset.rendered = '1'
    switch (tabId) {
      case 'tu-luyen':  renderTuLuyen(pane);  break
      case 'bi-canh':   renderBiCanh(pane);   break
      case 'chien-dau': renderChienDau(pane); break
      case 'cong-phap': renderCongPhap(pane); break
      case 'tui-do':    renderTuiDo(pane);    break
      case 'quan-he':   renderQuanHe(pane);   break
      case 'the-gioi':  renderTheGioi(pane);  break
    }
  } else {
    // Refresh dynamic parts
    if (tabId === 'tu-luyen') refreshTuLuyen(pane)
    if (tabId === 'chien-dau') refreshCombatLog(pane)
  }

  pane.classList.add('active')
}

/* ============================================================
   TU LUYEN
   ============================================================ */
function renderTuLuyen(pane) {
  const { player, stats, log } = state
  pane.innerHTML = `
<div class="tu-luyen-layout">
  <div class="tu-luyen-hero">
    <div class="avatar-frame" id="hero-avatar">
      <div class="avatar-ring"></div>
      <div class="avatar-ring-2"></div>
      ${player.avatar}
    </div>
    <div class="hero-info">
      <div class="hero-name">${player.name}</div>
      <div class="hero-realm-badge">${player.realmLabel}</div>
      <div class="hero-pressure">
        <span class="badge badge-${player.pressureLevel}">Áp Lực Thiên Địa: ${player.pressure}% (${player.pressureLabel})</span>
        <span class="badge badge-gold">Thọ Nguyên: ${player.age}/${player.lifespan} tuổi</span>
      </div>
    </div>
  </div>

  <div class="tu-luyen-actions">
    <div class="section-title">⚡ HÀNH ĐỘNG TU LUYỆN</div>
    <div class="action-grid">
      <button class="action-btn" id="btn-meditate">
        <span class="action-icon">🧘</span>
        <span>TĨNH TÂM TU LUYỆN</span>
      </button>
      <button class="action-btn" id="btn-absorb">
        <span class="action-icon">✨</span>
        <span>HẤP THU LINH KHÍ</span>
      </button>
      <button class="action-btn" id="btn-breakthrough">
        <span class="action-icon">⚡</span>
        <span>ĐỘT PHÁ CẢNH GIỚI</span>
      </button>
      <button class="action-btn" id="btn-purify">
        <span class="action-icon">💫</span>
        <span>TINH LUYỆN KHÍ HUYẾT</span>
      </button>
    </div>
  </div>

  <div class="tu-luyen-stats">
    <div class="section-title">📊 CHỈ SỐ TU SĨ</div>
    <div class="stat-row"><span class="stat-label">THẦN THỨC</span><span class="stat-value">${stats.spirit}</span></div>
    <div class="stat-row"><span class="stat-label">LỰC LƯỢNG</span><span class="stat-value">${stats.strength}</span></div>
    <div class="stat-row"><span class="stat-label">THÂN PHÁP</span><span class="stat-value">${stats.agility}</span></div>
    <div class="stat-row"><span class="stat-label">PHÒNG NGỰ</span><span class="stat-value">${stats.defense}</span></div>
    <div class="stat-row"><span class="stat-label">CƠ DUYÊN</span><span class="stat-value">${stats.luck}</span></div>
    <div class="stat-row"><span class="stat-label">CHIẾN LỰC</span><span class="stat-value glow-gold">${state.player.combatPower.toLocaleString()}</span></div>
  </div>

  <div class="tu-luyen-log" id="tu-luyen-log">
    ${log.map(e => `<div class="log-entry${e.type ? ' log-' + e.type : ''}">${e.text}</div>`).join('')}
  </div>
</div>
`
  spawnParticles(pane, 'linh-khi', 20)

  pane.querySelector('#btn-meditate').addEventListener('click', () => doMeditate(pane))
  pane.querySelector('#btn-absorb').addEventListener('click', () => doAbsorb(pane))
  pane.querySelector('#btn-breakthrough').addEventListener('click', () => doBreakthrough(pane))
  pane.querySelector('#btn-purify').addEventListener('click', () => doPurify(pane))
}

function refreshTuLuyen(pane) {
  const logEl = pane.querySelector('#tu-luyen-log')
  if (logEl) {
    logEl.innerHTML = state.log.map(e =>
      `<div class="log-entry${e.type ? ' log-' + e.type : ''}">${e.text}</div>`
    ).join('')
  }
}

function doMeditate(pane) {
  const gain = 3 + Math.floor(Math.random() * 5)
  state.cultivation.xp = Math.min(state.cultivation.xp + gain, state.cultivation.xpMax)
  state.cultivation.pct = Math.round((state.cultivation.xp / state.cultivation.xpMax) * 100)
  addLog(`✨ Tĩnh tâm tu luyện. Tu Vi +${gain}`, 'gain')
  updateCultBar()
  refreshTuLuyen(pane)
}

function doAbsorb(pane) {
  const gain = 5 + Math.floor(Math.random() * 8)
  state.cultivation.xp = Math.min(state.cultivation.xp + gain, state.cultivation.xpMax)
  state.cultivation.pct = Math.round((state.cultivation.xp / state.cultivation.xpMax) * 100)
  addLog(`💫 Hấp thu linh khí thiên địa. Tu Vi +${gain}`, 'gain')
  updateCultBar()
  refreshTuLuyen(pane)
}

function doBreakthrough(pane) {
  if (state.cultivation.xp < state.cultivation.xpMax) {
    addLog('⚠ Tu Vi chưa đủ để đột phá!', '')
  } else {
    state.cultivation.xp = 0
    state.cultivation.pct = 0
    state.player.stage = Math.min(state.player.stage + 1, state.player.maxStage)
    state.player.realmLabel = `Luyện Khí Tầng ${state.player.stage}`
    state.cultivation.realm = state.player.realmLabel
    state.player.combatPower += 150
    addLog(`⚡ ĐỘT PHÁ THÀNH CÔNG! ${state.player.realmLabel}`, 'important')
    updateCultBar()
  }
  refreshTuLuyen(pane)
}

function doPurify(pane) {
  state.stats.spirit += 5
  state.stats.strength += 3
  addLog(`💊 Tinh luyện khí huyết. Thần Thức +5, Lực Lượng +3`, 'gain')
  refreshTuLuyen(pane)
  // Re-render stats
  const rows = pane.querySelectorAll('.stat-row .stat-value')
  if (rows.length >= 2) {
    rows[0].textContent = state.stats.spirit
    rows[1].textContent = state.stats.strength
  }
}

function updateCultBar() {
  const fill = document.querySelector('#cult-fill')
  if (fill) {
    fill.style.width = `${state.cultivation.pct}%`
    fill.closest('.header-center').querySelector('.cult-bar-realm').textContent = state.cultivation.realm
    fill.closest('.header-center').querySelector('.cult-bar-pct').textContent = `${state.cultivation.pct}%`
    fill.closest('.header-center').querySelector('.cult-bar-nums').textContent = `${state.cultivation.xp} / ${state.cultivation.xpMax} Tu Vi`
  }
  const cpv = document.querySelector('#combat-power-val')
  if (cpv) cpv.textContent = state.player.combatPower.toLocaleString()
}

function startCultivationTick(root) {
  setInterval(() => {
    if (state.cultivation.xp < state.cultivation.xpMax) {
      state.cultivation.xp += 1
      state.cultivation.pct = Math.round((state.cultivation.xp / state.cultivation.xpMax) * 100)
      updateCultBar()
      const tuLuyenPane = root.querySelector('#pane-tu-luyen')
      if (tuLuyenPane && tuLuyenPane.classList.contains('active')) {
        const nums = tuLuyenPane.querySelector('.cult-bar-nums')
        // already updated via updateCultBar
      }
    }
  }, 3000)
}

/* ============================================================
   BI CANH
   ============================================================ */
function renderBiCanh(pane) {
  const { dungeons } = state
  pane.innerHTML = `
<div class="bi-canh-layout">
  <div class="bi-canh-portal">
    <div class="portal-wrap">
      <div class="portal-ring portal-ring-1"></div>
      <div class="portal-ring portal-ring-2"></div>
      <div class="portal-icon-inner">🌀</div>
    </div>
    <div class="portal-name">Bí Cảnh Chi Môn</div>
    <div class="portal-desc">Những di tích cổ xưa ẩn giấu vô số cơ duyên. Dũng cảm bước vào, cẩn thận mà tiến!</div>
    <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center; margin-top:4px;">
      <span class="badge badge-warning">Khai Phóng: Hàng Ngày</span>
      <span class="badge badge-gold">Cơ Duyên Sẵn Sàng: 2</span>
    </div>
  </div>

  <div style="font-family:var(--font-pixel);font-size:8px;color:var(--gold-300);padding:0 2px 4px;letter-spacing:0.08em;">
    ⚑ DANH SÁCH BÍ CẢNH
  </div>
  <div class="dungeon-list">
    ${dungeons.map(d => `
    <div class="dungeon-card" data-id="${d.id}">
      <div style="font-size:28px;">${d.fog ? '🌫️' : '🏯'}</div>
      <div class="dungeon-info">
        <div class="dungeon-name">${d.name}</div>
        <div class="dungeon-level">Yêu Cầu: ${d.level}</div>
      </div>
      <div class="dungeon-reward">
        <div style="font-family:var(--font-pixel);font-size:7px;color:var(--stone-500);margin-bottom:3px;">PHẦN THƯỞNG</div>
        ${d.reward}
        ${d.fog ? '' : `<div style="margin-top:4px;"><span class="badge badge-danger">KHÓA</span></div>`}
      </div>
    </div>
    `).join('')}
  </div>
</div>
`
  spawnParticles(pane, 'fog', 8)

  pane.querySelectorAll('.dungeon-card').forEach(card => {
    card.addEventListener('click', () => {
      const d = state.dungeons.find(x => x.id === +card.dataset.id)
      if (d && d.fog) {
        addLog(`🌀 Tiến vào ${d.name}... tìm kiếm cơ duyên.`, 'important')
      } else {
        addLog(`🔒 ${d.name} chưa mở khóa. Cần nâng cao cảnh giới.`, '')
      }
    })
  })
}

/* ============================================================
   CHIEN DAU
   ============================================================ */
function renderChienDau(pane) {
  const { enemies, combat } = state
  const enemyDat = enemies[combat.selectedEnemy] || enemies[0]
  pane.innerHTML = `
<div class="chien-dau-layout">
  <div class="combat-arena" id="combat-arena">
    <div class="combat-vs-row">
      <div class="combatant player">
        <div class="combatant-avatar">🧘</div>
        <div class="combatant-name">${state.player.name}</div>
        <div class="combatant-hp">
          <div class="combatant-hp-fill" id="player-hp-fill" style="width:${(combat.playerHp/combat.playerMaxHp)*100}%"></div>
        </div>
        <div style="font-family:var(--font-pixel);font-size:7px;color:var(--stone-400)" id="player-hp-text">${combat.playerHp}/${combat.playerMaxHp}</div>
      </div>
      <div class="vs-text">VS</div>
      <div class="combatant enemy">
        <div class="combatant-avatar">${enemyDat.icon}</div>
        <div class="combatant-name">${enemyDat.name}</div>
        <div class="combatant-hp">
          <div class="combatant-hp-fill" id="enemy-hp-fill" style="width:${(enemyDat.hp/enemyDat.maxHp)*100}%;background:linear-gradient(90deg,var(--fire-600),var(--fire-400))"></div>
        </div>
        <div style="font-family:var(--font-pixel);font-size:7px;color:var(--stone-400)" id="enemy-hp-text">${enemyDat.hp}/${enemyDat.maxHp}</div>
      </div>
    </div>
    <div class="combat-log" id="combat-log">
      ${combat.log.map(l => `<div class="combat-log-line ${l.type || ''}">${l.text}</div>`).join('')}
    </div>
  </div>

  <div class="combat-skills">
    <div class="section-title">⚔ CHIÊU THỨC</div>
    <div class="skill-grid">
      <button class="skill-btn" id="skill-attack">
        <span class="skill-icon">⚔️</span>
        <span>KIẾM KÍCH</span>
      </button>
      <button class="skill-btn" id="skill-heavy">
        <span class="skill-icon">💥</span>
        <span>TRỌNG KÍCH</span>
      </button>
      <button class="skill-btn" id="skill-spell">
        <span class="skill-icon">🌀</span>
        <span>PHÁP THUẬT</span>
      </button>
      <button class="skill-btn" id="skill-heal">
        <span class="skill-icon">💊</span>
        <span>HỒI PHỤC</span>
      </button>
    </div>
  </div>

  <div class="combat-targets">
    <div class="section-title">👁 CHỌN ĐỐI THỦ</div>
    ${enemies.map((e, i) => `
    <div class="enemy-row${i === combat.selectedEnemy ? ' selected' : ''}" data-idx="${i}">
      <div style="font-size:22px;">${e.icon}</div>
      <div class="enemy-info">
        <div class="enemy-name">${e.name}</div>
        <div class="enemy-power">${e.power}</div>
      </div>
      <button class="px-btn px-btn-crimson" style="font-size:7px;padding:4px 8px;">ĐÁNH</button>
    </div>
    `).join('')}
  </div>
</div>
`
  spawnParticles(pane, 'ember', 15)
  wireCombat(pane)
}

function wireCombat(pane) {
  pane.querySelectorAll('.enemy-row').forEach(row => {
    row.addEventListener('click', () => {
      const idx = +row.dataset.idx
      state.combat.selectedEnemy = idx
      const e = state.enemies[idx]
      state.combat.enemyHp = e.hp
      state.combat.enemyMaxHp = e.maxHp
      pane.querySelectorAll('.enemy-row').forEach((r, i) => r.classList.toggle('selected', i === idx))
      updateCombatDisplay(pane)
    })
  })

  pane.querySelector('#skill-attack').addEventListener('click', () => doCombatAction(pane, 'attack'))
  pane.querySelector('#skill-heavy').addEventListener('click', () => doCombatAction(pane, 'heavy'))
  pane.querySelector('#skill-spell').addEventListener('click', () => doCombatAction(pane, 'spell'))
  pane.querySelector('#skill-heal').addEventListener('click', () => doCombatAction(pane, 'heal'))
}

function doCombatAction(pane, action) {
  const enemy = state.enemies[state.combat.selectedEnemy]
  if (!enemy) return

  const arena = pane.querySelector('#combat-arena')

  if (action === 'heal') {
    const heal = 10 + Math.floor(Math.random() * 15)
    state.combat.playerHp = Math.min(state.combat.playerHp + heal, state.combat.playerMaxHp)
    addCombatLog(`💊 Hồi phục +${heal} HP`, 'atk')
    addLog(`💊 Hồi phục +${heal} HP`, 'gain')
  } else {
    let dmg = 0
    if (action === 'attack') dmg = 10 + Math.floor(Math.random() * 20)
    if (action === 'heavy')  dmg = 20 + Math.floor(Math.random() * 30)
    if (action === 'spell')  dmg = 15 + Math.floor(Math.random() * 25)

    const labels = { attack: '⚔ Kiếm Kích', heavy: '💥 Trọng Kích', spell: '🌀 Pháp Thuật' }
    enemy.hp = Math.max(0, enemy.hp - dmg)
    state.combat.enemyHp = enemy.hp
    addCombatLog(`${labels[action]} → ${enemy.name} mất ${dmg} HP`, 'atk')

    arena.classList.add('combat-flash')
    setTimeout(() => arena.classList.remove('combat-flash'), 300)

    if (enemy.hp <= 0) {
      enemy.hp = enemy.maxHp
      state.combat.enemyHp = enemy.hp
      const xpGain = 10 + Math.floor(Math.random() * 15)
      addCombatLog(`✨ Đánh bại ${enemy.name}! Nhận ${xpGain} Tu Vi`, 'atk')
      addLog(`⚔ Đánh bại ${enemy.name}! Tu Vi +${xpGain}`, 'gain')
      state.cultivation.xp = Math.min(state.cultivation.xp + xpGain, state.cultivation.xpMax)
      state.cultivation.pct = Math.round((state.cultivation.xp / state.cultivation.xpMax) * 100)
      updateCultBar()
    } else {
      // Enemy counter-attack
      const eDmg = 5 + Math.floor(Math.random() * 12)
      state.combat.playerHp = Math.max(0, state.combat.playerHp - eDmg)
      addCombatLog(`💢 ${enemy.name} phản công! Mất ${eDmg} HP`, 'dmg')
    }
  }

  updateCombatDisplay(pane)
  refreshCombatLog(pane)
}

function updateCombatDisplay(pane) {
  const { combat } = state
  const enemy = state.enemies[combat.selectedEnemy]
  const pFill = pane.querySelector('#player-hp-fill')
  const eFill = pane.querySelector('#enemy-hp-fill')
  const pText = pane.querySelector('#player-hp-text')
  const eText = pane.querySelector('#enemy-hp-text')
  if (pFill) pFill.style.width = `${(combat.playerHp / combat.playerMaxHp) * 100}%`
  if (eFill && enemy) eFill.style.width = `${(enemy.hp / enemy.maxHp) * 100}%`
  if (pText) pText.textContent = `${combat.playerHp}/${combat.playerMaxHp}`
  if (eText && enemy) eText.textContent = `${enemy.hp}/${enemy.maxHp}`
}

function refreshCombatLog(pane) {
  const logEl = pane.querySelector('#combat-log')
  if (logEl) {
    logEl.innerHTML = state.combat.log.map(l =>
      `<div class="combat-log-line ${l.type || ''}">${l.text}</div>`
    ).join('')
    logEl.scrollTop = 0
  }
}

/* ============================================================
   CONG PHAP
   ============================================================ */
function renderCongPhap(pane) {
  pane.innerHTML = `
<div class="cong-phap-layout">
  <div class="scripture-hall">
    <div class="hall-deco">📚</div>
    <div class="hall-title">Tàng Kinh Các</div>
    <div style="font-family:var(--font-serif);font-size:12px;color:var(--parchment-500);max-width:320px;line-height:1.6;">
      Nơi lưu giữ vô số tuyệt học của tông môn. Chuyên tâm tu luyện để nâng cao uy lực.
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
      <span class="badge badge-gold">Tổng Công Pháp: ${state.scriptures.length}</span>
      <span class="badge badge-success">Đang Tu: ${state.scriptures.filter(s => s.progress > 0).length}</span>
    </div>
  </div>

  <div style="font-family:var(--font-pixel);font-size:8px;color:var(--gold-300);padding:0 2px 4px;letter-spacing:0.08em;">
    📖 CÔNG PHÁP ĐÃ HỌC
  </div>
  <div class="scripture-grid">
    ${state.scriptures.map(s => `
    <div class="scripture-card" data-id="${s.id}">
      <div style="display:flex;align-items:center;gap:8px;">
        <span class="scripture-icon">${s.icon}</span>
        <div>
          <div class="scripture-name">${s.name}</div>
          <div class="scripture-tier">${s.tier}</div>
        </div>
      </div>
      <div class="scripture-bar">
        <div class="scripture-bar-fill" style="width:${s.progress}%"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-family:var(--font-pixel);font-size:7px;color:var(--amber-300);">
        <span>${s.progress}%</span><span>${s.progress}/${s.max}</span>
      </div>
      <div class="scripture-desc">${s.desc}</div>
      <div class="scripture-effect">${s.effect}</div>
    </div>
    `).join('')}
  </div>
</div>
`
  spawnParticles(pane, 'linh-khi', 6)

  pane.querySelectorAll('.scripture-card').forEach(card => {
    card.addEventListener('click', () => {
      const s = state.scriptures.find(x => x.id === +card.dataset.id)
      if (s) {
        const gain = 5 + Math.floor(Math.random() * 10)
        s.progress = Math.min(s.progress + gain, s.max)
        addLog(`📖 Tu luyện ${s.name} +${gain}%`, 'gain')
        card.querySelector('.scripture-bar-fill').style.width = `${s.progress}%`
        const texts = card.querySelectorAll('[style*="7px"]')
        texts.forEach(t => {
          if (t.textContent.includes('%')) {
            t.innerHTML = `<span>${s.progress}%</span><span>${s.progress}/${s.max}</span>`
          }
        })
      }
    })
  })
}

/* ============================================================
   TUI DO
   ============================================================ */
function renderTuiDo(pane) {
  const { inventory } = state
  pane.innerHTML = `
<div class="tui-do-layout">
  <div class="inventory-header">
    <div>
      <div class="inv-title">乾坤袋 Túi Càn Khôn</div>
      <div class="inv-sub">KHÔNG GIAN LƯU TRỮ CỔ ĐẠI</div>
    </div>
    <div>
      <div class="inv-cap-label">SỨC CHỨA: ${inventory.used}/${inventory.capacity}</div>
      <div class="inv-cap-bar">
        <div class="inv-cap-fill" style="width:${(inventory.used/inventory.capacity)*100}%"></div>
      </div>
    </div>
  </div>

  <div class="inv-filter" id="inv-filter">
    ${['all','dan-duoc','vu-khi','phap-bao','nguyen-lieu'].map(f =>
      `<button class="filter-btn${inventory.filter === f ? ' active' : ''}" data-filter="${f}">${
        {all:'TẤT CẢ',  'dan-duoc':'ĐAN DƯỢC',  'vu-khi':'VŨ KHÍ',  'phap-bao':'PHÁP BẢO',  'nguyen-lieu':'NGUYÊN LIỆU'}[f]
      }</button>`
    ).join('')}
  </div>

  <div class="item-grid" id="item-grid">
    ${inventory.items.map(item => `
    <div class="item-slot rarity-${item.rarity}" data-id="${item.id}">
      <div class="item-icon">${item.icon}</div>
      <div class="item-name">${item.name}</div>
      ${item.qty > 1 ? `<div class="item-qty">×${item.qty}</div>` : ''}
    </div>
    `).join('')}
  </div>
</div>
`
  spawnParticles(pane, 'linh-khi', 10)

  pane.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      inventory.filter = btn.dataset.filter
      pane.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
    })
  })

  pane.querySelectorAll('.item-slot').forEach(slot => {
    slot.addEventListener('click', () => {
      const item = inventory.items.find(x => x.id === +slot.dataset.id)
      if (item) addLog(`🎒 Kiểm tra: ${item.icon} ${item.name} (x${item.qty})`, '')
    })
  })
}

/* ============================================================
   QUAN HE
   ============================================================ */
function renderQuanHe(pane) {
  pane.innerHTML = `
<div class="quan-he-layout">
  <div class="pavilion-header">
    <div class="pavilion-icon">🌸</div>
    <div class="pavilion-title">Nhân Duyên Điện</div>
    <div class="pavilion-desc">Tình duyên kết nối vạn kiếp, nhân duyên trời định không thể tránh.</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:4px;">
      <span class="badge badge-gold">Duyên Phận Điểm: 240</span>
      <span class="badge badge-success">Bạn Đồng Hành: ${state.npcs.filter(n => n.affinity >= 50).length}</span>
    </div>
  </div>

  <div style="font-family:var(--font-pixel);font-size:8px;color:var(--pink-300);padding:0 2px 4px;letter-spacing:0.08em;">
    💗 NHÂN VẬT KẾT DUYÊN
  </div>
  <div class="npc-grid">
    ${state.npcs.map(npc => `
    <div class="npc-card" data-id="${npc.id}">
      <div class="npc-avatar">${npc.icon}</div>
      <div class="npc-name">${npc.name}</div>
      <div class="npc-title">${npc.title}</div>
      <div class="npc-aff-label">HẢO CẢM: ${npc.affinity}%</div>
      <div class="npc-aff-bar">
        <div class="npc-aff-fill" style="width:${npc.affinity}%"></div>
      </div>
      ${npc.affinity >= 80 ? '<span class="badge badge-success" style="margin-top:4px;">THÂN THIẾT</span>' : ''}
      ${npc.affinity < 30 ? '<span class="badge badge-danger" style="margin-top:4px;">THÙ ĐỊCH</span>' : ''}
    </div>
    `).join('')}
  </div>
</div>
`
  spawnParticles(pane, 'petal', 12)

  pane.querySelectorAll('.npc-card').forEach(card => {
    card.addEventListener('click', () => {
      const npc = state.npcs.find(x => x.id === +card.dataset.id)
      if (npc) {
        const gain = 2 + Math.floor(Math.random() * 5)
        npc.affinity = Math.min(npc.affinity + gain, 100)
        addLog(`🌸 Tăng hảo cảm với ${npc.name}: +${gain} (${npc.affinity}%)`, 'gain')
        const fillEl = card.querySelector('.npc-aff-fill')
        const labelEl = card.querySelector('.npc-aff-label')
        if (fillEl) fillEl.style.width = `${npc.affinity}%`
        if (labelEl) labelEl.textContent = `HẢO CẢM: ${npc.affinity}%`
      }
    })
  })
}

/* ============================================================
   THE GIOI
   ============================================================ */
function renderTheGioi(pane) {
  pane.innerHTML = `
<div class="the-gioi-layout">
  <div class="world-header">
    <div class="map-icon">🗺️</div>
    <div class="map-title">Tiên Giới Bản Đồ</div>
    <div style="font-family:var(--font-serif);font-size:12px;color:var(--blue-300);max-width:300px;line-height:1.6;">
      Thiên hạ bao la, vô số kỳ cảnh đang chờ đợi. Mỗi vùng đất ẩn chứa vô vàn cơ duyên.
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
      <span class="badge badge-gold">Vị Trí: ${state.player.location}</span>
      <span class="badge badge-success">Khám Phá: ${state.worldRegions.filter(r => !r.locked).length}/${state.worldRegions.length}</span>
    </div>
  </div>

  <div style="font-family:var(--font-pixel);font-size:8px;color:var(--blue-300);padding:0 2px 4px;letter-spacing:0.08em;">
    🌍 BẢN ĐỒ THẾ GIỚI
  </div>
  <div class="pixel-map">
    ${state.worldRegions.map(r => `
    <div class="map-region${r.current ? ' current' : ''}${r.locked ? ' locked' : ''}" data-id="${r.id}">
      <div class="region-icon">${r.locked ? '🔒' : r.icon}</div>
      <div class="region-name">${r.name}</div>
      ${r.current ? `<div style="font-family:var(--font-pixel);font-size:5px;color:var(--gold-300);margin-top:2px;">★ ĐÂY</div>` : ''}
    </div>
    `).join('')}
  </div>

  <div class="world-news">
    <div class="section-title">📰 THIÊN HẠ ĐẠI SỰ</div>
    ${state.worldNews.map(n => `
    <div class="news-item">
      <div class="news-title">${n.title}</div>
      <div class="news-time">⏱ ${n.time}</div>
    </div>
    `).join('')}
  </div>
</div>
`
  spawnParticles(pane, 'cloud', 6)

  pane.querySelectorAll('.map-region').forEach(el => {
    el.addEventListener('click', () => {
      const r = state.worldRegions.find(x => x.id === +el.dataset.id)
      if (r && !r.locked) {
        addLog(`🗺 Di chuyển đến ${r.name}...`, 'important')
        state.worldRegions.forEach(x => x.current = false)
        r.current = true
        state.player.location = r.name
        pane.querySelectorAll('.map-region').forEach((el2, i) => {
          el2.classList.toggle('current', state.worldRegions[i]?.current ?? false)
        })
        document.querySelector('.player-realm-text').textContent = r.name
      } else if (r && r.locked) {
        addLog(`🔒 ${r.name} chưa mở khóa.`, '')
      }
    })
  })
}
