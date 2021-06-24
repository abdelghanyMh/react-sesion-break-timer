import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import './App.sass';

var timeoutID;

class Timer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      timerLabel: "Session",// indicate if a Session Or Break has begun!
      BreakLength: 5,
      sesstionLength: 25,
      remainingTime: 1500000 //25 min = 1500000 Milliseconds

    }
  }

  handelPause = () => {
    clearInterval(timeoutID)
  }

  /**
   * When a countdown reaches zero (NOTE: timer MUST reach 00:00),
   ***a sound indicating that time is up should play.
   *@param {string} status indicate if the audio shauld start playing or stop
   * beep must stop playing  when the element with the id of reset is clicked. (audioBeep("stop"))
   * */
  audioBeep = (status) => {
    let audio = document.getElementById("beep")
    if (status == "start") {
      audio.play()
      audio.loop = true
    } else {
      audio.pause()
    }


  }

  /**
   *When I click the element with the id of break-decrement,
   ****the value within id="break-length" decrements by a value of 1,
   ****and I can see the updated value.
   *When I click the element with the id of break-increment,
   ****the value within id="break-length" increments by a value of 1,
   ****and I can see the updated value.
   **@param {object} e  used to access to the id of  the node on which current-event listener was attached.
   **/
  handleBreakLength = (e) => {
    this.handelPause() // in case the count down is on and we adjust the BreakLength
    let { BreakLength, _ } = this.state

    if (e.currentTarget.id == "break-decrement" && BreakLength > 0) {
      BreakLength--
    }
    else if (e.currentTarget.id == "break-increment") {
      BreakLength++
    }
    this.setState({
      BreakLength: BreakLength
    })
  }

  /**
   *When I click the element with the id of session-decrement,
   ****the value within id="session-length" decrements by a value of 1,
   ****and I can see the updated value.
   *When I click the element with the id of session-increment,
   ****the value within id="session-length" increments by a value of 1,
   ****and I can see the updated value.
  **@param {object} e  used to access to the id of  the node on which current-event listener was attached.
 **/
  handleSesstionLength = (e) => {
    this.handelPause()// in case the count down is on and we adjust the SesstionLength
    let { sesstionLength, remainingTime, _ } = this.state

    if (e.currentTarget.id == "session-decrement" && sesstionLength > 0) {
      sesstionLength--
    }
    else if (e.currentTarget.id == "session-increment") {
      sesstionLength++
    }
    remainingTime = sesstionLength * 60000 // Minutes to Milliseconds

    this.setState({
      sesstionLength: sesstionLength,
      remainingTime: remainingTime
    })
  }

  handelTimer = () => {
    let { remainingTime, _ } = this.state
    // Set the date we're counting down to
    remainingTime = Date.now() + remainingTime//in ms
    remainingTime = new Date(remainingTime)
    let countDownDate = remainingTime.getTime()
    // Update the count down every 1 second


    timeoutID = setInterval(() => {
      // Get today's date and time
      let now = new Date().getTime()

      // Find the distance between now and the count down date
      let distance = new Date(countDownDate - now)

      // Time calculations for  hours, minutes and seconds
      let hours = distance.getHours()
      let minutes = distance.getMinutes()
      let seconds = distance.getSeconds()
      let newremaining = (hours * 3600 * 1000 + minutes * 60000 + seconds * 1000)
      let newremainingtime = new Date(hours * 3600 * 1000 + minutes * 60000 + seconds * 1000)

      // console.log("distance" + distance + "--" + hours + ":" + minutes + ":" + seconds + "---" + (minutes * 60000 + seconds * 1000) + "----" + newremainingtime.getMinutes() + ":" + newremainingtime.getSeconds())
      this.setState({
        remainingTime: newremaining

      })
      if (minutes == 0 && seconds <= 3)
        this.audioBeep("start")
      // If the count down is over, trigger break timer
      if (seconds == 0) {
        this.audioBeep("stop")
        this.handleBreak()
      }

    }, 1000)

  }

  handleBreak = () => {
    this.handelPause()
    let { BreakLength, _ } = this.state
    let remainingTime = Date.now() + (BreakLength * 60000)
    remainingTime = new Date(remainingTime)
    let countDownDate = remainingTime.getTime()
    // console.log("breakkkkkkkkkkkkkkkkkkkkkkkkkkkkk" + remainingTime.getHours() + ":" + remainingTime.getMinutes() + ":" + remainingTime.getSeconds());
    timeoutID = setInterval(() => {

      // Get today's date and time
      let now = new Date().getTime()

      // Find the distance between now and the count down date
      let distance = new Date(countDownDate - now)

      // Time calculations for  hours, minutes and seconds
      let hours = distance.getHours()
      let minutes = distance.getMinutes()
      let seconds = distance.getSeconds()
      let newremaining = (hours * 3600 * 1000 + minutes * 60000 + seconds * 1000)

      //  Happy Debugging!
      // let newremainingtime = new Date(hours * 3600 * 1000 + minutes * 60000 + seconds * 1000)
      // console.log(hours + ":" + minutes + ":" + seconds + "---" + (minutes * 60000 + seconds * 1000) + "----" + newremainingtime.getMinutes() + ":" + newremainingtime.getSeconds())
      this.setState({
        timerLabel: "Take Break!",
        remainingTime: newremaining


      })
      if (minutes == 0 && seconds <= 3)
        this.audioBeep("start")

      // If the count down is over, rest the timer to intail state 25:00
      if (seconds == 0) {

        this.audioBeep("stop")
        this.handelPause()
        let { sesstionLength, _ } = this.state
        console.log("before"+sesstionLength);
        let newSession = sesstionLength * 60000
        this.setState({
          timerLabel: "Session",
          sesstionLength: sesstionLength,
          remainingTime: newSession
        })
        console.log("after"+sesstionLength);

      }
    }, 1000)


  }

  /**
   * When I click the element with the id of reset, any running timer should be stopped,
   * the value within id="break-length" should return to 5,
   * the value within id="session-length" should return to 25,
   * the element with id="time-left" should reset to its default state.
   */
  handelReset = () => {
    clearInterval(timeoutID)

    this.setState({
      timerLabel: "Session",
      BreakLength: 5,
      sesstionLength: 25,
      remainingTime: 1500000
    })
  }

  /**converts the remainingTime format ( ss(seconds) to mm:ss (minutes:seconds))*/
  timeFormat = (time) => {
    /**
     *The padStart() method pads the current string with another string (multiple times, if needed)
     * until the resulting string reaches the given length.
     * "1:0".padStart(2, '0')=>"01:00"
   */
    let minutes = new Date(time).getMinutes().toString().padStart(2, '0')
    let seconds = new Date(time).getSeconds().toString().padStart(2, '0')
    return minutes + ":" + seconds
  }

  render() {
    return (
      <div id="app">
        <div className="timer-wrapper">
          <div id="timer-label">{this.state.timerLabel}</div>
          <div id="time-left">{this.timeFormat(this.state.remainingTime)}</div>
        </div>
        <Controls
          reset={this.handelReset}
          start={this.handelTimer}
          stop={this.handelPause}
        />
        <Options
          changeBreakLength={this.handleBreakLength}
          changeSesstionLength={this.handleSesstionLength}
          currentBreakLength={this.state.BreakLength}
          currentSesstionLength={this.state.sesstionLength}
        />
        <audio
          id="beep"
          preload="auto"

          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
      </div>
    );
  }
}

class Controls extends React.Component {
  render() {
    return (
      <div id="controls">
        <button onClick={this.props.start}>Start</button>
        <button onClick={this.props.stop}>Stop</button>
        <button onClick={this.props.reset}>Reset</button>
      </div >

    );
  }
}

class Options extends React.Component {
  render() {
    return (
      <div id="options">
        <div className="length-control">
          <div id="break-label">Break Length</div>
          <button
            className="btn-level"
            id="break-decrement"
            onClick={this.props.changeBreakLength}
            value="-"
          >
            <span className="material-icons">&#xe316;</span>

          </button>
          <div className="btn-level" id="break-length">
            {this.props.currentBreakLength}
          </div>
          <button
            className="btn-level"
            id="break-increment"
            onClick={this.props.changeBreakLength}
            value="+"
          >
            <span className="material-icons">&#xe313;</span>
          </button>
        </div>

        <div className="length-control">
          <div id="session-label">Session Length</div>
          <button
            className="btn-level"
            id="session-decrement"
            onClick={this.props.changeSesstionLength}
            value="-"
          >
            <span className="material-icons">&#xe316;</span>
          </button>
          <div className="btn-level" id="session-length">
            {this.props.currentSesstionLength}
          </div>
          <button
            className="btn-level"
            id="session-increment"
            onClick={this.props.changeSesstionLength}
            value="+"
          >
            <span className="material-icons">&#xe313;</span>

          </button>
        </div>
      </div>

    );
  }

}

ReactDOM.render(
  <React.StrictMode>
    <Timer />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
