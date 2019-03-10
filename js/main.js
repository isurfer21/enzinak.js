var app = function() {

    var common = {
        handleAnchor: function(e) {
            e.preventDefault();
            var element = e.currentTarget;
            var url = element.getAttribute('href');
            if (url == '#') {
                common.changeView(element);
            } else {
                window.location.href = url;
            }
        }, 
        changeView: function (el) {
            var link = el.getAttribute('data-link');
            if (link != undefined && link != '') {
                var list = link.split('/');
                GlobalDisplays.getInstance().module(list[0]).activate(list[1]);
            }
        }
    };

    var modules = {
        Home: z.Singleton(function() {
            var uid = 'home',
                containers = {},
                controls = {};
            var _constructor = function() {}();

            controls.anchor = common.handleAnchor.bind(this);

            this.destroy = function() {
                console.log('modules.Home.destroy');
                z.Event.off(containers.anchor, 'click', controls.anchor);
            };
            this.initialize = function() {
                console.log('modules.Home.initialize');
                containers.self = document.getElementById(uid);

                containers.anchor = containers.self.querySelectorAll('a[href="#"]');
                z.Event.on(containers.anchor, 'click', controls.anchor);
            };
        }),
        About: z.Singleton(function() {
            var uid = 'about',
                containers = {},
                controls = {};
            var _constructor = function() {}();

            controls.anchor = common.handleAnchor.bind(this);

            this.destroy = function() {
                console.log('modules.About.destroy');
                z.Event.off(containers.anchor, 'click', controls.anchor);
            };
            this.initialize = function() {
                console.log('modules.About.initialize');
                containers.self = document.getElementById(uid);

                containers.anchor = containers.self.querySelectorAll('a[href="#"]');
                z.Event.on(containers.anchor, 'click', controls.anchor);
            };
        }),
        Contact: z.Singleton(function() {
            var uid = 'contact',
                containers = {},
                controls = {};
            var _constructor = function() {}();

            controls.anchor = common.handleAnchor.bind(this);

            this.destroy = function() {
                console.log('modules.Contact.destroy');
                z.Event.off(containers.anchor, 'click', controls.anchor);
            };
            this.initialize = function() {
                console.log('modules.Contact.initialize');
                containers.self = document.getElementById(uid);

                containers.anchor = containers.self.querySelectorAll('a[href="#"]');
                z.Event.on(containers.anchor, 'click', controls.anchor);
            };
        })
    };

    console.log('main -> initialized');

    var Communicator = z.Singleton(z.Communicator);

    ViewToProceed = {
        instance: null,
        onUnload: function(e) {
            console.log('ViewToProceed.onUnload', e.detail);
            if (e.detail != undefined) {
                ViewToProceed.instance.module(e.detail).destroy();
            }
        },
        onLoad: function(e) {
            console.log('ViewToProceed.onLoad', e.detail);
            if (e.detail != undefined) {
                ViewToProceed.instance.module(e.detail).initialize();
            }
        }
    };

    var panels = {
        main: {
            Controllers: z.Singleton(z.Collection),
            Views: z.Singleton(z.ViewStack),
            initialize: function() {
                controllers = panels.main.Controllers.getInstance();
                controllers.initialize();
                controllers.register('home', modules.Home.getInstance());
                controllers.register('about', modules.About.getInstance());
                controllers.register('contact', modules.Contact.getInstance());

                ViewToProceed.instance = controllers;
                
                views = panels.main.Views.getInstance();
                views.setContainer('sections');
                views.setProceedOnUnload(ViewToProceed.onUnload);
                views.setProceedOnLoad(ViewToProceed.onLoad);
                views.initialize();

                views.activate('home');
            }
        }
    };
    
    var GlobalDisplays = z.Singleton(z.Collection);
    var globalDisplays = GlobalDisplays.getInstance();
    globalDisplays.initialize();
    globalDisplays.register('main', panels.main.Views.getInstance());

    panels.main.initialize();

}

z.Dom.whenReady(app);