/**
 * @file class
 * @desc  from aralejs events
 * @author lanmingming
 * @date 2016-3-1
 */

var eventSplitter = /\s+/;

var keys = Object.keys ? Object.keys : function (obj) {
	var result = [];
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			result.push[key];
		}
	}
	return result;
};

function Events () {
}

Events.prototype.on = function (events, callback, context) {
	var cache;
	var event;
	var list;

	if (!callback) {
		return this;
	}

	cache = this.__events || (this.__events = {});
	events = events.split(eventSplitter);
	while (event = events.shift()) {
		list = cache[event] || (cache[event] = []);
		list.push(callback, context);
	}

	return this;
};

Events.prototype.once = function (events, callback, context) {
	var that = this;
	var cb = function () {
		that.off(events, cb);
		callback.apply(contex || that, arguments);
	};
	this.on(events, cb, context)

};

Events.prototype.off = function (events, callback, context) {
	var cache;
	var event;
	var list;
	var i;

	if (!(cache = this.__events)) {
		return this;
	}

	// remove all
	if (!(events || callback || context)) {
		delete this.__events;
		return this;
	}

	events = events ? events.split(eventSplitter) : keys(cache);

	while (event = events.shift()) {
		list = cache[event];

		if (!list) {
			continue;
		}

		// !callback && !context
		if (!(callback || context)) {
			delete cache[event];
			continue;
		}

		// list : [cb, ctx, cb, ctx, ...]
		for (i = list.length; i >= 0; i -= 2) {

			// (!callback || list[i] === callback) && (!context || list[i + 1] ===context)
			if (!(callback && list[i] !== callback || context && list[i + 1] !== context)) {
				list.splice(i, 2);
			}
		}
	}
	return this;
};

Events.prototype.trigger = function (events) {

	var cache = {};
	var rest = [];
	var event;
	var returned = true;

	if (!(cache = this.__events)) {
		return this;
	}

	events = events.split(eventSplitter);

	for (var i = 1, len = arguments.length; i < len; i++) {
		rest[i - 1] = arguments[i];
	}
	debugger;
	while (event = events.shift()) {
		if (all = cache.all) {
			// 拷贝所有事件都会触发的func
			all = all.slice();
		}
		if (list = cache[event]) {
			// copy list
			list = list.slice();
		}

		if (event !== 'all') {
			returned = triggerEvents(list, rest, this) && returned;
		}

		returned = triggerEvents(all, [event].concat(rest), this) && returned;
	}
};

Events.prototype.emit = Events.prototype.trigger;

function triggerEvents(list, args, context) {
	var pass = true;

	if (list) {
		var i = 0;
		len = list.length;
		a1 = args[0];
		a2 = args[1];
		a3 = args[2];

		switch (args.length) {
	        case 0: for (; i < len; i += 2) {pass = list[i].call(list[i + 1] || context) !== false && pass} break;
	        case 1: for (; i < len; i += 2) {pass = list[i].call(list[i + 1] || context, a1) !== false && pass} break;
	        case 2: for (; i < len; i += 2) {pass = list[i].call(list[i + 1] || context, a1, a2) !== false && pass} break;
	        case 3: for (; i < len; i += 2) {pass = list[i].call(list[i + 1] || context, a1, a2, a3) !== false && pass} break;
	        default: for (; i < len; i += 2) {pass = list[i].apply(list[i + 1] || context, args) !== false && pass} break;
		}

		return pass;
	}
}

function isFunction(func) {
    return Object.prototype.toString.call(func) === '[object Function]'
}

Events.mixTo = function (receiver) {
	var proto = Events.prototype;

	if (isFunction(receiver)) {
		for (var key in proto) {
			if (proto.hasOwnProperty(key)) {
				receiver.prototype[key] = proto[key];
			}
		}
	}
	else {
		var event = new Events;

		for (var key in proto) {
			if (proto.hasOwnProperty(key)) {
				receiver[key] = function () {
					proto[key].apply(event, Array.prototype.slice.call(arguments));
					return this;
				}
			}
		}
	}
};


