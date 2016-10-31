import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import 'scss/base.scss';
import 'scss/Entry/index.scss';

class TodoList extends Component{
	constructor(props){
		super(props);
		//初始化数据，TodoList的数据由state来控制
		this.state={
			todolist:[]
		};
	}
	
	/**
	 * [handleChange 接收一个传入的数据，并将它实时更新到组件的 state 中，以便组件根据数据重新render]
	 * @param  {[type]} rows [description]
	 * @return {[type]}      [description]
	 */
	handleChange(rows) {
		this.setState({
			todolist:rows
		});
	}

	

	render() {
		let that =this;
		let handleChange =function(rows){
			that.handleChange(rows);
		}
		return (
			<div className="dolist">
				<TypeNew handleChange={handleChange}  todo={this.state.todolist}/>
				<ListTodo todo={this.state.todolist} handleDel={handleChange}/>
			</div>
		);
	}
}

/**
 * 用于新增数据
 */
class TypeNew extends Component{
	constructor(props){
		super(props);
		this.state={};
	}

	handleAdd(e) {
		e.preventDefault();
		//var inputobj =this.refs.inputadd.getDOMNode();//获取DOM节点
		var value = this.refs.inputadd.value.trim();

		//更新数据，并使用handleChange更新到TodoList组件的state中
		var rows = this.props.todo;
		if(value != ''){
			rows.push(value);//最新的父组件的state数据，更新父组件的state数据，从而更新列表UI
			console.log(rows);
			this.props.handleChange(rows);
		}
	}

	render() {
		let that =this;
		let handleAdd =function(e){
			that.handleAdd(e);
		}
		return (
			<form onSubmit={handleAdd}>
				<input type="text" ref="inputadd" placeholder="Add a new todo" autoComplete="off" className="add_input"/>
			</form>
		);
		
	}
}

/**
 * ListTodo 组件用于展示列表，并可以删除某一项内容
 */
class ListTodo extends Component{
	constructor(props){
		super(props);
		this.state={};
	}
	
	/**
	 * [HandleDel 对某一项执行删除时，想将todo中的数据删除，通过del事件调用父组件的handleChange来更新state,然后react自动render]
	 * @param {[type]} e [description]
	 */
	HandleDel(e){
		var index = e.target.getAttribute("data-key");
		this.props.todo.splice(index,1);
		this.props.handleDel(this.props.todo);
	}

	render() {
		console.log(this.props.todo);
		let that =this;
		let HandleDel = function(e){
			that.HandleDel(e);
		}
		return (
			<ul className="todo-list">
				{
					// this.props.todo 获取父组件传递过来的数据
	                 // {/* 遍历数据 */}
	                //if(this.props.todo.length >0) {
	                	this.props.todo.map(function (item, i) {
		                     return (
		                         <li>
		                             <label className="title">{item}</label>
		                             <button className="del" onClick={HandleDel} data-key={i}>delete</button>
		                         </li>
		                     );
		                })
	                //};
	                
				}
			</ul>
		);
	}
}

function doRender() {
	ReactDOM.render(<TodoList />,document.getElementById("app"));
}

setTimeout(doRender(),16);
