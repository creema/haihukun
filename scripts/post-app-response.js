// Description:
//   アプリ配布受け付け用
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   None

var https = require('https');

module.exports = function(robot) {
  var replyFormatError = function(res, message) {
      var replyMessage = '';
      replyMessage += 'ﾌｫｰﾏｯﾄ間違ってるｶﾓﾖ';
      replyMessage += '┏┫￣皿￣┣┛';

      if (message) {
        replyMessage += '\n\n';
        replyMessage += message;
      }

      return res.reply(replyMessage);
  };

  var validate = function(message) {
    var matches, ret = {};

    matches = message.match(/BRANCH=(.*)\n/i);
    ret.branch = '';
    if (matches && matches[1]) {
      ret.branch = matches[1];
    }
    matches = message.match(/TAG=(.*)\n/i);
    ret.tag = '';
    if (matches && matches[1]) {
      ret.tag = matches[1];
    }
    if (ret.branch == '' && ret.tag == '') {
      throw new Error('TAG or BRANCH は必須ﾃﾞｽﾖ');
    }

    matches = message.match(/ENVIRONMENT-MODE=(.*)\n/i);
    if (!matches || !matches[1]) {
      throw new Error('ENVIRONMENT-MODE は必須');
    }
    ret.environmentMode = matches[1];

    matches = message.match(/API-DOMAIN=(https?:\/\/)?(.*)\n/i);
    if (!matches || !matches[2]) {
      throw new Error('API-DOMAIN は必須');
    }
    ret.apiDomain = matches[2];

    matches = message.match(/DEVELOPER-ID=(.*)\n/i);
    if (!matches || !matches[1]) {
      throw new Error('DEVELOPER-ID は必須');
    }
    ret.developerId = matches[1];

    return ret;
  };

  var createDistributeInfo = function(os, input) {
    var environments = [];
    environments.push({
      "mapped_to": "PROJECT_ENVIROMENT_MODE",
      "value": input.environmentMode,
      "is_expand": true
    });
    environments.push({
      "mapped_to": "PROJECT_API_DOMAIN",
      "value": input.apiDomain,
      "is_expand": true
    });
    environments.push({
      "mapped_to": "PROJECT_DEVELOPER_ID",
      "value": input.developerId,
      "is_expand": true
    });

    var buildParams = {
      "workflow_id": "haihukun",
      "environments": environments
    };

    if (input.tag != '') {
      buildParams.tag = input.tag;
    } else if (input.branch != '') {
      buildParams.branch = input.branch;
    }

    var params = {
      "hook_info": {
        "type": "bitrise",
      },
      "build_params": buildParams
    };

    if (os === 'ios') {
      params.hook_info.api_token = process.env.HUBOT_BITRISE_IOS_API_TOKEN;
    } else {
      params.hook_info.api_token = process.env.HUBOT_BITRISE_ANDROID_API_TOKEN;
    }

    robot.logger.info(params);

    return params;
  };

  var request = function(os, params, success, failure) {
    var appId = '';
    if (os === 'ios') {
      appId = process.env.HUBOT_BITRISE_IOS_APP_ID;
    } else {
      appId = process.env.HUBOT_BITRISE_ANDROID_APP_ID;
    }

    var jsonString = JSON.stringify(params);

    var options = {
      host: 'www.bitrise.io',
      port: 443,
      path: '/app/' + appId + '/build/start.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': jsonString.length
      }
    };

    var req = https.request(options, success);
    req.on('error', failure);
    req.write(jsonString);
    req.end();
  };

  robot.respond(/.*(DISTRIBUTION INFO).*/i, function(res) {
    robot.logger.info(res.message.text);
    var message = res.message.text;
    var input = {}, matches;

    try {
      input = validate(message);
    } catch (e) {
      robot.logger.info('Invalidation Error - ' + e.message);
      return replyFormatError(res, e.message);
    }

    request(
      'android',
      createDistributeInfo('android', input),
      function(res) {
        robot.logger.info('Post a reply message.');
        res.on('data', function(body) {
          robot.logger.info('Body:' + body);
        });
      },
      function(e) {
        robot.logger.error('Error:' + e.message);
      }
    );

    request(
      'ios',
      createDistributeInfo('ios', input),
      function(res) {
        robot.logger.info('Post a reply message.');
        res.on('data', function(body) {
          robot.logger.info('Body:' + body);
        });
      },
      function(e) {
        robot.logger.error('Error:' + e.message);
      }
    );

    var replyMessage = '';
    replyMessage += 'ﾏｯﾃﾛﾔ';
    replyMessage += '┏┫￣皿￣┣┛';
    res.reply(replyMessage);
    robot.logger.info('Post a reply message.');
  });
};
