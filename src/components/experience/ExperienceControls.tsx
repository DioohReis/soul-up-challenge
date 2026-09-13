import { JourneyIcon } from './JourneyIcon'

type ExperienceControlsProps = {
  canSpeak: boolean
  voiceEnabled: boolean
  paused: boolean
  thinking: boolean
  onWave: () => void
  onInspire: () => void
  onConverse: () => void
  onToggleVoice: () => void
  onTogglePause: () => void
}

export function ExperienceControls({
  canSpeak,
  voiceEnabled,
  paused,
  thinking,
  onWave,
  onInspire,
  onConverse,
  onToggleVoice,
  onTogglePause,
}: ExperienceControlsProps) {
  return (
    <div
      className="
mx-0 flex flex-wrap items-center justify-between gap-2.5 border-b border-[#dfe8f4] px-0
py-[13px] lg:mx-[15px] lg:flex-nowrap lg:gap-[15px] lg:px-2.5 lg:py-4 [&>p]:flex
[&>p]:flex-1 [&>p]:items-center [&>p]:gap-[7px] [&>p]:text-[9px] [&>p]:leading-[1.5]
[&>p]:text-[#7a8ca8] lg:[&>p]:max-w-[170px] lg:[&>p]:flex-initial lg:[&>p]:text-[10px]
min-[1101px]:[&>p]:max-w-none min-[1101px]:[&>p]:leading-normal
"
    >
      <p>
        <span className="text-xl text-[#6c90c1]">↖</span> Toque no Nexo e veja o que acontece
      </p>
      <div
        className="
order-3 flex w-full justify-center gap-2 md:order-none md:w-auto lg:gap-2.5
[&_button]:flex [&_button]:min-h-[38px] [&_button]:flex-1 [&_button]:items-center
[&_button]:justify-center [&_button]:gap-[7px] [&_button]:rounded-[20px]
[&_button]:border [&_button]:border-[#e0e8f5] [&_button]:bg-white [&_button]:p-2
[&_button]:text-[9px] [&_button]:font-semibold [&_button]:text-[#46658d]
[&_button:hover]:border-[#b2ccee] [&_button:hover]:bg-[#eaf3ff]
lg:[&_button]:flex-initial lg:[&_button]:px-3.5 lg:[&_button]:text-[10px]
[&_svg]:text-[#5d8dcf]
"
      >
        <button
          type="button"
          onClick={onWave}
        >
          <JourneyIcon
            name="wave"
            size={17}
          />
          Dar um oi
        </button>
        <button
          type="button"
          onClick={onInspire}
          disabled={thinking}
        >
          <JourneyIcon
            name="sparkles"
            size={17}
          />
          Me inspire
        </button>
        <button
          type="button"
          onClick={onConverse}
        >
          <JourneyIcon
            name="chat"
            size={17}
          />
          Conversar
        </button>
      </div>
      <div
        className="
flex gap-1.5 [&_button]:grid [&_button]:size-8 [&_button]:place-items-center
[&_button]:rounded-full [&_button]:border [&_button]:border-[#dce7f4]
[&_button]:text-[#7890af] [&_button[aria-pressed=true]]:bg-[#dcecff]
[&_button[aria-pressed=true]]:text-[#245db8] lg:[&_button]:size-9
"
      >
        {canSpeak && (
          <button
            type="button"
            aria-label={voiceEnabled ? 'Desativar voz do Nexo' : 'Ouvir a voz do Nexo'}
            title={voiceEnabled ? 'Desativar voz' : 'Ouvir o Nexo'}
            aria-pressed={voiceEnabled}
            onClick={onToggleVoice}
          >
            <JourneyIcon
              name={voiceEnabled ? 'volume' : 'mute'}
              size={18}
            />
          </button>
        )}
        <button
          type="button"
          aria-label={paused ? 'Retomar animações' : 'Pausar animações'}
          title={paused ? 'Retomar animações' : 'Pausar animações'}
          aria-pressed={paused}
          onClick={onTogglePause}
        >
          <JourneyIcon
            name={paused ? 'play' : 'pause'}
            size={18}
          />
        </button>
      </div>
    </div>
  )
}
