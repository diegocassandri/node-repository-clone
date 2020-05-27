const nodegit = require('nodegit');
const path = require('path');
const fs = require('fs');
const { buildDate } = require('./utils');    

require('dotenv').config();

let today = buildDate();
const dir = `./repositories/${today}`;

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

var cloneOpts = {};

const { repos } = require('./repo.json');

cloneOpts.fetchOpts = {
    callbacks: {
        certificateCheck: function() { return 0; },
        credentials: function(url, userName) {
            return nodegit.Cred.userpassPlaintextNew(process.env.GITUSER, process.env.GITPASS);
        }
    }
};


for(repo of repos) {

    console.log('>>> Cloning Repo:' + repo.url);
    let url = repo.url;
    let local = `${dir}/${repo.name}`;

    
    nodegit.Clone(url, local, cloneOpts).then(function (repo) {
        console.log(">>>> Cloned " + path.basename(url) + " to " + repo.workdir());
    }).catch(function (err) {
        console.log(err);
    });

}


