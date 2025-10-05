import { sdk } from './sdk'

export const main = sdk.setupMain(async ({ effects, started }) => {
  // ========================
  // Set containers with proper mounts
  // ========================

  const mongoContainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'mongodb' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'mongodb',
      subpath: null,
      mountpoint: '/data/db',
      readonly: false,
    }),
    'database'
  )

  const backendContainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'backend' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'backend',
      subpath: null,
      mountpoint: '/data',
      readonly: false,
    }),
    'backend-api'
  )

  const frontendContainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'frontend' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'frontend',
      subpath: null,
      mountpoint: '/data',
      readonly: false,
    }),
    'user-interface'
  )

  // ========================
  // Custom health checks
  // ========================

  const apiDataReadyCheck = {
    display: 'API Data Import',
    fn: async () => {
      try {
        const response = await fetch(
          'http://toshi-moto.startos:3000/api/prices/data-imported'
        )
        const data = await response.json()

        if (data.status === true) {
          return {
            result: 'success' as const,
            message: 'API data has been imported and is ready',
          }
        } else {
          return {
            result: 'failure' as const,
            message: 'API data is still being imported',
          }
        }
      } catch (error) {
        return {
          result: 'failure' as const,
          message: `API data import check failed: ${(error as Error).message}`,
        }
      }
    },
  }

  return sdk.Daemons.of(effects, started)
    .addDaemon('mongodb', {
      subcontainer: mongoContainer,
      exec: {
        command: [
          'mongod',
          '--dbpath',
          '/data/db',
          '--bind_ip',
          '0.0.0.0',
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
      subcontainer: backendContainer,
      exec: {
        command: [
          'sh',
          '-c',
          'cd /app && MONGODB_URI=mongodb://mongodb:27017/toshi-moto node main.js',
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
    .addHealthCheck('api-data', {
      ready: apiDataReadyCheck,
      requires: ['backend'],
    })
    .addDaemon('frontend', {
      subcontainer: frontendContainer,
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
      requires: ['api-data'],
    })
})
