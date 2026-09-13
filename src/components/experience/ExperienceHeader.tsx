type ExperienceHeaderProps = {
  userName: string
}

export function ExperienceHeader({ userName }: ExperienceHeaderProps) {
  return (
    <div
      className="
mb-[23px] flex items-center justify-between gap-[30px] lg:mb-[29px] [&_h1]:my-[9px]
[&_h1]:text-[25px] [&_h1]:font-[750] [&_h1]:leading-[1.25] [&_h1]:tracking-[-.8px]
lg:[&_h1]:text-[clamp(25px,2.5vw,34px)] lg:[&_h1]:tracking-[-1px] [&_h1_span]:block
[&_h1_span]:text-[#3b70b8] md:[&_h1_span]:inline [&>div>p:last-child]:mt-3
[&>div>p:last-child]:max-w-[350px] [&>div>p:last-child]:text-[11px]
[&>div>p:last-child]:leading-[1.8] [&>div>p:last-child]:text-[#77869e]
md:[&>div>p:last-child]:max-w-none lg:[&>div>p:last-child]:mt-0
lg:[&>div>p:last-child]:text-[12px]
"
    >
      <div>
        <p className="text-[9px] font-[750] tracking-[.19em] text-[#537db8]">
          SUA JORNADA TEM COMPANHIA
        </p>
        <h1>
          Um pequeno passo. <span>Um futuro melhor.</span>
        </h1>
        <p>Conheça o Nexo, seu parceiro para transformar boas intenções em novas conquistas.</p>
      </div>
      <div
        className="
hidden shrink-0 items-center gap-2.5 text-[12px] font-[650] min-[1101px]:flex
[&>span]:grid [&>span]:size-[39px] [&>span]:place-items-center [&>span]:rounded-full
[&>span]:border-[3px] [&>span]:border-white [&>span]:bg-[#dfebfc] [&>span]:text-[#4779bf]
[&_small]:mt-[3px] [&_small]:block [&_small]:text-[10px] [&_small]:font-normal
[&_small]:text-[#8392a8]
"
      >
        <span>{userName.slice(0, 1).toUpperCase()}</span>
        <div>
          Olá, {userName}
          <small>Vamos fazer a diferença hoje?</small>
        </div>
      </div>
    </div>
  )
}
