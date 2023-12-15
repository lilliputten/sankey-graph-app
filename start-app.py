# -*- coding:utf-8 -*-

import os
from os import path
import json
import sys
import datetime
import argparse
from typing import TypedDict


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


# Default options...
defaultDataFolder: str = 'data'
defaultDataSetFolder: str = 'hardwood-forestry'
defaultTargetFolder: str = 'temp'


# Command line parameters...
parser = argparse.ArgumentParser(description='Launch app from python script demo.')
parser.add_argument('--use-public', dest='usePublic', action=argparse.BooleanOptionalAction, help='Use "public" folder prefix (for non-built dev environment)')
parser.add_argument('--data-folder', dest='dataFolder', metavar='{dataFolder}', action='store', default=defaultDataFolder, help='Data folder name (default: "' + defaultDataFolder + '")')
parser.add_argument('--data-set-folder', dest='dataSetFolder', metavar='{dataSetFolder}', action='store', default=defaultDataSetFolder, help='Data set folder name (default: "' + defaultDataSetFolder + '")')
parser.add_argument('--target-folder', dest='targetFolder', metavar='{targetFolder}', action='store', default=defaultTargetFolder, help='Target folder name (default: "' + defaultTargetFolder + '")')
parser.add_argument('--omit-date-tag', dest='omitDateTag', action=argparse.BooleanOptionalAction, help='Omit date tag postfix for auto-generated target folder name')
options = parser.parse_args()


# Data processing routines...

def loadDemoAppData() -> AppData:
    """
    Loading demo data from external files.

    Uses global variables:
    - rootPath
    - options
    """

    print('usePublic:', options.usePublic)
    print('dataFolder:', options.dataFolder)
    print('dataSetFolder:', options.dataSetFolder)

    dataPathParts = [
        'public' if options.usePublic else None,  # For pre-build environment, when 'public' hasn't served at root of build files yet.
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

    #  print('Input files:')
    #  print('edgesFile', edgesFile)
    #  print('flowsFile', flowsFile)
    #  print('graphsFile', graphsFile)
    #  print('nodesFile', nodesFile)

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
    targetPath = posixPath(path.join(rootPath, targetFolder))
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

def writeAppData(appData: AppData, targetFileNames: TargetFileNames):
    """
    Write app data to later use in launched app.
    """
    print('Writting target files:')
    print('Writting', targetFileNames['edges'], '...')
    writeJson(posixPath(path.join(rootPath, targetFileNames['edges'])), appData['edges'])
    print('Writting', targetFileNames['flows'], '...')
    writeJson(posixPath(path.join(rootPath, targetFileNames['flows'])), appData['flows'])
    print('Writting', targetFileNames['graphs'], '...')
    writeJson(posixPath(path.join(rootPath, targetFileNames['graphs'])), appData['graphs'])
    print('Writting', targetFileNames['nodes'], '...')
    writeJson(posixPath(path.join(rootPath, targetFileNames['nodes'])), appData['nodes'])
    print('Done')


# Start processing...

# DEBUG: Get demo data from files. Provide real data here.
appData = loadDemoAppData()

targetFolder = getTargetFolder()

ensureTargetFolder(targetFolder)

targetFileNames = getTargetFileNames(targetFolder)

#  print('App data:')
#  print('edgesData:', appData['edgesData'])
#  print('flowsData:', appData['flowsData'])
#  print('graphsData:', appData['graphsData'])
#  print('nodesData:', appData['nodesData'])

writeAppData(appData, targetFileNames)

# TODO:
# - Launch server for app and data.
# - Construct app url query with target file names.
# - Launch browser with app.
# - (Optional?) Remove temp data when browser closed.
