import * as THREE from 'three'
import type { NexoPointer, NexoState } from '../../types/nexo'
import type { NexoParts } from './NexoModel'

type AnimationFrame = {
  state: NexoState
  time: number
  delta: number
  pointer: NexoPointer
  reducedMotion: boolean
}

type Pose = {
  leftShoulder: number
  leftForearm: number
  rightShoulder: number
  rightForearm: number
  headTilt: number
  coreIntensity: number
  happyEyes: boolean
}

const POSES: Record<NexoState, Pose> = {
  idle: { leftShoulder: -0.16, leftForearm: 0.08, rightShoulder: 0.16, rightForearm: -0.08, headTilt: -0.065, coreIntensity: 0.48, happyEyes: false },
  looking: { leftShoulder: -0.20, leftForearm: 0.10, rightShoulder: 0.18, rightForearm: -0.08, headTilt: -0.045, coreIntensity: 0.56, happyEyes: false },
  listening: { leftShoulder: -0.32, leftForearm: -0.16, rightShoulder: 0.13, rightForearm: -0.10, headTilt: -0.09, coreIntensity: 0.64, happyEyes: false },
  thinking: { leftShoulder: -0.12, leftForearm: 0.08, rightShoulder: 0, rightForearm: 0, headTilt: -0.10, coreIntensity: 0.46, happyEyes: false },
  talking: { leftShoulder: -0.62, leftForearm: -0.45, rightShoulder: 0.24, rightForearm: -0.18, headTilt: 0.025, coreIntensity: 0.68, happyEyes: false },
  happy: { leftShoulder: -2.42, leftForearm: -0.12, rightShoulder: 0.18, rightForearm: -0.09, headTilt: 0.065, coreIntensity: 0.76, happyEyes: true },
  celebrating: { leftShoulder: -2.25, leftForearm: -0.16, rightShoulder: 2.25, rightForearm: 0.16, headTilt: 0, coreIntensity: 0.96, happyEyes: true },
  sleeping: { leftShoulder: -0.12, leftForearm: 0.05, rightShoulder: 0.12, rightForearm: -0.05, headTilt: -0.06, coreIntensity: 0.23, happyEyes: false },
}

const armEuler = new THREE.Euler()
const armQuaternion = new THREE.Quaternion()

const thinkingShoulder = new THREE.Quaternion().setFromEuler(
  new THREE.Euler(-1.36, 0.723, -0.37, 'XYZ'),
)

const thinkingForearm = new THREE.Quaternion().setFromAxisAngle(
  new THREE.Vector3(0, 0, 1), -1.05,
)

function smooth(current: number, target: number, speed: number, delta: number) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-speed * Math.min(delta, 0.15)))
}

function animateRotation(object: THREE.Object3D, axis: 'x' | 'y' | 'z', target: number, speed: number, delta: number) {
  object.rotation[axis] = smooth(object.rotation[axis], target, speed, delta)
}

function animateJoint(object: THREE.Object3D, z: number, x: number, delta: number) {
  armQuaternion.setFromEuler(armEuler.set(x, 0, z))
  object.quaternion.slerp(armQuaternion, 1 - Math.exp(-7 * Math.min(delta, 0.15)))
}

function animateElbow(object: THREE.Object3D, angle: number, delta: number) {
  animateJoint(object, THREE.MathUtils.clamp(angle, -Math.PI * 5 / 12, Math.PI * 5 / 12), 0, delta)
}

export function animateNexo(parts: NexoParts, frame: AnimationFrame) {
  const { state, time, delta, pointer, reducedMotion } = frame
  const pose = POSES[state]
  const motion = reducedMotion ? 0 : 1
  const celebrationBounce = state === 'celebrating'
    ? Math.pow(Math.max(0, Math.sin(time * 5.4)), 2) * 0.085 * motion
    : 0

  parts.root.position.y = smooth(
    parts.root.position.y,
    parts.root.userData.baseY + celebrationBounce,
    9,
    delta,
  )

  parts.body.scale.y = smooth(
    parts.body.scale.y,
    parts.body.userData.baseScaleY * (1 + Math.sin(time * 1.7) * 0.0045 * motion),
    5,
    delta,
  )

  const followStrength = state === 'sleeping'
    ? 0.12
    : state === 'thinking'
      ? 0.30
      : 0.85

  const headNod = state === 'talking'
    ? Math.sin(time * 3.5) * 0.028 * motion
    : 0

  animateRotation(parts.head, 'y', pointer.x * 0.17 * followStrength, 6.5, delta)

  animateRotation(
    parts.head,
    'x',
    -pointer.y * 0.10 * followStrength + headNod + (state === 'sleeping' ? 0.09 : 0),
    6.5,
    delta,
  )

  animateRotation(
    parts.head,
    'z',
    pose.headTilt + (state === 'thinking' ? Math.sin(time * 1.7) * 0.012 * motion : 0),
    5.5,
    delta,
  )

  const eyeX = pointer.x * 0.045 * followStrength
  const eyeY = pointer.y * 0.023 * followStrength

  parts.leftEye.position.x = smooth(parts.leftEye.position.x, -0.405 + eyeX, 10, delta)
  parts.rightEye.position.x = smooth(parts.rightEye.position.x, 0.405 + eyeX, 10, delta)
  parts.leftEye.position.y = smooth(parts.leftEye.position.y, -0.018 + eyeY, 10, delta)
  parts.rightEye.position.y = smooth(parts.rightEye.position.y, -0.018 + eyeY, 10, delta)
  parts.eyeBridge.position.x = smooth(parts.eyeBridge.position.x, eyeX, 10, delta)
  parts.eyeBridge.position.y = smooth(parts.eyeBridge.position.y, -0.018 + eyeY, 10, delta)

  let leftShoulder = pose.leftShoulder
  let leftForearm = pose.leftForearm
  let rightShoulder = pose.rightShoulder
  let rightForearm = pose.rightForearm

  if (state === 'happy') {
    leftShoulder += Math.sin(time * 3.2) * 0.035 * motion
    leftForearm += Math.sin(time * 3.2 + 0.6) * 0.025 * motion
  }

  if (state === 'celebrating') {
    leftShoulder += Math.sin(time * 5.4) * 0.10 * motion
    rightShoulder -= Math.sin(time * 5.4) * 0.10 * motion
  }

  if (state === 'talking') {
    leftShoulder += Math.sin(time * 2.8) * 0.075 * motion
    leftForearm += Math.sin(time * 2.8 + 0.8) * 0.10 * motion
    rightForearm += Math.sin(time * 2.1) * 0.045 * motion
  }

  animateJoint(parts.leftShoulder, leftShoulder, -0.035, delta)
  animateElbow(parts.leftForearm, leftForearm, delta)

  if (state === 'thinking') {
    const alpha = 1 - Math.exp(-6.5 * Math.min(delta, 0.15))
    parts.rightShoulder.quaternion.slerp(thinkingShoulder, alpha)
    parts.rightForearm.quaternion.slerp(thinkingForearm, alpha)
  } else {
    animateJoint(parts.rightShoulder, rightShoulder, -0.035, delta)
    animateElbow(parts.rightForearm, rightForearm, delta)
  }

  animateRotation(
    parts.leftHand,
    'z',
    state === 'happy'
      ? Math.sin(time * 5.6 + 0.6) * 0.12 * motion
      : 0,
    8,
    delta,
  )

  parts.normalEyes.visible = !pose.happyEyes
  parts.happyEyes.visible = pose.happyEyes

  const blinkPhase = time % 5.7

  const blink = blinkPhase > 3.2 && blinkPhase < 3.42
    ? Math.sin((blinkPhase - 3.2) / 0.22 * Math.PI) * motion
    : 0

  const winkPhase = time % 13.1

  const wink = state === 'looking' && winkPhase > 7.6 && winkPhase < 7.95
    ? Math.sin((winkPhase - 7.6) / 0.35 * Math.PI) * motion
    : 0

  const asleep = state === 'sleeping'

  parts.leftEye.scale.y = smooth(
    parts.leftEye.scale.y,
    asleep ? 0.11 : 1.12 * (1 - blink * 0.94),
    35,
    delta,
  )

  parts.rightEye.scale.y = smooth(
    parts.rightEye.scale.y,
    asleep ? 0.11 : 1.12 * (1 - Math.max(blink, wink) * 0.94),
    35,
    delta,
  )

  for (let index = 0; index < parts.eyeGlows.length; index += 1) {
    const eye = index === 0 ? parts.leftEye : parts.rightEye
    const glow = parts.eyeGlows[index]

    glow.position.x = eye.position.x
    glow.position.y = eye.position.y
    glow.material.opacity = asleep ? 0.18 : 0.62 * Math.min(1, eye.scale.y)
  }

  const pulse = (parts.coreHeart.userData.baseScale ?? 1)
    * (1 + Math.sin(time * 2.4) * 0.022 * motion)

  parts.coreHeart.scale.setScalar(
    smooth(parts.coreHeart.scale.x, pulse, 7.5, delta),
  )

  parts.coreMaterial.emissiveIntensity = smooth(
    parts.coreMaterial.emissiveIntensity,
    pose.coreIntensity,
    7,
    delta,
  )

  parts.coreLight.intensity = smooth(
    parts.coreLight.intensity,
    pose.coreIntensity * 0.16,
    7,
    delta,
  )

  parts.coreHalo.material.opacity = smooth(
    parts.coreHalo.material.opacity,
    (asleep ? 0.25 : 0.46) + Math.sin(time * 2.4) * 0.07 * motion,
    7,
    delta,
  )
}