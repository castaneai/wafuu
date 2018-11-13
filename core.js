
const isWafuuablePawooPost = (data) => {
    if (data.reblog) {
        return isWafuuablePawooPost(data.reblog);
    }
    return data.sensitive && data.media_attachments.length > 0;
}

const pawooPostToSlackMessage = (data) => {
    if (data.reblog) {
        return pawooPostToSlackMessage(data.reblog);
    }
    return {
        attachments: createSlackAttachments(data),
    }
}

const createSlackAttachments = (data) => {
    return data.media_attachments.map(media => {
        const title = `${data.account.display_name} (${data.account.username})`;
        return {
            fallback: title,
            title: title,
            title_link: data.uri,
            image_url: media.preview_url,
        };
    });
}

module.exports = {
    isWafuuablePawooPost: isWafuuablePawooPost,
    pawooPostToSlackMessage: pawooPostToSlackMessage,
};