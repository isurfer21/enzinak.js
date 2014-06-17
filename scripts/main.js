document.addEventListener('DOMContentLoaded', function() {
    console.log('main -> initialized'); 
    var oViewStack = new enzinak.ViewStack();
    oViewStack.setContainer('sections');
    oViewStack.setProceedOnUnload(function(e) {
        console.log('setProceedOnUnload', e.detail);
    });
    oViewStack.setProceedOnLoad(function(e) {
        console.log('setProceedOnLoad', e.detail);
    });
    oViewStack.initialize();
    oViewStack.activate('contact');
    oViewStack.activate('home');
});