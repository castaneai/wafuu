const core = require('./core');

const DATA_NORMAL = {
    uri: 'https://uri',
    sensitive: true,
    reblog: null,
    media_attachments: [
        {preview_url: 'http://placehold.jp/250x250.png?text=image01'},
        {preview_url: 'http://placehold.jp/250x250.png?text=image02'},
    ],
    account: {username: 'username', display_name: 'display_name'},
};

const DATA_NON_FAFUUABLE = {
    sensitive: false,
};

const DATA_REBLOG = {
    sensitive: false,
    reblog: DATA_NORMAL,
};

test('is wafuuable?', () => {
    expect(core.isWafuuablePawooPost(DATA_NON_FAFUUABLE)).toBe(false);
    expect(core.isWafuuablePawooPost(DATA_NORMAL)).toBe(true);
    expect(core.isWafuuablePawooPost(DATA_REBLOG)).toBe(true);
});

test('creates slack payload', () => {
    console.log(core.pawooPostToSlackMessage(DATA_NORMAL));
});

if (process.env.SLACK_WEBHOOK_URL) {
    test('send to slack', done => {
        const slackPayload = core.pawooPostToSlackMessage(DATA_NORMAL);
        const slack = require('slack-incoming-webhook')({url: process.env.SLACK_WEBHOOK_URL});
        slack('', slackPayload, () => done());
    });
}
