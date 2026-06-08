export const state = {
  player: {
    name: 'Vân Thiên',
    avatar: '🧘',
    realm: 'Luyện Khí',
    stage: 3,
    maxStage: 9,
    realmLabel: 'Luyện Khí Tầng 3',
    xp: 35,
    xpMax: 100,
    combatPower: 1240,
    pressure: 72,
    pressureLabel: 'Nguy Hiểm',
    pressureLevel: 'danger',
    age: 18,
    lifespan: 120,
    location: 'Thanh Vân Sơn',
  },
  cultivation: {
    xp: 35,
    xpMax: 100,
    realm: 'Luyện Khí Tầng 3',
    pct: 35,
  },
  stats: {
    strength:   120,
    agility:    98,
    spirit:     210,
    defense:    80,
    luck:       55,
  },
  combat: {
    playerHp:   100,
    playerMaxHp: 100,
    enemyHp:    80,
    enemyMaxHp: 80,
    selectedEnemy: 0,
    log: [
      '⚔ Bắt đầu chiến đấu...',
      '💫 Hệ thống chiến đấu sẵn sàng.',
    ],
  },
  inventory: {
    filter: 'all',
    capacity: 30,
    used: 12,
    items: [
      { id:1,  icon:'💊', name:'Hồi Khí Đan',  qty:5,   rarity:'common' },
      { id:2,  icon:'⚔️', name:'Thiết Kiếm',    qty:1,   rarity:'rare' },
      { id:3,  icon:'📖', name:'Kỳ Thư Cấp 1',  qty:1,   rarity:'rare' },
      { id:4,  icon:'💍', name:'Ngọc Linh Hư',  qty:1,   rarity:'epic' },
      { id:5,  icon:'🧪', name:'Phá Cảnh Đan',  qty:2,   rarity:'epic' },
      { id:6,  icon:'🗡️', name:'Huyền Thiết',   qty:4,   rarity:'common' },
      { id:7,  icon:'🏆', name:'Cổ Phù Lục',    qty:1,   rarity:'legend' },
      { id:8,  icon:'🌿', name:'Linh Thảo',     qty:12,  rarity:'common' },
      { id:9,  icon:'🔮', name:'Thần Thạch',    qty:3,   rarity:'rare' },
      { id:10, icon:'🎋', name:'Linh Trúc',     qty:8,   rarity:'common' },
      { id:11, icon:'👘', name:'Tăng Bào',      qty:1,   rarity:'epic' },
      { id:12, icon:'🌟', name:'Tinh Thần Thạch', qty:2, rarity:'legend' },
    ],
  },
  scriptures: [
    { id:1, icon:'📜', name:'Thanh Vân Kiếm Pháp',   tier:'Trung Cấp',   progress:60, max:100, desc:'Kiếm pháp biến ảo, như mây trắng trôi.',          effect:'+15% Kiếm Sát Thương' },
    { id:2, icon:'🌀', name:'Huyền Thiên Chưởng',    tier:'Sơ Cấp',    progress:30, max:100, desc:'Chưởng phong mạnh mẽ, trấn áp thiên hạ.',           effect:'+10% Chưởng Lực' },
    { id:3, icon:'🔥', name:'Liệt Hỏa Công',         tier:'Hạ Cấp',    progress:80, max:100, desc:'Lửa thiêu đốt vạn vật, uy lực vô song.',            effect:'+20% Hỏa Hệ' },
    { id:4, icon:'❄️', name:'Băng Tâm Quyết',        tier:'Sơ Cấp',    progress:10, max:100, desc:'Tâm như băng tuyết, linh khí trong vắt.',           effect:'+8% Linh Lực Hồi Phục' },
    { id:5, icon:'⚡', name:'Lôi Đình Bộ',           tier:'Trung Cấp',   progress:45, max:100, desc:'Thân pháp nhanh như sét đánh, khó bắt kịp.',       effect:'+25% Tốc Độ' },
    { id:6, icon:'🌙', name:'Nguyệt Hoa Công',       tier:'Hạ Cấp',    progress:20, max:100, desc:'Vận hành linh lực theo chu kỳ mặt trăng.',          effect:'+12% Tu Vi Hấp Thu' },
  ],
  npcs: [
    { id:1, icon:'👸', name:'Lăng Tiểu Tiên',  title:'Sư Muội',        affinity:85, max:100 },
    { id:2, icon:'👴', name:'Thanh Vân Lão Tổ', title:'Trưởng Môn',    affinity:60, max:100 },
    { id:3, icon:'🧝', name:'Bạch Y Tẩu',       title:'Tiên Cô',       affinity:40, max:100 },
    { id:4, icon:'⚔️', name:'Hắc Kiếm Hầu',    title:'Địch Nhân',     affinity:15, max:100 },
    { id:5, icon:'🐉', name:'Vạn Long Đồng',    title:'Thiên Tài',     affinity:72, max:100 },
    { id:6, icon:'🌸', name:'Đào Hoa Tiên',     title:'Phương Thảo',   affinity:90, max:100 },
  ],
  dungeons: [
    { id:1, name:'Di Tích Thanh Vân Cốc',  level:'Luyện Khí 1-5',  reward:'Linh Thạch x50',   fog: true  },
    { id:2, name:'Huyết Mạch Động',        level:'Luyện Khí 5-9',  reward:'Huyết Mạch Đan x3', fog: true  },
    { id:3, name:'Cổ Tháp Thiên Kiếm',    level:'Trúc Cơ 1-3',    reward:'Thiên Kiếm Phổ',    fog: false },
    { id:4, name:'Vực Thẳm Vô Danh',      level:'Trúc Cơ 5+',     reward:'???',               fog: false },
  ],
  enemies: [
    { id:1, icon:'🐺', name:'Linh Lang',     power:'Linh Khí: 380',  hp:80,  maxHp:80  },
    { id:2, icon:'🐉', name:'Tiểu Hỏa Long', power:'Linh Khí: 620',  hp:120, maxHp:120 },
    { id:3, icon:'👻', name:'Âm Hồn Quỷ',   power:'Linh Khí: 290',  hp:60,  maxHp:60  },
    { id:4, icon:'🦅', name:'Điêu Vương',    power:'Linh Khí: 510',  hp:100, maxHp:100 },
  ],
  worldRegions: [
    { id:1,  icon:'🏔️', name:'Thanh Vân Sơn',  current:true,  locked:false },
    { id:2,  icon:'🌿', name:'Linh Thảo Cốc',  current:false, locked:false },
    { id:3,  icon:'🗡️', name:'Huyết Kiếm Môn', current:false, locked:false },
    { id:4,  icon:'🌊', name:'Hải Ngoại Tiên',  current:false, locked:true  },
    { id:5,  icon:'🔥', name:'Hỏa Linh Núi',   current:false, locked:true  },
    { id:6,  icon:'❄️', name:'Băng Cung',       current:false, locked:true  },
    { id:7,  icon:'⚡', name:'Lôi Trạch',       current:false, locked:true  },
    { id:8,  icon:'🌙', name:'Nguyệt Cung',     current:false, locked:true  },
    { id:9,  icon:'🌸', name:'Đào Hoa Đảo',    current:false, locked:true  },
    { id:10, icon:'🏯', name:'Thiên Đế Cung',   current:false, locked:true  },
  ],
  worldNews: [
    { title:'Thiên Kiếm Tông mở đại hội tuyển đệ tử', time:'3 ngày trước' },
    { title:'Huyết Ma Giáo tấn công biên giới phía Bắc', time:'5 ngày trước' },
    { title:'Linh Mạch cổ xuất hiện tại Bạch Ngọc Sơn', time:'7 ngày trước' },
    { title:'Phá Hư Kỳ cao thủ đột phá Độ Kiếp', time:'10 ngày trước' },
  ],
  log: [
    { text: '🌟 Tu Vi Hệ Thống kích hoạt. Chào mừng Vân Thiên!', type: 'important' },
    { text: '⚡ Linh Khí thiên địa bắt đầu hấp thu.', type: '' },
    { text: '✨ Tu luyện Luyện Khí Tầng 3 tiến triển tốt.', type: 'gain' },
  ],
}

export function addLog(text, type = '') {
  state.log.unshift({ text, type })
  if (state.log.length > 20) state.log.pop()
}

export function addCombatLog(text, type = '') {
  state.combat.log.unshift({ text, type })
  if (state.combat.log.length > 15) state.combat.log.pop()
}
