// Use strict mode
'use strict';

//Import Slack RTM client, memory module, RTM events, client events
const RtmClient = require('@slack/client').RtmClient;
const MemoryDataStore = require('@slack/client').MemoryDataStore;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
require('dotenv').config();

//Add here your Slack token for your bot or you can use an env file with
//your variables and call it here.
const token = process.env.token;

// The Slack constructor takes 2 arguments:
// token - String representation of the Slack token
// opts - Objects with options for our implementation
var slack = new RtmClient(token, {

// Sets the level of logging we require
    logLevel: 'error',

// Initialize a data store for our client, this will
// load additional helper functions for the storing
// and retrieval of data
    dataStore: new MemoryDataStore(),

// Boolean indicating whether Slack should automatically
// reconnect after an error response
    autoReconnect: true,

// Boolean indicating whether each message should be marked as
// read
// or not after it is processed
    autoMark: true
});

// Add an event listener for the RTM_CONNECTION_OPENED
// event, which is called when the bot connects to a channel. The Slack API can
// subscribe to events by using the 'on' method
slack.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function(){

    var user = slack.dataStore.getUserById(slack.activeUserId);
    var team = slack.dataStore.getTeamById(slack.activeTeamId);
    var canal = slack.dataStore.channels;
    var channels = getChannels(canal);
    var id;

    //console.log(slack);

    // Log the slack team name and the bot's name
    console.log('Connected to ' + team.name + ' as ' + user.name);

    var channelNames = channels.map(function(channel){
        return channel.name;
    }).join(', ');
    console.log('Registered on ' + channelNames);

    channels.forEach(function(channel){
        var members = channel.members.map(function(id){
            return slack.dataStore.getUserById(id);
        });

        var memberName = members.map(function(member){
            return member.name;
        }).join(', ');

        console.log('Members of ' + channel.name + ': ' + memberName);

        //Send a message
        slack.sendMessage('Hello ' + memberName, channel.id);
    });

});

// Start the login process
slack.start();

//Retrieve bot channels
function getChannels(allChannels){
    var channels = [];
    var channel;
    var id;
    for(id in allChannels){
        channel = allChannels[id];
        if(channel.is_member){
            channels.push(channel);
        }
    }

    return channels;
}

