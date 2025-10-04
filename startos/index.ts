/**
 * Plumbing. DO NOT EDIT.
 */

export { actions } from './actions'
export { createBackup } from './backups'
export { init, uninit } from './init'
export { main } from './main'

import { buildManifest } from '@start9labs/start-sdk'
import { versionGraph } from './install/versionGraph'
import { manifest as sdkManifest } from './manifest'
export const manifest = buildManifest(versionGraph, sdkManifest)
