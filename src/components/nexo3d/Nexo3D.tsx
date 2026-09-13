import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import type { NexoPointer, NexoState } from '../../types/nexo'
import { animateNexo } from './NexoAnimations'
import { createNexoEnvironment } from './NexoEnvironment'
import { createNexoModel, disposeNexoModel } from './NexoModel'

type Nexo3DProps = {
  state: NexoState
  className?: string
  interactive?: boolean
  paused?: boolean
  onInteract?: () => void
  onPresenceChange?: (present: boolean) => void
}

const DEFAULT_POINTER: NexoPointer = { x: 0, y: 0 }

export function Nexo3D({
  state,
  className = '',
  interactive = true,
  paused = false,
  onInteract,
  onPresenceChange,
}: Nexo3DProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const pointerRef = useRef<NexoPointer>({ ...DEFAULT_POINTER })
  const stateRef = useRef<NexoState>(state)
  const pausedRef = useRef(paused)
  const reducedMotionRef = useRef(false)
  const wakeRef = useRef<() => void>(() => undefined)
  const [renderFailed, setRenderFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    stateRef.current = state
    wakeRef.current()
  }, [state])

  useEffect(() => {
    pausedRef.current = paused
    wakeRef.current()
  }, [paused])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => {
      reducedMotionRef.current = media.matches
      wakeRef.current()
    }
    updatePreference()
    media.addEventListener('change', updatePreference)
    return () => media.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    let renderer: THREE.WebGLRenderer
    let nexo: ReturnType<typeof createNexoModel> | undefined
    let atrium: ReturnType<typeof createNexoEnvironment> | undefined
    let room: RoomEnvironment | undefined
    let pmrem: THREE.PMREMGenerator | undefined
    let environmentTarget: THREE.WebGLRenderTarget | undefined
    let keyLight: THREE.DirectionalLight | undefined
    let resizeObserver: ResizeObserver | undefined
    let intersectionObserver: IntersectionObserver | undefined
    let frameId = 0
    let previousFrame = 0
    let elapsed = 0
    let disposed = false
    let contextLost = false
    let inView = true
    let ready = false
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog('#345e93', 13, 26)
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50)

    const canAnimate = () => ready && !disposed && !contextLost && inView && !document.hidden && !pausedRef.current

    function draw() {
      if (ready && !disposed && !contextLost && inView && !document.hidden) renderer.render(scene, camera)
    }

    function suspend() {
      cancelAnimationFrame(frameId)
      frameId = 0
      previousFrame = 0
    }

    function tick(now: number) {
      frameId = 0
      if (!canAnimate()) return
      const interval = reducedMotionRef.current ? 1000 / 30 : 1000 / 60
      if (!previousFrame || now - previousFrame >= interval - 1) {
        const delta = previousFrame ? Math.min((now - previousFrame) / 1000, 0.15) : 1 / 60
        previousFrame = now
        elapsed += delta
        animateNexo(nexo!, {
          state: stateRef.current, time: elapsed, delta,
          pointer: pointerRef.current, reducedMotion: reducedMotionRef.current,
        })
        atrium!.update(elapsed, reducedMotionRef.current)
        draw()
      }
      frameId = requestAnimationFrame(tick)
    }

    function wake() {
      if (!canAnimate()) {
        suspend()
        return
      }
      if (!frameId) frameId = requestAnimationFrame(tick)
    }

    function handleContextLost(event: Event) {
      event.preventDefault()
      contextLost = true
      suspend()
      setRenderFailed(true)
    }

    function handleContextRestored() {
      if (!disposed) setAttempt((value) => value + 1)
    }

    function dispose() {
      if (disposed) return
      disposed = true
      ready = false
      suspend()
      wakeRef.current = () => undefined
      resizeObserver?.disconnect()
      intersectionObserver?.disconnect()
      document.removeEventListener('visibilitychange', wake)
      renderer?.domElement.removeEventListener('webglcontextlost', handleContextLost)
      renderer?.domElement.removeEventListener('webglcontextrestored', handleContextRestored)
      if (nexo) disposeNexoModel(nexo)
      atrium?.dispose()
      room?.dispose()
      pmrem?.dispose()
      environmentTarget?.dispose()
      keyLight?.shadow.dispose()
      scene.clear()
      renderer?.dispose()
      renderer?.forceContextLoss()
      if (renderer?.domElement.parentNode === mount) mount!.removeChild(renderer.domElement)
    }

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
      renderer.setClearColor(0x000000, 0)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1
      renderer.domElement.style.display = 'block'
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      renderer.domElement.setAttribute('aria-hidden', 'true')
      renderer.domElement.addEventListener('webglcontextlost', handleContextLost)
      renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored)
      mount.appendChild(renderer.domElement)

      room = new RoomEnvironment()
      pmrem = new THREE.PMREMGenerator(renderer)
      environmentTarget = pmrem.fromScene(room, 0.055)
      scene.environment = environmentTarget.texture
      scene.environmentIntensity = 0.48
      room.dispose()
      room = undefined
      pmrem.dispose()
      pmrem = undefined

      nexo = createNexoModel()
      atrium = createNexoEnvironment()
      scene.add(atrium.group, nexo.root)

      scene.add(new THREE.HemisphereLight('#e7f4ff', '#375e9d', 0.9))
      keyLight = new THREE.DirectionalLight('#fff9f2', 2.2)
      keyLight.position.set(-3.8, 6.4, 6.5)
      keyLight.castShadow = true
      keyLight.shadow.mapSize.set(1024, 1024)
      keyLight.shadow.camera.near = 0.5
      keyLight.shadow.camera.far = 20
      keyLight.shadow.camera.left = -5
      keyLight.shadow.camera.right = 5
      keyLight.shadow.camera.top = 5
      keyLight.shadow.camera.bottom = -4
      keyLight.shadow.normalBias = 0.025
      keyLight.shadow.bias = -0.0001
      keyLight.shadow.radius = 3
      scene.add(keyLight)

      const fill = new THREE.DirectionalLight('#b8ddff', 0.7)
      fill.position.set(4, 2.5, 5)
      const rim = new THREE.DirectionalLight('#70bfff', 2.6)
      rim.position.set(1.5, 3, -3.5)
      const portalLight = new THREE.PointLight('#8ad9ff', 8, 9, 2)
      portalLight.position.set(0, 1, -2.5)
      scene.add(fill, rim, portalLight)

      function resize() {
        if (disposed || !mount) return
        const width = Math.max(mount.clientWidth, 1)
        const height = Math.max(mount.clientHeight, 1)
        const aspect = width / height
        const distance = Math.max(9.5, 2.65 / (Math.tan(THREE.MathUtils.degToRad(17)) * aspect))
        camera.aspect = aspect
        camera.position.set(0, 1.15, distance)
        camera.lookAt(0, 0.02, 0)
        camera.updateProjectionMatrix()
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 600 ? 1.5 : 1.8))
        renderer.setSize(width, height, false)
        draw()
      }

      ready = true
      animateNexo(nexo, {
        state: stateRef.current, time: 0, delta: 0.05,
        pointer: DEFAULT_POINTER, reducedMotion: reducedMotionRef.current,
      })
      atrium.update(0, reducedMotionRef.current)
      resize()
      resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(mount)
      if ('IntersectionObserver' in window) {
        intersectionObserver = new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting
          if (inView) draw()
          wake()
        }, { rootMargin: '80px' })
        intersectionObserver.observe(mount)
      }
      document.addEventListener('visibilitychange', wake)
      wakeRef.current = wake
      setRenderFailed(false)
      wake()
    } catch {
      dispose()
      setRenderFailed(true)
    }

    return dispose
  }, [attempt])

  function updatePointer(event: ReactPointerEvent<HTMLDivElement>) {
    if (!interactive) return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerRef.current = {
      x: Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2)),
      y: Math.max(-1, Math.min(1, -((event.clientY - bounds.top) / bounds.height - 0.5) * 2)),
    }
    wakeRef.current()
  }

  function handlePresence(present: boolean) {
    if (!interactive) return
    if (!present) pointerRef.current = { ...DEFAULT_POINTER }
    onPresenceChange?.(present)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!interactive || (event.key !== 'Enter' && event.key !== ' ') || event.repeat) return
    event.preventDefault()
    onInteract?.()
  }

  const heightClass = className.split(/\s+/).includes('journey-avatar') ? '' : 'h-[520px] sm:h-[620px] lg:h-[700px]'

  return (
    <div className={`relative w-full ${heightClass} ${className}`}>
      <div
        className={`absolute inset-0 rounded-[inherit] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200 focus-visible:outline-offset-[-4px] ${interactive ? 'cursor-pointer' : ''}`}
        role={interactive ? 'button' : 'img'}
        tabIndex={interactive && !renderFailed ? 0 : undefined}
        aria-hidden={renderFailed || undefined}
        aria-label={interactive ? 'Nexo, seu companheiro virtual. Mova o cursor ou pressione Enter para receber um aceno.' : 'Nexo em seu ambiente de evolução.'}
        onPointerMove={updatePointer}
        onPointerEnter={() => handlePresence(true)}
        onPointerLeave={() => handlePresence(false)}
        onPointerDown={(event) => {
          if (event.pointerType === 'touch') { updatePointer(event); handlePresence(true) }
        }}
        onPointerUp={(event) => { if (event.pointerType === 'touch') handlePresence(false) }}
        onPointerCancel={() => handlePresence(false)}
        onFocus={() => handlePresence(true)}
        onBlur={() => handlePresence(false)}
        onClick={() => { if (interactive) onInteract?.() }}
        onKeyDown={handleKeyDown}
      >
        <div ref={mountRef} className="absolute inset-0 rounded-[inherit]" />
      </div>
      {renderFailed && (
        <div className="absolute inset-0 overflow-hidden rounded-[inherit] bg-[#163d71]">
          <img src="/image/nexo-stage.png" alt="Nexo, um robô branco com visor azul luminoso, acenando em seu ambiente." className="h-full w-full object-contain" />
          <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-[#0b2351]/90 p-3 text-center text-xs text-white">
            <span role="status">A visualização 3D está temporariamente indisponível.</span>
            <button type="button" onClick={() => setAttempt((value) => value + 1)} className="rounded-full bg-white px-4 py-2 font-semibold text-[#153869] outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2">
              Tentar novamente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
