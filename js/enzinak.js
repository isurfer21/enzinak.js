/** 
 * @author Abhishek Kumar
 * @license This work is licensed under a Creative Commons Attribution 4.0 International License.
 */

var enzinak = z = {};

enzinak.Singleton = function(Class) {
    var instance;
    return {
        getInstance: function() {
            if (!instance) {
                instance = new Class();
            }
            return instance;
        }
    };
};

enzinak.Dom = {
    whenReady: function(method) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            method();
        } else {
            document.addEventListener('DOMContentLoaded', method);
        }
    },
    parseHTML: function(htmlString) {
        var tmp = document.implementation.createHTMLDocument();
        tmp.body.innerHTML = htmlString;
        return tmp.body.children;
    },
    siblings: function(elementRef) {
        var el = (!!elementRef.length) ? elementRef[0] : elementRef;
        return Array.prototype.filter.call(el.parentNode.children, function(child) {
            return child !== el;
        });
    },
    position: function(elementRef) {
        return {
            left: elementRef.offsetLeft,
            top: elementRef.offsetTop
        };
    },
    outerWidth: function(elementRef, withMargin) {
        var width = elementRef.offsetWidth;
        if (withMargin) {
            var style = getComputedStyle(elementRef);
            width += parseInt(style.marginLeft) + parseInt(style.marginRight);
        }
        return width;
    },
    outerHeight: function(elementRef, withMargin) {
        var height = elementRef.offsetHeight;
        if (withMargin) {
            var style = getComputedStyle(elementRef);
            height += parseInt(style.marginTop) + parseInt(style.marginBottom);
        }
        return height;
    },
    offsetParent: function(elementRef) {
        return elementRef.offsetParent || elementRef;
    },
    matches: function(el, selector) {
        if (enzinak.Determine.type(selector) == 'string')
            return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
        else
            return (el === selector);
    },
    filter: function(selector, filterFn) {
        return Array.prototype.filter.call(document.querySelectorAll(selector), filterFn);
    }
};

enzinak.Style = {
    getValue: function(elementRef, ruleName) {
        return getComputedStyle(elementRef)[ruleName];
    },
    hasClass: function(elementRef, className) {
        if (elementRef.classList)
            elementRef.classList.contains(className);
        else
            new RegExp('(^| )' + className + '( |$)', 'gi').test(elementRef.className);
    },
    addClass: function(elementRef, classNames) {
        if (elementRef.classList) {
            var classes = classNames.split(' ');
            elementRef.classList.add(...classes);
        } else {
            elementRef.className += ' ' + classNames;
        }
    },
    removeClass: function(elementRef, classNames) {
        if (elementRef.classList) {
            var classes = classNames.split(' ');
            elementRef.classList.remove(...classes);
        } else {
            elementRef.className = elementRef.className.replace(new RegExp('(^|\\b)' + classNames.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    },
    toggleClass: function(className) {
        if (elementRef.classList) {
            elementRef.classList.toggle(className);
        } else {
            var classes = elementRef.className.split(' ');
            var existingIndex = classes.indexOf(className);

            if (existingIndex >= 0)
                classes.splice(existingIndex, 1);
            else
                classes.push(className);

            elementRef.className = classes.join(' ');
        }
    }
};

enzinak.Drshya = {
    hide: function(ref) {
        if (ref.length == undefined) {
            enzinak.Style.addClass(ref, 'hide');
        } else {
            for (var i = 0; i < ref.length; i++)
                enzinak.Style.addClass(ref[i], 'hide');
        }
    },
    show: function(ref) {
        if (ref.length == undefined) {
            enzinak.Style.removeClass(ref, 'hide');
        } else {
            for (var i = 0; i < ref.length; i++)
                enzinak.Style.removeClass(ref[i], 'hide');
        }
    }
};

enzinak.Trigger = {
    custom: function(elementRef, eventName, cargoObj) {
        if (window.CustomEvent) {
            var event = new CustomEvent(eventName, { detail: cargoObj });
        } else {
            var event = document.createEvent('CustomEvent');
            event.initCustomEvent(eventName, true, true, cargoObj);
        }
        elementRef.dispatchEvent(event);
    },
    native: function(elementRef, eventName) {
        var event = document.createEvent('HTMLEvents');
        event.initEvent(eventName, true, false);
        elementRef.dispatchEvent(event);
    }
};

enzinak.ViewStack = function() {
    var container,
        proceedOnUnload,
        proceedOnLoad,
        activeId;

    var _constructor = function() {}();
    var deactivateAll = function() {
        for (var i = 0, len = container.childElementCount; i < len; i++) {
            enzinak.Drshya.hide(container.children[i]);
        }
    };
    var onUnload = function(e) {
        if (proceedOnUnload != undefined) {
            proceedOnUnload(e);
        }
    };
    var onLoad = function(e) {
        if (proceedOnLoad != undefined) {
            proceedOnLoad(e);
        }
    };

    this.setContainer = function(id) {
        container = document.getElementById(id);
    };
    this.setProceedOnUnload = function(method) {
        proceedOnUnload = method;
    };
    this.setProceedOnLoad = function(method) {
        proceedOnLoad = method;
    };
    this.initialize = function() {
        container.addEventListener('sectionunload', onUnload);
        container.addEventListener('sectionload', onLoad);
    };
    this.destroy = function() {
        container.removeEventListener('sectionunload', onUnload);
        container.removeEventListener('sectionload', onLoad);
    };
    this.activate = function(id) {
        enzinak.Trigger.custom(container, 'sectionunload', activeId);
        deactivateAll();
        activeId = id;
        enzinak.Drshya.show(container.children[activeId]);
        enzinak.Trigger.custom(container, 'sectionload', activeId);
    };
};

enzinak.ObjectList = function() {
    var list;
    this.fetchItemByKey = function(key, val) {
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i][key] == val) {
                return list[i];
            }
        }
        return null;
    };
    this.removeItemByKey = function(key, val) {
        var item = fetchItemByKey(key, val);
        if (item != null) {
            return delete item;
        }
        return false;
    };
    this.removeItem = function(index) {
        return list.splice(index, 1);
    };
    this.getItem = function(index) {
        return list[index];
    };
    this.setItem = function(item) {
        list.push(item);
    };
    this.initialize = function() {
        list = [];
    };
};

enzinak.Collection = function() {
    var objectList;

    var _constructor = function() {
        objectList = new enzinak.ObjectList();
    }();

    this.register = function(id, instance) {
        objectList.setItem({
            id: id,
            instance: instance
        });
    };
    this.unregister = function(id) {
        return objectList.removeItemByKey('id', id);
    };
    this.module = function(id) {
        var item = objectList.fetchItemByKey('id', id);
        if (item != null) {
            return item.instance;
        }
        return null;
    };
    this.initialize = function() {
        objectList.initialize();
    };
};

enzinak.Templator = {
    /**
     *  Usage:
     *      enzinak.Templator.fitIn('<a href="#[0]" title="[1]">[1]</a>', ['test1.html', 'Test1']);
     *  Result:
     *      <a href="#test1.html" title="Test1">Test1</a>
     **/
    fitIn: function(template, arglist) {
        var output = template;
        for (var i = 0; i < arglist.length; i++) {
            output = output.replace(new RegExp('\\[' + i + '\\]', 'g'), arglist[i]);
        }
        return output;
    },
    /**
     *  Usage:
     *      enzinak.Templator.fixIn('<a href="#[Link]" title="[Content]">[Content]</a>', { Link: 'test1.html', Content: 'Test1' });
     *  Result:
     *      <a href="#test1.html" title="Test1">Test1</a>
     **/
    fixIn: function(template, hashtable) {
        var tag, output = template;
        for (var key in hashtable) {
            tag = new RegExp("\\[" + key + "\\]", 'g')
            output = output.replace(tag, hashtable[key]);
        }
        return output;
    },
    /**
     *  Usage:
     *      enzinak.Templator.castAs('[firstname] [lastname]', ['firstname', 'lastname'], "<[0]>");
     *  Result:
     *      <firstname> <lastname>
     **/
    castAs: function(template, keylist, cast) {
        var tag, key, output = template;
        for (var i = 0; i < keylist.length; i++) {
            key = keylist[i];
            tag = new RegExp("\\[" + key + "\\]", 'g')
            output = output.replace(tag, this.fitIn(cast, [key]));
        }
        return output;
    }
};

enzinak.Communicator = function() {
    var requests = [],
        crossDomain = false;
    var call = function() {
        var package = requests.shift();
        //console.log('Communicator -> call: ', package);
        if (!!window.jQuery) {
            $.ajax({
                url: package.service,
                type: 'POST',
                dataType: (crossDomain) ? 'jsonp' : 'json',
                crossDomain: true,
                data: {
                    cmd: package.command,
                    pl: JSON.stringify(package.payload),
                    ak: package.authkey
                },
                success: function(response, textStatus, xOptions) {
                    //console.log("Communicator -> Success: ", response);
                    if (requests.length > 0) {
                        this.call();
                    }
                    package.success(response);
                },
                error: function onError(xOptions, textStatus, errorThrown) {
                    //console.log("Communicator -> Failed: ", xOptions, textStatus, errorThrown);
                    package.failure(xOptions, textStatus, errorThrown);
                }
            });
        } else {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', package.service, true);
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 400) {
                    if (requests.length > 0) {
                        this.call();
                    }
                    package.success(xhr.responseText);
                } else {
                    package.failure(xhr, xhr.statusText, xhr.responseText);
                }
            };
            xhr.onabort = function() {
                package.failure(xhr, xhr.statusText, xhr.responseText);
            };
            xhr.onerror = function() {
                package.failure(xhr, xhr.statusText, xhr.responseText);
            };
            xhr.ontimeout = function() {
                package.failure(xhr, xhr.statusText, xhr.responseText);
            };
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send({
                cmd: package.command,
                pl: JSON.stringify(package.payload),
                ak: package.authkey
            });
        }
    };
    this.request = function(package) {
        requests.push(package);
        if (requests.length == 1) {
            call();
        }
    };
    this.isCrossDomain = function(bool) {
        crossDomain = bool;
    };
};

enzinak.DatePattern = {
    culture: {
        en_US: '[M]/[D]/[Y]',
        fr_FR: '[D]/[M]/[Y]',
        ja_JP: '[Y]/[M]/[D]'
    },
    objectify: function(date) {
        var dateObj;
        if (typeof(date) != 'object') {
            var tarikh = date.split('-');
            dateObj = {
                Y: parseInt(tarikh[0]),
                M: parseInt(tarikh[1]),
                D: parseInt(tarikh[2])
            };
        } else {
            dateObj = date;
        }
        return dateObj;
    },
    format: function(pattern, date) {
        var dateObj = this.objectify(date);
        return enzinak.Templator.fixIn(pattern, dateObj);
    }
};

enzinak.HashMap = function(map) {
    var self = this,
        list;
    var _constructor = function(iMap) {
        //list = (map != undefined) ? ((typeof(map) == 'string') ? JSON.parse(map) : map) : {};
        list = (iMap != undefined) ? iMap : {};
    }(map);
    this.isEmpty = function() {
        return (Object.getOwnPropertyNames(list).length === 0);
    };
    this.heap = function() {
        return list;
    };
    this.add = function(key, value) {
        list[key] = value;
    };
    this.remove = function(key) {
        delete list[key];
    };
    this.fetch = function(key) {
        return list[key];
    };
    this.find = function(value) {
        for (var o in list) {
            if (list[o] == value) {
                return o;
            }
        }
        return null;
    };
    this.findAll = function(value) {
        var a = [];
        for (var o in list) {
            if (list[o] == value) {
                a.push(o);
            }
        }
        return (a.length > 0) ? a : null;
    };
};

enzinak.FormValidator = function() {
    var fields = [],
        fieldprefix = null,
        proceedOnError = null;
    var regexpPattern = {
        insensitive: {
            fullname: "^[a-z\\'\\.\\- ]+$",
            email: "^[_a-z0-9-\\+]+(\\.[_a-z0-9-]+)*@[a-z0-9-]+(\\.[a-z0-9]+)*(\\.[a-z]{2,})$",
            telephone: "^[\\+\\-\\#\\*\\(\\)\\.\\s]*([0-9][\\+\\-\\#\\*\\(\\)\\.\\s]*){7,15}$",
            alphanum: "^[\\w\\d]+$"
        }
    };
    var regexpModifier = {
        insensitive: 'i',
        global: 'g',
        multiline: 'm'
    };

    var _constructor = function() {}();
    var NotNull = function(value) {
        if (null === value || 'undefined' === typeof value)
            return false;
        return true;
    };
    var NotBlank = function(value) {
        if ('string' !== typeof value) {
            if ('object' === typeof value) {
                return true;
            }
            return false;
        } else if ('' === value.replace(/^\s+/g, '').replace(/\s+$/g, '')) {
            return false;
        }
        return true;
    };
    var Required = function(value) {
        return NotBlank(value);
    };
    var Alphanum = function(value) {
        var pattern = new RegExp(regexpPattern.insensitive.alphanum, regexpModifier.insensitive);
        return pattern.test(value);
    };
    var FullName = function(value) {
        var pattern = new RegExp(regexpPattern.insensitive.fullname, regexpModifier.insensitive);
        return pattern.test(value);
    };
    var Email = function(value) {
        var pattern = new RegExp(regexpPattern.insensitive.email, regexpModifier.insensitive);
        return pattern.test(value);
    };
    var Telephone = function(value) {
        var pattern = new RegExp(regexpPattern.insensitive.telephone, regexpModifier.insensitive);
        return pattern.test(value);
    };
    var MinLength = function(value, minlen) {
        return (value.length >= minlen);
    };
    var error = function(fieldname, bool, message) {
        if (proceedOnError != null) {
            proceedOnError(fieldname, bool, message);
        } else {
            var fieldwrapper = document.querySelectorAll('div#' + fieldprefix + fieldname + ' div.error');
            if (!bool) {
                enzinak.Drshya.show(fieldwrapper);
                fieldwrapper[0].innerHTML = message;
            } else {
                enzinak.Drshya.hide(fieldwrapper);
                fieldwrapper[0].innerHTML = '';
            }
        }
        return bool;
    };
    this.setErrorCallback = function(callback) {
        proceedOnError = callback;
    };
    this.setFields = function(list) {
        fields = list;
    };
    this.setFieldPrefix = function(prefix) {
        fieldprefix = prefix;
    };
    this.isValid = function(values) {
        var totalerrors = 0;
        for (i in fields) {
            var status = null,
                isrequired = false;
            for (j in fields[i]) {
                switch (j) {
                    case 'Required':
                        isrequired = true;
                        status = error(i, Required(values[i]), fields[i][j]);
                        break;
                    case 'FullName':
                        if (isrequired || NotBlank(values[i])) {
                            status = error(i, FullName(values[i]), fields[i][j]);
                        }
                        break;
                    case 'Alphanum':
                        if (isrequired || NotBlank(values[i])) {
                            status = error(i, Alphanum(values[i]), fields[i][j]);
                        }
                        break;
                    case 'Email':
                        if (isrequired || NotBlank(values[i])) {
                            status = error(i, Email(values[i]), fields[i][j]);
                        }
                        break;
                    case 'Telephone':
                        if (isrequired || NotBlank(values[i])) {
                            status = error(i, Telephone(values[i]), fields[i][j]);
                        }
                        break;
                    case 'MinLength':
                        if (isrequired || NotBlank(values[i])) {
                            status = error(i, MinLength(values[i], fields[i][j][0]), fields[i][j][1]);
                        }
                        break;
                }
                if (status !== null && !status) {
                    totalerrors++;
                    break;
                }
            }
        }
        return (totalerrors > 0) ? false : true;
    };
};

enzinak.UrlChurner = {
    // #!x&y=3 -> { x:null, y:3 }
    getHashBang: function(url) {
        url = url || window.location.href;
        var pos = url.indexOf('#!'),
            vars = {};
        if (pos >= 0) {
            var hashes = url.slice(pos + 2).split('&');
            for (var i = hashes.length; i--;) {
                var hash = hashes[i].split('=');
                vars[hash[0]] = hash.length > 1 ? hash[1] : null;
            }
        }
        return vars;
    },
    // ?x=&y=3 -> { x:undefined, y:3 }
    getParams: function(url, decode) {
        var s = url || window.location.search,
            t = s.match(/([^&?]*?=[^&?]*)/g),
            o = {};
        if (t != null) {
            for (var i = 0; i < t.length; i++) {
                var k = t[i].substring(0, t[i].indexOf('='));
                var v = t[i].substr(t[i].indexOf('=') + 1);
                o[k] = ((decode) ? decodeURIComponent(v) : v);
            }
        }
        return o;
    },
    getHostUrl: function() {
        var url = window.location.href;
        return url
            .replace(/\#.*/g, '')
            .replace(/\?.*/g, '');
    }
};

enzinak.Effect = {
    hide: function(elementRef) {
        elementRef.style.display = 'none';
    },
    show: function(elementRef) {
        elementRef.style.display = '';
    },
    fadeIn: function(elementRef) {
        elementRef.style.opacity = 0;

        var last = +new Date();
        var tick = function() {
            elementRef.style.opacity = +elementRef.style.opacity + (new Date() - last) / 400;
            last = +new Date();

            if (+elementRef.style.opacity < 1) {
                (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
            }
        };

        tick();
    }
};

enzinak.Extend = {
    _: function(out) {
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
            if (!arguments[i])
                continue;

            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key))
                    out[key] = arguments[i][key];
            }
        }

        return out;
    },
    deep: function(out) {
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
            var obj = arguments[i];

            if (!obj)
                continue;

            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object')
                        out[key] = deepExtend(out[key], obj[key]);
                    else
                        out[key] = obj[key];
                }
            }
        }

        return out;
    }
};

enzinak.Event = {
    on: function(elementRef, eventName, eventHandler) {
        if (!!elementRef.length && elementRef.length > 0) {
            for (var i = 0; i < elementRef.length; i++) {
                elementRef[i].addEventListener(eventName, eventHandler);
            }
        } else {
            elementRef.addEventListener(eventName, eventHandler);
        }
    },
    off: function(elementRef, eventName, eventHandler) {
        if (!!elementRef.length && elementRef.length > 0) {
            for (var i = 0; i < elementRef.length; i++) {
                elementRef[i].removeEventListener(eventName, eventHandler);
            }
        } else {
            elementRef.removeEventListener(eventName, eventHandler);
        }
    }
}

enzinak.Determine = {
    type: function(obj) {
        return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
    }
}

enzinak.Session = function(sessionId) {
    var SESSION;
    var _constructor = function(sid) {
        SESSION = sid;
    }(sessionId);
    this.clear = function(data) {
        localStorage.removeItem(SESSION);
    };
    this.store = function(data) {
        localStorage.setItem(SESSION, JSON.stringify(data));
    };
    this.retrieve = function() {
        if (localStorage.getItem(SESSION) !== null) {
            return JSON.parse(localStorage.getItem(SESSION));
        }
        return null;
    };
    this.admittance = function(proceed) {
        if (this.retrieve() !== null) {
            proceed();
        }
    };
};

enzinak.Storage = function(storageId) {
    var STORAGE,
        id;
    var _constructor = function(sid) {
        STORAGE = sid;
    }(storageId);
    this.setId = function(uid) {
        id = '_' + uid;
    };
    this.clear = function(data) {
        localStorage.removeItem(STORAGE + id);
    };
    this.store = function(data) {
        localStorage.setItem(STORAGE + id, JSON.stringify(data));
    };
    this.retrieve = function() {
        if (localStorage.getItem(STORAGE + id) !== null) {
            return JSON.parse(localStorage.getItem(STORAGE + id));
        }
        return null;
    };
    this.admittance = function(proceed) {
        if (this.retrieve() !== null) {
            proceed();
        }
    };
};

enzinak.Date = {
    locale: function(s) {
        var tz = new Date().getTimezoneOffset() * 60000;
        var cd = new Date(s.replace('T', ' ').replace('Z', ''));
        var ld = new Date(cd - tz);
        return ld;
    },
    monyear: function(s) {
        if (!/[a-zA-Z]{3}\s[0-9]{4}/.test(s)) {
            var t = this.locale(s);
            var d = t.toString().substr(4, 11).split(' ');
            return d[0] + ' ' + d[2];
        }
        return s;
    },
    short: function(s) {
        var t = this.locale(s);
        var d = t.toString().substr(4, 11).split(' ');
        return d[0] + ' ' + d[1] + ', ' + d[2];
    },
    long: function(s) {
        var t = this.locale(s);
        var d = t.toString().substr(4, 17).split(' ');
        return d[0] + ' ' + d[1] + ', ' + d[2] + ' ' + d[3];
    },
    sentence: function(s) {
        var t = this.locale(s);
        var d = t.toString().substr(4, 17).split(' ');
        return d[0] + ' ' + d[1] + ', ' + d[2] + ' at ' + d[3];
    },
    input: function(s) {
        var t = this.locale(s);
        var d = t.toISOString();
        return d.substring(0, d.indexOf('T'));
    },
    enUS: function(d) {
        return (d) ? enzinak.DatePattern.format(enzinak.DatePattern.culture.en_US, d) : d;
    }
};

String.prototype.autofit = function() {
    var formatted = this,
        list = arguments[0];
    for (var prop in list) {
        formatted = formatted.replace(new RegExp('\\[' + prop + '\\]', 'g'), list[prop]);
    }
    return formatted;
};

String.prototype.graft = function() {
    var formatted = this;
    for (var arg in arguments) {
        formatted = formatted.replace("[" + arg + "]", arguments[arg]);
    }
    return formatted;
};

Array.prototype.implant = function() {
    var pattern = (!!arguments[1]) ? new RegExp(arguments[1]) : /…/;
    return this.reduce(function(p, c) {
        return p.replace(pattern, c);
    }, arguments[0]);
};
