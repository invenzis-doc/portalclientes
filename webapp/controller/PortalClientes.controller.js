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
            //Seteo el proveedor para filtrar las entidades
                this._oProveedor = "0000200542";

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
            var fechaHasta = this.formatDateToISO(fechaHoy)

            var fechaDesde = fechaHoy;
            fechaDesde.setMonth(fechaHoy.getMonth() - 4);
            fechaDesde = this.formatDateToISO(fechaDesde);
            
            that.byId("fechaDesdePickerOfertas").setValue(fechaDesde);
            that.byId("fechaHastaPickerOfertas").setValue(fechaHasta);
                
            this._oModel.read("/ZI_PurchaseOrder", {
                urlParameters: {
                    "$filter": "CreationDate ge datetime'"+ fechaDesde +"' and CreationDate le datetime'"+ fechaHasta +"'" 
                },
                success: function(dataPedidos, responsePedidos) {
                    that._jsonModel.setProperty("/ZI_PurchaseOrder",dataPedidos.results);                                              
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
            var fechaHasta = this.formatDateToISO(fechaHoy)

            var fechaDesde = fechaHoy;
            fechaDesde.setMonth(fechaHoy.getMonth() - 4);
            fechaDesde = this.formatDateToISO(fechaDesde);
            
            that.byId("fechaDesdePickerPedidos").setValue(fechaDesde);
            that.byId("fechaHastaPickerPedidos").setValue(fechaHasta);
            
            that._oModel.read("/ZI_PurchaseOrder", {
                urlParameters: {
                    "$filter": "CreationDate ge datetime'"+ fechaDesde +"' and CreationDate le datetime'"+ fechaHasta +"'" 
                },
                success: function(dataPedidos, responsePedidos) {
                    that._jsonModel.setProperty("/ZI_PurchaseOrder",dataPedidos.results);                                              
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
            var fechaHasta = this.formatFilterDate(fechaHoy)

            var fechaDesde = fechaHoy;
            fechaDesde.setMonth(fechaHoy.getMonth() - 4);
            fechaDesde = this.formatFilterDate(fechaDesde);

            that.byId("fechaDesdePickerEntregas").setValue(fechaDesde);
            that.byId("fechaHastaPickerEntregas").setValue(fechaHasta);
               
            this._oModel.read("/ZI_PurchaseOrder", {
                urlParameters: {
                    //"$filter": "Lifnr eq '" + that._oProveedor + "' and FechaDesde eq '"+ fechaDesde +"' and FechaHasta eq '"+ fechaHasta +"'" 
                },
                success: function(dataPedidos, responsePedidos) {
                    that._jsonModel.setProperty("/ZI_PurchaseOrder",dataPedidos.results);                                              
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
            var fechaHasta = this.formatFilterDate(fechaHoy)

            var fechaDesde = fechaHoy;
            fechaDesde.setMonth(fechaHoy.getMonth() - 4);
            fechaDesde = this.formatFilterDate(fechaDesde);
            
            that.byId("fechaDesdePickerFacturas").setValue(fechaDesde);
            that.byId("fechaHastaPickerFacturas").setValue(fechaHasta);
                
            /**
            that._oModel.read("/PedidoSet", {
                urlParameters: {
                    "$filter": "Lifnr eq '" + that._oProveedor + "' and FechaDesde eq '"+ fechaDesde +"' and FechaHasta eq '"+ fechaHasta +"'" 
                },
                success: function(dataPedidos, responsePedidos) {
                    that._jsonModel.setProperty("/PedidoSet",dataPedidos.results);                                              
                },
                error: function(oError) {
                }
            });       */
            this.getSplitAppObj().toDetail(this.createId("detailFacturas"));
        },

        onSelectOfertaDET: function() { // DELETE (nav list item -> detailOferta)
            this.getSplitAppObj().toDetail(this.createId("detailOfertaDET"));
            
        },

        onSelectPedidoDET: function() { //DELETE (nav list item -> detailPedido)
            this.getSplitAppObj().toDetail(this.createId("detailPedidoDET"));
        },

        handleLinkPedido: function(evt) { //link pedido -> detail pedido
            var linkPedido = evt.getSource();
            var numPedido = linkPedido.getText();
            var that = this;

            this._oModel.read("/I_PurchaseOrderItem('" + numPedido +"')", {
                urlParameters: {
                    //"$expand": "PosicionSet,EntregaSet,FacturaSet,PagoSet",
                    "sap-lang":'S'
                },
                success: function(data, response) {
                    that._jsonModel.setProperty("/PedidoSeleccionado",data);
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

            this._oModel.read("/I_PurchaseOrderItem('" + numPedido +"')", {
                urlParameters: {
                    //"$expand": "PosicionSet,EntregaSet,FacturaSet,PagoSet",
                    "sap-lang":'S'
                },
                success: function(data, response) {
                    that._jsonModel.setProperty("/OfertaSeleccionada",data);
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
            var fechaDesde = this.byId("fechaDesdePickerOferta").getValue();
            var fechaHasta = this.byId("fechaHastaPickerOferta").getValue();

            var pedido = this.byId("inputOferta").getValue();
            var pedidoFiltro= "";
            if (pedido)
                pedidoFiltro = " and Ebeln eq '"+ pedido +"'";

            //Filtros de checkboxes
            var estadoFiltro = "";
            
            if (this.byId("checkEstadoOfertasV").getSelected())
                estadoFiltro = "V";
            
            if (this.byId("checkEstadoOfertasA").getSelected())
                estadoFiltro = estadoFiltro + "A";
            
            if (this.byId("checkEstadoOfertasR").getSelected())
                estadoFiltro = estadoFiltro + "R";

            if (estadoFiltro)
                estadoFiltro = " and Estado eq '"+ estadoFiltro +"'";
            
            this.getSplitAppObj().toDetail(this.createId("detailOferta"));
        } ,
        
        onSearchPedidos: function() { //busqueda pedidos
            //Inicio los filtros vacios
            var tableFilters = [];
            
            var inputPedido = this.byId("inputSearchPedidos");
            var valuePedido = inputPedido.getValue();
            var busquedaPedido = inputPedido.getValue()
            
            //Para cualquier campo, pregunto si contiene el string
            var totalFilter = new Filter({
                filters: [                      
                    new Filter({
                        path: "Ebeln",
                        operator: FilterOperator.Contains,
                        value1: busquedaPedido
                    }),
                    new Filter({
                        path: "Estado",
                        operator: FilterOperator.Contains,
                        value1: busquedaPedido
                    }), 
                    new Filter({
                        path: "Bedat",
                        operator: FilterOperator.Contains,
                        value1: busquedaPedido
                    }), 
                    new Filter({
                        path: "Netwr",
                        operator: FilterOperator.Contains,
                        value1: busquedaPedido
                    }), 
                    new Filter({
                        path: "Waers",
                        operator: FilterOperator.Contains,
                        value1: busquedaPedido
                    }), 
                    new Filter({
                        path: "Vtext",
                        operator: FilterOperator.Contains,
                        value1: busquedaPedido
                    }), 
                    new Filter({
                        path: "Bloqu",
                        operator: FilterOperator.Contains,
                        value1: busquedaPedido
                    }),
                    new Filter({
                        path: "Butxt",
                        operator: FilterOperator.Contains,
                        value1: busquedaPedido
                    }), 
                ],
                    
                and: false
                })
                            
            var oTable = this.getView().byId("tablePedidos");
            oTable.getBinding("rows").filter(totalFilter);   

        },
        onFilterPedidos: function() { //boton buscar -> aplica filtros pedido

            //Obtiene los filtros de fecha              
            var fechaDesde = this.byId("fechaDesdePickerPedidos").getValue();
            var fechaHasta = this.byId("fechaHastaPickerPedidos").getValue();
            
            var pedido = this.byId("inputPedido").getValue();
            var pedidoFiltro= "";
            if (pedido)
                pedidoFiltro = " and Ebeln eq '"+ pedido +"'";
            
            //Filtros de checkboxes
            var estadoFiltro = "";
            
            if (this.byId("checkEstadoPedidosV").getSelected())
                estadoFiltro = "V";
            
            if (this.byId("checkEstadoPedidosA").getSelected())
                estadoFiltro = estadoFiltro + "A";
            
            if (this.byId("checkEstadoPedidosR").getSelected())
                estadoFiltro = estadoFiltro + "R";

            if (estadoFiltro)
                estadoFiltro = " and Estado eq '"+ estadoFiltro +"'";

            var anticipoFiltro = "";
            if (this.byId("checkAnticipoPedidos").getSelected())
                anticipoFiltro = " and Anticipo eq 'A'";
            
            var bloqueadoFiltro = "";
            if (this.byId("checkLiberarPedidos").getSelected())
                bloqueadoFiltro = " and Bloqu eq 'X'";
               
            this.getSplitAppObj().toDetail(this.createId("detailPedidos"));
        },
        createColumnConfigPedidos: function() {
            var aCols = [];

            aCols.push({
                label: 'Estado',
                type: EdmType.String,
                property: 'Estado'                    
            });

            aCols.push({
                label: 'Pedido',
                property: 'Ebeln',
                type: EdmType.String
            });

            aCols.push({
                label:'Fecha',
                property: 'Bedat',
                type: EdmType.String
            });

            aCols.push({
                label:'Valor Neto',
                property: 'Netwr',
                type: EdmType.String
            });

            aCols.push({
                label:'Condiciones de Pago',
                property: 'Vtext',
                type: EdmType.String
            });

            aCols.push({
                label:'Bloqueado',
                property: 'Bloqu',
                type: EdmType.String
            });

            aCols.push({
                label:'Empresa',
                property: 'Butxt',
                type: EdmType.String
            });

            return aCols;
        },

        getSplitAppObj: function () { // nav function
            var result = this.byId("SplitContDemo");
            if (!result) {
                Log.info("SplitApp object can't be found");
            }
            return result;
        },
        formatFilterDate : function (date) { //format date filters
            var dia = date.getDate().toString().padStart(2, '0');
            var mes = date.getMonth() + 1;
            mes = mes.toString().padStart(2, '0');
            var valorFechaHasta = date.getFullYear() + mes + dia;
            return (valorFechaHasta)
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
        }

    });
});