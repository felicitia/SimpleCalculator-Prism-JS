// this sets the background color of the master UIView (when there are no windows/tab groups on it)
//Titanium.API.info(Ti.Platform.osname);

//include PRISM-JS
Ti.include("PRISM/prism.js");
Ti.include("PRISM/PrismConstants.js");
Ti.include("PRISM/event.js");
Ti.include("PRISM/WorkerThreads.js");
Ti.include("PRISM/scaffold.js");
Ti.include("PRISM/component.js");
Ti.include("PRISM/connector.js");
Ti.include("PRISM/abstractImplementation.js");
Ti.include("PRISM/scheduler.js");
Ti.include("PRISM/roundRobinDispatcher.js");
Ti.include("PRISM/FIFOScheduler.js");
Ti.include("PRISM/port.js");
Ti.include("PRISM/architecture.js");

//define components
GUI = function() {
	prism.core.abstractImplementation.call(this);
}
GUI.prototype = Object.create(prism.core.abstractImplementation.prototype);
GUI.prototype.constructor = GUI;

Calculation = function() {
	prism.core.abstractImplementation.call(this);
}
Calculation.prototype = Object.create(prism.core.abstractImplementation.prototype);
Calculation.prototype.constructor = Calculation;

GUI.prototype.sendMessage = function(operation, op1, op2) {
	var event = new prism.core.event("Message");
	Titanium.API.info("sending the message from GUI side");
	Titanium.API.info("operation: " + operation);
	Titanium.API.info("op1: " + op1);
	Titanium.API.info("op2: " + op2);
	event.addParameter("op", operation);
	event.addParameter("op1", op1);
	event.addParameter("op2", op2);
	event.eventType = prism.core.prismConstants.REQUEST;
	this.send(event);
};

Calculation.prototype.handle = function(event) {
	Titanium.API.info("Calculation handle");
	var op = event.getParameter('op');
	var op1 = event.getParameter('op1');
	var op2 = event.getParameter('op2');
	if (op == 'add') {
		Titanium.API.info(op);
		textField3.setValue(op1 + op2);
	} else if (op == 'sub') {
		Titanium.API.info(op);
		textField3.setValue(op1 - op2);
	} else {
		Titanium.API.info("op invalid :(");
	}

};

//initialize the architecture
var scf = new prism.core.scaffold();
var fifo = new prism.core.FIFOScheduler(100);
var roundRobin = new prism.core.roundRobinDispatcher(fifo, 2);
scf.dispatcher = roundRobin;
scf.scheduler = fifo;

var arch = new prism.core.architecture("calculator");
arch.scaffold = scf;

var calculationBehavior = new Calculation();
var calComp = new prism.core.component("calculation", calculationBehavior);
calComp.scaffold = scf;

var guiBehavoir = new GUI();
var guiComp = new prism.core.component("gui", guiBehavoir);
guiComp.scaffold = scf;

arch.add(calComp);
arch.add(guiComp);

//add ports
var guiRequestPort = new prism.core.port("GUI request Port", prism.core.prismConstants.REQUEST);
guiComp.addCompPort(guiRequestPort);

var calReplyPort = new prism.core.port("Calculation Reply Port", prism.core.prismConstants.REPLY);
calComp.addCompPort(calReplyPort);

arch.weld(guiRequestPort, calReplyPort);

roundRobin.start();
arch.start();

//create the UI and events
Titanium.UI.setBackgroundColor('#000');

var win = Titanium.UI.createWindow({
	title : 'calculator',
	backgroundColor : '#fff'
});

var textField1 = Ti.UI.createTextField({
	borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	keyboardType : Titanium.UI.KEYBOARD_DECIMAL_PAD,
	hintText : 'first number',
	color : '#336699',
	top : 50,
	left : 10,
	width : 250,
	height : 60
});

var textField2 = Ti.UI.createTextField({
	borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	keyboardType : Titanium.UI.KEYBOARD_DECIMAL_PAD,
	hintText : 'second number',
	color : '#336699',
	top : 150,
	left : 10,
	width : 250,
	height : 60
});

var textField3 = Ti.UI.createTextField({
	borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	hintText : 'result',
	color : '#336699',
	top : 250,
	left : 10,
	width : 250,
	height : 60
});
var addbtn = Titanium.UI.createButton({
	title : 'add',
	top : 350,
	width : 100,
	height : 50
});
addbtn.addEventListener('click', function(e) {
	guiBehavoir.sendMessage('add', parseFloat(textField1.getValue()), parseFloat(textField2.getValue()));
	//	textField3.setValue(parseFloat(textField1.getValue()) + parseFloat(textField2.getValue()));
});

var subtractbtn = Titanium.UI.createButton({
	title : 'subtract',
	top : 450,
	width : 100,
	height : 50
});
subtractbtn.addEventListener('click', function(e) {
	guiBehavoir.sendMessage('sub', parseFloat(textField1.getValue()), parseFloat(textField2.getValue()));
	//	textField3.setValue(parseFloat(textField1.getValue()) - parseFloat(textField2.getValue()));
});

win.add(textField1);
win.add(textField2);
win.add(textField3);
win.add(addbtn);
win.add(subtractbtn);

win.open();
