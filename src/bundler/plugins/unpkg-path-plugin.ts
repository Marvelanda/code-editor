import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: 'index.js', namespace: 'a' };
      });

      build.onResolve(
        { filter: /^\.+\// },
        (args: { path: string; resolveDir: string }) => {
          return {
            namespace: 'a',
            path: new URL(
              args.path,
              'https://unpkg.com' + args.resolveDir + '/'
            ).href,
          };
        }
      );

      build.onResolve(
        { filter: /.*/ },
        async (args: { path: string; resolveDir: string }) => {
          return {
            namespace: 'a',
            path: `https://unpkg.com/${args.path}`,
          };
        }
      );
    },
  };
};
