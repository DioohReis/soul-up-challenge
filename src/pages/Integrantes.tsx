import { useState } from 'react'

import { SocialIcon } from '../components/SocialIcon'
import { TeamCarousel } from '../components/TeamCarousel'

import { team } from '../data/team'

import type { TeamMember } from '../types'

export function Integrantes() {
  /**
   * Começa null exatamente para manter a lógica
   * do primeiro projeto:
   *
   * os detalhes aparecem somente depois
   * que o usuário clicar em alguém.
   */
  const [selected, setSelected] =
    useState<TeamMember | null>(null)

  return (
    <main>
      {/* =====================================================
          CARROSSEL
      ====================================================== */}

      <section
        className="
          relative

          flex
          min-h-[calc(100vh-4rem)]
          w-full

          items-center
          justify-center

          overflow-hidden

          text-center
        "
        aria-labelledby="titulo-integrantes"
      >
        {/* brilho de fundo */}
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2

            h-[35rem]
            w-[35rem]

            -translate-x-1/2
            -translate-y-1/2

            rounded-full

            bg-cyan-300/[0.06]

            blur-[100px]
          "
        />

        {/* título igual à estrutura original */}
        <div
          className="
            absolute
            left-1/2
            top-8
            z-10

            w-[calc(100%-1.5rem)]
            max-w-[720px]

            -translate-x-1/2

            rounded-3xl
            border
            border-cyan-100/[0.12]

            bg-[#000c0a]/35

            p-4

            backdrop-blur-md

            sm:top-12
            sm:p-5

            lg:top-16
          "
        >
          <h1
            id="titulo-integrantes"
            className="
              text-3xl
              font-black
              uppercase

              tracking-[0.18rem]

              text-white

              sm:text-4xl
              md:text-5xl
              lg:text-6xl
            "
          >
            Integrantes
          </h1>

          <p
            className="
              mt-2

              text-sm
              leading-6

              text-[#d7ffe3]

              sm:text-base
            "
          >
            Clique em uma imagem do carrossel para
            visualizar as informações do integrante.
          </p>

          <p
            className="
              mt-2

              text-xs

              text-white/40

              md:hidden
            "
          >
            Você também pode arrastar o carrossel.
          </p>
        </div>

        <TeamCarousel
          members={team}
          selectedRm={selected?.rm}
          onSelect={setSelected}
        />
      </section>

      {/* =====================================================
          DETALHES
      ====================================================== */}

      <section
        id="integrante-detalhes"
        aria-live="polite"
        className={`
          mx-auto
          mb-16

          w-[calc(100%-2rem)]
          max-w-[1100px]

          transition-all
          duration-500

          ${
            selected
              ? `
                translate-y-0
                opacity-100
              `
              : `
                pointer-events-none
                translate-y-8
                opacity-0
              `
          }
        `}
      >
        {selected && (
          <article
            className="
              grid

              items-center

              gap-6

              rounded-3xl

              border
              border-cyan-100/20

              bg-gradient-to-br
              from-[#001210]/90
              to-[#000807]/75

              p-4

              shadow-[0_24px_80px_rgba(0,0,0,0.35)]

              backdrop-blur-md

              sm:p-6

              md:grid-cols-[minmax(260px,380px)_1fr]
              md:gap-8
              md:p-8
            "
          >
            {/* FOTO */}

            <img
              src={selected.imagem}
              alt={`Foto de ${selected.nome}`}
              className="
                h-[260px]
                w-full

                rounded-2xl

                object-cover
                object-top

                shadow-[0_0_30px_rgba(2,255,87,0.22)]

                sm:h-[320px]

                md:h-[420px]
              "
            />

            {/* CONTEÚDO */}

            <div className="text-left">
              <span
                className="
                  inline-block

                  rounded-full

                  border
                  border-emerald-200/40

                  bg-cyan-300/[0.08]

                  px-3
                  py-1.5

                  text-xs

                  font-bold
                  uppercase

                  tracking-[0.08rem]

                  text-[#d7ffe3]
                "
              >
                Integrante selecionado
              </span>

              <h2
                className="
                  mt-4

                  text-3xl
                  font-black

                  text-white

                  sm:text-4xl

                  lg:text-5xl
                "
              >
                {selected.nome}
              </h2>

              <p
                className="
                  mt-4

                  font-bold

                  text-[#c8fff7]
                "
              >
                Turma: {selected.turma}
              </p>

              <p
                className="
                  mt-2

                  font-bold

                  text-[#c8fff7]
                "
              >
                {selected.cargo}
              </p>

              <p
                className="
                  mt-2

                  font-bold

                  text-[#c8fff7]
                "
              >
                RM: {selected.rm}
              </p>

              <p
                className="
                  mt-5

                  max-w-[640px]

                  text-sm
                  leading-7

                  text-white/75

                  sm:text-base
                "
              >
                {selected.descricao}
              </p>

              {/* REDES SOCIAIS */}

              <div
                className="
                  mt-6

                  flex
                  flex-wrap

                  gap-3
                "
              >
                {selected.github && (
                  <a
                    href={selected.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      inline-flex

                      items-center

                      gap-2

                      rounded-full

                      border
                      border-cyan-200/40

                      bg-gradient-to-r
                      from-cyan-300/[0.16]
                      to-emerald-300/[0.09]

                      px-4
                      py-3

                      text-sm

                      font-extrabold

                      text-white

                      transition-all
                      duration-200

                      hover:-translate-y-1
                      hover:border-white/70
                      hover:shadow-[0_16px_36px_rgba(0,247,255,0.16)]

                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-cyan-300
                    "
                  >
                    <SocialIcon type="github" />

                    GitHub
                  </a>
                )}

                {selected.linkedin && (
                  <a
                    href={selected.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      inline-flex

                      items-center

                      gap-2

                      rounded-full

                      border
                      border-cyan-200/40

                      bg-gradient-to-r
                      from-cyan-300/[0.16]
                      to-emerald-300/[0.09]

                      px-4
                      py-3

                      text-sm

                      font-extrabold

                      text-white

                      transition-all
                      duration-200

                      hover:-translate-y-1
                      hover:border-cyan-300
                      hover:shadow-[0_16px_36px_rgba(0,247,255,0.16)]

                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-cyan-300
                    "
                  >
                    <SocialIcon type="linkedin" />

                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </article>
        )}
      </section>
    </main>
  )
}