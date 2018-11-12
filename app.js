const Mastodon = require('mastodon-api');
const readline = require('readline');

const baseUrl = 'https://pawoo.net';
const apiUrl = `${baseUrl}/api/v1/`;

const getAccessToken = async () => {
    const rl = readline.createInterface(process.stdin, process.stdout);
    const authUrl = await Mastodon.getAuthorizationUrl(clientId, clientSecret, baseUrl, 'read')
    console.log('Please visit: ', authUrl);
    rl.on('line', async input => {
        rl.close();
        const authCode = input;
        const accessToken = await Mastodon.getAccessToken(clientId, clientSecret, authCode, baseUrl).catch(err => console.error(err));
        console.log('Your access token: ', accessToken);
    });
}

const extractData = (data) => {
    if (data.reblog !== null) {
        return extractData(data.reblog);
    }
    return {
        account: data.account,
        uri: data.uri,
        sensitive: data.sensitive,
        mediaAttachments: data.media_attachments,
        tags: data.tags,
    }
};

const main = async (accessToken) => {
    const client = new Mastodon({access_token: accessToken, api_url: apiUrl});
    const stream = client.stream('streaming/user');
    console.log('streaming start...');
    stream.on('message', msg => {
        const payload = extractData(msg.data);
        console.log(payload);
    });
    stream.on('error', err => {
        console.error(err);
    });
}

const accessToken = process.env.ACCESS_TOKEN;
main(accessToken);