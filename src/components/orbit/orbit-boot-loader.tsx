/** Brief boot mark shown while AuthGate reads the local session. */
export function OrbitBootLoader() {
  return (
    <div
      className="flex min-h-svh items-center justify-center bg-transparent"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading Orbit</span>
      <div className="orbit-boot-loader" aria-hidden="true">
        <span className="orbit-boot-loader-ring" />
        <span className="orbit-boot-loader-orbit" />
        <span className="orbit-boot-loader-core" />
      </div>
    </div>
  )
}
