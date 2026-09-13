import { NexoAvatar } from '../nexo/NexoAvatar'

type NexoStageProps = {
  message: string
  success?: boolean
  onInteract?: () => void
}

export function NexoStage({ message, success = false, onInteract }: NexoStageProps) {
  return (
    <div className="relative flex min-h-[455px] items-end justify-center lg:min-h-[535px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[48%] h-[470px] w-[470px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/10 bg-[radial-gradient(circle,rgba(94,204,255,0.18)_0%,rgba(62,145,255,0.08)_44%,transparent_72%)] shadow-[0_0_95px_rgba(80,180,255,0.15)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[28px] left-1/2 h-20 w-[72%] max-w-[440px] -translate-x-1/2 rounded-[50%] border border-cyan-100/25 bg-cyan-300/8 shadow-[0_0_42px_rgba(125,221,255,0.24)]"
      />

      <div className="relative z-10 flex w-full items-end justify-center">
        <NexoAvatar
          mood={success ? 'success' : 'guide'}
          active={success}
          onInteract={onInteract}
          className="drop-shadow-[0_34px_42px_rgba(0,0,0,0.18)]"
        />
      </div>

      <div className="absolute right-0 top-[62px] z-20 max-w-[230px] rounded-[1.45rem] border border-white/55 bg-white/95 px-4 py-3 text-[12px] font-semibold leading-5 text-[#15467f] shadow-[0_16px_38px_rgba(2,22,58,0.18)] backdrop-blur-md sm:right-[4%] lg:right-[-4%]">
        <span className="absolute -bottom-4 left-7 h-7 w-7 rotate-45 border-b border-r border-white/60 bg-white" aria-hidden="true" />
        <div className="relative z-10 flex gap-2.5">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#edf8ff] text-[#2d7be8]">✦</span>
          <p aria-live="polite">{message}</p>
        </div>
      </div>
    </div>
  )
}
