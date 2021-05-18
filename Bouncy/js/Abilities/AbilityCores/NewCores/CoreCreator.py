import fileinput
import argparse

from shutil import copyfile
from pathlib import Path

parser = argparse.ArgumentParser(description='Make a bunch of ability cores.')
parser.add_argument('coreNum', metavar='ID', type=int,
                   help='the Core Number to create')
parser.add_argument('coreClass', metavar='Type', type=str,
                   help='the class of the core.  One of [WEAPON, DEFENDER, CHAOS, POISON, ENGINEER, EARTHMASTER, NEUTRAL]')

args = parser.parse_args()

coreNum = args.coreNum
coreClass = args.coreClass.upper()
try:
    if not coreNum:
        raise Exception("coreNum required.")
    if coreClass not in ["WEAPON", "DEFENDER", "CHAOS", "POISON", "ENGINEER", "EARTHMASTER", "NEUTRAL"]:
        raise Exception("coreClass must be one of [WEAPON, DEFENDER, CHAOS, POISON, ENGINEER, EARTHMASTER, NEUTRAL]")

    fileName = "AbilityCore" + str(coreNum) + ".js"

    my_file = Path(fileName)
    if my_file.exists():
        raise Exception("This ability already exists");

    inputFile = open("AbilityCoreTemplate.js", 'r')
    outputFile = open(fileName, 'w')
    #fileToSearch = 'D:\dummy1.txt'

    textToSearch = "NUMBER"
    fileContents = inputFile.read()
    inputFile.close()

    fileContents = fileContents.replace("NUMBER", str(coreNum))
    fileContents = fileContents.replace("CLASS_TYPE", str(coreClass))
    outputFile.write(fileContents)
    outputFile.close()
except Exception as error:
    print ("Error: " + repr(error));
