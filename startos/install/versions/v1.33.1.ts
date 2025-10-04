import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const v_1_33_1 = VersionInfo.of({
  version: '1.33.1:0',
  releaseNotes: 'Initial release',
  migrations: {
    up: async () => {
      // No migrations needed for initial version
    },
    down: IMPOSSIBLE,
  },
})
