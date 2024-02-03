#!/bin/sh
#
# @desc Small dev-time watcher for build files
#
# @changed 2024.02.02, 22:19
#
# 1. Run server for `build` folder with a command `npm run serve-build`.
# 2. For dev mode: run start-app files updater (this script) with `sh start-app-watch.sh`
# 3. Start web server with: `python start-app.py --dev` (if start with `build` subfolder) or just `python start-app.py` if start in the app root (this script is located on the same level as `build.txt` and `index.html` app files, in the build or published folder). It's possible to start it with npm commands: `npm run start-app-server` (for build) and `npm run start-app-dev-server` (for developing project).
# 4. Open demo html in a browser: `http://localhost:8080/start-app-demo-post.html`.
# 5. Submit a form manually. It'll be sent to data processing endpoint `POST /cgi-bin/accept-post-data`.
# 6. When/if data is successfully created it'll be redirected to main app page with corresponding parameters in the url query, like:
#
# http://localhost:8080/
# ?doAutoLoad=yes
# &doAutoStart=yes
# &autoLoadUrlEdges=temp-240202-220842/post-http-localhost-8080-start-app-demo-post-html-240202-220848-edges.json
# &autoLoadUrlFlows=temp-240202-220842/post-http-localhost-8080-start-app-demo-post-html-240202-220848-flows.json
# &autoLoadUrlGraphs=temp-240202-220842/post-http-localhost-8080-start-app-demo-post-html-240202-220848-graphs.json
# &autoLoadUrlNodes=temp-240202-220842/post-http-localhost-8080-start-app-demo-post-html-240202-220848-nodes.json
#
# File names here formed with request headers' origin string and current timestamp to prevent reuse the same names for different clients.
#
# Don't forget to close the browser or release the page before stopping the server.

# TODO: Clear 'build/temp*' folders?

npx copy-and-watch --watch \
  start-app*.{py,html,js} \
  build/
