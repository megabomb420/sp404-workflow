import {
  Link as TanLink,
  Navigate as TanNavigate,
  Outlet,
  useNavigate as useTanNavigate,
  useParams as useTanParams,
  useRouter,
  useRouterState,
  useSearch,
} from '@tanstack/react-router'
import type { MouseEventHandler, ReactNode } from 'react'

export { Outlet }

function splitTo(to: string) {
  const [pathname, query] = to.split('?')
  const search = query ? Object.fromEntries(new URLSearchParams(query)) : undefined
  return { pathname: pathname || '/', search }
}

export function Link({
  to,
  className,
  children,
  onClick,
  replace,
  role,
  'aria-label': ariaLabel,
}: {
  to: string
  className?: string
  children?: ReactNode
  onClick?: MouseEventHandler
  replace?: boolean
  role?: string
  'aria-label'?: string
}) {
  const { pathname, search } = splitTo(to)
  return (
    <TanLink
      to={pathname as never}
      search={search as never}
      replace={replace}
      className={className}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </TanLink>
  )
}

export function NavLink({
  to,
  end,
  className,
  children,
}: {
  to: string
  end?: boolean
  className?: string | ((args: { isActive: boolean }) => string)
  children?: ReactNode
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isActive = end ? pathname === to : pathname === to || (to !== '/' && pathname.startsWith(`${to}/`))
  const cls = typeof className === 'function' ? className({ isActive }) : className
  return (
    <TanLink to={to as never} className={cls}>
      {children}
    </TanLink>
  )
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const { pathname, search } = splitTo(to)
  return <TanNavigate to={pathname as never} search={search as never} replace={replace} />
}

export function useNavigate() {
  const nav = useTanNavigate()
  const router = useRouter()
  return (to: string | number, opts?: { replace?: boolean }) => {
    if (typeof to === 'number') {
      router.history.go(to)
      return
    }
    const { pathname, search } = splitTo(to)
    void nav({ to: pathname as never, search: (search ?? {}) as never, replace: opts?.replace })
  }
}

export function useParams<T extends Record<string, string | undefined>>(): T {
  return useTanParams({ strict: false } as never) as T
}

export function useLocation() {
  return useRouterState({
    select: (s) => ({
      pathname: s.location.pathname,
      search: s.location.searchStr,
      key: s.location.state?.key ?? s.location.href,
    }),
  })
}

type SearchRecord = Record<string, string | undefined>

export function useSearchParams(): [
  URLSearchParams,
  (next: URLSearchParams | Record<string, string>, opts?: { replace?: boolean }) => void,
] {
  const search = (useSearch({ strict: false }) ?? {}) as SearchRecord
  const nav = useTanNavigate()
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(search)) {
    if (value != null && value !== '') params.set(key, value)
  }
  const setParams = (next: URLSearchParams | Record<string, string>, opts?: { replace?: boolean }) => {
    const source = next instanceof URLSearchParams ? next : new URLSearchParams(next)
    const obj: SearchRecord = {}
    source.forEach((value, key) => {
      obj[key] = value
    })
    void nav({ search: obj as never, replace: opts?.replace })
  }
  return [params, setParams]
}

export function passSearch(search: Record<string, unknown>): SearchRecord {
  const out: SearchRecord = {}
  for (const [key, value] of Object.entries(search)) {
    if (value == null || value === '') continue
    out[key] = String(value)
  }
  return out
}
