# enzinak.js

View-stack based micro-framework with built-in utility library in JavaScript that can reduce the development time of the project.

### Usage
You can define the various screens as `section` tags in the *index.html* file
```
<div id="sections">
    <section id="home"><b>home</b></section>
    <section id="about"><b>about</b></section>
    <section id="contact"><b>contact</b></section>
</div>
```
While in your *main.js* file, you can define a logic to load particular screens
```
oViewStack.initialize();
oViewStack.activate('contact');
oViewStack.activate('home');
```
To learn more about it, dive into *main.js* which describes the way to make your webapp using view-controller design pattern.

The view-stack concept is inspired from [jQuery Mobile](https://jquerymobile.com/). So with this libary, you can make multiple display areas each with their separate views & controllers which can easily handle the screen transitions.

This framework has potential to create very basic to extremely large application without cultering your code base. We ourself have used this framework in more than dozens of projects that evolved it to the current level and is still going strong. The philosophy followed in this, is divide & rule. So you need to think about the display areas of your application, then divide those areas into various portions and apply the view-controller logic over it. That's it!

Since the project begin in 2014, so all the classes have been made in JS5. So for ES6 or ESnext upgrade keep a watch.
