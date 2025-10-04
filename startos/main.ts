import { sdk } from './sdk'

export const main = sdk.setupMain(async ({ effects, started }) => {
  const uiSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'toshi-moto' },
    null,
    'ui'
  )

  const backendSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'toshi-moto' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: null,
      mountpoint: '/data',
      readonly: false,
    }),
    'backend'
  )

  return sdk.Daemons.of(effects, started)
    .addDaemon('mongodb', {
      subcontainer: backendSub,
      exec: {
        command: [
          'mongod',
          '--dbpath',
          '/data/db',
          '--bind_ip',
          '127.0.0.1',
          '--port',
          '27017',
          '--quiet',
        ],
      },
      ready: {
        display: 'MongoDB Database',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, 27017, {
            successMessage: 'MongoDB is ready',
            errorMessage: 'MongoDB is not ready',
          }),
      },
      requires: [],
    })
    .addDaemon('backend', {
      subcontainer: backendSub,
      exec: {
        command: [
          'sh',
          '-c',
          'cd /app && MONGODB_URI=mongodb://127.0.0.1:27017/toshi-moto node main.js',
        ],
      },
      ready: {
        display: 'Backend API',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, 3000, {
            successMessage: 'The backend API is ready',
            errorMessage: 'The backend API is not ready',
          }),
      },
      requires: ['mongodb'],
    })
    .addDaemon('ui', {
      subcontainer: uiSub,
      exec: {
        command: ['nginx', '-g', 'daemon off;'],
      },
      ready: {
        display: 'Web Interface',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, 80, {
            successMessage: 'The web interface is ready',
            errorMessage: 'The web interface is not ready',
          }),
      },
      requires: ['backend'],
    })
})
