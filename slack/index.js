#!/usr/bin/env node
/**
 * Created by uditverma on 01/08/17.
 */
const program = require('commander');
const chalk = require('chalk');
const config = require('./config');
const IncomingWebhook = require('@slack/client').IncomingWebhook;

program
    .command('sendplaintext <channel> <message> [external_link] [unfurl_external_link]')
    .description("Send message to a specific channel of user's team")
    .action(function (channel, message, external_link, unfurl_external_link) {
        message = message.trim();
        var unfurl = false;
        if (external_link) {
            message += '<' + external_link.trim() + '>';
        }
        if (unfurl_external_link) {
            unfurl = unfurl_external_link;
        }
        var msg = {
            channel: channel.trim(),
            text: message,
            unfurl_links: unfurl
        };
        if (config.webhooks.length == 0) {
            console.error(chalk.red('Error:'), chalk.cyan('Please add the incoming webhook url in config.js file for your team'));
            console.log("Refer to https://my.slack.com/services/new/incoming-webhook for creating a webhook url");
        } else {
            for (let i = 0; i < config.webhooks.length; i++) {
                if (config.webhooks[i].url.length != '' && typeof config.webhooks[i].url.length !== 'undefined') {
                    var webhook = new IncomingWebhook(config.webhooks[i].url);
                    webhook.send(msg, function (err, res) {
                        if (err) {
                            console.error(chalk.red('Error:'), chalk.cyan(err));
                        } else {
                            console.log(chalk.green('Message sent'));
                        }
                    });
                }
            }
        }
    });

program
    .command('sendrichtext <channel> <message_title> <message_value> [message_pretext] [external_link] [external_link_label] [color]')
    .description("Send rich text message to a specific channel of user's team")
    .action(function (channel, message_title, message_value, message_pretext, external_link, external_link_label, color) {
        message_title = message_title.trim();
        message_value = message_value.trim();
        var message_extension = '';
        var color_val = '#00ff00';
        var pretext = '';
        if (external_link) {
            if (external_link_label) {
                external_link = '<' + external_link.trim() + '|' + external_link_label.trim() + '>';
            } else {
                external_link = '<' + external_link.trim() + '>';
            }
            message_extension = " " + external_link;
        }
        if (color) {
            color_val = color;
        }
        if (message_pretext) {
            pretext = message_pretext;
        }
        var msg = {
            channel: channel.trim(),
            attachments: [
                {
                    'fallback': message_title + message_extension,
                    'pretext': pretext + message_extension,
                    'color': color_val,
                    'fields': [
                        {
                            'title': message_title,
                            'value': message_value,
                            'short': false
                        }
                    ]
                }
            ]
        };
        if (config.webhooks.length == 0) {
            console.error(chalk.red('Error:'), chalk.cyan('Please add the incoming webhook url in config.js file for your team'));
            console.log("Refer to https://my.slack.com/services/new/incoming-webhook for creating a webhook url");
        } else {
            for (let i = 0; i < config.webhooks.length; i++) {
                if (config.webhooks[i].url.length != '' && typeof config.webhooks[i].url.length !== 'undefined') {
                    var webhook = new IncomingWebhook(config.webhooks[i].url);
                    webhook.send(msg, function (err, res) {
                        if (err) {
                            console.error(chalk.red('Error:'), chalk.cyan(err));
                        } else {
                            console.log(chalk.green('Message sent'));
                        }
                    });
                }
            }
        }
    });

program.parse(process.argv);
