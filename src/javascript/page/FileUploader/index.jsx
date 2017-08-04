import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import FileInput from 'extend/FileInput';
import Jcrop from "components/Jcrop/jquery.Jcrop.min.js";

import 'scss/base.scss';
import 'scss/FileUploader/index.scss';
import 'components/Jcrop/jquery.Jcrop.min.css';

class IndexComponent extends Component {
	constructor(props){
		super(props);

		this.state = {
			files:[],
            region:'oss-cn-hangzhou',
            urllib:OSS.urllib,
            Buffer:OSS.Buffer,
            OSS :OSS.Wrapper,
            STS :OSS.STS,
            blob:''
		};
	}

	onChange(files) {
        this.setState({
            files: this.state.files.concat(files)
        });
	}

	onChange2(files) {
		this.setState({
            files: this.state.files.concat(files)
        });

		let that = this;
        let reader=new FileReader();  
        //将文件读取为DataURL  
        reader.readAsDataURL(files[0]);  
        reader.onload= function (e) {  
            let localimghtml = '<img id="cropbox" src="' +  e.target.result + '" >';  
            $("#imgfield").html(localimghtml);  
            that.initJcrop();  
        };  
	}
    
    /**
     * [initJcrop 初始化裁剪区域]
     * @return {[type]} [description]
     */
	initJcrop() {  
		let that = this;
        $('#cropbox').Jcrop({  
            onSelect: that.updateCoords,  
            aspectRatio: 1,  
            boxWidth: 300,  
            boxHeight: 300  
        }, function () {  
            //图片实际尺寸  
            var bb = this.getBounds();  
            var bWidth= Number(bb[0]) / 2;  
            var bHeight= Number(bb[1]) / 2;  
  
            this.setSelect([0, 0, bWidth,bHeight]);  
  
            var ss = this.getWidgetSize();  
            var aheight = (300 - Number(ss[1])) / 2 + "px";  
            //$(".jcrop-holder").css("margin-top", aheight);  
        });  
    }  
    
    /**
     * [updateCoords 更新裁剪坐标]
     * @param  {[type]} c [description]
     * @return {[type]}   [description]
     */
    updateCoords(c){  
        var img=document.getElementById("cropbox");  
        var ctx=document.getElementById("myCan").getContext("2d");  
  
        //img,开始剪切的x,Y坐标宽高，放置图像的x,y坐标宽高。  
        ctx.drawImage(img,c.x,c.y, c.w, c.h,0,0,200,200);  
    }  
  
    /**
     * [dataURLtoBlob dataURL to blob]
     * @param  {[type]} dataurl [description]
     * @return {[type]}         [description]
     */
    dataURLtoBlob(dataurl) {  
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],  
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);  
        while (n--) {  
            u8arr[n] = bstr.charCodeAt(n);  
        }  
        return new Blob([u8arr], { type: mime });  
    }  

    ConfirmUpload() {
        //获取裁剪完后的base64图片url,转换为blob  
        let data=document.getElementById("myCan").toDataURL();  
        let blob = this.dataURLtoBlob(data);
       
        this.applyTokenDo(this.uploadFile,blob);
    }
    
    uploadFile  (client,blob) {
       let that = this;
       var file =document.getElementById("file").files[0];
       var key = "images/testObjectname.png";
       //console.log(file.name + ' => ' + key);

      return client.multipartUpload(key, file, {
        //progress: that.progress
        headers:{
            "x-oss-object-acl":'public-read',
        }
      })/*.then(function (res) {

        //console.log('upload success: %j', res);
        //return listFiles(client);
      })*/;
    }

    applyTokenDo (func,blob) {
        let that = this;
        var url = 'http://172.16.1.51:8022/getOSSConfig';
        return   this.state.urllib.request(url, {
            method: 'GET'
        }).then(function (result) {
            var creds = JSON.parse(result.data);
            var client = new OSS({
              region: that.state.region,
              accessKeyId: creds.data.accessKey,
              accessKeySecret: creds.data.secret,
              stsToken: creds.data.token,
              bucket: creds.data.bucket
            });

            return func(client,blob);
        });
    }


    progress (p) {
      return function (done) {
        var bar = document.getElementById('progress-bar');
        bar.style.width = Math.floor(p * 100) + '%';
        bar.innerHTML = Math.floor(p * 100) + '%';
        done();
      }
    }



	render() {

		return (
			<div >
                <FileInput className="upload-button" multiple="true" btnValue="Upload Image" onChange={this.onChange.bind(this)} onChange2={this.onChange2.bind(this)} />
                <div className="thumbs-box">
                    {this.state.files.length > 0 ? 
                        this.state.files.map(function(file,index) {
            	        return  <div key = {index} >
                                  <img src={file.thumb} alt="上传图片显示"/>
            	                </div>
                    }):''}
                </div>
                <div className="croparea">
                    <div className="uploadPics" >
                        <div className="picCont" >  
                            <div id="imgfield" className="imgfield" ></div>  
                        </div> 
                    </div> 
                    <canvas id="myCan" width="200" height="200"></canvas> 
                </div>
                <span className="btn confirm" onClick={this.ConfirmUpload.bind(this)}>确认</span>  
            </div>
		);
	}
}

ReactDOM.render(<IndexComponent></IndexComponent>,document.getElementById("app"));
