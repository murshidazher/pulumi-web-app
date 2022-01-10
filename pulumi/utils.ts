import * as fs from "fs";
import * as path from "path";

/**
 * Returns an array of absolute files paths
 */
const getAllFiles = (dirPath: string, arrayOfFiles: Array<string>): Array<string> => {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, file))
    }
  })

  return arrayOfFiles
}

/**
 * Returns file path within a give base directory
 */
const getRelativeFilePaths = (basePath: string) => {
  return getAllFiles(basePath, []).map((value) => value.replace(basePath, ""))
}

export {
  getRelativeFilePaths
}

// const fs = require("fs");
// const path = require("path");


// const getAllFiles = function(dirPath, arrayOfFiles) {
//   files = fs.readdirSync(dirPath)

//   arrayOfFiles = arrayOfFiles || []

//   files.forEach(function(file) {
//     if (fs.statSync(dirPath + "/" + file).isDirectory()) {
//       arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
//     } else {
//       arrayOfFiles.push(path.join(dirPath, "/", file))
//     }
//   })

//   return arrayOfFiles
// }

// const getRelativeFilePaths = (path) => {
//   return getAllFiles(path).map((value) => value.replace(path, ""))
// }

// module.exports = {
//   getRelativeFilePaths
// };
