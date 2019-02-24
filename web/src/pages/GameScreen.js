import React, {Component} from 'react';
import {Checkers} from '../components/Checkers'
import Lobby from '../pages/Lobby'


class GameScreen extends Component {	
	
	state = { chosenRoom : null}
	
	constructor(props){
		super(props);
		this.getData = this.getData.bind(this);
	}

	
	getData(val){
		this.setState({'chosenRoom':val})
	}

	
    render(){	
	let component;
	
		if (this.state.chosenRoom == null) {
			component = <Lobby sendData={this.getData}/>
		} else{
		component = <Checkers sendData={this.getData}/>
		}
		return(
			<div>
			{component}
			</div>
		);
	
	}
};

export default GameScreen
