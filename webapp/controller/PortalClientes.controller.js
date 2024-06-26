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
                    
        onInit: function () { //al cargar la pagina setea los datos
            this._oModel = new ODataModel("/sap/opu/odata/sap/Z_PURCHASEORDER_SRV", true);
            this._oModel.setHeaders({
                "Accept":"application/pdf",
                "Content-Type": "application/pdf"
            })
            var that = this;
            this._oModel.read("/ZI_PurchaseOrder", {
                success: function(data, response) {
                    var jsonModel = new JSONModel();
                    that.getView().setModel(jsonModel);
                    that._jsonModel = jsonModel;
                                                                
                },
                error: function(oError) {
                }
            });
        },
        
        onSelectHome: function() { //nav list item home -> carga fragment detailHome
            this.getSplitAppObj().toDetail(this.createId("detailHome"));
        },
        
        onSelectOfertas: function() { //nav list item ofertas -> carga fragment detailOfertas y setea filters
            var that = this;
            //Inicializar los filtros de fecha
            var fechaHoy = new Date();
            var fechaF = this.formatFilterDate(fechaHoy);
            var fechaHasta = this.formatDateToISO(fechaHoy)

            var fechaDesde = fechaHoy;
            fechaDesde.setMonth(fechaHoy.getMonth() - 4);
            var fechaI = this.formatFilterDate(fechaDesde);
            fechaDesde = this.formatDateToISO(fechaDesde);
            
            that.byId("fechaDesdePickerOfertas").setValue(fechaI);
            that.byId("fechaHastaPickerOfertas").setValue(fechaF);
                
            this._oModel.read("/ZI_PurchaseOrder", {
                urlParameters: {
                    "$filter": "CreationDate ge datetime'"+ fechaDesde +"' and CreationDate le datetime'"+ fechaHasta +"'" 
                },
                success: function(dataPedidos, responsePedidos) {
                    that._jsonModel.setProperty("/ZI_PurchaseOrder", dataPedidos.results);
                    that.getView().setModel(that._jsonModel);                                             
                },
                error: function(oError) {
                }
            });   
            this.getSplitAppObj().toDetail(this.createId("detailOfertas"));
        },

        onSelectPedidos: function() {// nav list item pedidos -> carga fragment y filters
            var that = this;
            //Inicializar los filtros de fecha
            var fechaHoy = new Date();
            var fechaF = this.formatFilterDate(fechaHoy);
            var fechaHasta = this.formatDateToISO(fechaHoy)

            var fechaDesde = fechaHoy;
            fechaDesde.setMonth(fechaHoy.getMonth() - 4);
            var fechaI = this.formatFilterDate(fechaDesde);
            fechaDesde = this.formatDateToISO(fechaDesde);
            
            that.byId("fechaDesdePickerPedidos").setValue(fechaI);
            that.byId("fechaHastaPickerPedidos").setValue(fechaF);
            
            that._oModel.read("/ZI_PurchaseOrder", {
                urlParameters: {
                    "$filter": "CreationDate ge datetime'"+ fechaDesde +"' and CreationDate le datetime'"+ fechaHasta +"'",
                    "$expand": "to_PurchaseOrderItem"
                },
                success: function(dataPedidos, responsePedidos) {
                    that._jsonModel.setProperty("/ZI_PurchaseOrder", dataPedidos.results);
                    that.getView().setModel(that._jsonModel);                                             
                },
                error: function(oError) {
                }
            });
            
            this.getSplitAppObj().toDetail(this.createId("detailPedidos"));
        },

        onSelectEntregas: function() { //nav list item entregas -> carga fragment detailEntregas y setea filters
            var that = this;
            //Inicializar los filtros de fecha
            var fechaHoy = new Date();
            var fechaF = this.formatFilterDate(fechaHoy);
            var fechaHasta = this.formatDateToISO(fechaHoy)

            var fechaDesde = fechaHoy;
            fechaDesde.setMonth(fechaHoy.getMonth() - 4);
            var fechaI = this.formatFilterDate(fechaDesde);
            fechaDesde = this.formatDateToISO(fechaDesde);
            
            that.byId("fechaDesdePickerEntregas").setValue(fechaI);
            that.byId("fechaHastaPickerEntregas").setValue(fechaF);
               
            this._oModel.read("/ZI_PurchaseOrder", {
                urlParameters: {
                    "$filter": "CreationDate ge datetime'"+ fechaDesde +"' and CreationDate le datetime'"+ fechaHasta +"'"
                },
                success: function(dataPedidos, responsePedidos) {
                    that._jsonModel.setProperty("/ZI_PurchaseOrder",dataPedidos.results);
                    that.getView().setModel(that._jsonModel);                                              
                },
                error: function(oError) {
                }
            });      
            this.getSplitAppObj().toDetail(this.createId("detailEntregas"));
        },

        onSelectFacturas: function() {// nav list item facturas -> carga fragment y filters
            var that = this;
            //Inicializar los filtros de fecha
            var fechaHoy = new Date();
            var fechaF = this.formatFilterDate(fechaHoy);
            var fechaHasta = this.formatDateToISO(fechaHoy)

            var fechaDesde = fechaHoy;
            fechaDesde.setMonth(fechaHoy.getMonth() - 4);
            var fechaI = this.formatFilterDate(fechaDesde);
            fechaDesde = this.formatDateToISO(fechaDesde);
            
            that.byId("fechaDesdePickerFacturas").setValue(fechaI);
            that.byId("fechaHastaPickerFacturas").setValue(fechaF);
               
            this._oModel.read("/ZI_PurchaseOrder", {
                urlParameters: {
                    "$filter": "CreationDate ge datetime'"+ fechaDesde +"' and CreationDate le datetime'"+ fechaHasta +"'"
                },
                success: function(dataPedidos, responsePedidos) {
                    that._jsonModel.setProperty("/ZI_PurchaseOrder",dataPedidos.results);
                    that.getView().setModel(that._jsonModel);                                              
                },
                error: function(oError) {
                }
            });    
            this.getSplitAppObj().toDetail(this.createId("detailFacturas"));
        },

        handleLinkPedido: function(evt) { //link pedido -> detail pedido
            var linkPedido = evt.getSource();
            var numPedido = linkPedido.getText();
            var that = this;

            this._oModel.read("/ZI_PurchaseOrder('" + numPedido +"')/to_PurchaseOrderItem", {
                urlParameters: {
                    "sap-lang":'S'
                },
                success: function(data, response) {
                    that._jsonModel.setProperty("/PedidoSeleccionado",data.results[0]);
                    that.getView().setModel(that._jsonModel);                        
                },
                error: function(oError) {
                }
            });

            this.getSplitAppObj().toDetail(this.createId("detailPedidoDET"));
        },

        handleLinkOferta: function(evt) {// link oferta -> detail oferta
            var linkPedido = evt.getSource();
            var numPedido = linkPedido.getText();
            var that = this;

            this._oModel.read("/ZI_PurchaseOrder('" + numPedido +"')/to_PurchaseOrderItem", {
                urlParameters: {
                    "sap-lang":'S'
                },
                success: function(data, response) {
                    that._jsonModel.setProperty("/OfertaSeleccionada",data.results[0]);
                    that.getView().setModel(that._jsonModel);                        
                },
                error: function(oError) {
                }
            });

            this.getSplitAppObj().toDetail(this.createId("detailOfertaDET"));

        },

        onFilterOfertas: function() { // boton buscar -> aplica filtros
            var that = this;    

            //Obtiene filtros de fecha
            var fechaDesde = this.byId("fechaDesdePickerOfertas").getValue();
            var fechaHasta = this.byId("fechaHastaPickerOfertas").getValue();

            var pedido = this.byId("inputOfertas").getValue();
            var pedidoFiltro= "";
            if (pedido)
                pedidoFiltro = " and PurchaseOrder eq '"+ pedido +"'";
            
            fechaHasta = this.formatNewDateToISO(fechaHasta)
            fechaDesde = this.formatNewDateToISO(fechaDesde);

            this._oModel.read("/ZI_PurchaseOrder", {
                urlParameters: {
                    "$filter": "CreationDate ge datetime'"+ fechaDesde +"' and CreationDate le datetime'"+ fechaHasta +"'" + pedidoFiltro
                },
                success: function(dataPedidos, responsePedidos) {
                    that._jsonModel.setProperty("/ZI_PurchaseOrder",dataPedidos.results);
                    that.getView().setModel(that._jsonModel);                                             
                },
                error: function(oError) {
                }
            });   
            this.getSplitAppObj().toDetail(this.createId("detailOfertas"));
        },

        onFilterPedidos: function() { //boton buscar -> aplica filtros pedido

            var that = this;    

            //Obtiene filtros de fecha
            var fechaDesde = this.byId("fechaDesdePickerPedidos").getValue();
            var fechaHasta = this.byId("fechaHastaPickerPedidos").getValue();
            var pedido = this.byId("inputPedido").getValue();
            var pedidoFiltro= "";
            if (pedido)
                pedidoFiltro = " and PurchaseOrder eq '"+ pedido +"'";
            
            fechaHasta = this.formatNewDateToISO(fechaHasta)
            fechaDesde = this.formatNewDateToISO(fechaDesde);
            this._oModel.read("/ZI_PurchaseOrder", {
                urlParameters: {
                    "$filter": "CreationDate ge datetime'"+ fechaDesde +"' and CreationDate le datetime'"+ fechaHasta +"'" + pedidoFiltro
                },
                success: function(dataPedidos, responsePedidos) {
                    that._jsonModel.setProperty("/ZI_PurchaseOrder",dataPedidos.results);
                    that.getView().setModel(that._jsonModel);                                             
                },
                error: function(oError) {
                }
            });   
            this.getSplitAppObj().toDetail(this.createId("detailPedidos"));
        },

        onFilterFacturas: function() { //boton buscar -> aplica filtros pedido

            var that = this;    

            //Obtiene filtros de fecha
            var fechaDesde = this.byId("fechaDesdePickerFacturas").getValue();
            var fechaHasta = this.byId("fechaHastaPickerFacturas").getValue();
            var factura = this.byId("inputFactura").getValue();
            var facturaFiltro= "";
            if (factura)
                facturaFiltro = " and PurchaseOrder eq '"+ factura +"'";
            
            fechaHasta = this.formatNewDateToISO(fechaHasta)
            fechaDesde = this.formatNewDateToISO(fechaDesde);
            this._oModel.read("/ZI_PurchaseOrder", {
                urlParameters: {
                    "$filter": "CreationDate ge datetime'"+ fechaDesde +"' and CreationDate le datetime'"+ fechaHasta +"'" + facturaFiltro
                },
                success: function(dataFacturas, responsefacturas) {
                    that._jsonModel.setProperty("/ZI_PurchaseOrder",dataFacturas.results);
                    that.getView().setModel(that._jsonModel);                                             
                },
                error: function(oError) {
                }
            });   
            this.getSplitAppObj().toDetail(this.createId("detailFacturas"));
        },
        
        onFilterEntregas: function() { //boton buscar -> aplica filtros pedido

            var that = this;    

            //Obtiene filtros de fecha
            var fechaDesde = this.byId("fechaDesdePickerEntregas").getValue();
            var fechaHasta = this.byId("fechaHastaPickerEntregas").getValue();
            var factura = this.byId("inputFactura").getValue();
            var facturaFiltro= "";
            if (factura)
                facturaFiltro = " and PurchaseOrder eq '"+ factura +"'";
            
            fechaHasta = this.formatNewDateToISO(fechaHasta)
            fechaDesde = this.formatNewDateToISO(fechaDesde);
            this._oModel.read("/ZI_PurchaseOrder", {
                urlParameters: {
                    "$filter": "CreationDate ge datetime'"+ fechaDesde +"' and CreationDate le datetime'"+ fechaHasta +"'" + facturaFiltro
                },
                success: function(dataEntregas, responseEntregas) {
                    that._jsonModel.setProperty("/ZI_PurchaseOrder",dataEntregas.results);
                    that.getView().setModel(that._jsonModel);                                             
                },
                error: function(oError) {
                }
            });   
            this.getSplitAppObj().toDetail(this.createId("detailEntregas"));
        },

        getSplitAppObj: function () { // nav function
            var result = this.byId("SplitContDemo");
            if (!result) {
                Log.info("SplitApp object can't be found");
            }
            return result;
        },
        formatFilterDate : function (date) { //format date filters
            if (!date) {
                return "";
            }
            var date = new Date(date);
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            if (day < 10) {
                day = '0' + day;
            }
            if (month < 10) {
                month = '0' + month;
            }
            var formattedDate = day + '/' + month + '/' + year;
            return formattedDate; 
        },
        formatDateToISO: function(dateString) {
            // Crear un objeto Date a partir del string
            var date = new Date(dateString);
        
            // Obtener componentes de la fecha
            var year = date.getFullYear();
            var month = ("0" + (date.getMonth() + 1)).slice(-2);
            var day = ("0" + date.getDate()).slice(-2);
            var hours = ("0" + date.getHours()).slice(-2);
            var minutes = ("0" + date.getMinutes()).slice(-2);
            var seconds = ("0" + date.getSeconds()).slice(-2);
        
            // Formatear en ISO 8601
            var formattedDate = year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds;
        
            return formattedDate;
        },
        formatNewDateToISO: function(dateString) {
            var parts = dateString.split('/');
            var date = new Date(parts[2], parts[1] - 1, parts[0]);
            
            var isoDateString = date.toISOString();
            return isoDateString.slice(0, 19);
        }

    });
});