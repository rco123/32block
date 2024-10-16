

tfjs 환경설정.

https://github.com/tensorflow/tfjs/issues/2046

I followed these steps and it worked !!:
Node.js:
Version: 16.18.1

npm:
Version: 8.19.2

Visual Studio Build Tools:
Version: Visual Studio 2022 Community Edition
Download from: Visual Studio Downloads
Select: Desktop development with C++ and Windows 10 SDK

Python:
Version: 3.11.4
Download from: Python Downloads

@tensorflow/tfjs-node:
Version: 4.20.0
Install with:

npm install @tensorflow/tfjs-node@4.20.0
Rebuild addon from source with:

npm rebuild @tensorflow/tfjs-node --build-addon-from-source
npm Configuration:
Set Python and Visual Studio Build Tools:

npm config set python python3.9
npm config set msvs_version 2022
Remove and Reinstall node_modules and package-lock.json:
If these files exist, remove them on PowerShell:

Remove-Item -Recurse -Force .\node_modules
Remove-Item -Force .\package-lock.json 
Reinstall packages:

npm install
If you have any further questions or need more assistance, feel free to ask! 🥳


