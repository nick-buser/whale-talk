import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router'
import App from './App'
import { BirdsPlaceholder } from './birds/BirdsPlaceholder'

const rootRoute = createRootRoute({ component: () => <Outlet /> })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
})

const birdsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/birds',
  component: BirdsPlaceholder,
})

const routeTree = rootRoute.addChildren([indexRoute, birdsRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
