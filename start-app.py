# -*- coding:utf-8 -*-

import os
from os import path
import json
import sys
import datetime
import argparse
from typing import TypedDict
import http.server
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
from time import sleep
import webbrowser

devBuildFolder = 'build'
# Constants...
browserUrlPrefix = 'http://localhost:'
devBuildFolder = 'build'

# Default options...
defaultDataFolder: str = 'data'
defaultDataSetFolder: str = 'hardwood-forestry'
defaultTargetFolder: str = 'temp'
defaultWebPort: str = 8080


# Command line options...
parser = argparse.ArgumentParser(description='Launch app from python script demo.')
parser.add_argument('--data-folder', dest='dataFolder', metavar='{dataFolder}', action='store', default=defaultDataFolder, help='Data folder name (default: "' + defaultDataFolder + '")')
parser.add_argument('--data-set-folder', dest='dataSetFolder', metavar='{dataSetFolder}', action='store', default=defaultDataSetFolder, help='Data set folder name (default: "' + defaultDataSetFolder + '")')
parser.add_argument('--target-folder', dest='targetFolder', metavar='{targetFolder}', action='store', default=defaultTargetFolder, help='Target folder name (default: "' + defaultTargetFolder + '")')
parser.add_argument('--omit-date-tag', dest='omitDateTag', action=argparse.BooleanOptionalAction, help='Omit date tag postfix for auto-generated target folder name')
parser.add_argument('--web-port', dest='webPort', metavar='{webPort}', type=int, action='store', default=defaultWebPort, help='Web server port (default: "' + str(defaultWebPort) + '")')
parser.add_argument('--dev', dest='isDev', action=argparse.BooleanOptionalAction, help='Use "public" folder prefix for demo data files and "' + devBuildFolder + '" for local web server (for non-built dev environment)')
options = parser.parse_args()


# Data types...

class TargetFileNames(TypedDict):
    edges: str
    flows: str
    graphs: str
    nodes: str

class AppData(TypedDict):
    edgesData: any
    flowsData: any
    graphsData: any
    nodesData: any


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


# Data processing routines...

def loadDemoAppData() -> AppData:
    """
    Loading demo data from external files.

    Uses global variables:
    - rootPath
    - options
    """

    print('isDev:', options.isDev)
    print('dataFolder:', options.dataFolder)
    print('dataSetFolder:', options.dataSetFolder)

    dataPathParts = [
        'public' if options.isDev else None,  # For pre-build environment, when 'public' hasn't served at root of build files yet.
        options.dataFolder,
    ]
    dataFolder = '/'.join(list(filter(None, dataPathParts)))
    dataSetFolder = options.dataSetFolder

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

    return {
        'edges': edgesData,
        'flows': flowsData,
        'graphs': graphsData,
        'nodes': nodesData,
    }

def getTargetFolder() -> str:
    targetFolder = options.targetFolder
    if not options.omitDateTag:
        targetFolder += '-' + getDateTag()
    return targetFolder

def ensureTargetFolder(targetFolder: str):
    pathPrefix = getPathPrefix()
    targetPath = posixPath(path.join(pathPrefix, targetFolder))
    # Ensure target path exists
    if not path.exists(targetPath):
        # TODO: To catch possible fs/io errors?
        os.makedirs(targetPath)

def getTargetFileNames(targetFolder: str) -> TargetFileNames:
    # Create target file names...
    targetFileNames: TargetFileNames = {
        'edges': posixPath(path.join(targetFolder, 'edges.json')),
        'flows': posixPath(path.join(targetFolder, 'flows.json')),
        'graphs': posixPath(path.join(targetFolder, 'graphs.json')),
        'nodes': posixPath(path.join(targetFolder, 'nodes.json')),
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

def getUrlQuery(targetFileNames: TargetFileNames):
    return '&'.join([
        'doAutoLoad=yes',
        'autoLoadUrlEdges=' + targetFileNames['edges'],
        'autoLoadUrlFlows=' + targetFileNames['flows'],
        'autoLoadUrlGraphs=' + targetFileNames['graphs'],
        'autoLoadUrlNodes=' + targetFileNames['nodes'],
    ])


class WebServer(threading.Thread):
    def __init__(self):
        super().__init__()
        self.host = 'localhost'
        self.port = options.webPort
        self.ws = HTTPServer((self.host, self.port), WebHandler)

    def run(self):
        print('WebServer started at port:', self.port)
        self.ws.serve_forever()

    def shutdown(self):
        # Set the two flags needed to shutdown the HTTP server manually
        self.ws._BaseServer__is_shut_down.set()
        self.ws.__shutdown_request = True
        print('Shutting down server')
        # Call it anyway, for good measure...
        self.ws.shutdown()
        print('Closing server')
        self.ws.server_close()
        print('Closing thread')
        self.join()

class WebHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        webRoot = devBuildFolder if options.isDev else ''
        super().__init__(*args, directory=webRoot, **kwargs)

def launchBrowser():
    """
    Launch browser and pass created file names in url query.
    """
    urlQuery = getUrlQuery(targetFileNames)
    url = browserUrlPrefix + str(options.webPort) + '/?' + urlQuery
    print('Opening browser with url:', url)
    webbrowser.open(url, new=0, autoraise=True)

def launchServer(targetFolder: str, targetFileNames: TargetFileNames):
    """
    Launch local web server to open app.
    """
    webServer = WebServer()
    webServer.start()
    launchBrowser()
    # TODO: Start this keyboard listening loop in the background
    while True:
        try:
            sleep(1)
        except KeyboardInterrupt:
            print('Keyboard Interrupt sent')
            webServer.shutdown()
            # Call cleanup code here
            removeTempAppData(targetFolder,targetFileNames)
            # TODO: Use callbacks?
            exit(0)


# Start processing...

targetFolder = getTargetFolder()
targetFileNames = getTargetFileNames(targetFolder)

# DEBUG: Get demo data from files. Provide real data here.
appData = loadDemoAppData()

ensureTargetFolder(targetFolder)
writeTempAppData(appData, targetFileNames)

launchServer(targetFolder, targetFileNames)
