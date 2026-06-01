import { createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router'
import { WhalesPage } from './whales/WhalesPage'
import { BirdsPage } from './birds/BirdsPage'
import { PrimatesPage } from './primates/PrimatesPage'
import { ParrotsPage } from './parrots/ParrotsPage'
import { BeesPage } from './bees/BeesPage'
import { ElephantsPage } from './elephants/ElephantsPage'
import { HumanPage } from './human/HumanPage'
import { LlmPage } from './llm/LlmPage'
import { FrontiersPage } from './frontiers/FrontiersPage'
import { PetsPage } from './pets/PetsPage'

const rootRoute = createRootRoute({ component: () => <Outlet /> })

// Redirect bare / to /whales/hero
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/whales/$section', params: { section: 'hero' } })
  },
})

// Redirect bare /whales to /whales/hero
const whalesIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/whales',
  beforeLoad: () => {
    throw redirect({ to: '/whales/$section', params: { section: 'hero' } })
  },
})

export const whalesSectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/whales/$section',
  component: WhalesPage,
})

// Redirect bare /birds to /birds/intro
const birdsIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/birds',
  beforeLoad: () => {
    throw redirect({ to: '/birds/$section', params: { section: 'intro' } })
  },
})

export const birdsSectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/birds/$section',
  component: BirdsPage,
})

// Redirect bare /primates to /primates/intro
const primatesIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/primates',
  beforeLoad: () => {
    throw redirect({ to: '/primates/$section', params: { section: 'intro' } })
  },
})

export const primatesSectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/primates/$section',
  component: PrimatesPage,
})

// Redirect bare /parrots to /parrots/intro
const parrotsIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/parrots',
  beforeLoad: () => {
    throw redirect({ to: '/parrots/$section', params: { section: 'intro' } })
  },
})

export const parrotsSectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/parrots/$section',
  component: ParrotsPage,
})

// Redirect bare /bees to /bees/intro
const beesIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bees',
  beforeLoad: () => {
    throw redirect({ to: '/bees/$section', params: { section: 'intro' } })
  },
})

export const beesSectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bees/$section',
  component: BeesPage,
})

// Redirect bare /elephants to /elephants/intro
const elephantsIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/elephants',
  beforeLoad: () => {
    throw redirect({ to: '/elephants/$section', params: { section: 'intro' } })
  },
})

export const elephantsSectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/elephants/$section',
  component: ElephantsPage,
})

// Redirect bare /human to /human/intro
const humanIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/human',
  beforeLoad: () => {
    throw redirect({ to: '/human/$section', params: { section: 'intro' } })
  },
})

export const humanSectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/human/$section',
  component: HumanPage,
})

// Redirect bare /llm to /llm/intro
const llmIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/llm',
  beforeLoad: () => {
    throw redirect({ to: '/llm/$section', params: { section: 'intro' } })
  },
})

export const llmSectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/llm/$section',
  component: LlmPage,
})

// Redirect bare /frontiers to /frontiers/intro
const frontiersIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/frontiers',
  beforeLoad: () => {
    throw redirect({ to: '/frontiers/$section', params: { section: 'intro' } })
  },
})

export const frontiersSectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/frontiers/$section',
  component: FrontiersPage,
})

// Redirect bare /pets to /pets/intro
const petsIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pets',
  beforeLoad: () => {
    throw redirect({ to: '/pets/$section', params: { section: 'intro' } })
  },
})

export const petsSectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pets/$section',
  component: PetsPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  whalesIndexRoute,
  whalesSectionRoute,
  birdsIndexRoute,
  birdsSectionRoute,
  primatesIndexRoute,
  primatesSectionRoute,
  parrotsIndexRoute,
  parrotsSectionRoute,
  beesIndexRoute,
  beesSectionRoute,
  elephantsIndexRoute,
  elephantsSectionRoute,
  humanIndexRoute,
  humanSectionRoute,
  llmIndexRoute,
  llmSectionRoute,
  frontiersIndexRoute,
  frontiersSectionRoute,
  petsIndexRoute,
  petsSectionRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
