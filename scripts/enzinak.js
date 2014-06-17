/** 
 * @author Abhishek Kumar
 * @license This work is licensed under a Creative Commons Attribution 4.0 International License.
**/

var enzinak = {};

enzinak.Drshya = function () {
    this.hide = function (ref) {
        ref.classList.add('hide');
    };
    this.show = function (ref) {
        ref.classList.remove('hide');
    };
};

enzinak.VrttAnta = function () {
    this.getEvent = function (evento, payload) {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent(evento, true, true, payload);
        return event;
    };
};

enzinak.ViewStack = function () {
    var container,
        proceedOnUnload,
        proceedOnLoad,
        activeId,
        oDrshya,
        oVrttAnta;

    var _constructor = function () {
        oDrshya = new enzinak.Drshya();
        oVrttAnta = new enzinak.VrttAnta();
    }();
    var deactivateAll = function () {
        for (var i = 0, len = container.childElementCount; i < len; i++) {
            oDrshya.hide(container.children[i]);
        }
    };
    var onUnload = function (e) {
        if(proceedOnUnload != undefined) {
            proceedOnUnload(e);
        }
    };
    var onLoad = function (e) {
        if(proceedOnLoad != undefined) {
            proceedOnLoad(e);
        }
    };

    this.setContainer = function (id) {
        container = document.getElementById(id);
    };
    this.setProceedOnUnload = function (method) {
        proceedOnUnload = method;
    };
    this.setProceedOnLoad = function (method) {
        proceedOnLoad = method;
    };
    this.initialize = function () {
        container.addEventListener('sectionunload', onUnload);
        container.addEventListener('sectionload', onLoad);
    };
    this.destroy = function () {
        container.removeEventListener('sectionunload', onUnload);
        container.removeEventListener('sectionload', onLoad);
    };
    this.activate = function (id) {
        container.dispatchEvent(oVrttAnta.getEvent('sectionunload', activeId));
        deactivateAll();
        activeId = id;
        oDrshya.show(container.children[activeId]);
        container.dispatchEvent(oVrttAnta.getEvent('sectionload', activeId));
    };
};