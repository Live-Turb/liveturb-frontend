let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['localhost', 'liveturb.com', 'app.liveturb.com'],
  },
  experimental: {
    // Removendo configurações experimentais que podem causar problemas
    // webpackBuildWorker: true,
    // parallelServerBuildTraces: true,
    // parallelServerCompiles: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://liveturb.com/api/v1/:path*',
        basePath: false
      },
      {
        source: '/api/user',
        destination: 'https://liveturb.com/api/user',
        basePath: false
      },
      {
        source: '/sanctum/csrf-cookie',
        destination: 'https://liveturb.com/sanctum/csrf-cookie',
        basePath: false
      },
    ];
  },
}

if (userConfig) {
  // ESM imports will have a "default" property
  const config = userConfig.default || userConfig

  for (const key in config) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      }
    } else {
      nextConfig[key] = config[key]
    }
  }
}

export default nextConfig