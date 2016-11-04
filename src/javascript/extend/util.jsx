import urlConfig from './config/config.json';

let currentUrlPrefix = urlConfig[urlConfig["current"]];
let COOKIE_EXPIRE_SECONDS = 30 * 24 * 60 * 60; // 30 天 cookie 过期
export default class Util {
	/**
	 * [isDebugMode 判断是否为调试模式]
	 * @return {Boolean} [description]
	 */
	static isDebugMode () {
		return false;
	}

	//解决position fixed，页面中input focus状态下，header定位错误
	//http://stackoverflow.com/questions/15199072/ios-input-focused-inside-fixed-parent-stops-position-update-of-fixed-elements
	static fixFixed () {
		// 解决iOS下定位为fixed元素的定位问题，这里直接到fixed脚隐藏，当失去焦点时再给还原回来
		$(document).ready(function () {
			let $fixedEls = $(document.body).find('*').filter(function (index, item){
				return $(item).hasClass('footer-fixed');
			});

			$('input').each(function (){
				$(this).on('focus', function (){
					$fixedEls.addClass('hide');
				});

				$(this).on('blur', function (){
					$fixedEls.removeClass('hide');
				});
			});
		});
	}

	static fetchData (param) {
		let {url, data, method, successFn, errorFn} = param;
		if (!method || method.toLowerCase() == 'get') {

			let queryString = $.param(data, true);

			$.ajax({
		        url: currentUrlPrefix + url + '?' + queryString,
		        headers: {
		          'Accept': 'application/json',
		          'Content-Type': 'application/json'
		        },
		        type: 'GET',
		        dataType: 'json',
		        traditional: true,
		        xhrFields: {
		          withCredentials: true
		        },
		        crossDomain: true,
		        success: function(data) {
		          successFn(data);
		        },
		        error: function() {
		          errorFn.apply(null, [...arguments]);
		        }
		    });
		} else {

			$.ajax({
		        url: currentUrlPrefix + url,
		        headers: {
		          'Accept': 'application/json',
		          'Content-Type': 'application/json'
		        },
		        type: 'POST',
		        dataType: 'json',
		        data: JSON.stringify(data),
		        traditional: true,
		        xhrFields: {
		          withCredentials: true
		        },
		        crossDomain: true,
		        success: function(data) {
		          successFn(data);
		        },
		        error: function(data) {
		          errorFn.apply(null, [...arguments]);
		        }
		    });
		}
	}


	static getPageTimeInfo (url) {
		let pureUrl = Util.cleanUrlSubfix(url);
		return Util.cachedPageTime(pureUrl);
	}

	static inPage () {
		Util.logPageTime('in');
	}

	static outPage () {
		Util.logPageTime('out');
	}

	/**
	 * [cachedTime 用户停留时间记录相关的功能]
	 * @param  {[type]} url      [url]
	 * @param  {[type]} type      [记录的类型]
	 * @param  {[type]} timestamp [时间戳]
	 * @return {[type]}           [description]
	 */
	static cachedPageTime(url, type, timestamp) {
		let cache = window.__cache__ || (window.__cache__ = {});
		let pureUrl = Util.cleanUrlSubfix(url);

		if (typeof type == 'undefined') return cache[pureUrl];
		if (typeof cache[pureUrl] == 'undefined' ) cache[pureUrl] = {};

		cache[pureUrl][type] = timestamp;

		return cache[pureUrl][type];
	};

	/**
	 * [logPageTime 记录当前页面时间]
	 * @param  {[type]} type [类型：in（进入时间）|out（离开时间）]
	 * @return {[type]}      [description]
	 */
	static logPageTime (type) {
		let url = location.href;
		url = Util.cleanUrlSubfix(url);
		Util.cachedPageTime(url, type, new Date().getTime());
	}


	static cleanUrlSubfix (url) {
		if(!url) return null;
		let hasSubfix = url.indexOf('?')>=0;
		return hasSubfix ? url.substring(0, url.indexOf('?')) : url;
	}

	static isType (obj, type) {
		return Object.prototype.toString.call(obj) == '[object ' + type +']';
	}

	static leavePage (callback) {
		// 先强制刷新当前页面的离开时间
		Util.outPage();

		let url = location.href;
		let pureUrl = Util.cleanUrlSubfix(url);
		let pageTimeInfo = Util.getPageTimeInfo(pureUrl);

		let loggedPageTimeParam = {
			url: 'logger/printUserPageInfo',
			method: 'POST',
			data: {
				userId: Util.getCurrentUserId() || 0,
				url: pureUrl,
				inTime: +pageTimeInfo['in'],
				outTime: +pageTimeInfo['out']
			},
			successFn : function (result) {
				if (Util.isResultSuccessful(result.success)) {
					callback && callback(result);
				} else {
					console.error('Request is not successful in leavePage function', result);
				}
			},
			errorFn : function () {
				console.error.apply(this, [...arguments]);
			}
		};

		Util.fetchData(loggedPageTimeParam);
	}

	static addUserPageInfoUploadListener() {
		// 处理没有流程处理的页面，比如点击返回按钮也应该进行一次数据上报
		document.addEventListener('visibilitychange', () => {
		  if (document.visibilityState == 'hidden') {
		    Util.leavePage();
		  } else if (document.visibilityState == 'visible') {
		  	Util.inPage();
		  }

		  // 阻塞浏览器，以争取时间将用户统计信息上传
		  (new Image).src="http://fakeurl.com/fake.gif";
		});
	}

	static logCurrentPageTimeInfo () {
		let url = locatoin.href;
		url = Util.cleanUrlSubfix(url);
	}


	static isJoinedUser () {
		let obj = Util.parseQueryString(location.href);
		//当是拼团并且存在拼团ID的时候，属于参团人员
		return obj['isGroup'] == 'true' && !!obj['detailId'];
	}

	static isSingleBuy () {
		let obj = Util.parseQueryString(location.href);
		return typeof obj['isGroup'] == 'undefined';
	}

	static redirectPageByBuyType (buyType, href) {
		let stretagy = {
			'single' () {
				let singleHref = 'http://yougo.xinguang.com/fightgroup-web/public/build/wxPages/FillInfo/index.html';
				if (Util.parseQueryString(href)['groupId']) {
					// 如果是分享过来的页面，要补上拼团ID，即groupId
					singleHref = singleHref + "?groupId=" + Util.parseQueryString(href)['groupId'];
				}
				return singleHref;
			},

			'group' () {
				let groupHref = 'http://yougo.xinguang.com/fightgroup-web/public/build/wxPages/FillInfo/index.html?isGroup=true';
				if (Util.parseQueryString(href)['groupId']) {
					// 如果是分享过来的页面，要补上拼团ID，即groupId
					groupHref = groupHref + '&groupId=' + Util.parseQueryString(href)['groupId'];

					if (Util.parseQueryString(href)['detailId']) {
						groupHref = groupHref + '&detailId=' + Util.parseQueryString(href)['detailId'];
					}
				}
				return groupHref;
			}
		};

		let isWeixin = true;
		let redirect = stretagy[buyType]();
		if (!isWeixin) {
			location.href = redirect;
		} else {
			let userId = Util.getCurrentUserId();
			if (!!userId) {
				// 1. try if userId exists in cookie
				if (redirect.indexOf('?') >= 0) {
					redirect = redirect + '&user=' + userId;
				} else {
					redirect = redirect + '?user=' + userId;
				}
				location.href = redirect;
			} else {
				// 授权
				let authUrl = 'http://yougo.xinguang.com/fightgroup-web/oauth/gotoOauth?redirect_param='+redirect+'&thirdPartType=weixin';
				location.href = authUrl;
			}
		}
	}

	/**
	 * [calcCountDownByLeftTime 通过剩余毫秒数返回格式化的时间]
	 * @param  {[type]} leftTimeMills [description]
	 * @return {[type]}               [description]
	 */
    static calcCountDownByLeftTime (leftTime) {
    	let secondsPerMinute = 60;
    	let secondsPerHour = 60 * secondsPerMinute;

    	let leftHours = Math.floor(leftTime / secondsPerHour);
    	let leftMinutes = Math.floor((leftTime - leftHours*secondsPerHour) / secondsPerMinute);
    	let leftSeconds = Math.floor(leftTime % 60);

    	if (leftHours < 10) leftHours = '0' + leftHours;
    	if (leftMinutes < 10) leftMinutes = '0' + leftMinutes;
    	if (leftSeconds < 10) leftSeconds = '0' + leftSeconds;


    	return {
    		hours: leftHours,
    		minutes: leftMinutes,
    		seconds: leftSeconds
    	};
    }

   static formatTimestamp (timestamp, format) {
       let  d = new Date(timestamp),
                  year = d.getFullYear(),
                  month = d.getMonth() + 1,
                  date = d.getDate(),
                  hour = d.getHours(),
                  minute = d.getMinutes(),
                  second = d.getSeconds();

        if (month < 10) month = '0' + month;
        if (date < 10) date = '0' + date;
        if (hour < 10) hour = '0' + hour;
        if (minute < 10) minute = '0' + minute;
        if (second < 10) second = '0' + second;

        const formattedDate = year+"-"+month+"-"+date+" " +hour+":"+minute+":"+second;
        
        return formattedDate;
   }

    static isHtmlUrl (href) {
		return href.substring(href.length-4, href.length) == 'html';
	};

	static isEmptyObject (obj) {
		return obj !== null && typeof obj === 'object' && Object.keys(obj).length == 0;
	}

	static parseQueryString (url) {
	    let reg_url =/^[^\?]+\?([\w\W]+)$/,
	        reg_para=/([^&=]+)=([\w\W]*?)(&|$)/g, //g is very important
	        arr_url = reg_url.exec( url ),
			ret = {};
	    if( arr_url && arr_url[1] ){
	        let str_para = arr_url[1],result;
	        while((result = reg_para.exec(str_para)) != null){
	            ret[result[1]] = result[2];
	        }
	    }
	    return ret;
	};

	/**
	 * [isGroup 从页面跳转过来的url判断是否为拼团页面]
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-09-02T16:21:48+0800
	 * @return   {Boolean}                    [description]
	 */
	static isGroup () {
		let paramObj = Util.parseQueryString(location.href);
		if (!!paramObj) {
			return (paramObj['isGroup'] && paramObj['isGroup'] == 'true');
		} else {
			return false;
		}
	}

    static fetchGroupId () {
        let paramObj = Util.parseQueryString(location.href);
		if (!!paramObj) {
			return paramObj['groupId'];
		} else {
			return null;
		}
    }

    /**
     * [lazyLoadeImages 图片懒加载函数]
     * @param  {[type]} $images [description]
     * @return {[type]}         [description]
     */
    static lazyLoadImages ($images, size = 8, timeout = 200) {
    	let chunks = [],
    		tmp = [];
    	// pre tackle
    	$images.each(function (index, item){
    		if (tmp.length < size) {
    			tmp.push($(item));
    		} else {
    			chunks.push(tmp.slice(0));
    			tmp = [item];
    		}
    	});
    	if (tmp.length) chunks.push(tmp);

    	$.each(chunks, function (index, chk){
    		setTimeout(function (){
    			$.each(chk, function (idx, img){
    				let $img = $(img);
	    			let src = $img.attr('data-src');
	    			if(src) {
	    				$img.attr('src', src).removeAttr('data-src');
	    			}
	    		})
    		}, index * timeout);
    	})
    }
    
    /**
	 * [getCurrentUserId 从cookie中获取用户userid]
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-09-02T16:21:48+0800
	 * @return   {Boolean}                    [description]
	 */
    static getCurrentUserId () {
    	if (urlConfig['current'] == 'dev') {
    		return 767;
    	} else {
    		return Util.getCookie('user');
    	}
    }

    static setCurrentUserId (userId) {
        return Util.setCookie('user', userId, COOKIE_EXPIRE_SECONDS, '/', 'yougo.xinguang.com');
    }

    static fetchParamValueByCurrentURL (key) {
    	return Util.parseQueryString(location.href)[key];
    }

    static rebuildItemState (item) {
		let kidCount = +item.specialNum;
        let adultCount = +item.normalNum;
        let totalCount = kidCount + adultCount;
        return   {
            "groupId": item.groupId,
            "id": item.id,
			"price" : new Number(item.payPrice).toFixed(2),
			"name" : "千岛湖国庆家庭3日游",
			"groupMemberNumber" :  totalCount,
            "kid": kidCount,
            "adult": adultCount,
            "payStatus": item.payStatus,
            "status": item.status,
            "remain": item.remainAmount,
			"groupStartTime" : Util.formatTimestamp(item.startTime),
			"groupEndTime" : item.endTime,
            "travelTime": item.travelTime,
            "type": item.type, // 1为拼团购买，2为单独购买
            "travelAddress": item.travelAddress
		} 
	}

	static isResultSuccessful (success) {
		return !!success || success == 'true';
	}

	//============================= 常用工具方法 ==================================//
	
	static isArray (obj) {
		if (typeof Array.isArray == 'function') {
			return Array.isArray(obj);
		} else {
			return Util.isType(obj, 'Array');
		}
	}

	static deepClone (obj) {
		if (obj === null || typeof obj !== 'object') return obj;
		let ret = new obj.constructor();

		if (Util.isType(obj, 'Array')) {
			ret = [];
			for (let i = 0, l = obj.length; i < l; i++) {
				ret[i] = Util.deepClone(obj[i]);
			}
		} else {

			if (obj instanceof Date) {
				return new Date(obj.valueOf());
			}

			if (obj instanceof RegExp) {
				var pattern = obj.valueOf();
			    var flags = '';
			    flags += pattern.global ? 'g' : '';
			    flags += pattern.ignoreCase ? 'i' : '';
			    flags += pattern.multiline ? 'm' : '';
			    return new RegExp(pattern.source, flags);
			}

			if (obj instanceof Function) {
				// 函数的话直接指向相对的内存地址
				return obj;
			}

			for (let attr in obj) {
				if (obj.hasOwnProperty(attr)) {
					ret[attr] = Util.deepClone(obj[attr]);
				}
			}
		}
		return ret;
	}

	static flatten (array) {
		let ret = [];
		array.forEach(function (item) {
			if (Util.isArray(item)) {
				ret = ret.concat(Util.flatten(item));
			} else {
				ret.push(item);
			}
			
		});
		return ret;
	}

	static throttle(method, context, timeout) {
		let delay = timeout || 200;
		clearTimeout(method.tId);
		method.tId = setTimeout(function() {
		    method.call(context);
		  },
		delay);
	}

	static UUIDAlgorithm () {
		let cache = 0;
		return function (algorithm) {
			return !!algorithm ? algorithm() : ++cache;
		}
	}

	static UUID () {
		return Util.UUIDAlgorithm()();
	}


	// cookie relative 
	// utility function called by getCookie()
	static getCookieVal (offset) {
	    var endstr = document.cookie.indexOf(";", offset);
	    if (endstr == -1) {
	        endstr = document.cookie.length;
	    }
	    return unescape(document.cookie.substring(offset, endstr));
	}
	 
	// primary function to retrieve cookie by name
	static getCookie(name) {
	    var arg = name + "=";
	    var alen = arg.length;
	    var clen = document.cookie.length;
	    var i = 0;
	    while (i < clen) {
	        var j = i + alen;
	        if (document.cookie.substring(i, j) == arg) {
	            return Util.getCookieVal(j);
	        }
	        i = document.cookie.indexOf(" ", i) + 1;
	        if (i == 0) break;
	    }
	    return null;
	}
	 
	// store cookie value with optional details as needed
	static setCookie(name, value, expires, path, domain, secure) {
	    document.cookie = name + "=" + escape(value) +
	    ((expires) ? "; expires=" + expires : "") +
	    ((path) ? "; path=" + path : "") +
	    ((domain) ? "; domain=" + domain : "") +
	    ((secure) ? "; secure" : "");
	}
	 
	// remove the cookie by setting ancient expiration date
	static deleteCookie(name, path, domain) {
	    if (Util.getCookie(name)) {
	        document.cookie = name + "=" +
	      ((path) ? "; path=" + path : "") +
	      ((domain) ? "; domain=" + domain : "") +
	      "; expires=Thu, 01-Jan-1970 00:00:01 GMT";
	 
	    }
	}

	static trim (str) {
    	return str.replace(/(^\s*)|(\s*$)/g, '');
	}	 
}