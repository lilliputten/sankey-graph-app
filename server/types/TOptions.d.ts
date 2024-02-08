interface TOptions {
  'web-port': string | number;

  'files-target-folder': string;
  'files-omit-date-tag': string;

  dev: boolean;

  help: boolean;

  /* // NOTE: These demo options hasn't been implemented in js server. It's possible to use `start-app-demo-post.html` demo page (it's already included in the `build` folder).
   * 'demo-post': boolean;
   * 'demo-files': boolean;
   * 'demo-files-data-folder': string;
   * 'demo-files-data-set-folder': string;
   */
}
