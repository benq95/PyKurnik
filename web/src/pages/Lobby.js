import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';


class Lobby extends Component {
	state = {
		rooms: ['userName','otherUser','anotherUser','yetAnotherUser']
	}
	
	handleExistingRoomClick(e){
		const { rooms } = this.state;
		this.setState({
			rooms: rooms.filter((rooms) => { 
				return rooms !== e;
			})
		});
		this.props.sendData(e);
	}
	
	handleNewRoomClick(){
		var newArray = this.state.rooms.slice(); 
		newArray.push('new value');   
		this.setState({rooms:newArray})
	}
	
    render(){	
		
		return (
			<div>
				<h1>Active rooms</h1>
				<ButtonGroup vertical>
				<ButtonGroup vertical>
					{this.state.rooms.map((e) => (
						<Button variant="secondary" onClick={() => this.handleExistingRoomClick(e)}>{e}</Button>
					))}
				</ButtonGroup>
				<ButtonGroup vertical>
					<Button variant="primary" onClick={() => this.handleNewRoomClick()}>New Room</Button>
				</ButtonGroup>
				</ButtonGroup>
			</div>
			);
	}
};

export default Lobby
