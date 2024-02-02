<!--
@since 2024.02.02, 22:55
@changed 2024.02.02, 22:55
-->

# Embedded web server (`start-app.py`)

## Open a data passed via a 'POST redirect'

1. Start web server with: `python start-app.py --dev` (if starting form the project folder, with `build` subfolder) or just `python start-app.py` (if starting in the built app root -- then this script is located on the same level as `build.txt` and `index.html` app files). It's possible to start it with npm commands: `npm run start-app-server` (for build) and `npm run start-app-dev-server` (for developing project).
2. Open demo html page in a browser: `http://localhost:8080/start-app-demo-post.html`.
3. Submit a form manually. It'll be sent to data processing endpoint `POST /cgi-bin/accept-post-data`.
4. When/if data is successfully created it'll be redirected to main app page with corresponding parameters in the url query, like:

http://localhost:8080/
?doAutoLoad=yes
&doAutoStart=yes
&autoLoadUrlEdges=temp-240202-220842/post-http-localhost-8080-start-app-demo-post-html-240202-220848-edges.json
&autoLoadUrlFlows=temp-240202-220842/post-http-localhost-8080-start-app-demo-post-html-240202-220848-flows.json
&autoLoadUrlGraphs=temp-240202-220842/post-http-localhost-8080-start-app-demo-post-html-240202-220848-graphs.json
&autoLoadUrlNodes=temp-240202-220842/post-http-localhost-8080-start-app-demo-post-html-240202-220848-nodes.json

File names here formed with request headers' origin string and current timestamp to prevent reuse the same names for different clients.

Don't forget to close the browser or release the page before stopping the server.

If you want to made changes in server files, it's possible to start a dynamic updater with `sh start-app-watch.sh`.

