# -*- coding:utf-8 -*-
# @since 2024.02.01, 20:08
# @changed 2024.02.03, 22:53

import os
from os import path
import sys
import datetime
import argparse
from typing import TypedDict
import http.server
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
from time import sleep
import webbrowser
import traceback
import re
import json
import urllib.parse

# NOTE: We've got a warning here:
# DeprecationWarning: 'cgi' is deprecated and slated for removal in Python 3.13
import cgi

# Constants...
browserUrlPrefix = 'http://localhost:'
devBuildFolder = 'build'

acceptPostDataUrl = '/cgi-bin/accept-post-data'

# Default options...
defaultDataFolder: str = 'data'
defaultDataSetFolder: str = 'hardwood-forestry'
defaultTargetFolder: str = 'temp'
defaultWebPort: str = 8080


# Command line options...
parser = argparse.ArgumentParser(description='Launch web server for the app.')

parser.add_argument('--web-port', dest='webPort', metavar='{webPort}', type=int, action='store', default=defaultWebPort, help='Web server port (default: "' + str(defaultWebPort) + '")')

#  parser.add_argument('--demo', dest='demo', action=argparse.BooleanOptionalAction, help='Do demo: write demo files and do one of the demo actions: demo-post or demo-files')
parser.add_argument('--demo-post', dest='demoPost', action=argparse.BooleanOptionalAction, help='Make demo POST request')
parser.add_argument('--demo-files', dest='demoFiles', action=argparse.BooleanOptionalAction, help='Open the app with links to demo files')

parser.add_argument('--demo-files-data-folder', dest='demoFilesDataFolder', metavar='{demoFilesDataFolder}', action='store', default=defaultDataFolder, help='Data folder name (default: "' + defaultDataFolder + '")')
parser.add_argument('--demo-files-data-set-folder', dest='demoFilesDataSetFolder', metavar='{demoFilesDataSetFolder}', action='store', default=defaultDataSetFolder, help='Data set folder name (default: "' + defaultDataSetFolder + '")')
parser.add_argument('--demo-files-target-folder', dest='demoFilesTargetFolder', metavar='{demoFilesTargetFolder}', action='store', default=defaultTargetFolder, help='Target folder name (default: "' + defaultTargetFolder + '")')
parser.add_argument('--demo-files-omit-date-tag', dest='demoFilesOmitDateTag', action=argparse.BooleanOptionalAction, help='Omit date tag postfix for auto-generated target folder name (datetime module required)')

# \<\(dataFolder\|dataSetFolder\|targetFolder\|omitDateTag\)\>

parser.add_argument('--dev', dest='isDev', action=argparse.BooleanOptionalAction, help='Use "public" folder prefix for demo data files and "' + devBuildFolder + '" for local web server (for non-built dev environment)')

options = parser.parse_args()


# Data types...

class TargetFileNames(TypedDict):
    edges: str
    flows: str
    graphs: str
    nodes: str

class AppData(TypedDict):
    edges: any
    flows: any
    graphs: any
    nodes: any


# Basic helpers...

def posixPath(pathName: str):
    return pathName.replace('\\', '/')

def loadJson(filename: str):
    if not path.isfile(filename):
        print('Not found file ', filename)
        exit(1)
    with open(filename, encoding='utf-8') as fh:
        return json.load(fh)

def writeJson(filename: str, data: any):
    jsonStr = json.dumps(data, indent=2)
    with open(filename, 'wb') as fh:
        fh.write(jsonStr.encode('utf-8'))

def getDateTag(now=None):
    dateTagPreciseFormat = '%y%m%d-%H%M%S'
    if now is None or not now:
        now = datetime.datetime.now()  # Get current date object
    dateTag = now.strftime(dateTagPreciseFormat)
    return dateTag


# Global shared params...
rootPath: str = posixPath(path.dirname(path.abspath(__file__)))


# Derived parameters...

webServerRootPath = posixPath(path.join(rootPath, devBuildFolder if options.isDev else ''))
print("Web server path:", webServerRootPath)


# Data processing routines...

def loadDemoAppData() -> AppData:
    """
    Loading demo data from external files.

    Uses global variables:
    - rootPath
    - options
    """

    print('isDev:', options.isDev)
    print('demoFilesDataFolder:', options.demoFilesDataFolder)
    print('demoFilesDataSetFolder:', options.demoFilesDataSetFolder)

    dataPathParts = [
        'public' if options.isDev else None,  # For pre-build environment, when 'public' hasn't served at root of build files yet.
        options.demoFilesDataFolder,
    ]
    dataFolder = '/'.join(list(filter(None, dataPathParts)))
    dataSetFolder = options.demoFilesDataSetFolder

    dataPath = posixPath(path.join(rootPath, dataFolder))
    dataSetPath = posixPath(path.join(dataPath, dataSetFolder))

    # Set input file names...
    edgesFile = posixPath(path.join(dataSetPath, 'edges.json'))
    flowsFile = posixPath(path.join(dataSetPath, 'flows.json'))
    graphsFile = posixPath(path.join(dataSetPath, 'nodes-supply-chain.json'))
    nodesFile = posixPath(path.join(dataPath, 'nodes.json'))

    edgesData = loadJson(edgesFile)
    flowsData = loadJson(flowsFile)
    graphsData = loadJson(graphsFile)
    nodesData = loadJson(nodesFile)

    appData: AppData = {
        'edges': edgesData,
        'flows': flowsData,
        'graphs': graphsData,
        'nodes': nodesData,
    }

    return appData

def getTargetFolder() -> str:
    targetFolder = options.demoFilesTargetFolder
    if not options.demoFilesOmitDateTag:
        targetFolder += '-' + getDateTag()
    return targetFolder

def ensureTargetFolder(targetFolder: str):
    pathPrefix = getPathPrefix()
    targetPath = posixPath(path.join(pathPrefix, targetFolder))
    # Ensure target path exists
    if not path.exists(targetPath):
        # TODO: To catch possible fs/io errors?
        os.makedirs(targetPath)

def getTargetFileNames(targetFolder: str, id: str = '') -> TargetFileNames:
    prefix = (id + '-' if id else '');
    postfix = '.json';
    # Create target file names...
    targetFileNames: TargetFileNames = {
        'edges': posixPath(path.join(targetFolder, prefix + 'edges' + postfix)),
        'flows': posixPath(path.join(targetFolder, prefix + 'flows' + postfix)),
        'graphs': posixPath(path.join(targetFolder, prefix + 'graphs' + postfix)),
        'nodes': posixPath(path.join(targetFolder, prefix + 'nodes' + postfix)),
    }
    return targetFileNames

def getPathPrefix():
    pathPrefix = rootPath
    if options.isDev:
        pathPrefix = pathPrefix + '/' + devBuildFolder
    return pathPrefix

def writeTempAppData(appData: AppData, targetFileNames: TargetFileNames):
    """
    Write app data to later use in launched app.
    """
    pathPrefix = getPathPrefix()
    print('Writting target files (in "' + pathPrefix + '")')
    print('Writting', targetFileNames['edges'], '...')
    writeJson(posixPath(path.join(pathPrefix, targetFileNames['edges'])), appData['edges'])
    print('Writting', targetFileNames['flows'], '...')
    writeJson(posixPath(path.join(pathPrefix, targetFileNames['flows'])), appData['flows'])
    print('Writting', targetFileNames['graphs'], '...')
    writeJson(posixPath(path.join(pathPrefix, targetFileNames['graphs'])), appData['graphs'])
    print('Writting', targetFileNames['nodes'], '...')
    writeJson(posixPath(path.join(pathPrefix, targetFileNames['nodes'])), appData['nodes'])
    print('Done')

def removeTempAppData(targetFolder: str,targetFileNames: TargetFileNames):
    """
    Remove previously created app data.
    """
    pathPrefix = getPathPrefix()
    targetPath = posixPath(path.join(pathPrefix, targetFolder))
    print('Removing target files (in "' + pathPrefix + '")')
    print('Removing', targetFileNames['edges'], '...')
    os.remove(posixPath(path.join(pathPrefix, targetFileNames['edges'])))
    print('Removing', targetFileNames['flows'], '...')
    os.remove(posixPath(path.join(pathPrefix, targetFileNames['flows'])))
    print('Removing', targetFileNames['graphs'], '...')
    os.remove(posixPath(path.join(pathPrefix, targetFileNames['graphs'])))
    print('Removing', targetFileNames['nodes'], '...')
    os.remove(posixPath(path.join(pathPrefix, targetFileNames['nodes'])))
    print('Check if target folder ("' + targetPath + '") is empty...')
    dir = os.listdir(targetPath)
    if len(dir) == 0:
        print('Removing folder "' + targetPath + '"...')
        os.rmdir(targetPath)
    print('Done')


# Web server...

def getAppUrlQuery(targetFileNames: TargetFileNames):
    return '&'.join([
        'autoLoadUrlEdges=' + urllib.parse.quote(targetFileNames['edges']),
        'autoLoadUrlFlows=' + urllib.parse.quote(targetFileNames['flows']),
        'autoLoadUrlGraphs=' + urllib.parse.quote(targetFileNames['graphs']),
        'autoLoadUrlNodes=' + urllib.parse.quote(targetFileNames['nodes']),
        'doAutoLoad=yes',
        'doAutoStart=yes',
    ])

def isEmptyData(data):
    if data == None or data == '':
        return True
    return False

def getPostedAppData(self) -> AppData:
    #  \<\(edges\|flows\|graphs\|nodes\)\>
    try:
        # Parameters...
        headers = self.headers
        dataLength = int(headers.get('content-length', 0))
        headerKeys = headers.keys()
        origin = headers.get('origin')
        referer = headers.get('referer')
        contentType = headers.get('Content-Type')
        # Data...
        edges = None
        flows = None
        graphs = None
        nodes = None
        if contentType == 'application/json':
            postJson = self.rfile.read(dataLength)
            postData = json.loads(postJson)
            edges = postData['edges']
            flows = postData['flows']
            graphs = postData['graphs']
            nodes = postData['nodes']
        elif contentType == 'application/x-www-form-urlencoded':
            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=headers,
                environ={'REQUEST_METHOD': 'POST'}
            )
            edges = form.getvalue('edges')
            flows = form.getvalue('flows')
            graphs = form.getvalue('graphs')
            nodes = form.getvalue('nodes')
            if not edges or not flows or not graphs or not nodes:
                raise Exception('One of four required data sets (edges, flows, graphs, nodes) hasn\'t been defined!')
        else:
            raise Exception('Unknown request content type: ' + contentType)

        # Parse data if strings received...
        try:
            edges = json.loads(edges) if type(edges) == str else edges
        except Exception as error:
            raise Exception('Edges json data parse error: ' + str(error))
        try:
            flows = json.loads(flows) if type(flows) == str else flows
        except Exception as error:
            raise Exception('Flows json data parse error: ' + str(error))
        try:
            graphs = json.loads(graphs) if type(graphs) == str else graphs
        except Exception as error:
            raise Exception('Graphs json data parse error: ' + str(error))
        try:
            nodes = json.loads(nodes) if type(nodes) == str else nodes
        except Exception as error:
            raise Exception('Nodes json data parse error: ' + str(error))

        # Check data existency...
        if isEmptyData(edges) or isEmptyData(flows) or isEmptyData(graphs) or isEmptyData(nodes):
           raise Exception('One of four required data sets (edges, flows, graphs, nodes) hasn\'t been defined!')
        appData: AppData = {
            'edges': edges,
            'flows': flows,
            'graphs': graphs,
            'nodes': nodes,
        }
        return appData
    except Exception as error:
        sTraceback = str(traceback.format_exc())
        sError = str(error)
        print('[getPostedAppData] error', sError, sTraceback)
        raise error

def getPostedDataId(self) -> str:
    global options
    # Get parameters...
    ipAddress = self.client_address[0]
    headers = self.headers
    referer = headers.get('referer')
    dataId = '-'.join(list(filter(None, [getDateTag() if not options.demoFilesOmitDateTag else '', ipAddress, referer])))
    dataId = re.sub(r'[^\w]+', ' ', dataId).strip();
    dataId = re.sub(r'[ \s]+', '-', dataId)
    return dataId

def doPostRequest(self): # : WebHandler):
    global options
    try:
        # Parse url...
        origUrl = self.path
        url = origUrl
        queryParams = {}
        if '?' in origUrl:
            [url, query] = origUrl.split('?')
            pairs = query.split('&') if '&' in query else [query]
            for pair in pairs:
                if '=' in pair:
                    [id, val] = pair.split('=')
                    queryParams[id] = val
                else:
                    queryParams[pair] = True
        # Get boolean `redirect` parameter
        redirectParam = queryParams['redirect'].lower() if 'redirect' in queryParams else ''
        redirectParam = True if redirectParam != 'no' and redirectParam != '0' and redirectParam != 'false' else False
        # Check url...
        if url != acceptPostDataUrl:
            self.send_error(404, message='Route not found')
            self.end_headers()
            return
        # Get parameters...
        # ipAddress = self.client_address[0]
        # Headers...
        headers = self.headers
        dataLength = int(headers.get('content-length', 0))
        headerKeys = headers.keys()
        # origin = headers.get('origin')
        # referer = headers.get('referer')
        # contentType = headers.get('Content-Type')
        # Data...
        print('doPostRequest: start', {
            #  'self': self,
            # 'headerKeys': headerKeys,
            # 'origin': origin,
            # 'referer': referer,
            # 'contentType': contentType,
        })
        # Prepare unique file id...
        dataId = getPostedDataId(self)
        logPrefix = 'POST ' + acceptPostDataUrl + ':'
        print(logPrefix, 'Starting to prepare data in folder "' + targetFolder + '" with data id: "' + dataId + '"')
        # Prepare file names and app url query...
        print(logPrefix, 'Preparing file names and query...')
        targetFileNames = getTargetFileNames(targetFolder, dataId)
        urlQuery = '/?' + getAppUrlQuery(targetFileNames)
        # Create data...
        appData: AppData = getPostedAppData(self)
        print('doPostRequest: got params', {
            # Headers...
            #  'headers': headers,
            'headerKeys': headerKeys,
            'dataLength': dataLength,
            # Prepared data
            'dataId': dataId,
            #  'targetFileNames': targetFileNames,
            'urlQuery': urlQuery,
            #  'appData': appData,
        })
        # Write files...
        ensureTargetFolder(targetFolder)
        writeTempAppData(appData, targetFileNames)
        # TODO: Set delayed 'garbage collector' here to remove unused files after some period of time?
        # OK. Finish the response with redirect to the app page...
        print(logPrefix, 'Data with id "' + dataId + '" has been successfully created, redirecting to the main app')
        if redirectParam:
            self.send_response(303)
            self.send_header('Status', '303 Redirect to main app page')
            self.send_header('Location', urlQuery)
            self.end_headers()
        else:
            self.send_response(200)
            #  self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Type', 'text/plain')
            returnData = { 'url': urlQuery }
            returnJson = json.dumps(returnData)
            #  result = '{"ok":1}'  # .encode()
            self.end_headers()
            self.wfile.write(returnJson.encode())
    except Exception as error:
        sTraceback = str(traceback.format_exc())
        sError = str(error)
        print('[doPostRequest] error', sError, sTraceback)
        # 'Server error occured. See server log for more details.'
        self.send_error(400, message=sError, explain=sTraceback)
        self.end_headers()

class WebServer(threading.Thread):
    def __init__(self):
        super().__init__()
        self.host = 'localhost'
        self.port = options.webPort
        self.ws = HTTPServer((self.host, self.port), WebHandler)

    def run(self):
        print('Web server has started at port:', self.port)
        self.ws.serve_forever()

    def shutdown(self):
        # Set the two flags needed to shutdown the HTTP server manually
        self.ws._BaseServer__is_shut_down.set()
        self.ws.__shutdown_request = True
        print('Shutting down server...')
        # Call it anyway, for good measure...
        self.ws.shutdown()
        print('Closing server...')
        self.ws.server_close()
        print('Closing thread...')
        self.join()

class WebHandler(http.server.CGIHTTPRequestHandler):  # Instead of `SimpleHTTPRequestHandler` in order to serve post requests
    # TODO: do_HEAD, do_POST
    # @see:
    # - https://docs.python.org/3/library/http.server.html
    # - https://copyprogramming.com/howto/python-python-cgi-get-post-data-code-example

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=webServerRootPath, **kwargs)

    # Process post requests...
    def do_POST(self):
        doPostRequest(self)

# Web client...

def launchBrowserWithFiles():
    """
    Launch browser and pass created file names in url query.
    """
    global targetFileNames
    urlQuery = getAppUrlQuery(targetFileNames)
    url = browserUrlPrefix + str(options.webPort) + '/?' + urlQuery
    print('Opening browser with url:', url)
    webbrowser.open(url, new=0, autoraise=True)


# Server helpers...

def isDemoMode():
    return options.demoPost or options.demoFiles

def waitForKeyboardInterrrupt():
    global targetFolder, demoTargetFileNames, webServer
    while True:
        try:
            sleep(1)
        except KeyboardInterrupt:
            print('Keyboard interrupt has cought!')
            print('Stopping the web server (don\'t forget to close the browser manually)...')
            if webServer:
                webServer.shutdown()
                webServer = None
            # Clean previously written files (if run demo mode)...
            isDemo = isDemoMode()
            if isDemo:
                removeTempAppData(targetFolder, demoTargetFileNames)
            # TODO: Use callbacks?
            exit(0)

def launchServer():
    global targetFolder, webServer
    """
    Launch local web server to open app in background.
    """
    print('Starting the web server')
    webServer = WebServer()
    webServer.start()


# Set global variables...

targetFolder = getTargetFolder()
demoTargetFileNames = getTargetFileNames(targetFolder, 'demo')

webServer = None


# Start...

isDemo = isDemoMode()

# Prepare demo data (if in demo mode)...
if isDemo:
    # DEBUG: Get demo data from files. It's possible to provide real data here.
    appData = loadDemoAppData()

    ensureTargetFolder(targetFolder)
    writeTempAppData(appData, demoTargetFileNames)

# Start web server (in a separate thread)...

serverThread = threading.Thread(target=launchServer)
serverThread.start()

# TODO: If passed parameter (`do-demo-post`) make a post request with a demo data
if options.demoPost:
    print('Starting demo post here...')
    # TODO: Create an intermediate page which should read the prepared files and then make a POST request with that data
    #  launchBrowserWithPostRequestPage()
elif options.demoFiles:
    launchBrowserWithFiles()
elif isDemo:
    removeTempAppData(targetFolder, demoTargetFileNames)

# Waiting for Ctrl-C to finish the web server...
waitForKeyboardInterrrupt()
