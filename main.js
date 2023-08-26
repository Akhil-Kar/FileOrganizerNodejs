#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const inputArr = process.argv.slice(2);

let command = inputArr[0];

let types = {
    media: ["mp4", "mkv", "jpg", "jpeg", "png", "mp3"],
    archives: ["zip", '7z', 'rar', 'tar', 'gz', 'ar', 'iso', 'xz'],
    document: ['docs', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', 'deb', 'rpm', 'sh']
}

switch (command) {
    case "tree":
        treeFn(inputArr[1]);
        break;
    case "organize":
        organizeFn(inputArr[1]);
        break;
    case "help":
        helpFn();
        break;
    default:
        console.log("Please provide a valid prompt!");
}

function treeFn(dirPath) {
    // console.log("Tree function called", dirPath);
    if(dirPath == undefined) {
        dirPath = process.cwd();
        treeHelper(dirPath, "");
    } else {
        let doesExist = fs.existsSync(dirPath);
        if(doesExist) {
            treeHelper(dirPath, "");
        } else {
            console.log("Please provide valid directory");
            return;
        }
    }
}


function organizeFn(dirPath) {
    let destinationPath;

    if(dirPath == undefined) {
        dirPath = process.cwd();
        destinationPath = path.join(dirPath, "organize_file");
        if(!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath);
        }

    } else {
        let doesExist = fs.existsSync(dirPath);
        if(doesExist) {

            destinationPath = path.join(dirPath, "organize_file");
            if(!fs.existsSync(destinationPath)) {
                fs.mkdirSync(destinationPath);
            }

        } else {
            console.log("Please provide valid directory");
            return;
        }
    }
    organizeHelper(dirPath, destinationPath);
}


function helpFn() {
    console.log(`
    All command list:
        node main.js tree "directory Path" for tree command.
        node main.js organize "directory Path" for organize command.
    `);
}


function organizeHelper(src, dest) {
    let childFiles = fs.readdirSync(src);
    // console.log(childFiles);
    for(let i = 0; i < childFiles.length; i++) {
        let childAddress = path.join(src, childFiles[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if(isFile) {
            // console.log(childFiles[i]);
            let category = getCategory(childFiles[i]);
            // console.log(childFiles[i], "-->", category);
            sendFiles(childAddress, dest, category);
        }
    }
}


function getCategory(name) {
    let extension = path.extname(name);
    extension = extension.slice(1);
    // console.log(extension);

    for(let type in types) {
        let currentType = types[type];
        for(let i = 0; i < currentType.length; i++) {
            if(extension == currentType[i]) {
                return type;
            }
        }
    }
    return "others";
}


function sendFiles(srcFilePath, dest, category) {
    let categoryPath = path.join(dest, category);
    if(!fs.existsSync(categoryPath)) {
        fs.mkdirSync(categoryPath);
    }

    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath, fileName);
    fs.copyFileSync(srcFilePath, destFilePath);
    fs.unlinkSync(srcFilePath);
    console.log(fileName, "--> copied");
}


function treeHelper(dirPath, indent) {
    let name = path.basename(dirPath);
    let isFile = fs.lstatSync(dirPath).isFile();
    if(isFile) {
        console.log(indent + "|-->" + name);
    } else {
        console.log(indent + "|-->" + name);
        let child = fs.readdirSync(dirPath);
        for(let i = 0; i < child.length; i++) {
            let childPath = path.join(dirPath, child[i]);
            treeHelper(childPath, indent + "\t");
        }
    }
}