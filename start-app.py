# -*- coding:utf-8 -*-

import os
from os import path
import json
import sys
import datetime

# Get command line arguments (shared global)
cliArgs = list(sys.argv)[1:]

# TODO: Print short help if no arguments passed
# Examples:
# - python start-app.py --use-public --data-set-folder sweet-corn --omit-date-tag --target-folder target


# Helpers...

def posixPath(pathName):
    return pathName.replace('\\', '/')


def loadJson(filename):
    if not path.isfile(filename):
        print('Not found file ', filename)
        exit(1)
    with open(filename, encoding='utf-8') as fh:
        return json.load(fh)

def writeJson(filename, data):
    jsonStr = json.dumps(data, indent=2)
    with open(filename, 'wb') as fh:
        fh.write(jsonStr.encode('utf-8'))

def getDateTag(now=None):
    dateTagPreciseFormat = '%y%m%d-%H%M%S'
    if now is None or not now:
        now = datetime.datetime.now()  # Get current date object
    dateTag = now.strftime(dateTagPreciseFormat)
    return dateTag


# Global shared root path...
rootPath = posixPath(path.dirname(path.abspath(__file__)))

def loadDemoData():
    """
    Loading demo data.

    Uses global variables:
    - rootPath
    - cliArgs

    TODO: Command line params:
    --use-public
    --data-folder
    --data-set-folder

    Returns dictionary with keys:
    - edgesData
    - flowsData
    - graphsData
    - nodesData
    """

    # Initialize parameters...
    usePublic = '--use-public' in cliArgs

    # Get data folder...
    dataFolder = 'data'
    hasDataFolder = '--data-folder' in cliArgs
    if hasDataFolder:
        p = cliArgs.index('--data-folder')
        dataFolder = cliArgs[p + 1]
        if not dataFolder or dataFolder.startswith('--'):
            print('Invalid or empty data folder argument:', dataFolder)
            exit(1)

    # Get data set folder...
    dataSetFolder = 'hardwood-forestry'
    hasDataSetFolder = '--data-set-folder' in cliArgs
    if hasDataSetFolder:
        p = cliArgs.index('--data-set-folder')
        dataSetFolder = cliArgs[p + 1]
        if not dataSetFolder or dataSetFolder.startswith('--'):
            print('Invalid or empty data set folder argument:', dataSetFolder)
            exit(1)

    print('dataFolder:', dataFolder)
    print('dataSetFolder:', dataSetFolder)

    dataPathParts = [
        'public' if usePublic else None,  # For pre-build environment, when 'public' hasn't served at root of build files yet.
        dataFolder,
    ]
    dataPath = posixPath(path.join(rootPath, '/'.join(list(filter(None, dataPathParts)))))
    dataSetPath = posixPath(path.join(dataPath, dataSetFolder))

    print('dataPath:', dataPath)
    print('dataSetPath:', dataSetPath)

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
        'edgesData': edgesData,
        'flowsData': flowsData,
        'graphsData': graphsData,
        'nodesData': nodesData,
    }

demoData = loadDemoData()

#  print('Data:')
#  print('edgesData:', demoData['edgesData'])
#  print('flowsData:', demoData['flowsData'])
#  print('graphsData:', demoData['graphsData'])
#  print('nodesData:', demoData['nodesData'])

def writeTempData(demoData):
    """
    Expected data dictionary with keys:
    - edgesData
    - flowsData
    - graphsData
    - nodesData

    Uses global variables:
    - rootPath
    - cliArgs

    TODO: Command line params:
    --omit-date-tag - To omit date tag postfix in auto-generated target folder name
    --target-folder
    """

    # Default target folder prefix
    targetFolder = 'temp'

    # Get data set folder...
    hasTargetFolder = '--target-folder' in cliArgs
    if hasTargetFolder:
        p = cliArgs.index('--target-folder')
        targetFolder = cliArgs[p + 1]
        if not targetFolder or targetFolder.startswith('--'):
            print('Invalid or empty target folder argument:', targetFolder)
            exit(1)

    omitDateTag = '--omit-date-tag' in cliArgs
    if not omitDateTag:
        targetFolder += '-' + getDateTag()

    print('targetFolder:', targetFolder)

    targetPath = posixPath(path.join(rootPath, targetFolder))
    print('targetPath:', targetPath)

    # Ensure target path exists
    if not path.exists(targetPath):
        # TODO: To catch possible fs/io errors?
        os.makedirs(targetPath)

    # Create target file names...
    edgesTempFile = posixPath(path.join(targetPath, 'edges.json'))
    flowsTempFile = posixPath(path.join(targetPath, 'flows.json'))
    graphsTempFile = posixPath(path.join(targetPath, 'graphs.json'))
    nodesTempFile = posixPath(path.join(targetPath, 'nodes.json'))

    #  print('Target files:')
    #  print('edgesTempFile', edgesTempFile)
    #  print('flowsTempFile', flowsTempFile)
    #  print('graphsTempFile', graphsTempFile)
    #  print('nodesTempFile', nodesTempFile)

    # Write files...
    print('Writting target files...')
    writeJson(edgesTempFile, demoData['edgesData'])
    writeJson(flowsTempFile, demoData['flowsData'])
    writeJson(graphsTempFile, demoData['graphsData'])
    writeJson(nodesTempFile, demoData['nodesData'])
    print('Done')

writeTempData(demoData)

# TODO:
# - Launch server for app and data.
# - Construct app url query with target file names.
# - Launch browser with app.
# - (Optional?) Remove temp data when browser closed.
