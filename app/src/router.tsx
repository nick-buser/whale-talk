import { createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router'
import App from './App'
import { BirdsPage } from './birds/BirdsPage'
import { PrimatesPage } from './primates/PrimatesPage'

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

const routeTree = rootRoute.addChildren([
  indexRoute,
  birdsIndexRoute,
  birdsSectionRoute,
  primatesIndexRoute,
  primatesSectionRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
