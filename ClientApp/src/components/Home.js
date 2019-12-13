import React, { Component } from 'react';
import './css/Home.scss';

// Control with the arrow keys
// *NOTE*: in Codepen you must click on the preview port to
// for the window to register key presses
// Known bug: You can potentially turn the snake around too fast
//            causing a collusion / reset

const start = {
    active: false,
    score: '0,0',
    high_score: 180,
    ball: [100, 100],
    speedBall: 50,  //ms
    directionBall: 125,   //Grad Winkel
};

export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = start;
    }

    static displayName = Home.name;

    startStop = manual => {
        let active = this.state.active;
        //console.log(localStorage.getItem('high_score'));
        if (manual) {
            this.setState({ active: !active });
        }
        // This is reading the previous state, before manual switched it
        if (!active) {
            this.interval = setInterval(() => this.updateBall(), this.state.speedBall);
        } else {
            clearInterval(this.interval);
            let high_score = this.state.high_score;
            if (this.state.score > high_score) {
                high_score = this.state.score;
            }
            localStorage.setItem("high_score", high_score);
            this.setState({
                active: false,
                score: '0,0',
                high_score: 235,
                ball: [100, 100],
                speedBall: 50,
                directionBall: 125
            });
        }
    };

    updateBall() {
        var direction = this.state.directionBall;
        var currentBall = this.state.ball;
        var currentSpeed = (1000 - this.state.speedBall) / 800; //Spielfeld ist 393 Pixel breit

        //neues X,Y berechnen
        var newBall = [];
        var currentBallX = currentBall[0];
        if (direction == 0) currentBallX = Math.round(currentBallX - currentSpeed);
        if (direction == 45) currentBallX = Math.round(currentBallX - currentSpeed);
        if (direction == 125) currentBallX = Math.round(currentBallX + currentSpeed);
        if (direction == 180) currentBallX = Math.round(currentBallX + currentSpeed);
        if (direction == 215) currentBallX = Math.round(currentBallX + currentSpeed);
        if (direction == 305) currentBallX = Math.round(currentBallX - currentSpeed);

        var currentBallY = currentBall[1];
        if (direction == 45) currentBallY = Math.round(currentBallY - currentSpeed);
        if (direction == 90) currentBallY = Math.round(currentBallY - currentSpeed);
        if (direction == 125) currentBallY = Math.round(currentBallY - currentSpeed);
        if (direction == 215) currentBallY = Math.round(currentBallY + currentSpeed);
        if (direction == 270) currentBallY = Math.round(currentBallY + currentSpeed);
        if (direction == 305) currentBallY = Math.round(currentBallY + currentSpeed);



        //Kollision -> Richtungsänderung
        if (currentBallX < 2 && direction == 0) direction = 180;
        if (currentBallX < 2 && direction == 45) direction = 125;
        if (currentBallX < 2 && direction == 305) direction = 215;
        if (currentBallX > 393 && direction == 125) direction = 45;
        if (currentBallX > 393 && direction == 180) direction = 0;
        if (currentBallX > 393 && direction == 215) direction = 305;

        if (currentBallY < 31 && direction == 45) direction = 305;
        if (currentBallY < 31 && direction == 90) direction = 270;
        if (currentBallY < 31 && direction == 125) direction = 215;
        if (currentBallY > 322 && direction == 215) direction = 125;
        if (currentBallY > 322 && direction == 270) direction = 90;
        if (currentBallY > 322 && direction == 305) direction = 45;

        var newBall = [currentBallX, currentBallY];

        if (this.state.active) {
            this.setState({ ball: newBall });
        }

        this.setState({ directionBall: direction});
        this.setState({ high_score: direction });
    }

    handleMouse = event => {
        var posX = event.clientX;
        var posY = event.clientY;
        this.setState({ score: posX + ',' + posY });

    }

    handleKeys = event => {
        let active = this.state.active;
        //  console.log(event.keyCode);
        if (event.keyCode === 13) {
            this.startStop(true);
        }
        if (event.keyCode === 65) { //links Taste 'a'
            this.setState({ directionBall: 0 });
            this.setState({ high_score: 0});
            this.swapClass();
        }
        if (event.keyCode === 68) { //rechts Taste 'd'
            this.setState({ directionBall: 180 });
            this.setState({ high_score: 180 });
            this.swapClass();
        }
        if (event.keyCode === 87) { //up Taste 'w'
            this.setState({ directionBall: 90 });
            this.setState({ high_score: 90 });
            this.swapClass();
        }
        if (event.keyCode === 83) { //down Taste 's'
            this.setState({ directionBall: 270 });
            this.setState({ high_score: 270 });
            this.swapClass();
        }
        if (event.keyCode === 81) { //links oben Taste 'q'
            this.setState({ directionBall: 45 });
            this.setState({ high_score: 45 });
            this.swapClass();
        }
        if (event.keyCode === 69) { //rechts oben Taste 'e'
            this.setState({ directionBall: 125 });
            this.setState({ high_score: 125 });
            this.swapClass();
        }
        if (event.keyCode === 89) { //links unten Taste 'y'
            this.setState({ directionBall: 305 });
            this.setState({ high_score: 305 });
            this.swapClass();
        }
        if (event.keyCode === 88) { //rechts unten Taste 'x'
            this.setState({ directionBall: 215 });
            this.setState({ high_score: 215 });
            this.swapClass();
        }
    };

    speedUp = () => {
        let speedBall = this.state.speedBall;
        if (speedBall > 50) {
            speedBall = speedBall - 2;
        }
        clearInterval(this.interval);
        this.interval = setInterval(() => this.updateBall(), speedBall);
        this.setState({ speedBall: speedBall });
    };

    // #root takes on the class of the direction, good for styling opportunities?
    swapClass = () => {
        var root = document.getElementById("root");
        root.className = "";
        root.className = this.state.directionBall;
    };

    componentDidMount() {
        this.swapClass();
        document.addEventListener("keydown", this.handleKeys, false);
        document.addEventListener("mousemove", this.handleMouse, false);

        this.startStop(true);
    }

    componentDidUpdate(prevProps, prevState) {
        // When the state changes, check if we've reached a % 5 milestone
        // Run speedUp once, but not again until next time (state updates each time snake moves)
        let score = this.state.score;
        if (score % 3 == 0 && score > 0 && score != prevState.score) {
            this.speedUp();
        }

        document.addEventListener("keydown", this.handleKeys, false);
        document.addEventListener("mousemove", this.handleMouse, false);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        var ball = this.state.ball;
        return (
            <React.Fragment>
                <Menu active={this.state.active} />
                <Score score={this.state.score} high_score={this.state.high_score} />

                <Ball transition={this.state.speedBall}
                    direction={this.state.directionBall}
                    top={ball[1]}
                    left={ball[0]} />

            </React.Fragment>
        );
    }
}

class Score extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="score">
                <span>
                    Maus x,y: <strong>{this.props.score}</strong>
                </span>
                <span>
                    direction: <strong>{this.props.high_score}</strong>
                </span>
            </div>
        );
    }
}

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // message: 'Press <span>Enter</span> to start'
        };
    }

    render() {
        var menu_list = this.props.active ? "menu hidden" : "menu";
        return (
            <div className={menu_list}>
                Press <span>enter</span> to start<br />
                <span>w a s d</span> keys to control
      </div>
        );
    }
}

class Ball extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div
                style={{ top: this.props.top + "px", left: this.props.left + "px" }}
                className="ball"
            />
        );
    }
}
