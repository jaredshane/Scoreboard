let PLAYERS = [
  {
    name: "Jared Fuller",
    score: 31,
    id: 1
  },
  {
    name: "Ben Conner",
    score: 33,
    id: 2
  },
  {
    name: "Billy Connolly",
    score: 40,
    id: 3
  }
];

let nextId = 4;

let Stopwatch = React.createClass({
  getInitialState: function () {
    return {
      running: false,
      elapsedTime: 0,
      previousTime: 0,
    }
  },

  componentDidMount: function () {
    this.interval = setInterval(this.onTick, 100);
  },

  componentWillUnmount: function () {
    clearInterval(this.interval);
  },

  onTick: function () {
    if (this.state.running) {
      var now = Date.now();
      this.setState({
        previousTime: now,
        elapsedTime: this.state.elapsedTime + (now - this.state.previousTime),
      })
    }
  },

  onStart: function () {
    this.setState({
      running: true,
      previousTime: Date.now(),
    })
  },

  onStop: function () {
    this.setState({running: false})
  },

  onReset: function() {
    this.setState({
      elapsedTime: 0,
      previousTime: Date.now(),
    })
  },

  render: function() {
    var seconds = Math.floor(this.state.elapsedTime / 1000);
    return (
      <div className="stopwatch">
        <h2>Stopwatch</h2>
        <div className="stopwatch-time">
          {seconds}
        </div>
        { this.state.running ?
          <button onClick={this.onStop}>Stop</button>
            :
          <button onClick={this.onStart}>Start</button>
        }
        <button onClick={this.onReset}>Reset</button>
      </div>
    )
  }
})

let AddPlayerForm  = React.createClass({
  propTypes: {
    onAdd: React.PropTypes.func.isRequired,
  },

  onNameChange: function(e) {
    console.log(e.target.value)
    this.setState({name: e.target.value});
  },

  getInitialState: function () {
    return {
      name: ""
    }
  },
  onSubmit: function (e) {
    e.preventDefault();
    this.props.onAdd(this.state.name);
    this.setState({name: ""})
  },

  render: function () {
    return(
      <div className="add-player-form">
        <form onSubmit={this.onSubmit}>
          <input type="text" value={this.state.name} onChange={this.onNameChange}/>
          <input type="submit" value="Add Player" />
        </form>
      </div>
    )
  }
});

let Stats = (props) => {
  let totalPlayers = props.players.length
  let totalPoints = props.players.reduce(function (total, player) {
    return total + player.score;
  }, 0)

  return (
    <table className="stats">
      <tbody>
        <tr>
          <td>Players:</td>
          <td>{totalPlayers}</td>
        </tr>
        <tr>
          <td>Total Points:</td>
          <td>{totalPoints}</td>
        </tr>
      </tbody>
    </table>
  )
}

Stats.propType = {
  players: React.PropTypes.array.isRequired,
};

let Header = (props) => {
  return (
    <div className="header">
      <Stats players={props.players}/>
      <h1>{props.title}</h1>
      <Stopwatch />
    </div>
  );
}

Header.propTypes = {
  title: React.PropTypes.string.isRequired,
  players: React.PropTypes.array.isRequired,
};

let Counter = (props) => {
  return (
    <div className="counter">
      <button className="counter-action decrement" onClick={function () {props.onChange(-1)}} > - </button>
      <div className="counter-score"> {props.score}</div>
      <button className="counter-action increment" onClick={function () {props.onChange(1)}}> + </button>
    </div>
  );
}

Counter.propTypes = {
  score: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired,
}

let Player = (props) => {
  return (
    <div className="player">
      <div className="player-name">
        <a className="remove-player" onClick={props.onRemove}>𝘅</a>
         {props.name}
      </div>
      <div className="player-score">
        <Counter score={props.score} onChange={props.onScoreChange}/>
      </div>
    </div>
  );
}

Player.propTypes = {
  name: React.PropTypes.string.isRequired,
  score: React.PropTypes.number.isRequired,
  onScoreChange: React.PropTypes.func.isRequired,
}

let Application = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    initialPlayers: React.PropTypes.arrayOf(React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      score: React.PropTypes.number.isRequired,
      id: React.PropTypes.number.isRequired,
    })).isRequired
  },

  getDefaultProps: function () {
    return {
      title: "Scoreboard",
    };
  },

  getInitialState: function () {
    return {
      players: this.props.initialPlayers,

    };
  },

  onScoreChange: function (index, delta) {
    console.log('on score change', index, delta)
    this.state.players[index].score += delta;
    this.setState(this.state)
  },

  render: function () {
    return (
      <div className="scoreboard">
        <Header title={this.props.title} players={this.state.players} />
        <div className="players">
          {this.state.players.map(function (player, index) {
            return (
              <Player
                onScoreChange={function(delta) {
                  this.onScoreChange(index, delta)
                }.bind(this)}
                name={player.name}
                score={player.score}
                key={player.id}
               />
            )
          }.bind(this))}
        </div>
      </div>
    );
  }
});




ReactDOM.render(<Application initialPlayers={PLAYERS} title="My Scoreboard"/>, document.getElementById('container'))
