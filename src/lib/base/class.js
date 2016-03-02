/**
 * @file class
 * @desc  from aralejs class
 * @author lanmingming
 * @date 2016-3-1
 */

var toString = Object.prototype.toString;

var isArray = Array.isArray || function (val) {
	return toString.call(val) === '[object Array]';
};

var isFunction = function (val) {
	return toString.call(val) === '[object Function]';
};

var indexOf = Array.prototype.indexOf ? function (arr, item) {
	return arr.indexOf(item);
} : function (arr, item) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] === item) {
			return i;
		}
	}
	return -1;
};

var mix = function (r, s, wl) {
	for (p in s) {
		if (s.hasOwnProperty(p)) {
			if (wl && indexOf(wl, p) === -1) {
				continue;
			}

			if (p !== 'prototype') {
				r[p] = s[p];
			}
		}
	}
};

var Ctor = function () {};

var createProto = Object.create ? function (proto) {
	return Object.create(proto);
} : function (proto) {
	Ctor.prototype = proto;
	return new Ctor;
};

function Class (o) {
	if (!(this instanceof Class) &&  isFunction(o)) {
		return classify(o);
	}
}

function classify (cls) {
	cls.extend = Class.extend;
	cls.implement = implement;
	return cls;
}

Class.create = function (parent, properties) {
	if (!isFunction(parent)) {
		properties = parent;
		parent = null;
	}

	properties || (properties = {});
	parent || (parent = properties.Extends || Class);

	// 每个properties 必定有一个 Extends, 在 调用implement时， 该函数调用 Mutators 里的 Extends 从而实现继承
	properties.Extends = parent;

	function SubClass () {
		parent.apply(this, arguments);

		if (this.constructor === SubClass && this.initialize) {
			this.initialize.apply(this, arguments);
		}
	};

	if (parent !== Class) {
		mix(SubClass, parent, parent.StaticsWhiteList);
	}

	implement.call(SubClass, properties);

	return classify(SubClass);
};

Class.extend = function (properties) {
	properties = properties || {};
	properties.Extends = this;

	return Class.create(properties);
};

function implement (properties) {
	var key;
	var value;

	for (key in properties) {
		value = properties[key];

		if (Class.Mutators.hasOwnProperty(key)) {
			Class.Mutators[key].call(this, value);
		}
		else {
			this.prototype[key] = value;
		}
	}
};

Class.Mutators = {
	Extends: function (parent) {
		var existed = this.prototype;
		var  proto = createProto(parent.prototype);

		mix(proto, existed);

		proto.constructor = this;
		this.prototype = proto;

		this.superclass = parent.prototype;
	},

	Implements: function (items) {
		items = isArray(items) ? items : [items];

		var proto = this.prototype;
		var item;
		while (item = items.shift()) {
			mix(proto, item);
		}
	},

	Statics: function (staticProperties) {
		mix(this, staticProperties);
	}
};

