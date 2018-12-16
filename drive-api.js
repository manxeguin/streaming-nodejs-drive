const readline = require('readline');
const {google} = require('googleapis');
const fs = require('fs');

const SCOPES = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.metadata.readonly'
];

const TOKEN_PATH = 'token.json';


class DriveApi {
    constructor() {
        fs.readFile('credentials.json', (err, content) => {
            if (err) {
                return console.log('Error loading client secret file:', err);
            }

            this.authorize(JSON.parse(content));
        });
    }

    authorize(credentials) {
        const {client_secret, client_id, redirect_uris} = credentials.installed;
        const oAuth2Client = new google
            .auth
            .OAuth2(client_id, client_secret, redirect_uris[0]);

        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) {
                return this.getAccessToken(oAuth2Client, callback);
            }

            oAuth2Client.setCredentials(JSON.parse(token));
            this.oAuth2Client = oAuth2Client;
        });
    }

    getAccessToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({access_type: 'offline', scope: SCOPES});
        const rl = readline.createInterface({input: process.stdin, output: process.stdout});
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) {
                    return console.error('Error retrieving access token', err);
                }

                oAuth2Client.setCredentials(token);

                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
                this.oAuth2Client = oAuth2Client;
            });
        });
    }

    downloadFile(file, callback, start, end) {
        const auth = this.oAuth2Client;
        const drive = google.drive({version: 'v3', auth });

        drive
            .files
            .get({
                fileId: file,
                alt: 'media',
                headers: { Range: `bytes=${start}-${end}` }
            }, {
                responseType: 'stream'
            }, callback)
    }

    listVideoFiles() {
        return new Promise(async (resolve, reject) => {
            const auth = this.oAuth2Client;
            const drive = google.drive({version: 'v3', auth });
            const query = "'19v2x0KthkXs1twUYdNyQwgQ67k5IlDdR' in parents and trashed = false";

            if (this.cachedList) {
                resolve(this.cachedList);
            }

            drive.files.list({
                auth: auth,
                pageSize: 10,
                q: query,
                fields: "nextPageToken, files(id, name, size, contentHints/thumbnail, videoMediaMetadata, thumbnailLink)"
              }, (err, response) => {
                
                if (err) {
                  reject(err);
                }
                this.cachedList = response.data.files;
                resolve(this.cachedList);
      
              });
        });
        
      }
}



module.exports = DriveApi;