
class Client {
  constructor () {
    this.websocket = new WebSocket('ws://localhost:8000/lucy');
    this.onmessage = this.onMessage.bind(this);
  }

  onMessage (event) {
    console.log(event.data);
  }
}
