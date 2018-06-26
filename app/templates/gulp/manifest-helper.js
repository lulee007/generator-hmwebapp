'use strict';

var fs = require('fs-extra');
var log = require('fancy-log');
var config = require('./config');
var path = require('path');
module.exports = {
    removeItemBySource: removeItemBySource,
    saveRev: saveRev,
    compareManifest: compareManifest,
    saveOldManifest: saveOldManifest
};
var _old, _new;

function removeItemBySource(source) {
    var manifest = require(config.revManifest);
    for (var sPath in manifest) {
        if (source.endsWith(sPath)) {
            delete manifest[sPath];
            break;
        }
    }
    fs.writeJsonSync(config.revManifest, manifest);
}

function saveRev(source, rev) {
    var manifest = fs.readJsonSync(config.revManifest);
    if (!rev) {
        rev = source;
        source = undefined;
    }
    if (!source) {
        log(rev, config.tmp + 'app/');
        var nPath = (config.tmp + 'app/').split('/').join(path.sep);
        rev = rev.split(nPath)[1];
        var dashStart = rev.indexOf('-');
        var dashEnd = dashStart + 11;
        source = rev.substr(0, dashStart) + rev.substr(dashEnd);
        log('save rev:', source, rev);
        manifest[source] = rev;
        fs.writeJsonSync(config.revManifest, manifest);
        return;
    }
    var nRev = rev.split(path.sep).join('/').split(config.tmp + 'app/')[1];
    log('save rev:', source, nRev);
    manifest[source] = nRev;
    fs.writeJsonSync(config.revManifest, manifest);
}

function compareManifest() {
    _new = fs.readJsonSync(config.revManifest);
    var oldKeys = Object.keys(_old);
    var toDelete = [], toAdd = [];
    oldKeys.forEach(function (key) {
        if (_old[key] !== _new[key]) {
            toDelete.push(_old[key]);
            toDelete.push(_old[key] + '.map');
            _new[key] && toAdd.push(_new[key]);
            _new[key] && toAdd.push(_new[key] + '.map');
        }
        delete _old[key];
        delete _new[key];
    });
    log(_old, _new);
    var newKeys = Object.keys(_new);
    newKeys.forEach(function (key) {
        toAdd.push(_new[key]);
        toAdd.push(_new[key] + '.map');
    });
    toAdd = toAdd.map(function (f) {
        return config.tmp + 'rev/' + f;
    });
    toDelete = toDelete.map(function (f) {
        return config.dist + 'app/' + f;
    });
    return {toAdd: toAdd, toDelete: toDelete};

}


function saveOldManifest() {
    _old = fs.readJsonSync(config.revManifest);
}
