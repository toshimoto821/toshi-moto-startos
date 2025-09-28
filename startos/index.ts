/**
 * Plumbing. DO NOT EDIT.
 */
export { createBackup } from './backups'
export { main } from './main'
export { init, uninit } from './init'
export { actions } from './actions'
import { buildManifest } from '@start9labs/start-sdk'
import { manifest as sdkManifest } from './manifest'
import { versionGraph } from './install/versionGraph'
export const manifest = buildManifest(versionGraph, sdkManifest)

//const ifaces = await sdk.serviceInterface.get(effects, { id: 'webui', packageId: 'mempool' }).once()
//const urls = ifaces?.addressInfo?.urls
// https://matrix.to/#/!fhiwnDIwIFshONYDzU:matrix.start9labs.com/$qeDQqJ9tMDMqNhZ_EFYKU3EwIALUcX8JACJuo6e2bmg?via=matrix.start9labs.com&via=matrix.org&via=start9.me