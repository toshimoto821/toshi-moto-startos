import { setupManifest } from '@start9labs/start-sdk'
import type { SDKImageInputSpec } from '@start9labs/start-sdk/base/lib/types/ManifestTypes'

const BUILD = process.env.BUILD || ''

const architectures =
  BUILD === 'x86_64' || BUILD === 'aarch64' ? [BUILD] : ['x86_64', 'aarch64']

export const manifest = setupManifest({
  id: 'toshi-moto-startos',
  title: 'Toshi Moto',
  license: 'MIT',
  wrapperRepo: 'https://github.com/toshimoto821/toshi-moto-startos',
  upstreamRepo: 'https://github.com/toshimoto821/toshi-moto',
  supportSite: 'https://toshimoto.app',
  marketingSite: 'https://toshimoto.app',
  donationUrl: 'https://toshimoto.app',
  docsUrl: 'https://toshimoto.app',
  description: {
    short:
      'Toshi Moto is a watch-only Bitcoin wallet designed for secure portfolio monitoring and transaction tracking.',
    long: `Toshi Moto is a watch only Bitcoin wallet aggregator.
    Key Features:
    - Import your extended public key (Xpub) to monitor multiple Bitcoin addresses simultaneously
    - Real-time balance aggregation across all your wallets and addresses
    - Comprehensive transaction history and monitoring capabilities
    - Privacy-focused: All data remains local to your browser - no sensitive information is transmitted to servers
    - Read-only security: Cannot spend or sign transactions, ensuring your funds remain safe
    Perfect for Bitcoin enthusiasts who want to monitor their holdings securely without compromising privacy or security.`,
  },
  volumes: ['frontend', 'backend', 'mongodb'],
  images: {
    frontend: {
      source: {
        dockerTag: 'toshimoto821/toshi-moto:1.33.1',
      },
      arch: architectures,
    } as SDKImageInputSpec,
    backend: {
      source: {
        dockerTag: 'toshimoto821/toshi-moto-api:1.8.4',
      },
      arch: architectures,
    } as SDKImageInputSpec,
    mongodb: {
      source: {
        dockerTag: 'mongo:8.0.10',
      },
      arch: architectures,
    } as SDKImageInputSpec,
  },
  hardwareRequirements: {
    arch: architectures,
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    bitcoind: {
      description: 'Used to query the Bitcoin blockchain',
      optional: false,
      s9pk: 'https://github.com/Start9Labs/bitcoind-startos/releases/download/v29.1.0.2-beta.0/bitcoind.s9pk',
    },
    mempool: {
      description: 'Used for API calls to query the Bitcoin blockchain',
      optional: false,
      s9pk: 'https://github.com/Start9Labs/mempool-startos/releases/download/v3.2.1.2/mempool.s9pk',
    },
  },
})
