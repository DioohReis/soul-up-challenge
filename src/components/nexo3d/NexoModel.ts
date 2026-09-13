import * as THREE from 'three'

const COLORS = {
  white: '#f5f8ff',
  navy: '#020817',
  blue: '#1679f1',
  cyan: '#51dfff',
}

function enableShadow<T extends THREE.Object3D>(mesh: T): T {
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

function ellipsoid(material: THREE.Material, x: number, y: number, z: number) {
  const mesh = enableShadow(new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), material))
  mesh.scale.set(x, y, z)
  return mesh
}

function createHand(material: THREE.Material, side: -1 | 1) {
  const hand = new THREE.Group()
  const palm = ellipsoid(material, 0.265, 0.30, 0.19)
  palm.castShadow = false
  palm.receiveShadow = false
  palm.position.y = -0.035
  hand.add(palm)
  const fingers = [
    [-0.16, -0.23, 0.085, 0.17], [-0.055, -0.285, 0.09, 0.205],
    [0.055, -0.28, 0.09, 0.195], [0.16, -0.225, 0.08, 0.16],
  ]
  fingers.forEach(([x, y, width, height]) => {
    const finger = ellipsoid(material, width, height, 0.105)
    finger.position.set(x, y, 0.005)
    finger.rotation.z = -x * 0.62
    hand.add(finger)
  })
  const thumb = ellipsoid(material, 0.11, 0.185, 0.12)
  thumb.position.set(-side * 0.24, -0.04, 0.055)
  thumb.rotation.z = -side * 0.55
  hand.add(thumb)
  return hand
}

function createArm(material: THREE.Material, side: -1 | 1) {
  const shoulder = new THREE.Group()
  shoulder.position.set(side * 1.035, 0.73, 0.015)

  const profile = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.28, 0), new THREE.Vector3(0.22, 0.17, 0),
    new THREE.Vector3(0.29, -0.08, 0), new THREE.Vector3(0.30, -0.32, 0),
    new THREE.Vector3(0.235, -0.60, 0), new THREE.Vector3(0.255, -0.86, 0),
    new THREE.Vector3(0.21, -1.13, 0), new THREE.Vector3(0.19, -1.27, 0),
    new THREE.Vector3(0, -1.34, 0),
  ], false, 'centripetal')
  const segments = 72
  const radialSegments = 48
  const positions: number[] = []
  const indices: number[] = []
  const skinIndices: number[] = []
  const weights: number[] = []
  for (let row = 0; row <= segments; row += 1) {
    const point = profile.getPoint(row / segments)
    const t = THREE.MathUtils.clamp(-point.y / 1.27, 0, 1)
    const centerX = side * (0.22 * t + 0.055 * Math.sin(t * Math.PI))
    const blend = THREE.MathUtils.smoothstep(-point.y, 0.44, 0.76)
    for (let column = 0; column <= radialSegments; column += 1) {
      const angle = column / radialSegments * Math.PI * 2
      positions.push(centerX + Math.cos(angle) * point.x, point.y,
        Math.sin(angle) * point.x * 0.94 + 0.025 * t)
      skinIndices.push(0, 1, 0, 0)
      weights.push(1 - blend, blend, 0, 0)
      if (row < segments && column < radialSegments) {
        const a = row * (radialSegments + 1) + column
        const b = a + radialSegments + 1
        indices.push(a, a + 1, b, b, a + 1, b + 1)
      }
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4))
  geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(weights, 4))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  const normals = geometry.attributes.normal
  for (let row = 0; row <= segments; row += 1) {
    const a = row * (radialSegments + 1)
    const b = a + radialSegments
    const normal = new THREE.Vector3().fromBufferAttribute(normals, a)
      .add(new THREE.Vector3().fromBufferAttribute(normals, b)).normalize()
    normals.setXYZ(a, normal.x, normal.y, normal.z)
    normals.setXYZ(b, normal.x, normal.y, normal.z)
  }
  const skin = enableShadow(new THREE.SkinnedMesh(geometry, material))
  skin.receiveShadow = false
  const upperBone = new THREE.Bone()
  const forearm = new THREE.Bone()
  forearm.position.set(side * 0.16, -0.60, 0)
  upperBone.add(forearm)
  skin.add(upperBone)
  skin.bind(new THREE.Skeleton([upperBone, forearm]))
  shoulder.add(skin)
  const hand = createHand(material, side)
  hand.position.set(side * 0.08, -0.63, 0.03)
  forearm.add(hand)
  return { shoulder, forearm, hand }
}

function roundedRectangle(width: number, height: number, radius: number) {
  const shape = new THREE.Shape()
  const x = -width / 2
  const y = -height / 2
  shape.moveTo(x + radius, y)
  shape.lineTo(x + width - radius, y)
  shape.quadraticCurveTo(x + width, y, x + width, y + radius)
  shape.lineTo(x + width, y + height - radius)
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  shape.lineTo(x + radius, y + height)
  shape.quadraticCurveTo(x, y + height, x, y + height - radius)
  shape.lineTo(x, y + radius)
  shape.quadraticCurveTo(x, y, x + radius, y)
  return shape
}

function createVisorGeometry(width: number, height: number, depth: number) {
  const outline = roundedRectangle(width, height, height * 0.46).getSpacedPoints(128)
  const count = outline.length - 1
  const rings = 32
  const positions: number[] = [0, 0, depth]
  const normals: number[] = [0, 0, 1]
  const indices: number[] = []
  for (let ring = 1; ring <= rings; ring += 1) {
    const t = ring / rings
    for (let segment = 0; segment < count; segment += 1) {
      const x = outline[segment].x * t
      const y = outline[segment].y * t
      positions.push(x, y, depth - 0.105 * x * x - 0.20 * y * y)
      const normal = new THREE.Vector3(0.21 * x, 0.40 * y, 1).normalize()
      normals.push(normal.x, normal.y, normal.z)
      const current = 1 + (ring - 1) * count + segment
      const next = 1 + (ring - 1) * count + (segment + 1) % count
      if (ring === 1) indices.push(0, current, next)
      else {
        const previous = current - count
        const previousNext = next - count
        indices.push(previous, current, next, previous, next, previousNext)
      }
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geometry.setIndex(indices)
  return geometry
}

function createGlowTexture() {
  const size = 64
  const pixels = new Uint8Array(size * size * 4)
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const radius = Math.hypot((x + 0.5) / size * 2 - 1, (y + 0.5) / size * 2 - 1)
      const offset = (y * size + x) * 4
      pixels[offset] = 58
      pixels[offset + 1] = 217
      pixels[offset + 2] = 255
      pixels[offset + 3] = Math.round(Math.pow(Math.max(0, 1 - radius), 2.5) * 255)
    }
  }
  const texture = new THREE.DataTexture(pixels, size, size)
  texture.needsUpdate = true
  return texture
}

function createLeafGeometry(side: -1 | 1) {
  const shape = new THREE.Shape()
  shape.moveTo(0, -0.31)
  shape.bezierCurveTo(side * 0.16, -0.20, side * 0.39, -0.015, side * 0.30, 0.20)
  shape.bezierCurveTo(side * 0.245, 0.36, side * 0.035, 0.29, side * 0.018, 0.105)
  shape.bezierCurveTo(side * 0.006, -0.035, side * 0.01, -0.21, 0, -0.31)
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.055, bevelEnabled: true, bevelSegments: 6, curveSegments: 24,
    steps: 1, bevelSize: 0.019, bevelThickness: 0.03,
  })
  const colors: number[] = []
  const top = new THREE.Color('#0745d6')
  const bottom = new THREE.Color('#27dbed')
  const positions = geometry.attributes.position
  for (let index = 0; index < positions.count; index += 1) {
    const fraction = THREE.MathUtils.clamp((positions.getY(index) + 0.15) / 0.40, 0, 1)
    const color = bottom.clone().lerp(top, fraction)
    colors.push(color.r, color.g, color.b)
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  return geometry
}

function createCore(coreMaterial: THREE.MeshStandardMaterial, glowTexture: THREE.Texture) {
  const group = new THREE.Group()
  group.position.set(0, 0.40, 0.972)
  group.rotation.x = -0.10
  const heart = new THREE.Group()
  const outlineMaterial = new THREE.MeshBasicMaterial({ color: '#86efff', toneMapped: false })
  for (const side of [-1, 1] as const) {
    const leaf = new THREE.Mesh(createLeafGeometry(side), coreMaterial)
    leaf.position.x = side * 0.012
    heart.add(leaf)
    const outline = new THREE.Mesh(leaf.geometry, outlineMaterial)
    outline.scale.set(1.07, 1.065, 0.92)
    outline.position.set(side * 0.012, 0, -0.024)
    heart.add(outline)
  }
  heart.scale.setScalar(0.82)
  heart.userData.baseScale = 0.82
  group.add(heart)
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(1.16, 1.16),
    new THREE.MeshBasicMaterial({ map: glowTexture, transparent: true, opacity: 0.48,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }))
  halo.position.z = 0.016
  group.add(halo)
  const light = new THREE.PointLight(COLORS.cyan, 0.40, 1.5, 2)
  light.position.z = 0.22
  group.add(light)
  return { group, heart, halo, light }
}

function addCurve(parent: THREE.Object3D, points: THREE.Vector3[], radius: number, material: THREE.Material) {
  const curve = new THREE.CatmullRomCurve3(points)
  const line = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, radius, 8, false), material)
  parent.add(line)
  return line
}

export function createNexoModel() {
  const pearlMaterial = new THREE.MeshPhysicalMaterial({
    color: COLORS.white, roughness: 0.31, metalness: 0, clearcoat: 0.48,
    clearcoatRoughness: 0.26, sheen: 0.32, sheenColor: new THREE.Color('#d9eaff'),
  })
  const blueMaterial = new THREE.MeshPhysicalMaterial({
    color: COLORS.blue, roughness: 0.24, metalness: 0.10, clearcoat: 0.8,
  })
  const visorMaterial = new THREE.MeshPhysicalMaterial({
    color: '#02091e', roughness: 0.29, metalness: 0.02, clearcoat: 0.55, clearcoatRoughness: 0.32, envMapIntensity: 0.24,
  })
  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: '#209ffe', emissive: '#0bbdff', emissiveIntensity: 0.95, roughness: 0.28, toneMapped: false,
  })
  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: '#ffffff', vertexColors: true, emissive: '#062455', emissiveIntensity: 0.48, envMapIntensity: 0.25,
    roughness: 0.30, metalness: 0.03, clearcoat: 0.55, clearcoatRoughness: 0.25,
  })
  const seamMaterial = new THREE.MeshStandardMaterial({ color: '#c7d7ed', roughness: 0.6 })
  const glowTexture = createGlowTexture()
  const root = new THREE.Group()
  root.name = 'Nexo3D'
  root.userData.baseY = -0.16
  root.rotation.y = -0.10

  const torsoProfile = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -1.34, 0), new THREE.Vector3(0.62, -1.33, 0),
    new THREE.Vector3(1.02, -1.22, 0), new THREE.Vector3(1.29, -0.88, 0),
    new THREE.Vector3(1.37, -0.42, 0), new THREE.Vector3(1.30, 0.12, 0),
    new THREE.Vector3(1.13, 0.60, 0), new THREE.Vector3(0.91, 0.96, 0),
    new THREE.Vector3(0.59, 1.14, 0), new THREE.Vector3(0, 1.19, 0),
  ], false, 'centripetal')
  const profilePoints = torsoProfile.getPoints(100).map((point) => new THREE.Vector2(point.x, point.y))
  const bodyGeometry = new THREE.LatheGeometry(profilePoints, 96)
  bodyGeometry.scale(1, 1, 0.79)
  const body = enableShadow(new THREE.Mesh(bodyGeometry, pearlMaterial))
  body.userData.baseScaleY = 1
  body.position.y = -0.045
  root.add(body)

  for (const side of [-1, 1] as const) {
    addCurve(root, [
      new THREE.Vector3(side * 0.83, 0.93, 0.19), new THREE.Vector3(side * 1.12, 0.47, 0.36),
      new THREE.Vector3(side * 1.29, -0.03, 0.40), new THREE.Vector3(side * 1.29, -0.53, 0.35),
      new THREE.Vector3(side * 1.05, -1.02, 0.19),
    ], 0.044, blueMaterial)
  }
  const seamPoints = profilePoints.filter((point) => point.y > -1.31 && point.y < 0.1)
    .map((point) => new THREE.Vector3(0, point.y, point.x * 0.79 + 0.002))
  addCurve(body, seamPoints, 0.003, seamMaterial)

  const leftFoot = ellipsoid(pearlMaterial, 0.465, 0.38, 0.59)
  leftFoot.position.set(-0.49, -1.32, 0.105)
  leftFoot.rotation.z = -0.07
  root.add(leftFoot)
  const rightFoot = leftFoot.clone()
  rightFoot.position.x = 0.49
  rightFoot.rotation.z = 0.07
  root.add(rightFoot)

  const head = new THREE.Group()
  head.position.set(0, 1.49, 0.035)
  root.add(head)
  const headGeometry = new THREE.SphereGeometry(1, 80, 56)
  const headPositions = headGeometry.attributes.position
  for (let index = 0; index < headPositions.count; index += 1) {
    const x = headPositions.getX(index)
    const y = headPositions.getY(index)
    const z = headPositions.getZ(index)
    headPositions.setXYZ(index,
      Math.sign(x) * Math.pow(Math.abs(x), 0.86) * 1.13,
      Math.sign(y) * Math.pow(Math.abs(y), y < 0 ? 0.63 : 0.96) * (y < 0 ? 0.59 : 0.79),
      Math.sign(z) * Math.pow(Math.abs(z), 0.65) * 0.76)
  }
  headGeometry.computeVertexNormals()
  const headShell = enableShadow(new THREE.Mesh(headGeometry, pearlMaterial))
  head.add(headShell)

  const visorRim = new THREE.Mesh(createVisorGeometry(1.805, 0.665, 0.012),
    new THREE.MeshStandardMaterial({ color: '#a6bfdd', metalness: 0.25, roughness: 0.32 }))
  visorRim.position.set(0, -0.025, 0.757)
  head.add(visorRim)
  const visor = new THREE.Mesh(createVisorGeometry(1.77, 0.63, 0.034), visorMaterial)
  visor.position.set(0, -0.025, 0.768)
  head.add(visor)
  const reflectionMaterial = new THREE.MeshBasicMaterial({ color: '#a4bfff', transparent: true, opacity: 0.045, depthWrite: false })
  addCurve(head, [
    new THREE.Vector3(-0.70, 0.18, 0.692), new THREE.Vector3(-0.43, 0.257, 0.764),
    new THREE.Vector3(-0.05, 0.26, 0.797), new THREE.Vector3(0.35, 0.235, 0.777),
  ], 0.012, reflectionMaterial)

  for (const side of [-1, 1] as const) {
    const ear = ellipsoid(blueMaterial, 0.055, 0.225, 0.16)
    ear.position.set(side * 1.119, -0.045, 0.005)
    ear.rotation.z = side * -0.18
    head.add(ear)
    const earLight = ellipsoid(new THREE.MeshBasicMaterial({ color: '#7cddff' }), 0.018, 0.151, 0.105)
    earLight.position.set(side * 1.166, -0.045, 0.02)
    earLight.rotation.z = side * -0.18
    head.add(earLight)
  }
  const normalEyes = new THREE.Group()
  head.add(normalEyes)
  const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.112, 32, 24), eyeMaterial)
  leftEye.scale.set(1, 1.12, 0.47)
  leftEye.position.set(-0.405, -0.018, 0.797)
  normalEyes.add(leftEye)
  const rightEye = leftEye.clone()
  rightEye.position.x = 0.405
  normalEyes.add(rightEye)
  const eyeGlows: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] = []
  for (const eye of [leftEye, rightEye]) {
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.48),
      new THREE.MeshBasicMaterial({ map: glowTexture, transparent: true, opacity: 0.7,
        depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }))
    glow.position.copy(eye.position)
    glow.position.z += 0.065
    normalEyes.add(glow)
    eyeGlows.push(glow)
  }
  const eyeBridge = new THREE.Mesh(new THREE.CylinderGeometry(0.010, 0.010, 0.64, 12), eyeMaterial)
  eyeBridge.rotation.z = Math.PI / 2
  eyeBridge.position.set(0, -0.018, 0.815)
  normalEyes.add(eyeBridge)
  const happyEyes = new THREE.Group()
  happyEyes.visible = false
  head.add(happyEyes)
  for (const side of [-1, 1] as const) {
    const eye = new THREE.Mesh(new THREE.TorusGeometry(0.109, 0.020, 10, 32, Math.PI), eyeMaterial)
    eye.position.set(side * 0.405, -0.06, 0.817)
    happyEyes.add(eye)
  }
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.102, 0.012, 8, 28, Math.PI), eyeMaterial)
  smile.rotation.z = Math.PI
  smile.position.set(0, -0.076, 0.815)
  happyEyes.add(smile)

  const leftArmParts = createArm(pearlMaterial, -1)
  const rightArmParts = createArm(pearlMaterial, 1)
  leftArmParts.shoulder.rotation.z = -0.16
  rightArmParts.shoulder.rotation.z = 0.16
  root.add(leftArmParts.shoulder, rightArmParts.shoulder)
  const core = createCore(coreMaterial, glowTexture)
  root.add(core.group)
  const chestSensor = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.009, 10, 48),
    new THREE.MeshStandardMaterial({ color: '#a9c4f6', roughness: 0.42 }))
  chestSensor.scale.y = 1.19
  chestSensor.position.set(0.68, 0.50, 0.774)
  chestSensor.rotation.set(-0.22, 0.36, -0.16)
  root.add(chestSensor)
  root.position.y = root.userData.baseY
  return {
    root, body, head, headShell, visor, normalEyes, happyEyes, leftEye, rightEye, eyeBridge, eyeGlows,
    leftShoulder: leftArmParts.shoulder, leftForearm: leftArmParts.forearm, leftHand: leftArmParts.hand,
    rightShoulder: rightArmParts.shoulder, rightForearm: rightArmParts.forearm, rightHand: rightArmParts.hand,
    coreGroup: core.group, coreHeart: core.heart, coreHalo: core.halo, coreLight: core.light,
    coreMaterial, pearlMaterial, blueMaterial, eyeMaterial,
  }
}

export type NexoParts = ReturnType<typeof createNexoModel>

export function disposeNexoModel(parts: NexoParts) {
  const geometries = new Set<THREE.BufferGeometry>()
  const materials = new Set<THREE.Material>()
  const textures = new Set<THREE.Texture>()
  parts.root.traverse((object) => {
    if (!(object instanceof THREE.Mesh || object instanceof THREE.Sprite)) return
    geometries.add(object.geometry)
    if (object instanceof THREE.SkinnedMesh) object.skeleton.dispose()
    const objectMaterials = Array.isArray(object.material) ? object.material : [object.material]
    objectMaterials.forEach((material: THREE.Material) => {
      if (!material) return
      materials.add(material)
      if ('map' in material && material.map instanceof THREE.Texture) textures.add(material.map)
    })
  })
  geometries.forEach(geometry => geometry.dispose())
  materials.forEach(material => material.dispose())
  textures.forEach(texture => texture.dispose())
}
