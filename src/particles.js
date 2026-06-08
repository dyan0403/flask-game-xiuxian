export function spawnParticles(container, type, count) {
  const layer = document.createElement('div')
  layer.className = 'particles-layer'
  container.appendChild(layer)

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div')
    const delay = Math.random() * 8
    const duration = 5 + Math.random() * 10
    const left = Math.random() * 100

    if (type === 'linh-khi') {
      p.className = 'particle particle-linh-khi'
      const colors = ['#3aad77','#5ecf95','#40d8f0','#12b8d8','#8de8b8']
      const color = colors[Math.floor(Math.random() * colors.length)]
      p.style.cssText = `
        left: ${left}%;
        bottom: -10px;
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
        background: ${color};
        box-shadow: 0 0 6px ${color};
        --px-drift: ${(Math.random() - 0.5) * 80}px;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
      `
    } else if (type === 'fog') {
      p.className = 'particle particle-fog'
      const size = 80 + Math.random() * 200
      p.style.cssText = `
        left: -${size}px;
        top: ${Math.random() * 100}%;
        width: ${size}px;
        height: ${size * 0.6}px;
        --px-color: rgba(90,42,170,0.12);
        --py: ${(Math.random() - 0.5) * 40}px;
        animation-delay: ${delay}s;
        animation-duration: ${15 + Math.random() * 20}s;
      `
    } else if (type === 'ember') {
      p.className = 'particle particle-ember'
      const colors = ['#f07840','#e85020','#f8a878','#f8c840']
      const color = colors[Math.floor(Math.random() * colors.length)]
      p.style.cssText = `
        left: ${left}%;
        bottom: -6px;
        --px-color: ${color};
        --px-drift: ${(Math.random() - 0.5) * 60}px;
        animation-delay: ${delay}s;
        animation-duration: ${4 + Math.random() * 6}s;
      `
    } else if (type === 'petal') {
      p.className = 'particle particle-petal'
      p.textContent = ['🌸','🌺','🌼','✿','❀'][Math.floor(Math.random() * 5)]
      p.style.cssText = `
        left: ${left}%;
        top: -20px;
        font-size: ${8 + Math.random() * 8}px;
        --px-drift: ${(Math.random() - 0.5) * 80}px;
        animation-delay: ${delay}s;
        animation-duration: ${8 + Math.random() * 10}s;
      `
    } else if (type === 'cloud') {
      p.className = 'particle particle-cloud'
      const size = 120 + Math.random() * 280
      p.style.cssText = `
        left: -${size}px;
        top: ${Math.random() * 60}%;
        width: ${size}px;
        height: ${size * 0.5}px;
        animation-delay: ${delay}s;
        animation-duration: ${20 + Math.random() * 30}s;
      `
    }

    layer.appendChild(p)
  }

  return layer
}
