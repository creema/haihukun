// Description:
//   アプリ配布リクエスト用
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   None

module.exports = function(robot) {
  robot.respond(/.*(頂戴|くれ|please).*/i, function(res) {
    var replyMessage = '';
    replyMessage += 'ﾌｫｰﾏｯﾄﾖｺｼﾃｸﾀﾞｻｲ';
    replyMessage += '┏┫￣皿￣┣┛';
    replyMessage += '\n';
    replyMessage += '\n';
    replyMessage += '-- DISTRIBUTION INFO --\n';
    replyMessage += 'BRANCH=' + process.env.HUBOT_HAIHUKUN_FORMAT_ITEM1  + '\n';
    replyMessage += 'ENVIRONMENT-MODE=debug\n';
    replyMessage += 'API-DOMAIN=' + process.env.HUBOT_HAIHUKUN_FORMAT_ITEM2  + '\n';
    replyMessage += 'DEVELOPER-ID=xx\n';
    replyMessage += '-----------------------\n';
    res.reply(replyMessage);
    robot.logger.info('Post a reply message.');
  });
};
