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
                /** Cambiar esto por el cliente cuando tenga la informacion
              	//Seteo el proveedor para filtrar las entidades
                this._oProveedor = "0000200542";
                
                //Dato hardcoded en el portal
                this._oSociedad = "AR10";

                this._oModel = new ODataModel("/sap/opu/odata/sap/Z_PORTAL_PROVEEDORES_SRV", true);
                this._oModel.setHeaders({
                    "Accept":"application/pdf",
                    "Content-Type": "application/pdf"
                })
                var that = this;
                this._oModel.read("/SociedadSet", {
                    success: function(data, response) {
                        var jsonModel = new JSONModel();
                        jsonModel.setProperty("/SociedadSet",data.results);
                        that.getView().setModel(jsonModel);
                        that._jsonModel = jsonModel;
                                                                   
                    },
                    error: function(oError) {
                    }
                });*/		       
            },
            
            onSelectHome: function() {
                this.getSplitAppObj().toDetail(this.createId("detailHome"));
            },
            
            onSelectOferta: function() {
                
                
                //Inicializar los filtros de fecha
                var fechaHoy = new Date();
                var fechaHasta = this.formatFilterDate(fechaHoy)

                var fechaDesde = fechaHoy;
                fechaDesde.setMonth(fechaHoy.getMonth() - 4);
                fechaDesde = this.formatFilterDate(fechaDesde);
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
                });*/      
                this.getSplitAppObj().toDetail(this.createId("detailOferta"));
            },

            onSelectPedidos: function() {
                //Inicializar los filtros de fecha
                var fechaHoy = new Date();
                var fechaHasta = this.formatFilterDate(fechaHoy)

                var fechaDesde = fechaHoy;
                fechaDesde.setMonth(fechaHoy.getMonth() - 4);
                fechaDesde = this.formatFilterDate(fechaDesde);
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
                this.getSplitAppObj().toDetail(this.createId("detailPedidos"));
            },

            onSelectOfertaDET: function() {
                this.getSplitAppObj().toDetail(this.createId("detailOfertaDET"));
                
            },

            onSelectPedidosDET: function() {
                this.getSplitAppObj().toDetail(this.createId("detailPedidosDET"));
            },

            handleLinkPedido: function(evt) {
                /**var linkPedido = evt.getSource();
                var numPedido = linkPedido.getText();
                var that = this;
                
                //numPedido = '4500000252';

                this._oModel.read("/PedidoSet('" + numPedido +"')", {
                    urlParameters: {
                        "$expand": "PosicionSet,EntregaSet,FacturaSet,PagoSet",
                        "sap-lang":'S'
                    },
                    success: function(data, response) {
                        that._jsonModel.setProperty("/PedidoSeleccionado",data);
                        that.getView().setModel(that._jsonModel);                        
                    },
                    error: function(oError) {
                    }
                });*/

                this.getSplitAppObj().toDetail(this.createId("detailPedidosDET"));

            },

            handleLinkOferta: function(evt) {
                /**var linkPedido = evt.getSource();
                var numPedido = linkPedido.getText();
                var that = this;
                
                //numPedido = '4500000252';

                this._oModel.read("/PedidoSet('" + numPedido +"')", {
                    urlParameters: {
                        "$expand": "PosicionSet,EntregaSet,FacturaSet,PagoSet",
                        "sap-lang":'S'
                    },
                    success: function(data, response) {
                        that._jsonModel.setProperty("/PedidoSeleccionado",data);
                        that.getView().setModel(that._jsonModel);                        
                    },
                    error: function(oError) {
                    }
                }); */

                this.getSplitAppObj().toDetail(this.createId("detailOfertaDET"));

            },

            onFilterOfertas: function() {
                
                var that = this;                
                this.byId("tableOferta").setBusy(true);

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
                

                this._oModel.read("/FacturaSet", {
                    urlParameters: {
                        "$filter": "Lifnr eq '" + that._oProveedor + //"'"
                        "' and FechaDesde eq '"+ fechaDesde +"' and FechaHasta eq '"+ fechaHasta +"'" 
                        + pedidoFiltro + estadoFiltro + facturaFiltro
                    },
                    success: function(data, response) {
                        that._jsonModel.setProperty("/FacturaSet",data);
                        that.getView().setModel(that._jsonModel); 
                        that.byId("tableListaFacturas").setBusy(false);                                               
                    },
                    error: function(oError) {
                    }
                });
                that.getSplitAppObj().toDetail(that.createId("detailOferta"));
            } ,
            
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
            onFilterPedidos: function() {
                var that = this;

                //Obtiene los filtros de fecha              
                var fechaDesde = this.byId("fechaDesdePickerPedidos").getValue();
                var fechaHasta = that.byId("fechaHastaPickerPedidos").getValue();
                
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

                
                that._oModel.read("/PedidoSet", {
                    urlParameters: {
                        "$filter": "Lifnr eq '" + that._oProveedor + 
                        "' and FechaDesde eq '"+ fechaDesde +"' and FechaHasta eq '"+ fechaHasta +"'" 
                        + pedidoFiltro + estadoFiltro + anticipoFiltro + bloqueadoFiltro
                    },
                    success: function(dataPedidos, responsePedidos) {
                        that._jsonModel.setProperty("/PedidoSet",dataPedidos.results);                                              
                    },
                    error: function(oError) {
                    }
                });      
                this.getSplitAppObj().toDetail(this.createId("detailPedidos"));
            },
            onExportPedidos: function() {
                var aCols, oRowBinding, oSettings, oSheet, oTable;
    
                this._oTable = this.byId('tablePedidos');
                    
                oTable = this._oTable;
                oRowBinding = oTable.getBinding('rows');
                aCols = this.createColumnConfigPedidos();
    
                oSettings = {
                    workbook: {
                        columns: aCols,
                        hierarchyLevel: 'Level'
                    },
                    dataSource: oRowBinding,
                    fileName: 'Export Pedidos.xlsx',
                    worker: false // We need to disable worker because we are using a MockServer as OData Service
                };
    
                oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function() {
                    oSheet.destroy();
                });
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
