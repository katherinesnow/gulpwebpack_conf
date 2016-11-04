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