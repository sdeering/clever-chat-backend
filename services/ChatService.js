var Q = require('q')
  , ChatService;

module.exports = function( sequelize, ORMCurrencyModel ) {
    ChatService = require( 'services' ).BaseService.extend({});

    if ( !ChatService.instance ) {
        ChatService.instance = new ChatService( sequelize );
        ChatService.Model = ORMChatModel;
    }
    
    return ChatService.instance;
};
