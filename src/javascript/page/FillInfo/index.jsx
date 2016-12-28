import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import Search from 'components/Search/Search';
import 'scss/base.scss';
import 'scss/FillInfo/index.scss';

class IndexComponent extends Component {
	constructor(props){
		super(props);
		//更新状态数据
		this.state ={

		}
	}
	render(){
		return (
			<div className="nav">
				<ul>
					<li><a href="" >首页</a></li>
					<li><a href="">最新文章</a></li>
					<li><Search cssClass="searchText"/></li>
				</ul>
			</div>
		);
	}
}
class ButtonComponent extends Component {
	constructor (props) {
		super(props);
		this.state={
			count:0
		};
	}
	sendSword () {
		var newCount = this.state.count+1;
		this.setState({count:newCount});
		//通过props调用父组件的方法
		this.props.getSwordCount(newCount);
	}
	render () {
		let that =this;
		let sendSword =function () {
			that.sendSword();
		};
		let buttonName = that.props.buttonName;
		return (
			<button onClick={sendSword}>{buttonName}</button>
		);
	}
}
/**
 * 子组件调用父组件的方法,儿子给老爸宝刀
 */
class ImDaddyComponent extends Component {
	constructor (props) {
		super(props);
		this.state ={
			sendCount:0
		};
	}
	getSwordCount (newCount) {
		this.setState({sendCount:newCount});
	}
	render () {
		let  that = this;
		let  getSwordCount =function (newCount) {
			that.getSwordCount(newCount);
		}
		return (
			<div>
				<ButtonComponent getSwordCount={getSwordCount}  buttonName="儿子送宝刀"></ButtonComponent>
				<p>父子俩共送{this.state.sendCount}把宝刀</p>
			</div>
		);
	}
}

/**
 * 父组件调用子组件的方法，对子组件数据修改, 老爸给儿子送宝刀
 */

class ImDaddy2Component extends Component {
	constructor (props) {
		super(props);
		this.state={
			sendCount:0
		};
		//this.sendSword = this.sendSword.bind(this);

	}
	//通过refs方式调用子组件的方法sendSword
	sendSword () {
		//console.log(this.refs);
		this.refs.getSwordButton.sendSword();
	}
	getSwordCount () {
        //通过refs方式调用子组件的属性count
        this.setState({sendCount:this.refs.getSwordButton.state.count + 1});
    }
	render () {
		let that =this;
		let sendSword =function () {
			that.sendSword();
		}
		let getSwordCount =function () {
			that.getSwordCount();
		}
		return (
			<div>
				
					<ButtonComponent ref="getSwordButton" getSwordCount={getSwordCount} buttonName="儿子送宝刀"></ButtonComponent>
					<button onClick={sendSword}>通过老爸送宝刀</button>
					<p>父子俩共送{this.state.sendCount}把宝刀</p>
			</div>
		);
	}
}

function doRender () {
	ReactDOM.render(<IndexComponent></IndexComponent>,document.getElementById("app"));
}


setTimeout(doRender,16);
ReactDOM.render(<ImDaddy2Component></ImDaddy2Component>,document.getElementById("Communication"));

class InputComp extends Component{
	constructor (props) {
		super(props);
		this.state={
			inputValue:""
		}
	}
	getValue () {
		let that =this;
		this.setState({
			inputValue:this.refs[this.props.inputRef].value
		},() =>{
			//更改值后回调的函数
			if(that.props.onChangeMethod){
				console.log(that.state.inputValue);

				that.props.onChangeMethod(that.state.inputValue,that.props.inputRef);
			}
		});
		
	}

	render () {
		let that = this; 
		return (
			<div className="input-item">
				<label>{this.props.labelName}</label>
				<input type={this.props.inputType} ref={this.props.inputRef} name={this.props.inputName} onChange={that.getValue.bind(that)} />
				<span>{that.state.inputValue}</span>
			</div>
		);
	}
}
class ButtonComp extends Component {
	constructor (props) {
		super(props);
	}
	GetSelf () {
		return (
			<div>button 组件内部可调用函数</div>
		);
		//console.log("button 组件内部可调用函数");
	}
	render () {
		let that =this;
		let GetSelf =function () {
			that.GetSelf();
		}

		return (
			<div className="do">
				<button onClick={this.props.buttonClickMethod}>{this.props.buttonName}</button>
				<a onClick ={this.props.aHrefClick}>{this.props.aName}</a>
			</div>
		);
	}
}

class LoginPage extends Component {
	constructor (props) {
		super(props);
		this.state={
			userName:"Catherine"
		}
	}
	/**
	 * [onChangeMethod 文本框点击事件]
	 * @return {[type]} [description]
	 */
	onChangeText () {
		console.log("文本信息发生变化");
	}
	onChangePwd () {
		console.log("密码发生改变");
	}
	aHrefClick () {
		console.log("忘记密码");
	}
	buttonClickMethod () {
		console.log("登录按钮被点击");
	}
	render () {
		let that =this;
		let onChangeText =function() {
			that.onChangeText();
		}
		let onChangePwd=function () {
			that.onChangePwd();
		}
		let aHrefClick =function () {
			that.aHrefClick();
		}
		let buttonClickMethod =function () {
			that.buttonClickMethod();
		}
		

		return (
			<div className="login">
				<InputComp labelName="用户名" inputType="text" inputRef="userName" inputName="userName" onChangeMethod={onChangeText}></InputComp>
				<InputComp labelName="密码" inputType="text" inputRef="userName" inputName="userPwd" onChangeMethod={onChangePwd}></InputComp>
				<ButtonComp buttonName="登录" buttonClickMethod={buttonClickMethod} aName="忘记密码？" aHrefClick={aHrefClick} />
				{this.state.userName}
			</div>
		);
	}

}

class LoginPageOptimize extends Component {
	constructor (props) {
		super(props);
		this.state={
			inputdata:this.props.inputdata,
			otherdata:this.props.otherdata

		};
	}
	/**
	 * [onChangeMethod 文本框点击事件]
	 * @return {[type]} [description]
	 */
	onChangeMethod (inputValue,inputRef) {

		/*
		let inputdata_  = this.state.inputdata;
		for(let i=0;i<inputdata_.length;i++){
			if(inputdata_[i].inputRef==inputRef){
				inputinputdata_data[i].value=inputValue;
			}
		}
		this.setState({
			inputdata:inputdata_
		});*/
	}
	onChangePwd (inputValue,inputRef) {
		console.log("密码发生改变");
		let inputdata_  = this.state.inputdata;
		for(let i=0;i<inputdata.length;i++){
			if(inputdata[i].inputRef==inputRef){
				inputdata[i].value=inputValue;
			}
		}

		this.setState({
			inputdata:inputdata
		});
	}
	aHrefClick () {
		console.log("忘记密码");
	}
	buttonClickMethod () {
		console.log("登录按钮被点击");
	}
	render () {
		//let onChangeMethod =[this.onChangeText,this.onChangePwd];

		let that =this;
		
		let onChangeMethod =function() {
			that.onChangeMethod();
		}
		let onChangePwd=function () {
			that.onChangePwd();
		}
		let aHrefClick =function () {
			that.aHrefClick();
		}
		let buttonClickMethod =function () {
			that.buttonClickMethod();
		}

		//批量生成多个Input组件
		let inputs= this.state.inputdata.map(function(item){
			return (
				<InputComp key={item.inputType} labelName ={item.labelName} inputType ={item.inputType} inputRef={item.inputRef} inputName ={item.inputName} onChangeMethod ={onChangeMethod}></InputComp>
			);
		});
		return(
			<div className="login">
				{inputs}
				<ButtonComp buttonName={this.state.otherdata.buttonName} buttonClickMethod={buttonClickMethod} aName={this.state.otherdata.aName} aHrefClick={aHrefClick}></ButtonComp>
				{this.state.inputdata[0].value}
			</div>
		);
	}
	

}
ReactDOM.render(<LoginPage/>,document.getElementById("login"))
/*
var inputdata = [
        {enable:false,labelName:'用户名',inputType:'text',inputRef:'userName',inputName:'userName',method:0,value:""},
        {enable:false,labelName:'密码',inputType:'password',inputRef:'userPwd',inputName:'userPwd',method:1,value:""}
];

var otherdata = {buttonName:'登录',titleName:'登录界面',aName:'忘记密码?'}
ReactDOM.render(
	<LoginPageOptimize inputdata ={inputdata} otherdata={otherdata} />,document.getElementById("login")
);*/

//ReactDOM.render(<InputComp labelName="用户名" inputType="text" inputRef="userName" inputName="userName" onChangeMethod={}></InputComp>,document.getElementById("login"));
//ReactDom.render(<ButtonComp buttonName="登录" aName="忘记密码" buttonClickMethod ={} aHrefClick={} />)


