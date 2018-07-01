import fileinput
import argparse

from shutil import copyfile

parser = argparse.ArgumentParser(description='Make a bunch of ability cores.')
parser.add_argument('coreNum', metavar='N', type=int,
                   help='the Core Number to create')

args = parser.parse_args()

coreNum = args.coreNum
if coreNum:
    fileName = "AbilityCore" + str(coreNum) + ".js"

    inputFile = open("AbilityCoreTemplate.js", 'r')
    outputFile = open(fileName, 'w')
    #fileToSearch = 'D:\dummy1.txt'

    textToSearch = "NUMBER"
    fileContents = inputFile.read()
    inputFile.close()

    fileContents = fileContents.replace("NUMBER", str(coreNum))
    outputFile.write(fileContents)
    outputFile.close()
