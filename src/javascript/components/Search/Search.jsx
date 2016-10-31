import React,{Component} from 'react';


import './Search.scss';

export default class Search extends Component {
	constructor (props) {
		super(props);
	}
	render () {
		return (
				<input type="text" placeholder='请输入搜索内容' className={this.props.cssClass} />
		);
	}
}