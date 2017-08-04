import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default
class FileInput extends Component {
    constructor(props){
		super(props);
	}

	static PropsType = {
         onChange:React.PropTypes.func.isRequired,
         multiple:React.PropTypes.bool,
         btnValue:React.PropTypes.string
	};

	_onChange(event) {
        event.preventDefault();
        let target = event.target;
        let files = target.files;
        let count = this.props.multiple ? files.length : 1;
       
        let i;
        for(i = 0; i<count;i++) {
        	files[i].thumb = URL.createObjectURL(files[i])
        }

        files = Array.prototype.slice.call(files,0);//第一个选择的文件

        /*files = files.filter(function(file) {
        	return /image/png.test(file.type);
        });*/
        
        //this.GetFileExtension(files);
        let isUpload = this.GetFileSize(files);

        if(isUpload) {

        	this.props.onChange2(files);
            
        	//this.props.onChange(files,event);
        }
        
	}

	GetFileSize(files) {
		let _f = files;
		let _first_file = files[0];
		let browser = this.GetUserAgent();
		let size = 0;
        let rtn = true;
		let MAX_SIZE = 5*1024*1024;// 单位B(字节)
        
		if(browser == "Chrome") {
			size = _first_file.size;
			if(size > MAX_SIZE) {
                this.refs.err_tip.innerHTML= "图片大小不能大于5MB";
                rtn = false;
			}
		}
		return rtn;
	}

	GetFileName(files) {
        let _f = files;
		let _first_file = files[0];
		return _first_file.name;
	}

	GetFileExtension(files) {
		let _f = files;
		let _first_file = files[0];
		let fileName = _first_file.name;
		let extension = fileName.substring(fileName.lastIndexOf('.'),fileName.length).toLowerCase(); 

		if(extension!='.jpeg' && extension!='.png' && extension!='.jpg')  
        {  
            this.refs.err_tip.innerHTML = "上传失败，请上传jpg,png格式的图片";  
            return;  
        }  
	}


	GetUserAgent() {
		let ua = window.navigator.userAgent;  
        let browser = "";

		if (ua.indexOf("MSIE")>=0){  
            browser = "IE";
        }else if(ua.indexOf("Firefox")>=1){  
            browser = "Firefox";
        }else if(ua.indexOf("Chrome")>=1){  
            browser = "Chrome";
        } 

        return browser; 
	}

	render() {
		let className = this.props.className;
		return (
			<div>
                <a href="javascript:;" className={className}>
                    <input type="file" id="file" multiple={this.props.multiple} ref="fileInput"  onChange={this._onChange.bind(this)} />
                    <span>{this.props.btnValue}</span>
                </a>
                <span className="err" ref="err_tip"></span>
            </div>
		);
	}
}