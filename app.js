const Mastodon = require('mastodon-api');
const readline = require('readline');
const slack = require('slack-incoming-webhook')({url: process.env.SLACK_WEBHOOK_URL});
const core = require('./core');

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

const main = async (accessToken) => {
    const client = new Mastodon({access_token: accessToken, api_url: apiUrl});
    const stream = client.stream('streaming/user');
    console.log('streaming start...');
    stream.on('message', msg => {
        if (!core.isWafuuablePawooPost(msg.data)) {
            return;
        }
        const slackPayload = core.pawooPostToSlackMessage(msg.data);
        console.log(`[wafuu]: ${msg.data.uri}`);
        slack('', slackPayload)
    });
    stream.on('error', err => {
        console.error(err);
    });
}

const accessToken = process.env.WAFUU_ACCESS_TOKEN;
main(accessToken);