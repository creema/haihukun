// Description:
//   ヘルプ
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
  robot.respond(/(help|たすけて|わからない)/i, function(res) {
    var replyMessage = '';
    replyMessage += '\n';
    replyMessage += 'ｲｽﾞﾚｶｦﾍﾝｼﾝｼﾃｸﾚ';
    replyMessage += '\n';
    replyMessage += '- 頂戴\n';
    replyMessage += '- くれ\n';
    replyMessage += '- please';
    res.reply(replyMessage);
    robot.logger.info('Post a reply message.');
  });
};
