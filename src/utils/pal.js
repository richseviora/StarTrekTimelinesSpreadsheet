const electron = require('electron');
const app = electron.app || electron.remote.app;
const shell = electron.shell || electron.remote.shell;
const dialog = electron.dialog || electron.remote.dialog;
const fs = require('fs');
const os = require('os');

import { ipcRenderer } from 'electron';

export function getAppVersion() {
    return app.getVersion();
}

export function getAppPath(name) {
    return app.getPath(name);
}

export function getOSDetails() {
    return `${os.platform()} ${os.arch()} (${os.release()})`;
}

export function openDevTools() {
    ipcRenderer.send("open-dev-tools", "");
}

export function openShellExternal(url) {
    shell.openExternal(url);
}

export function download(filename, text, title, buttonLabel) {
    // For the browser:
    /*var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }*/

    // For Electron:

    //TODO: filters based on file extension

    let extension = filename.split('.').pop();
    let extName = '';
    if (extension === 'csv') {
        extName = 'Comma separated file (*.csv)';
    } else if (extension === 'xlsx') {
        extName = 'Excel spreadsheet (*.xlsx)';
    } else if (extension === 'json') {
        extName = 'JSON formatted file (*.json)';
    } else if (extension === 'html') {
        extName = 'HTML file (*.html)';
    }

    dialog.showSaveDialog(
        {
            filters: [{ name: extName, extensions: [extension] }],
            title: title,
            defaultPath: filename,
            buttonLabel: buttonLabel
        },
        (fileName) => {
            if (fileName === undefined)
                return;

            fs.writeFile(fileName, text, (err) => {
                if (!err) {
                    shell.openItem(fileName);
                }
            });

        });
}