const nodegit = require('nodegit');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { buildDate } = require('./utils');    

require('dotenv').config();

(clone = async() => {
    
    let today = buildDate();
    const dir = `./repositories/${today}`;
    let repos = [];

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    var cloneOpts = {};

    cloneOpts.fetchOpts = {
        callbacks: {
            certificateCheck: function() { return 0; },
            credentials: function(url, userName) {
                return nodegit.Cred.userpassPlaintextNew(process.env.GITUSER, process.env.GITPASS);
            }
        }
    };

    repos = [... require('./repos.json').repos, ...await getRepos() ];

    for(repo of repos) {
        console.log('>>> Cloning Repo:' + repo.name);
        let url = repo.http_url_to_repo;
        let local = `${dir}/${repo.name}`;
       
        nodegit.Clone(url, local, cloneOpts).then(function (repo) {
            console.log(">>>> Cloned " + path.basename(url) + " to " + repo.workdir());
        }).catch(function (err) {
            console.log(err);
        });
    
    }

    
})();

async function getRepos() {
    try {
      const response = await axios.get(process.env.GITURL);

      return response.data;

    } catch (error) {
        console.log(error);
    }
}


