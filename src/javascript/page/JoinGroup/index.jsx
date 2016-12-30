import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import Gallery from 'components/Gallery/Gallery';
import Util from 'extend/util';
import RouteDetailHeader from 'components/RouteDetail/RouteDetailHeader';

import 'scss/base.scss';
import 'scss/JoinGroup/index.scss';

class IndexComponent extends Component {
	constructor(props){
		super(props);
		this.state= {
			routeDeatil:{
				imageList :[
					'../../../statics/images/RouteDetail/places/banner/banner1@3x.jpg',
			        '../../../statics/images/RouteDetail/places/banner/banner2@3x.jpg',
			        '../../../statics/images/RouteDetail/places/banner/banner3@3x.jpg',
			        '../../../statics/images/RouteDetail/places/banner/banner4@3x.jpg',
			        '../../../statics/images/RouteDetail/places/banner/banner5@3x.jpg',
			        '../../../statics/images/RouteDetail/places/banner/banner6@3x.jpg'
				]
			}
		};
	}

	render() {
		return (
			<div>
				<div>
					<div>Learning Test</div>
					{/*Header imglist*/}
					<RouteDetailHeader imageList ={this.state.routeDeatil.imageList}></RouteDetailHeader>
				</div>
			</div>
		);
	}
}

function doRender(){
	ReactDOM.render(<IndexComponent />,document.getElementById('app'));
}

setTimeout(doRender,16);

class Learning extends Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}

	render() {
		let content = "<strong>content</strong>";
		let style = {
			"color":"white",
			"display":"block"
		};
		return (
            <div>
                 <button color="blue">
                     <b style={style}>sdfsdfsdfsd</b>
                 </button>
                 
            </div>
		);
	}
}

//ReactDOM.render(<Learning />,document.getElementById('custom'));


class TodoItems extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let listdata = this.props.listdata;

		let listItems = listdata.map( (item) => {
			return <li key={item.key}>{item.text}</li>
		});

		return (
			<ul>
				{listItems}
			</ul>
		);
	}
}
class TodoList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items: []
		};
	}

	addItem(e) {
		let itemArray = this.state.items;
		itemArray.push({
			text: this.refs.inputElement.value,
			key:Date.now(),
		});

		this.setState({
			items:itemArray
		});
		
		//后台数据接口，处理数据
		this.refs.inputElement.value = "";

		e.preventDefault();
		console.log(this.state.items);
	}

	render() {
		return (
			<div className="todoListMain">
				<div className="header">
	                <form action="" onSubmit={this.addItem.bind(this)} >
	 					<input type="text" ref="inputElement" placeholder="enter task"/>
	 					<button type="submit">add</button>
	                </form>
				</div>
				<div className="list">
					<TodoItems listdata = {this.state.items} />
				</div>
			</div>
		);
		
	}
}



ReactDOM.render(<TodoList />,document.getElementById('list'));
