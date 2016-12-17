// class
class Point {
	constructor(x,y) {
		// constructor 方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法.
		// 一个类必须有constructor 方法，如果没有显式定义，一个空的constructor 方法会被默认添加.
		// constructor 方法默认返回实例对象(即this),完全可以指定另外一个对象.
		// 比如 constructor函数中: return Object.create(null) 返回一个全新的对象，结果导致实例对象不是Point类的实例.
		// 类的构造函数，不使用new 是没法调用的，会报错，这是跟普通构造函数的有一个主要区别，后者不用new 也可以执行.

		// 类的方法内部如果含有this,它默认指向类的实例,但是，必须非常小心，一旦单独使用该方法，很可能报错
		this.x = x;
		this.y = y;
	}

	toString() {
		return '(' + this.x + "," + this.y +")";
	}
}

// 类的实例对象
// 生成类的实例对象的写法，与ES5完全一样，也就是使用new 命令，否则报错
// 与ES5一样，实例的属性除非显式定义在其本身（即定义在this对象上），否则都是定义在原型上（即定义在class上）
let point = new Point(2,3);
point.toString() // (2, 3)

point.hasOwnProperty('x') // true
point.hasOwnProperty('y') // true
point.hasOwnProperty('toString') // false
point.__proto__.hasOwnProperty('toString') // true
// 上面代码中，x和y都是实例对象point自身的属性（因为定义在this变量上），所以hasOwnProperty方法返回true，而toString是原型对象的属性（因为定义在Point类上），所以hasOwnProperty方法返回false。这些都与ES5的行为保持一致。

/* start 不推荐做法*/
let p1 = new Point(3,2);
let p2 = new Point(2,3);

p1.__proto__ = p2.__proto__; 
//可以通过实例的__proto__属性为Class添加方法
P1.__proto__.printName = function () {
	return '__proto__ add Class function';
}
p1.printName();
p2.printName();

let p3 = new Point(4,2);
p3.printName();
//上面代码在p1的原型上添加了一个printName方法，由于p1的原型就是p2的原型，因此p2也可以调用这个方法
//而且，此后新建的实例p3也可以调用这个方法。这意味着，使用实例的__proto__属性改写原型，必须相当谨慎，不推荐使用，因为这会改变Class的原始定义，影响到所有实例。
/* end 不推荐做法*/

//  start ES6 class 不存在变量提升，这一点雨ES6完全不同
// 因为ES6不会把类的声明提升到代码头部。这种规定的原因与下文要提到的继承有关，必须保证子类在父类之后定义。

// ES6中，与函数一样,类也可以使用表达式的形式定义（但是不推荐）

// ES6 私有方法
// 私有方法是常见需求，但ES6不提供,只能通过变通方法模拟实现
// 一种做法是在命名上加以区别.
// 另外一种方法：将私有方法移出模块，因为模块内部的所有方法都是对外可见.

// 方法一
class Widget {

	//共有方法
	foo(baz) {
		this._bar(baz);
	}

	// 私有方法
	// _bar方法前面的下划线，表示这是一个只限于内部使用的私有方法。但是，这种命名是不保险的，在类的外部，还是可以调用到这个方法
	_bar(baz) {
		return this.snaf = baz;
	}
}

class Widget2 {
	foo(baz) {
        bar.call(this,baz);
	}
}

function bar(baz) {
	return this.snaf = baz;
}

// ES6 继承
// 代码定义了一个ColorPoint类，该类通过extends关键字，继承了Point类的所有属性和方法。但是如果该类由于没有部署任何代码，所以这两个类完全一样，等于复制了一个Point类
// 子类必须在constructor 方法中调用super 方法，否则新建实例会报错,这是因为子类没有自己 的this对象，而是继承父类的this对象，然后对其进行加工，如果不调用super方法，子类就得不到this对象
// super 用法: 
// (1) 作为函数时，super()只能用在子类的构造函数之中，用在其他地方就会报错
// (2) 作为对象时，指向父类的原型对象A.prototype 
//     所以定义在父类实例上的方法或属性，是无法通过super调用的，
//     如果属性定义在父类的原型对象上，super就可以找到
class ColorPoint extends Point {
     constructor(x,y,color) {
     	super(x,y);
     	this.color = color;
     }

     toString() {
         return this.color + ' ' +super.toString(); //调用父类的toString() 
     }
     
     /**
      * 定义在父类实例上的方法或者属性，是无法通过super 对象调用的(但是可以通过super 函数调用)
      * @return {[type]}
      */
     getSuperInstanceFunAtr() {
         return super.x; 
     }
}
let getSuperInstance = new  ColorPoint();
getSuperInstance.getSuperInstanceFunAtr(); //undefined

// ES5的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）。ES6的继承机制完全不同，实质是先创造父类的实例对象this（所以必须先调用super方法），然后再用子类的构造函数修改this。
// 另一个需要注意的地方是，在子类的构造函数中，只有调用super之后，才可以使用this关键字，否则会报错。这是因为子类实例的构建，是基于对父类实例加工，只有super方法才能返回父类实例。
class ColorPoint2 extends Point {
  constructor(x, y, color) {
    this.color = color; // ReferenceError
    super(x, y);
    this.color = color; // 正确
  }
}

let cp = new ColorPoint(25, 8, 'green');

cp instanceof ColorPoint // true
cp instanceof Point // true
// 上面代码中，实例对象cp同时是ColorPoint和Point两个类的实例，这与ES5的行为完全一致




// class 的取值函数(getter) 和存值函数(setter)
// 与ES5一样，在Class内部可以使用get和set关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为
// 存值函数和取值函数是设置在属性的descriptor对象上的
class MyClassGetSet {
	get prop() {
		return "getter";
	}

	set prop(value) {
		console.log("setter: " + value);
	}
}

let inst = new MyClassGetSet();
inst.prop = 123;
inst.prop;


class CustomHTMLElement {
	constructor(element) {
		this.element = element;
	}

	get html() {
		return this.element.innerHTML;
	}

	set html(value) {
        this.element.innerHTML = value;
	}
}

var descriptor = Object.getOwnPropertyDescriptor(
  CustomHTMLElement.prototype, "html");
"get" in descriptor  // true
"set" in descriptor  // true


// class的静态方法 (实例方法比较)
// 1. 类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。
// 2. 如果在实例上调用静态方法，会抛出一个错误，表示不存在该方法
// 3. 父类的静态方法，可以被子类继承。extendStaticMethod.classMethod();
// 4. 静态方法也是可以从super 对象上调用的.

class GetStaticMethod {
	static classMethod() {
		return "hello";
	}
}

class extendStaticMethod extends GetStaticMethod {

}
extendStaticMethod.classMethod();

class Foo {
	static classMethod() {
		return 'hello';
	}
}

class FooExtends extends Foo {
	static classMethod() {
		return super.classMethod() +",too extends";
	}
}

// class 静态属性和实例属性
// 1. 静态属性指的是Class 本身的属性,即Clas.propname,而不是定义在实例对象(this)上的属性
// 2. 目前，只有下面代码写法可行，因为ES6明确规定，class 内部只有静态方法，没有静态属性.
class Foo2 {

}
Foo2.prop = 1;
Foo2.prop;//1
//上面的写法为Foo2类定义了一个静态属性prop


//无效的静态属性写法
class Foo3 {
	// 写法一
	prop:2

	// 写法二
	static prop: 2
}

Foo3.prop;//undefined;

/*
typeof Point;// "function" 类的数据类型就是函数，类本身指向构造函数.

// Object.assign 方法可以很方便地一次向类添加多个方法
Object.assign(Point.prototype, {
	addFun1() {},
	addFun2() {}
});

let p = new Point();
p.constructor === Point.prototype.constructor // true
// p是Point类的实例，它的constructor方法就是Point类原型的constructor方法
// prototype对象的constructor属性，直接指向“类”的本身，这与ES5的行为是一致的。
Point.prototype.constructor === Point // true

// 类的内部所有定义的方法，都是不可枚举的（non-enumerable）
Object.keys(Point.prototype);
Object.getOwnPropertyNames(Point.prototype);

*/


// Array.of 方法用于将一组值,转换为数组
// 1.这个方法的主要目的，是弥补数组构造函数Array()的不足,因为参数个数的不同，会导致Array() 的行为有所差异
// 2.Array.of总是返回参数值组成的数组.如果没有参数，就返回一个空数组.
Array.of();//[]
Array.of(undefined); // [undefined]
Array.of(2);//[2]
Array.of(1,2,);//[1,2]

// Array.of 方法可以用下面的代码模拟实现
function Arrayof() {
	return [].slice.call(arguments);
}

//ES6 数组实例的find() 和findIndex() 
//1. find() 找到第一个符合条件的元素
//2. findIndex 返回第一个符合条件的数组成员的位置,如果所有成员都不符合条件,则返回-1
//3. 这两个方法都可以发现NaN，弥补了数组的IndexOf 方法的不足.
[1,5,-10,29].find(n => n <0 );// 找出数组中第一个小于0的成员
[1,5,10,15].find(function (value,index, arr) {
   return value >9;
});

[1,5,10,15].findIndex(function (value,index,arr) {
    return value >9;
});

[1,5,10].indexOf(5);
[NaN].indexOf(NaN);//-1
[NaN].findIndex( y => isNaN(y)); //0 
[NaN].findIndex( y => Object.is(NaN, y));//0
// 上面的indexOf方法无法识别数组的NaN成员

// 数组实例的fill() 方法
// 1. fill 方法用于空数组的初始化非常方便,数组中已经有的元素，会被全部抹去.
// 2. fill 方法还可以接受第二个和第三个参数,用于指定填充的起始位置和结束位置.
['a','b','c'].fill(7);// [7,7,7]
new Array(3).fill(7);// [7,7,7]
['a', 'b', 'c'].fill(7, 1, 2)
// ['a', 7, 'c']