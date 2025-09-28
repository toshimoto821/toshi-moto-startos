import { setupManifest } from '@start9labs/start-sdk'
import { SDKImageInputSpec } from '@start9labs/start-sdk/base/lib/types/ManifestTypes'

const BUILD = process.env.BUILD || ''

const architectures =
  BUILD === 'x86_64' || BUILD === 'aarch64' ? [BUILD] : ['x86_64', 'aarch64']

export const manifest = setupManifest({
  id: 'hello-world-fullstack',
  title: 'Hello World Full Stack',
  license: 'MIT',
  wrapperRepo: 'https://github.com/Start9Labs/hello-world-fullstack',
  upstreamRepo: 'https://github.com/Start9Labs/hello-world-fullstack',
  supportSite: 'https://github.com/Start9Labs/hello-world-fullstack/issues',
  marketingSite: 'https://github.com/Start9Labs/hello-world-fullstack',
  donationUrl: 'https://github.com/Start9Labs/hello-world-fullstack',
  docsUrl: 'https://github.com/Start9Labs/hello-world-fullstack#readme',
  description: {
    short: 'A full-stack hello world application with React, Node.js, and MongoDB',
    long: 'This is a demonstration application showing how to package a full-stack web application for StartOS. It includes a React frontend, Node.js backend API, and MongoDB database all running in a single container. Perfect for learning how to create complex Start9 services.',
  },
  volumes: ['main'],
  images: {
    main: {
      source: {
        dockerBuild: {},
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
  dependencies: {},
})