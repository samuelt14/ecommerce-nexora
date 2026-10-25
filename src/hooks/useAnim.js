import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
export { gsap }

// Respeta prefers-reduced-motion via gsap.matchMedia() (skill gsap-core)
export const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Hook principal: usa gsap.context() + cleanup en useLayoutEffect (skill gsap-react)
export function useAnim(fn, deps = [], extRef) {
  const own = useRef(null)
  const ref = extRef || own
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      if (ref.current) fn(ref.current)
    }, ref)
    return () => mm.revert()
  }, deps) // eslint-disable-line
  return ref
}

// Selector helper
export const q = (root, sel) => Array.from(root.querySelectorAll(sel))

// Reveal individual elements con ScrollTrigger (skill gsap-scrolltrigger: once:true)
export const revealEls = (root, sel = '.reveal') =>
  q(root, sel).forEach(el =>
    gsap.from(el, {
      y: 28, autoAlpha: 0, duration: 0.7, ease: 'power3.out', clearProps: 'all',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    })
  )

// Reveal grids con ScrollTrigger.batch() (skill gsap-scrolltrigger: batch para cards)
export const revealGrids = (root, sel = '.grid') =>
  q(root, sel).forEach(g => {
    const cards = Array.from(g.children)
    if (!cards.length) return
    ScrollTrigger.batch(cards, {
      onEnter: batch => gsap.from(batch, {
        y: 34, autoAlpha: 0, duration: 0.6, stagger: 0.08,
        ease: 'power3.out', clearProps: 'all', overwrite: true
      }),
      start: 'top 86%',
      once: true
    })
  })

// Timeline hero cinematográfico helper
export const heroTimeline = (root, selectors) => {
  const { lines, sub, cta, art } = selectors
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  if (lines?.length) tl.from(lines, { yPercent: 110, duration: 0.9, stagger: 0.12 })
  if (sub) tl.from(sub, { autoAlpha: 0, y: 16, duration: 0.6 }, '-=.4')
  if (cta?.length) tl.from(cta, { autoAlpha: 0, y: 16, stagger: 0.1, duration: 0.5 }, '-=.3')
  if (art) tl.from(art, { autoAlpha: 0, scale: 0.92, duration: 1 }, 0.2)
  return tl
}

// Float loop para hero art
export const floatLoop = (el) => gsap.to(el, {
  y: -14, rotation: 1.5, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut'
})
