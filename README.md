# enzinak.js

View-stack based micro-framework in JavaScript that can reduce the development time of the project.

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
The view-stack concept which is similar to [jQuery Mobile](https://jquerymobile.com/) can easily handle the screen transitions.
