import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ShopTab from './ShopList/ShopList';



import 'scss/base.scss';
import 'scss/RouteList/index.scss';

class IndexComponent extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="m-list">
				<ShopTab />
			</div>
		);
	}
}
function doRender(){
	ReactDOM.render(<IndexComponent />,document.getElementById('app'));
}

setTimeout(doRender,16);