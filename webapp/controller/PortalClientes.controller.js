sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/odata/v2/ODataModel',
    'sap/ui/model/json/JSONModel',
    '../model/formatter',
    'sap/ui/export/library',
    "sap/m/MessageToast",
    'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator'
],
/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller
 */
function (Controller, ODataModel, JSONModel,formatter, exportLibrary, MessageToast, Filter, FilterOperator) {
    "use strict";
    var EdmType = exportLibrary.EdmType;

    return Controller.extend("com.migracion.portalproveedores.controller.PortalClientes", {

        formatter:formatter,
                    
        onInit: function () { //al cargar la pagina setea los datos
            this._oModel = new ODataModel("/sap/opu/odata/sap/ZI_SALESORDER_CDS", true);
            this._oModel.setHeaders({
                "Accept":"application/pdf",
                "Content-Type": "application/pdf"
            })
            this._oModel2 = new ODataModel("/sap/opu/odata/sap/ZI_SALESQUOTATION_CDS", true);
            this._oModel2.setHeaders({
                "Accept":"application/pdf",
                "Content-Type": "application/pdf"
            })
            this._oModel3 = new ODataModel("/sap/opu/odata/sap/ZI_OUTBOUNDDELIVERYITEM_CDS", true);
            this._oModel3.setHeaders({
                "Accept":"application/pdf",
                "Content-Type": "application/pdf"
            })
            this._oModel4 = new ODataModel("/sap/opu/odata/sap/ZI_BILLINGDOCUMENT_CDS", true);
            this._oModel4.setHeaders({
                "Accept":"application/pdf",
                "Content-Type": "application/pdf"
            })
            
            var that = this;
            this._oModel.read("/I_SalesOrder", {
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
                
            this._oModel2.read("/ZI_SalesQuotation", {
                urlParameters: {
                    "$filter": "CreationDate ge datetime'"+ fechaDesde +"' and CreationDate le datetime'"+ fechaHasta +"'"
                },
                success: function(dataPedidos, responsePedidos) {
                    that._jsonModel.setProperty("/Ofertas", dataPedidos.results);
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
            
            that._oModel.read("/I_SalesOrder", {
                urlParameters: {
                    "$filter": "CreationDate ge datetime'"+ fechaDesde +"' and CreationDate le datetime'"+ fechaHasta +"'"
                },
                success: function(dataPedidos, responsePedidos) {
                    that._jsonModel.setProperty("/I_SalesOrder", dataPedidos.results);
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
               
            this._oModel3.read("/ZI_OutboundDeliveryItem", {
                urlParameters: {
                    "$filter": "CreationDate ge datetime'"+ fechaDesde +"' and CreationDate le datetime'"+ fechaHasta +"'"
                },
                success: function(data, response) {
                    that._jsonModel.setProperty("/ZI_OutboundDeliveryItem",data.results);
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
               
            this._oModel4.read("/ZI_BillingDocument", {
                urlParameters: {
                    "$filter": "CreationDate ge datetime'"+ fechaDesde +"' and CreationDate le datetime'"+ fechaHasta +"'"
                },
                success: function(data, response) {
                    that._jsonModel.setProperty("/ZI_BillingDocument",data.results);
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

            this._oModel.read("/Z_SALESORDERITEM", {
                urlParameters: {
                    "$filter": "SalesOrder eq '" + numPedido + "'"
                    //"sap-lang":'S'
                },
                success: function(data, response) {
                    that._jsonModel.setProperty("/PedidoSeleccionado",data.results[0]);
                    console.log(that._jsonModel.getProperty("/PedidoSeleccionado"));
                    that.getView().setModel(that._jsonModel);                        
                },
                error: function(oError) {
                }
            });

            this.getSplitAppObj().toDetail(this.createId("detailPedidoDET"));
        },

        handleLinkOferta: function(evt) {// link oferta -> detail oferta
            var linkOferta = evt.getSource();
            var numOferta = linkOferta.getText();
            var that = this;

            this._oModel2.read("/ZI_SalesQuotationItem", {
                urlParameters: {
                    "$filter": "SalesQuotation eq '" + numOferta + "'",
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

            var fechaDesde = this.byId("fechaDesdePickerOfertas").getValue();
            var fechaHasta = this.byId("fechaHastaPickerOfertas").getValue();

            var pedido = this.byId("inputOfertas").getValue();
            var pedidoFiltro= "";
            if (pedido)
                pedidoFiltro = " and SalesQuotation eq '"+ pedido +"'";
            
            fechaHasta = this.formatNewDateToISO(fechaHasta)
            fechaDesde = this.formatNewDateToISO(fechaDesde);

            this._oModel2.read("/ZI_SalesQuotation", {
                urlParameters: {
                    "$filter": "CreationDate ge datetime'"+ fechaDesde +"' and CreationDate le datetime'"+ fechaHasta +"'" + pedidoFiltro
                },
                success: function(dataPedidos, responsePedidos) {
                    that._jsonModel.setProperty("/Ofertas",dataPedidos.results);
                    that.getView().setModel(that._jsonModel);                                             
                },
                error: function(oError) {
                }
            });   
            this.getSplitAppObj().toDetail(this.createId("detailOfertas"));
        },onSearchOfertas: function() {
            //Inicio los filtros vacios
            var tableFilters = [];
            
            var inputPedido = this.byId("inputSearchOfertas");
            var valuePedido = inputPedido.getValue();
            var busquedaPedido = inputPedido.getValue()
            
            //Para cualquier campo, pregunto si contiene el string
            var totalFilter = new Filter({
                filters: [                      
                    new Filter({
                        path: "PurchaseOrder",
                        operator: FilterOperator.Contains,
                        value1: busquedaPedido
                    }),
                    new Filter({
                        path: "CreationDate",
                        operator: FilterOperator.EQ,
                        value1: busquedaPedido
                    }), 
                    new Filter({
                        path: "CompanyCode",
                        operator: FilterOperator.Contains,
                        value1: busquedaPedido
                    }), 
                    new Filter({
                        path: "PurchaseOrderType",
                        operator: FilterOperator.Contains,
                        value1: busquedaPedido
                    }), 
                    new Filter({
                        path: "DocumentCurrency",
                        operator: FilterOperator.Contains,
                        value1: busquedaPedido
                    }), 
                    new Filter({
                        path: "PurchasingProcessingStatus",
                        operator: FilterOperator.Contains,
                        value1: busquedaPedido
                    }), 
                    new Filter({
                        path: "PurchasingCompletenessStatus",
                        operator: FilterOperator.EQ,
                        value1: busquedaPedido
                    }),
                ],
                  
                and: false
              })
                         
            var oTable = this.getView().byId("tableOfertas");
            oTable.getBinding("rows").filter(totalFilter);   

        },

        onFilterPedidos: function() { //boton buscar -> aplica filtros pedido

            var that = this;    

            //Obtiene filtros de fecha
            var fechaDesde = this.byId("fechaDesdePickerPedidos").getValue();
            var fechaHasta = this.byId("fechaHastaPickerPedidos").getValue();
            var pedido = this.byId("inputPedido").getValue();
            var pedidoFiltro= "";
            if (pedido)
                pedidoFiltro = " and SalesOrder eq '"+ pedido +"'";
            
            fechaHasta = this.formatNewDateToISO(fechaHasta)
            fechaDesde = this.formatNewDateToISO(fechaDesde);
            this._oModel.read("/I_SalesOrder", {
                urlParameters: {
                    "$filter": "CreationDate ge datetime'"+ fechaDesde +"' and CreationDate le datetime'"+ fechaHasta +"'" + pedidoFiltro
                },
                success: function(dataPedidos, responsePedidos) {
                    that._jsonModel.setProperty("/Pedidos",dataPedidos.results);
                    that.getView().setModel(that._jsonModel);                                             
                },
                error: function(oError) {
                }
            });   
            this.getSplitAppObj().toDetail(this.createId("detailPedidos"));
        },
        onSearchPedidos: function() {
            //Inicio los filtros vacios
            var tableFilters = [];
            
            var inputPedido = this.byId("inputSearchPedidos");
            var valuePedido = inputPedido.getValue();
            var busquedaPedido = inputPedido.getValue()
            
            //Para cualquier campo, pregunto si contiene el string
            var totalFilter = new Filter({
                filters: [                      
                    new Filter({
                        path: "SalesOrder",
                        operator: FilterOperator.Contains,
                        value1: busquedaPedido
                    }),
                    new Filter({
                        path: "CreationDate",
                        operator: FilterOperator.EQ,
                        value1: busquedaPedido
                    }), 
                    new Filter({
                        path: "CompanyCode",
                        operator: FilterOperator.Contains,
                        value1: busquedaPedido
                    }), 
                    new Filter({
                        path: "PurchaseOrderType",
                        operator: FilterOperator.Contains,
                        value1: busquedaPedido
                    }), 
                    new Filter({
                        path: "DocumentCurrency",
                        operator: FilterOperator.Contains,
                        value1: busquedaPedido
                    }), 
                    new Filter({
                        path: "PurchasingProcessingStatus",
                        operator: FilterOperator.Contains,
                        value1: busquedaPedido
                    }), 
                    new Filter({
                        path: "PurchasingCompletenessStatus",
                        operator: FilterOperator.EQ,
                        value1: busquedaPedido
                    }),
                ],
                  
                and: false
              })
                         
            var oTable = this.getView().byId("tablePedidos");
            oTable.getBinding("rows").filter(totalFilter);   

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
            /*this._oModel.read("/ZI_PurchaseOrder", {
                urlParameters: {
                    "$filter": "CreationDate ge datetime'"+ fechaDesde +"' and CreationDate le datetime'"+ fechaHasta +"'" + facturaFiltro
                },
                success: function(dataFacturas, responsefacturas) {
                    that._jsonModel.setProperty("/ZI_PurchaseOrder",dataFacturas.results);
                    that.getView().setModel(that._jsonModel);                                             
                },
                error: function(oError) {
                }
            });   */
            this.getSplitAppObj().toDetail(this.createId("detailFacturas"));
        },

        onFilterEntregas: function() { //boton buscar -> aplica filtros pedido

            var that = this;    

            //Obtiene filtros de fecha
            var fechaDesde = this.byId("fechaDesdePickerEntregas").getValue();
            var fechaHasta = this.byId("fechaHastaPickerEntregas").getValue();
            var entrega = this.byId("inputEntrega").getValue();
            var entregaFiltro= "";
            if (entrega)
                entregaFiltro = " and PurchaseOrder eq '"+ entrega +"'";
            
            fechaHasta = this.formatNewDateToISO(fechaHasta)
            fechaDesde = this.formatNewDateToISO(fechaDesde);
            /*this._oModel.read("/ZI_PurchaseOrder", {
                urlParameters: {
                    "$filter": "CreationDate ge datetime'"+ fechaDesde +"' and CreationDate le datetime'"+ fechaHasta +"'" + entregaFiltro
                },
                success: function(dataEntregas, responseEntregas) {
                    that._jsonModel.setProperty("/ZI_PurchaseOrder",dataEntregas.results);
                    that.getView().setModel(that._jsonModel);                                             
                },
                error: function(oError) {
                }
            });   */
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