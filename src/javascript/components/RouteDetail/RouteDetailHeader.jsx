import React from 'react';
import Slide from 'components/Slide/Slide';
import Util from 'extend/util';
import 'scss/base.scss';
import './RouteDetailHeader.scss';

export default class Gallery extends React.Component {
	constructor(props){
		super(props);
		this.state={};
	}

	render() {
		return (
			<div className='m-route-detail-header'>
				<Slide imageList={this.props.imageList} />
			</div>
		);
	}
}
