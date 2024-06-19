/*global QUnit*/

sap.ui.define([
	"portalclientes/controller/PortalClientes.controller"
], function (Controller) {
	"use strict";

	QUnit.module("PortalClientes Controller");

	QUnit.test("I should test the PortalClientes controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
