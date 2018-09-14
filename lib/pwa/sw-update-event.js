/* global MessageChannel */
export default class SWUpdateEvent {
  constructor (registration) {
    this.registration = registration
  }

  update () {
    return this.registration.update()
  }

  skipWaiting () {
    const worker = this.registration.waiting

    if (!worker) return Promise.resolve()

    console.log('[dvan:pwa] Doing worker.skipWaiting()')
    return new Promise((resolve, reject) => {
      const channel = new MessageChannel()

      channel.port1.onmessage = event => {
        console.log('[dvan:pwa] Doing worker.skipWaiting()')
        if (event.data.error) reject(event.data.error)
        else resolve(event.data)
      }

      worker.postMessage({ type: 'skip-waiting' }, [channel.port2])
    })
  }
}
