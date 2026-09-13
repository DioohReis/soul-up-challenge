import * as THREE from 'three'

export function createNexoEnvironment() {
  const group = new THREE.Group()
  group.name = 'Nexo atrium'
  const floorY = -2.03
  const textures = new Set<THREE.Texture>()
  const materials = new Set<THREE.Material>()
  const geometries = new Set<THREE.BufferGeometry>()
  const material = (color: string, roughness = 0.55, metalness = 0.08) => {
    const result = new THREE.MeshStandardMaterial({ color, roughness, metalness })
    materials.add(result)
    return result
  }
  const luminous = (color: string, opacity = 1) => {
    const result = new THREE.MeshBasicMaterial({
      color, transparent: opacity < 1, opacity, toneMapped: false,
      depthWrite: opacity === 1,
    })
    materials.add(result)
    return result
  }
  const add = (geometry: THREE.BufferGeometry, surface: THREE.Material, x: number, y: number, z: number, parent = group) => {
    geometries.add(geometry)
    const mesh = new THREE.Mesh(geometry, surface)
    mesh.position.set(x, y, z)
    mesh.receiveShadow = true
    parent.add(mesh)
    return mesh
  }
  const radialTexture = (shadow = false) => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 128
    const context = canvas.getContext('2d')!
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, shadow ? 'rgba(8,24,67,0.48)' : 'rgba(143,221,255,0.68)')
    gradient.addColorStop(0.34, shadow ? 'rgba(8,24,67,0.30)' : 'rgba(100,191,255,0.30)')
    gradient.addColorStop(1, shadow ? 'rgba(8,24,67,0)' : 'rgba(100,191,255,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, 128, 128)
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    textures.add(texture)
    return texture
  }

  const architecture = material('#477ab6', 0.66)
  const innerArch = material('#76a6d5', 0.48)
  const pale = material('#b2d4f4', 0.4)
  const edge = material('#4788d1', 0.32, 0.18)
  const cyan = luminous('#91e7ff')
  const white = luminous('#d5f7ff', 0.92)
  const softCyan = luminous('#6ad9ff', 0.53)
  const floor = add(new THREE.PlaneGeometry(30, 26), material('#557faa', 0.54), 0, floorY, -4)
  floor.rotation.x = -Math.PI / 2

  add(new THREE.PlaneGeometry(22, 14), material('#254c80', 0.9), 0, 3.6, -4.2)
  add(new THREE.CircleGeometry(3.84, 96), architecture, 0, 0.7, -4.05)
  add(new THREE.CircleGeometry(3.13, 96), material('#609dd3', 0.8), 0, 0.7, -3.96)
  ;([
    [3.86, 0.16, -3.87, architecture],
    [3.5, 0.095, -3.76, innerArch],
    [3.17, 0.16, -3.68, pale],
    [2.98, 0.016, -3.48, softCyan],
    [2.79, 0.065, -3.39, innerArch],
  ] satisfies [number, number, number, THREE.Material][]).forEach(([radius, tube, z, surface]) => {
    add(new THREE.TorusGeometry(radius, tube, 12, 96), surface, 0, 0.7, z as number)
  })

  const glowTexture = radialTexture()
  const portalGlowMaterial = new THREE.SpriteMaterial({
    map: glowTexture, transparent: true, opacity: 0.28,
    depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
  })
  materials.add(portalGlowMaterial)
  const portalGlow = new THREE.Sprite(portalGlowMaterial)
  portalGlow.position.set(0, 0.95, -3.2)
  portalGlow.scale.set(7.3, 7.3, 1)
  group.add(portalGlow)

  for (const side of [-1, 1]) {
    for (let index = 0; index < 3; index += 1) {
      const x = side * (4.15 + index * 1.2)
      const column = add(new THREE.BoxGeometry(0.26, 6.8, 0.32), architecture, x, 1.25, -3.25)
      column.castShadow = true
      add(new THREE.BoxGeometry(0.025, 5.7, 0.025), softCyan, x - side * 0.12, 1.4, -3.065)
    }
    const plinth = add(new THREE.BoxGeometry(0.56, 1.58, 0.5), innerArch, side * 3.64, -1.21, -2.58)
    plinth.castShadow = true
    add(new THREE.CircleGeometry(0.19, 32), edge, side * 3.64, -0.66, -2.316)
    add(new THREE.TorusGeometry(0.12, 0.024, 8, 32), softCyan, side * 3.64, -0.66, -2.297)
  }

  add(new THREE.CylinderGeometry(2.24, 2.27, 0.155, 96), edge, 0, -1.9525, 0)
  add(new THREE.CylinderGeometry(2.20, 2.20, 0.016, 96), pale, 0, -1.868, 0)
  const pedestalRim = add(new THREE.TorusGeometry(2.225, 0.018, 8, 96), cyan, 0, -1.875, 0)
  pedestalRim.rotation.x = -Math.PI / 2
  for (const [radius, y, surface] of [[1.69, -1.856, white], [2.71, -2.016, cyan], [3.07, -2.018, softCyan]] satisfies [number, number, THREE.Material][]) {
    const ring = add(new THREE.TorusGeometry(radius, 0.012, 8, 128), surface, 0, y as number, 0)
    ring.rotation.x = -Math.PI / 2
  }
  const shadowMaterial = new THREE.MeshBasicMaterial({
    map: radialTexture(true), transparent: true, depthWrite: false,
    polygonOffset: true, polygonOffsetFactor: -1,
  })
  materials.add(shadowMaterial)
  const contactShadow = add(new THREE.PlaneGeometry(2.7, 1.55), shadowMaterial, 0, -1.851, 0.1)
  contactShadow.rotation.x = -Math.PI / 2

  const potMaterial = material('#c0d9ef', 0.42)
  const soilMaterial = material('#284966', 0.96)
  const leafMaterials = [material('#297e92', 0.63), material('#4ba4b1', 0.59), material('#3e8b9d', 0.62)]
  const leafShape = new THREE.Shape()
  leafShape.moveTo(0, 0)
  leafShape.bezierCurveTo(-0.38, 0.3, -0.31, 0.69, 0, 1)
  leafShape.bezierCurveTo(0.3, 0.68, 0.38, 0.3, 0, 0)
  const leafGeometry = new THREE.ExtrudeGeometry(leafShape, {
    depth: 0.025, bevelEnabled: true, bevelSegments: 2,
    steps: 1, bevelSize: 0.028, bevelThickness: 0.023, curveSegments: 10,
  })
  const stemGeometry = new THREE.CylinderGeometry(0.018, 0.022, 0.7, 6)
  for (const [x, z, scale] of [[-3.03, -1.7, 1], [3.17, -1.54, 1.17], [4.52, -2.6, 0.73]]) {
    const plant = new THREE.Group()
    plant.position.set(x, floorY, z)
    plant.scale.setScalar(scale)
    group.add(plant)
    add(new THREE.CylinderGeometry(0.29, 0.22, 0.53, 32), potMaterial, 0, 0.265, 0, plant).castShadow = true
    add(new THREE.CircleGeometry(0.25, 32), soilMaterial, 0, 0.533, 0, plant).rotation.x = -Math.PI / 2
    for (let index = 0; index < 7; index += 1) {
      const angle = index * 2.4
      const lean = index === 6 ? 0.1 : 0.45 + (index % 3) * 0.2
      const branch = new THREE.Group()
      branch.position.y = 0.5
      branch.rotation.set(Math.sin(angle) * lean, angle, Math.cos(angle) * lean)
      plant.add(branch)
      add(stemGeometry, leafMaterials[0], 0, 0.3, 0, branch)
      const leaf = add(leafGeometry, leafMaterials[index % 3], 0, 0.39, 0, branch)
      leaf.scale.set(0.65, 0.62 + (index % 3) * 0.12, 1)
      leaf.rotation.y = -angle * 0.6
      leaf.castShadow = true
    }
  }

  const moteMaterial = new THREE.SpriteMaterial({
    map: glowTexture, transparent: true, opacity: 0.48,
    depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
  })
  materials.add(moteMaterial)
  const motes = Array.from({ length: 9 }, (_, index) => {
    const mote = new THREE.Sprite(moteMaterial)
    const x = Math.sin(index * 2.4) * 2.65
    const y = -0.6 + (index % 4) * 0.89
    mote.position.set(x, y, -2.4 - (index % 3) * 0.12)
    mote.scale.setScalar(0.045 + (index % 3) * 0.015)
    group.add(mote)
    return { mote, x, y }
  })

  return {
    group,
    floorY,
    update(time: number, reducedMotion: boolean) {
      const t = reducedMotion ? 0 : time
      portalGlowMaterial.opacity = 0.26 + Math.sin(t * 0.44) * 0.02
      softCyan.opacity = 0.5 + Math.sin(t * 0.8) * 0.07
      motes.forEach(({ mote, x, y }, index) => {
        mote.position.x = x + Math.sin(t * 0.2 + index) * (reducedMotion ? 0 : 0.08)
        mote.position.y = y + Math.sin(t * 0.31 + index * 0.9) * (reducedMotion ? 0 : 0.1)
      })
    },
    dispose() {
      geometries.forEach((geometry) => geometry.dispose())
      materials.forEach((surface) => surface.dispose())
      textures.forEach((texture) => texture.dispose())
      group.clear()
    },
  }
}
