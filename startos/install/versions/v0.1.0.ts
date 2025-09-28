import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_0_1_0 = VersionInfo.of({
  version: '0.1.0:0',
  releaseNotes: 'Initial release',
  migrations: {
    up: async () => {
      // No migrations needed for initial version
    },
    down: IMPOSSIBLE,
  },
})