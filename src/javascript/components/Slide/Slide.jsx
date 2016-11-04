import React from 'react';
import Hammer from 'lib/hammer.min.js';
import Util from 'extend/util';
import className from 'classnames';
import "./Slide.scss";

export default class Slider extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			activeSlide:0
		};
	}
	
	/**
	 * [nextSlide 播放下一张图]
	 * @return {[type]} [description]
	 */
	nextSlide() {
		var slide = this.state.activeSlide +1 <this.props.imageList.length? this.state.activeSlide + 1 : 0;
		this.setState({
			activeSlide: slide
		});
	}

	/**
	 * [previousSlide 播放上一张图]
	 * @return {[type]} [description]
	 */
	previousSlide() {
		var slide = this.state.activeSlide - 1 < 0 ? this.props.imageList.length - 1 : this.state.activeSlide - 1;
	    this.setState({
	      activeSlide: slide
	    });
	}
	
	/**
	 * [componentDidMount 组件加载完后用户操作]
	 * @return {[type]} [description]
	 */
	componentDidMount(){
		var dom =this.refs.div;
		var hammer = new Hammer(dom,{});
		hammer.on('swipeleft',function(){
			//console.log("图片想左滑动");
			this.nextSlide();
		}.bind(this));
		hammer.on('swiperight',function(){
			//console.log("图片想右滑动");
			this.previousSlide();
		}.bind(this));

		setTimeout(function() {
			//console.log($('img').length);
			let $images = $('img');
			Util.lazyLoadImages($images,2,400);
		},50);
	}

	render() {
		var _this = this;
		var slides = this.props.imageList;//获取图片列表地址
		var activeIndex = this.state.activeSlide;
		var slide= slides.map(function (element,index){
			var classes = className({
				'slide': true,
				'active': index === activeIndex
			})
			if(index){
				//次页的图片懒加载
				return (
					<div className={classes} key={index}>
						<img data-src={element} />
					</div>
				);
			}else{
				return (
					<div className={classes} key={index}>
						<img src={element} />
					</div>
				);
			}
		})

		return (
			<div className="m-slider" ref="div">
				{slide}
			</div>
		);
	}
}