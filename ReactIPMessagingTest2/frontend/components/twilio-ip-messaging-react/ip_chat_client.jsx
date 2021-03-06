import React from 'react';
import ReactDOM from 'react-dom';
import IPChatChannelManager from './ip_chat_channel_manager';

require('./ip_messaging_stylesheet.css');

function refreshToken(accessManager, url, device) {
  $.ajax({
    method: "GET",
    url,
    data: {device: device},
    success: (data) => {
      accessManager.updateToken(data.token);
    }
  });
}

//Expected props are tokenUrl and device to refresh token.
class IPChatClient extends React.Component {
  constructor(props) {
    super(props);
    if (!props.tokenUrl) {
      throw "No url given to retrieve token. Chat client will not be able to initialize.";
    }
    this.token = props.token;
    this.tokenUrl = props.tokenUrl;
    this.device = props.device || "browser"; // default to "browser"

    this.state = {};
  }

  componentWillMount() {
    let chatClient = this;
    $.ajax({
      method: "GET",
      url: chatClient.tokenUrl,
      data: {device: chatClient.device},
      success: (data) => {
        let accessManager = new Twilio.AccessManager(data.token);
        let messagingClient = new Twilio.IPMessaging.Client(accessManager);
        messagingClient.on('tokenExpired',
          () => refreshToken(accessManager,
            chatClient.tokenUrl,
            chatClient.device));
        chatClient.setState({
          accessManager,
          messagingClient
        });
      }
    });
  }

  render() {
    if (this.state.messagingClient) {
      return (
        <div>
          <IPChatChannelManager
            messagingClient={this.state.messagingClient}
          />
        </div>
      );
    } else {
      return (
        <div className="client-loading">Starting chat...</div>
      );
    }
  }
}

export default IPChatClient;
