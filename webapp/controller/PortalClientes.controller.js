sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/odata/v2/ODataModel',
    'sap/ui/model/json/JSONModel',
    '../model/formatter',
    'sap/ui/export/library',
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ODataModel, JSONModel,formatter, exportLibrary, MessageToast) {
        "use strict";
        var EdmType = exportLibrary.EdmType;

        return Controller.extend("com.migracion.portalproveedores.controller.PortalClientes", {

            formatter:formatter,
                        
            onInit: function () { 
              				       
            },
            
            onSelectHome: function() {
                this.getSplitAppObj().toDetail(this.createId("detailHome"));
            },
            
            onSelectOferta: function() {
                this.getSplitAppObj().toDetail(this.createId("detailOferta"));   
            },

            onSelectPedidos: function() {
                this.getSplitAppObj().toDetail(this.createId("detailPedidos"));    
            },

            onSelectOfertaDET: function() {
                this.getSplitAppObj().toDetail(this.createId("detailOfertaDET"));
                
            },

            onSelectPedidosDET: function() {
                this.getSplitAppObj().toDetail(this.createId("detailPedidosDET"));
            },

            handleLinkPedido: function(evt) {
                var linkPedido = evt.getSource();
                var numPedido = linkPedido.getText();

                this.getSplitAppObj().toDetail(this.createId("detailPedidosDET"));

            },

            handleLinkOferta: function(evt) {
                var linkPedido = evt.getSource();
                var numPedido = linkPedido.getText();
                
                //numPedido = '4500000252'

                this.getSplitAppObj().toDetail(this.createId("detailOfertaDET"));

            },

            getSplitAppObj: function () {
                var result = this.byId("SplitContDemo");
                if (!result) {
                    Log.info("SplitApp object can't be found");
                }
                return result;
            },

            formatFilterDate : function (date) {
                var dia = date.getDate().toString().padStart(2, '0');
                var mes = date.getMonth() + 1;
                mes = mes.toString().padStart(2, '0');
                var valorFechaHasta = date.getFullYear() + mes + dia;
                return (valorFechaHasta)
            }

        });
    });
