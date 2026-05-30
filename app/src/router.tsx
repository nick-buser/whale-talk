import { createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router'
import App from './App'
import { BirdsPage } from './birds/BirdsPage'

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

const routeTree = rootRoute.addChildren([indexRoute, birdsIndexRoute, birdsSectionRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
