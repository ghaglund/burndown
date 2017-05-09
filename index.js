/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ______    ______    ______   __  __    __    ______
 /\  == \  /\  __ \  /\__  _\ /\ \/ /   /\ \  /\__  _\
 \ \  __<  \ \ \/\ \ \/_/\ \/ \ \  _"-. \ \ \ \/_/\ \/
 \ \_____\ \ \_____\   \ \_\  \ \_\ \_\ \ \_\   \ \_\
 \/_____/  \/_____/    \/_/   \/_/\/_/  \/_/    \/_/


 This is a sample Slack Button application that provides a custom
 Slash command.

 This bot demonstrates many of the core features of Botkit:

 *
 * Authenticate users with Slack using OAuth
 * Receive messages using the slash_command event
 * Reply to Slash command both publicly and privately

 # RUN THE BOT:

 Create a Slack app. Make sure to configure at least one Slash command!

 -> https://api.slack.com/applications/new

 Run your bot from the command line:

 clientId=<my client id> clientSecret=<my client secret> PORT=3000 node bot.js

 Note: you can test your oauth authentication locally, but to use Slash commands
 in Slack, the app must be hosted at a publicly reachable IP or host.


 # EXTEND THE BOT:

 Botkit is has many features for building cool and useful bots!

 Read all about it here:

 -> http://howdy.ai/botkit

 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/* Uses the slack button feature to offer a real time bot to multiple teams */
var Botkit = require('botkit');

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.PORT || !process.env.VERIFICATION_TOKEN) {
    console.log('Error: Specify CLIENT_ID, CLIENT_SECRET, VERIFICATION_TOKEN and PORT in environment');
    process.exit(1);
}

var config = {}
if (process.env.MONGOLAB_URI) {
    var BotkitStorage = require('botkit-storage-mongo');
    config = {
        storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
    };
} else {
    config = {
        json_file_store: './db_slackbutton_slash_command/',
    };
}

var controller = Botkit.slackbot(config).configureSlackApp(
    {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        scopes: ['commands'],
    }
);

controller.setupWebserver(process.env.PORT, function (err, webserver) {
    controller.createWebhookEndpoints(controller.webserver);

    controller.createOauthEndpoints(controller.webserver, function (err, req, res) {
        if (err) {
            res.status(500).send('ERROR: ' + err);
        } else {
            res.send('Success!');
        }
    });
});


//
// BEGIN EDITING HERE!
//

controller.on('slash_command', function (slashCommand, message) {

    switch (message.command) {
        case "/burndown": //handle the `/burndown` slash command. We might have others assigned to this app too!
            // The rules are simple: If there is no text following the command, treat it as though they had requested "help"
            // Otherwise just echo back to them what they sent us.

            // but first, let's make sure the token matches!
            if (message.token !== process.env.VERIFICATION_TOKEN) return; //just ignore it.

            // if no text was supplied, treat it as a help command
            if (message.text === "" || message.text === "help") {
                slashCommand.replyPrivate(message,
                    "You forgot to type which team's burndown to view. " +
                    "Try typing `/burndown Android` or `/burndown iOS` to see burndown chart.");
                return;
            } else if (message.text === "Android") {
                slashCommand.replyPrivate(message,
                    {
                        "attachments": [
                                            {
                                                "fallback": "Burndown for Android: This is how we're doing! @burndown-ops - https://docs.google.com/spreadsheets/d/1tHC8uRyAP7mYiK0M7GuhlWpIIuqoG-V73w6Wl3QpTH8/pubchart?oid=1187944909&format=image",
                                                "title": "Burndown for Android",
                                                "title_link": "https://docs.google.com/spreadsheets/d/1tHC8uRyAP7mYiK0M7GuhlWpIIuqoG-V73w6Wl3QpTH8/pubchart?oid=1187944909&format=image",
                                                "text": "This is how we're doing! @burndown-ops",
                                                "image_url": "https://docs.google.com/spreadsheets/d/1tHC8uRyAP7mYiK0M7GuhlWpIIuqoG-V73w6Wl3QpTH8/pubchart?oid=1187944909&format=image",
                                                "color": "#262226"
                                            }
                                        ]
                    });
                return;
            } else if (message.text === "iOS") {
                slashCommand.replyPrivate(message,
                    {
                        "attachments": [
                                            {
                                                "fallback": "Burndown for iOS: This is how we're doing! @burndown-ops - https://docs.google.com/spreadsheets/d/1tHC8uRyAP7mYiK0M7GuhlWpIIuqoG-V73w6Wl3QpTH8/pubchart?oid=1144902157&format=image",
                                                "title": "Burndown for iOS",
                                                "title_link": "https://docs.google.com/spreadsheets/d/1tHC8uRyAP7mYiK0M7GuhlWpIIuqoG-V73w6Wl3QpTH8/pubchart?oid=1144902157&format=image",
                                                "text": "This is how we're doing! @burndown-ops",
                                                "image_url": "https://docs.google.com/spreadsheets/d/1tHC8uRyAP7mYiK0M7GuhlWpIIuqoG-V73w6Wl3QpTH8/pubchart?oid=1144902157&format=image",
                                                "color": "#262226"
                                            }
                                        ]
                    });
                return;
            } else return;

            // If we made it here, just echo what the user typed back at them
            //TODO You do it!
            //slashCommand.replyPublic(message, "1");

            break;
        default:
            slashCommand.replyPublic(message, "I'm afraid I don't know how to do " + message.command + " yet.");

    }

})
;

