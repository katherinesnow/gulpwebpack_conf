import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import Gallery from 'components/Gallery/Gallery';
import Util from 'extend/util';
import RouteDetailHeader from 'components/RouteDetail/RouteDetailHeader';

import 'scss/base.scss';
import 'scss/JoinGroup/index.scss';

import {Router, Route, Link} from 'react-router';

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

class EventLearning extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {
		let tipE = ReactDOM.findDOMNode(this.refs.tip);
		if(tipE.style.display == "none") {
			tipE.style.display = "inline";
		}else {
			tipE.style.display ="none";
		}
		e.stopPropagation();
		e.preventDefault();
	}

	render() {
		return (
			<div className="test">
				<button onClick={this.handleClick}>显示/隐藏</button><span ref="tip">点击测试显示</span>
			</div>
		);
	}
}

ReactDOM.render(<EventLearning />,document.getElementById('event'));

class Avatar extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
            <div>
                 <ProfilePic username={this.props.username} ></ProfilePic>
                 <ProfileLink username={this.props.username} ></ProfileLink>
            </div>
		);
	}
}

class ProfilePic extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
             <img src={'http://pic.qiantucdn.com/' + this.props.username + '/13/72/07/55Z58PICKka_1024.jpg'} />
		);
	}
}

class ProfileLink extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
            <a href={'http://pic.qiantucdn.com/' + this.props.username +'/13/72/07/55Z58PICKka_1024.jpg'} >
                {this.props.username}
            </a>
        );
	}
}

ReactDOM.render(<Avatar username="58pic" />,document.getElementById('props'));

/*
let GetPropTypes = React.createClass({
    propTypes:{
    	// 可以声明 prop 为指定的 JS 基本类型。默认
        // 情况下，这些 prop 都是可传可不传的。
    	optionalArray:React.PropTypes.array,
    	optionalBool: React.PropTypes.bool,
    	optionalFunc: React.PropTypes.func,
    	optionalNumber:React.PropTypes.number,
    	optionalObject:React.PropTypes.object,
    	optionalString:React.PropTypes.string,
    	optionalNode:React.PropTypes.node,

    	//React元素
    	optionalElement:React.PropTypes.element,

    	// 用enum 来限制prop只接受指定的值
    	optionalEnum: React.PropTypes.oneof(['News','Photos']),

    	// 指定的多个对象类型中的一个
    	optionalUnion:React.PropTypes.oneOfType([
           React.PropTypes.string,
           React.PropTypes.number
    	]),

    	// 指定类型组成的数组
    	optionalArrayOf:React.PropTypes.arrayOf(React.PropTypes.number),

    	// 指定类型组成的数组
    	optionalArrayOf:React.PropTypes.objectOf(React.PropTypes.number),
    }
});*/

class GetInputChangeValue extends Component {
	constructor(props) {
		super(props);
		this.state = {
			inputValue:''
		};
	}

	/**
	 * [GetOnlyInt 只允许输入整数值]
	 * @param {[type]} value [description]
	 */
    GetOnlyInt(value) {
        console.log("只能输入整数值");
    }

	handelChange(e) {
        this.setState({
        	inputValue:e.target.value.substr(0,140)
        });
	}

	render() {
		//React 将用户输入的值更新到 <input> 组件的 value 属性。这样实现响应或者验证用户输入的界面就很容易了
		let value = this.state.inputValue;
		return (
            <input type="text" value={value} onChange={this.handelChange.bind(this)}/>
		);
	}
}

import { is } from 'immutable';
class Person  extends Component {
  /**
   * [componentWillReceiveProps 
   * 在组件接受到新的Props的时候调用,在初始化渲染的时候，该方法不会调用
   * 用此函数可以作为react在prop传入之后，render()渲染之前更新state的机会
   * 老的props可以通过this.props获取到.在该函数中调用this.setState() 将不会引起第二次渲染.
   * componentWillReceiveProps
   * ]
   * @param  {[type]} newProps [description]
   * @return {[type]}          [description]
   */
  componentWillReceiveProps(newProps){
    console.log(`我新的props的name是${newProps.name}，age是${newProps.age}。我以前的props的name是${this.props.name}，age是${this.props.age}是我要re-render了`);
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return !(this.props === nextProps || is(this.props, nextProps)) ||
         !(this.state === nextState || is(this.state, nextState));
  }

  render() {
    const {name,age} = this.props;

      return (
        <div>
          <span>姓名:</span>
          <span>{name}</span>
          <span> age:</span>
          <span>{age}</span>
        </div>
      )
  }
}
import pureRender from "pure-render-decorator";


class GetInputReRender extends Component {
    constructor(props){
        super(props)
        this.state={
          name:"",
          age :"",
          persons:[]
        }
    }

    render() {
        const {name,age,persons} = this.state;
        return (
          <div>
            <div><span>姓名:</span><input value={name} name="name" onChange={this._handleChange.bind(this)}></input></div>
            <div><span>年龄:</span><input value={age} name="age" onChange={this._handleChange.bind(this)}></input></div>
            <input type="button" onClick={this._handleClick.bind(this)} value="确认"></input>
            {persons.map((person,index)=>(
              <Person key={index} name={person.name} age={person.age}></Person>
            ))}
          </div>
        )
    }

    _handleChange(event){
        this.setState({[event.target.name]:event.target.value})
    }

    _handleClick(){
        const {name,age} = this.state
        this.setState({
          name:"",
          age :"",
          persons:this.state.persons.concat([{name:name,age:age}])
        })
    
    }
}

ReactDOM.render(<GetInputReRender />,document.getElementById('fatherchild'));


class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
                <h1>APP</h1>
                <ul>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/inbox">Inbox</Link></li>
                </ul>
                {this.props.children}
            </div>
		);
	}
}

class About extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <h3>About</h3>
	}
}

class Inbox extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
                <h2>Inbox</h2>
               
            </div>
		);
	}
}

ReactDOM.render(
    <Router>
        <Route path="/" component={App}>
            <Route path="about" component={About}></Route>
            <Route path="inbox" component={Inbox}></Route>
        </Route>
    </Router>
,document.getElementById('router'));
