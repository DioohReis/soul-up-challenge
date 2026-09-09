type PageHeroProps = {
  tag: string
  title: string
  description: string
  align?: 'left' | 'center'
}

export function PageHero({ tag, title, description, align = 'left' }: PageHeroProps) {
  const centered = align === 'center'

  return (
    <section className={`mx-auto max-w-7xl px-4 pb-12 pt-14 sm:px-6 sm:pt-20 lg:px-8 ${centered ? 'text-center' : ''}`}>
      <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-cyan-100">
        {tag}
      </span>
      <h1 className={`mt-5 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl ${centered ? 'mx-auto max-w-4xl' : 'max-w-4xl'}`}>
        {title}
      </h1>
      <p className={`mt-5 max-w-3xl text-base leading-8 text-white/70 sm:text-lg ${centered ? 'mx-auto' : ''}`}>
        {description}
      </p>
    </section>
  )
}
