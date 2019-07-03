var Service, Characteristic;
var rpio = require('request');

module.exports = function(homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory("homebridge-treta-plugin", "TretaPlugin", TretaAccessory);
}

function TretaAccessory(log, config) {
	this.log = log;
	this.name = config["name"] || "Treta Home";
	this.url = config["url"];
}

TretaAccessory.prototype.getOn = function(callback) {
	this.log("Input PIN:%d is %d", this.pin, this.buttonState);
	this.log("Funcionando");
	callback(null, this.buttonState);
}

TretaAccessory.prototype.setOn = function(on, callback) {
	this.log("Output PIN:%d to %d", this.outpin, on);
	this.log("Baixou PORRA");
	callback(null);
}

TretaAccessory.prototype.heaterState = function(on,callback) {
	this.log("State: "+on);
	callback();
}


TretaAccessory.prototype.getServices = function() {
	var heaterCoolerService = new Service.HeaterCooler(this.name);
	
	heaterCoolerService.getCharacteristic(Characteristic.On)
		.on('set', this.heaterState.bind(this));
            
	
	heaterCoolerService.addCharacteristic(Characteristic.CoolingThresholdTemperature)
	.setProps({
                maxValue: 25,
                minValue: 17,
                minStep: 1
            })
	.on('get', this.getOn.bind(this))
	.on('set', this.setOn.bind(this))
	.updateValue(this.targetTemperature);
	
	//heterCooler.getCharacteristic(Characteristic.On)
	//	.on('get', this.getOn.bind(this))
	//	.on('set', this.setOn.bind(this));
	
	//this.CoolingThresholdTemperature = this.acService.addCharacteristic(Characteristic.CoolingThresholdTemperature)
	
	var serviceInfo = new Service.AccessoryInformation();
	serviceInfo
		.setCharacteristic(Characteristic.Manufacturer, 'Treta`s Enterprise')
		.setCharacteristic(Characteristic.Model, 'Treta`s House')
		.setCharacteristic(Characteristic.SerialNumber, "Treta`s Product");
	

	return [heaterCoolerService,serviceInfo];
}
