import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['src/app.ts'],
  bundle: true,
  platform: 'node',
  target: 'node14',
  outfile: 'build/app.js',
  external: ['aws-sdk'],  // Don't bundle AWS SDK
}).catch(() => process.exit(1));
