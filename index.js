import { h, render, Component } from 'preact';

/** @jsx h */

const lua = `
print "starting up..."

t = 0
x = 0

Element:setAttribute("position", "0 0 -10")

children = Element:childNodes()

colors = { '#f0a', '#0af', '#0fa' }

function tick (delta)
  t = t + (delta / 1000)

  -- Cycle at 0.25hz
  i = t * 3.14 * 0.25

  for index, node in ipairs(children) do 
    i = i + 0.4
    x = math.sin(i) * 4
    y = math.cos(i * 3 / 2) * 2 + 2
    z = math.cos(i / 5) * 0.5

    node:setAttribute("position", string.format("%.2f %.2f %.2f", x, y, z))
    node:setAttribute("color", colors[index])
  end

end

-- tick()`;

class Clock extends Component {
  constructor () {
    super();

    // set initial time:
    this.state = {
      content: lua
    };
  }

  onClick () {
    // console.log(this.state.content);
    client.websocket.send(this.state.content);
  }

  render (props, state) {
    let time = new Date(state.time).toLocaleTimeString();
    return (
      <div>
        <textarea
          value={this.state.content}
          onChange={(e) => { this.setState({content: e.target.value}) }}>
        </textarea>

        <p>
          <button onClick={this.onClick.bind(this)}>Save</button>
        </p>
      </div>
    );
  }
}

// render an instance of Clock into <body>:

class Client {
  constructor () {
    this.domElement = document.querySelector('canvas');
    this.worldElement = document.querySelector('#world');

    this.overlayElement = document.createElement('div');
    document.body.appendChild(this.overlayElement);
    this.overlayElement.className = 'sidebar';

    render(<Clock />, this.overlayElement);

    this.websocket = new WebSocket('ws://localhost:8080/lucy');
    this.websocket.onmessage = this.onMessage.bind(this);
  }

  onMessage (event) {
    // console.log(event.data);
    this.worldElement.innerHTML = event.data;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.client = new Client();
});
