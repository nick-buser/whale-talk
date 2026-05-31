import { createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router'
import App from './App'
import { BirdsPage } from './birds/BirdsPage'
import { PrimatesPage } from './primates/PrimatesPage'
import { ParrotsPage } from './parrots/ParrotsPage'
import { BeesPage } from './bees/BeesPage'

const rootRoute = createRootRoute({ component: () => <Outlet /> })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
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

const routeTree = rootRoute.addChildren([
  indexRoute,
  birdsIndexRoute,
  birdsSectionRoute,
  primatesIndexRoute,
  primatesSectionRoute,
  parrotsIndexRoute,
  parrotsSectionRoute,
  beesIndexRoute,
  beesSectionRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
