const nextConfig = {
  eslint: {
    // Ignorer les erreurs ESLint pendant le build, utile en CI/CD.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignorer les erreurs TypeScript pendant le build.
    ignoreBuildErrors: true,
  },
  images: {
    // Désactiver l'optimisation d'images Next.js, car elle n'est pas
    // toujours compatible avec les environnements conteneurisés sans configuration supplémentaire.
    unoptimized: true,
  },
  // Activer la sortie "standalone" pour créer une image Docker optimisée
  // ne contenant que les fichiers strictement nécessaires à la production.
  output: 'standalone',
};

export default nextConfig;
