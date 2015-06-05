'use strict';

// Famous dependencies
var DOMElement = require('famous/dom-renderables/DOMElement');
var FamousEngine = require('famous/core/FamousEngine');
var Transitionable = require('famous/transitions/Transitionable');
var Node = require('famous/core/Node');
// Boilerplate code to make your life easier
FamousEngine.init();

var scene = FamousEngine.createScene();
// Initialize with a scene; then, add a 'node' to the scene root
var logo = scene.addChild();

// Create an [image] DOM element providing the logo 'node' with the 'src' path
new DOMElement(logo, { tagName: 'div' })
    .setContent('<h1>axe</h1>');

// Chainable API
logo
    // Set size mode to 'absolute' to use absolute pixel values: (width 250px, height 250px)
    .setSizeMode('absolute', 'absolute', 'absolute')
    .setPosition(0, 200)
    .setAbsoluteSize(250, 250)
    // Center the 'node' to the parent (the screen, in this instance)
    //.setAlign(0, 0.5)
    // Set the translational origin to the center of the 'node'
    .setMountPoint(0.5, 0.5)
    // Set the rotational origin to the center of the 'node'
    .setOrigin(0.5, 0.5);
//var Align = require('famous/components/Align');
//var alignComponent = new Align(logo);
//
//// move node to center over 1000ms period
//alignComponent.set(0.5, 0.5, 0, {duration:2000});

// Add a spinner component to the logo 'node' that is called, every frame
var spinner = logo.addComponent({
    onUpdate: function(time) {
        logo.setRotation(time / 1000, 0, 0);
        logo.requestUpdateOnNextTick(spinner);
    }
});

logo.onReceive = function(type, ev){
    if (type === 'click') {
        animation.start();
    }
    // Equivalent to Node.prototype.receive.call(this, type, ev);
    // Used in order to allow potential components to receive the event.
    this.receive(type, ev);
};

logo.addUIEvent('click');

// Let the magic begin...
logo.requestUpdate(spinner);


// A component that will animate a node's position in x.
function Animation (node) {
    // store a reference to the node
    this.node = node;
    // get an id from the node so that we can update
    this.id = node.addComponent(this);
    // create a new transitionable to drive the animation
    this.xPosition = new Transitionable(100);
}

Animation.prototype.start = function start () {
    // request an update to start the animation
    this.node.requestUpdate(this.id);
    // begin driving the animation
    this.xPosition.from(1800).to(1000, 'outElastic', 10000);
};

Animation.prototype.onUpdate = function (){
    // while the transitionable is still transitioning
    // keep requesting updates
    if (this.xPosition.isActive()) {
        // set the position of the component's node
        // every frame to the value of the transitionable
        this.node.setPosition(this.xPosition.get());
        this.node.requestUpdateOnNextTick(this.id);
    }
};

var animation = new Animation(logo);
window.animation = animation;

//animation.start();
