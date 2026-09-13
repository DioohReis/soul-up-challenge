import { Nexo3D } from './Nexo3D'
import { useNexoInteraction } from '../../hooks/useNexoInteraction'
import type { NexoState } from '../../types/nexo'

const STATE_CONTROLS: Array<{ state: NexoState; label: string; icon: string }> = [
  { state: 'idle', label: 'Online', icon: '●' },
  { state: 'listening', label: 'Escutando', icon: '◖' },
  { state: 'thinking', label: 'Pensando', icon: '◇' },
  { state: 'talking', label: 'Conversando', icon: '✦' },
  { state: 'celebrating', label: 'Comemorar', icon: '★' },
  { state: 'sleeping', label: 'Descansar', icon: '☾' },
]

export function NexoStage() {
  const {
    state,
    mode,
    interactionCount,
    chooseState,
    handlePresence,
    handleAvatarInteraction,
  } = useNexoInteraction()

  return (
    <section className="relative isolate overflow-hidden rounded-[2.25rem] border border-soul-blue/10 bg-white/70 shadow-[0_35px_90px_rgba(7,26,71,0.12)] backdrop-blur-xl">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_44%,rgba(92,200,255,0.22),transparent_34%),linear-gradient(180deg,#f9fcff_0%,#edf6ff_58%,#e5f1ff_100%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[46%] -z-10 h-[580px] w-[580px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-soul-sky/20 bg-soul-sky/10 blur-[1px]" />

      <div className="grid gap-0 xl:grid-cols-[290px_minmax(0,1fr)_310px]">
        <aside className="order-2 border-t border-soul-blue/10 p-5 sm:p-7 xl:order-1 xl:border-r xl:border-t-0">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-soul-blue">Nexo • modelagem 3D</span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-soul-navy">Presença que reage.</h2>
          <p className="mt-4 text-sm leading-7 text-soul-navy/60">
            O personagem agora possui volume real em WebGL: corpo, cabeça, visor, olhos, braços, mãos, núcleo e iluminação existem em três dimensões.
          </p>

          <div className="mt-6 grid gap-3">
            <div className="rounded-2xl border border-soul-blue/10 bg-white/75 p-4">
              <span className="text-[9px] font-black uppercase tracking-[0.15em] text-soul-navy/40">Interação</span>
              <strong className="mt-1 block text-lg text-soul-navy">Olhar responsivo</strong>
              <p className="mt-1 text-xs leading-5 text-soul-navy/50">Cabeça e olhos acompanham o ponteiro com suavização.</p>
            </div>

            <div className="rounded-2xl border border-soul-blue/10 bg-white/75 p-4">
              <span className="text-[9px] font-black uppercase tracking-[0.15em] text-soul-navy/40">Modelagem</span>
              <strong className="mt-1 block text-lg text-soul-navy">Mãos articuladas</strong>
              <p className="mt-1 text-xs leading-5 text-soul-navy/50">Palma, dedos, braço e antebraço são objetos separados.</p>
            </div>

            <div className="rounded-2xl border border-soul-blue/10 bg-white/75 p-4">
              <span className="text-[9px] font-black uppercase tracking-[0.15em] text-soul-navy/40">Energia</span>
              <strong className="mt-1 block text-lg text-soul-navy">Núcleo luminoso</strong>
              <p className="mt-1 text-xs leading-5 text-soul-navy/50">O coração possui emissão e luz real que muda por estado.</p>
            </div>
          </div>
        </aside>

        <div className="order-1 relative min-w-0 xl:order-2">
          <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-soul-blue/10 bg-white/100 px-3 py-2 text-[9px] font-black uppercase tracking-[0.14em] text-soul-navy/60 shadow-[0_10px_30px_rgba(7,26,71,0.06)] backdrop-blur-xl sm:left-6 sm:top-6">
            <span className="h-2 w-2 animate-nexo-signal rounded-full bg-soul-blue" />
            {mode.label}
          </div>

          <Nexo3D
            state={state}
            onInteract={handleAvatarInteraction}
            onPresenceChange={handlePresence}
          />

          <div className="pointer-events-none absolute bottom-8 left-1/2 z-20 w-[min(90%,520px)] -translate-x-1/2 rounded-[1.45rem] border border-white/70 bg-white/90 px-4 py-3 text-center text-sm font-semibold leading-6 text-[#15467f] shadow-[0_18px_45px_rgba(7,26,71,0.13)] backdrop-blur-xl sm:px-5 sm:py-4">
            <p aria-live="polite">{mode.message}</p>
          </div>
        </div>

        <aside className="order-3 border-t border-soul-blue/10 p-5 sm:p-7 xl:border-l xl:border-t-0">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-soul-blue">Teste de comportamento</span>
          <h3 className="mt-3 text-2xl font-black text-soul-navy">Estados do avatar</h3>
          <p className="mt-2 text-sm leading-6 text-soul-navy/50">
            Use os controles para visualizar como a futura IA poderá comandar linguagem corporal e feedback.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2 xl:grid-cols-1">
            {STATE_CONTROLS.map((control) => {
              const active = state === control.state

              return (
                <button
                  key={control.state}
                  type="button"
                  onClick={() => chooseState(control.state)}
                  className={`flex min-h-12 items-center gap-3 rounded-2xl border px-4 py-3 text-left text-xs font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soul-blue ${
                    active
                      ? 'border-soul-blue bg-soul-blue text-white shadow-[0_10px_24px_rgba(31,95,224,0.18)]'
                      : 'border-soul-blue/10 bg-white/75 text-soul-navy/60 hover:-translate-y-0.5 hover:border-soul-blue/25 hover:text-soul-blue'
                  }`}
                >
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${active ? 'bg-white/20' : 'bg-soul-mist text-soul-blue'}`}>
                    {control.icon}
                  </span>
                  {control.label}
                </button>
              )
            })}
          </div>

          <div className="mt-5 rounded-2xl border border-soul-blue/10 bg-soul-mist/70 p-4">
            <span className="text-[9px] font-black uppercase tracking-[0.14em] text-soul-navy/40">Interações detectadas</span>
            <strong className="mt-1 block text-3xl font-black text-soul-blue">{interactionCount}</strong>
            <p className="mt-1 text-xs leading-5 text-soul-navy/40">A cada quarta interação o Nexo comemora automaticamente.</p>
          </div>
        </aside>
      </div>

      <div className="border-t border-soul-blue/10 bg-white/60 px-5 py-4 sm:px-7">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] font-bold uppercase tracking-[0.12em] text-soul-navy/40">
          <span>Arraste o cursor pelo avatar</span>
          <span className="hidden h-1 w-1 rounded-full bg-soul-blue/30 sm:block" />
          <span>Clique para receber uma reação</span>
          <span className="hidden h-1 w-1 rounded-full bg-soul-blue/30 sm:block" />
          <span>Enter ou Espaço também funcionam</span>
        </div>
      </div>
    </section>
  )
}
