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
                    
        onInit: function () {
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
            this._oModel5 = new ODataModel("/sap/opu/odata/sap/Z_BILLINGDOCUMENTITEM_CDS", true);
            this._oModel5.setHeaders({
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
        
        onSelectHome: function() {
            this.getSplitAppObj().toDetail(this.createId("detailHome"));
        },
        
        onSelectOfertas: function() {
            var that = this;

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

        onSelectPedidos: function() {
            var that = this;

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

        onSelectEntregas: function() {
            var that = this;
           
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
                    //"$filter": "CreationDate ge datetime'"+ fechaDesde +"' and CreationDate le datetime'"+ fechaHasta +"'"
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

        onSelectFacturas: function() {
            var that = this;

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
                    "$filter": "CreationDate ge datetime'"+ fechaDesde +"' and CreationDate le datetime'"+ fechaHasta +"'",
                    "$expand": "to_Item"
                },
                success: function(data, response) {
                    that._jsonModel.setProperty("/ZI_BillingDocument",data.results);
                    console.log(data.results[0]/to_Item);
                    that.getView().setModel(that._jsonModel);                                              
                },
                error: function(oError) {
                }
            });
            /*this._oModel5.read("/I_BillingDocument", {
                urlParameters: {
                    //"$filter": "CreationDate ge datetime'"+ fechaDesde +"' and CreationDate le datetime'"+ fechaHasta +"'"
                },
                success: function(data, response) {
                    that._jsonModel.setProperty("/ZI_BillingDocument",data.results);
                    console.log(data.results);
                    that.getView().setModel(that._jsonModel);                                              
                },
                error: function(oError) {
                }
            });*/
            this.getSplitAppObj().toDetail(this.createId("detailFacturas"));
        },

        handleLinkPedido: function(evt) {
            var linkPedido = evt.getSource();
            var numPedido = linkPedido.getText();
            var that = this;

            this._oModel.read("/Z_SALESORDERITEM", {
                urlParameters: {
                    "$filter": "SalesOrder eq '" + numPedido + "'"
                },
                success: function(data, response) {
                    that._jsonModel.setProperty("/PedidoSeleccionado",data.results[0]);
                    that.getView().setModel(that._jsonModel);                        
                },
                error: function(oError) {
                }
            });

            this._oModel4.read("/Z_BillingDocumentItem", {
                urlParameters: {
                    "$filter": "ReferenceSDDocument eq '" + numPedido + "'",
                    "$expand": "to_BillingDocument"
                },
                success: function(data, response) {
                    that._jsonModel.setProperty("/Facturas", data);
                    console.log(data);
                    that.getView().setModel(that._jsonModel);       
                                                                  
                },
                error: function(oError) {
                }
            });

            /*this._oModel4.read("/ZI_BillingDocument", {
                urlParameters: {
                    "$expand": "to_Item"
                },
                success: function(data, response) {
                    var filteredData = data.results.filter(function(billingDoc) {
                        return billingDoc.to_Item.results.some(function(item) {
                            return item.ReferenceSDDocument === numPedido;
                        });
                    });
                    
                    that._jsonModel.setProperty("/Facturas", filteredData);
                    console.log(filteredData);
                    that.getView().setModel(that._jsonModel);       
                                                                  
                },
                error: function(oError) {
                }
            });*/

            this._oModel3.read("/ZI_OutboundDeliveryItem", {
                urlParameters: {
                    "$filter": "ReferenceSDDocument eq '" + numPedido + "'"
                },
                success: function(data, response) {
                    that._jsonModel.setProperty("/Entregas",data.results);
                    that.getView().setModel(that._jsonModel);                                              
                },
                error: function(oError) {
                }
            });

            this.getSplitAppObj().toDetail(this.createId("detailPedidoDET"));
        },

        handleLinkOferta: function(evt) {
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

        onFilterOfertas: function() {
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
        },
        
        onSearchOfertas: function() {
            
            var inputOferta = this.byId("inputSearchOfertas");
            var busquedaOferta = inputOferta.getValue()
            
            var totalFilter = new Filter({
                filters: [                      
                    new Filter({
                        path: "SalesQuotation",
                        operator: FilterOperator.Contains,
                        value1: busquedaOferta
                    }),
                    new Filter({
                        path: "CreationDate",
                        operator: FilterOperator.EQ,
                        value1: busquedaOferta
                    }), 
                    new Filter({
                        path: "SalesOffice",
                        operator: FilterOperator.Contains,
                        value1: busquedaOferta
                    }), 
                    new Filter({
                        path: "TransactionCurrency",
                        operator: FilterOperator.Contains,
                        value1: busquedaOferta
                    }), 
                    new Filter({
                        path: "TotalNetAmount",
                        operator: FilterOperator.Contains,
                        value1: busquedaOferta
                    }),
                ],
                  
                and: false
              })
                         
            var oTable = this.getView().byId("tableOfertas");
            oTable.getBinding("rows").filter(totalFilter);   

        },

        onFilterPedidos: function() {

            var that = this;    

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
                    that._jsonModel.setProperty("/I_SalesOrder",dataPedidos.results);
                    that.getView().setModel(that._jsonModel);                                             
                },
                error: function(oError) {
                }
            });   
            this.getSplitAppObj().toDetail(this.createId("detailPedidos"));
        },

        onSearchPedidos: function() {
            
            var inputPedido = this.byId("inputSearchPedidos");
            var busquedaPedido = inputPedido.getValue()
            
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
                        path: "SalesOffice",
                        operator: FilterOperator.Contains,
                        value1: busquedaPedido
                    }), 
                    new Filter({
                        path: "SalesOrderType",
                        operator: FilterOperator.Contains,
                        value1: busquedaPedido
                    }), 
                    new Filter({
                        path: "TransactionCurrency",
                        operator: FilterOperator.Contains,
                        value1: busquedaPedido
                    }),
                    new Filter({
                        path: "TotalNetAmount",
                        operator: FilterOperator.EQ,
                        value1: busquedaPedido
                    }), 
                    new Filter({
                        path: "DeliveryBlockReason",
                        operator: FilterOperator.Contains,
                        value1: busquedaPedido
                    }), 
                    new Filter({
                        path: "OverallSDProcessStatus",
                        operator: FilterOperator.Contains,
                        value1: busquedaPedido
                    }),
                ],
                  
                and: false
              })
                         
            var oTable = this.getView().byId("tablePedidos");
            oTable.getBinding("rows").filter(totalFilter);   

        },

        onFilterFacturas: function() {

            var that = this;    

            var fechaDesde = this.byId("fechaDesdePickerFacturas").getValue();
            var fechaHasta = this.byId("fechaHastaPickerFacturas").getValue();
            var factura = this.byId("inputFactura").getValue();
            var facturaFiltro= "";
            if (factura)
                facturaFiltro = " and BillingDocument eq '"+ factura +"'";
            
            fechaHasta = this.formatNewDateToISO(fechaHasta)
            fechaDesde = this.formatNewDateToISO(fechaDesde);
            this._oModel4.read("/ZI_BillingDocument", {
                urlParameters: {
                    "$filter": "CreationDate ge datetime'"+ fechaDesde +"' and CreationDate le datetime'"+ fechaHasta +"'" + facturaFiltro,
                    "$expand": "to_Item"
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
        onSearchFacturas: function() {
            
            var inputFactura = this.byId("inputSearchFacturas");
            var busquedaFactura = inputFactura.getValue()
            
            var totalFilter = new Filter({
                filters: [                      
                    new Filter({
                        path: "BillingDocument",
                        operator: FilterOperator.Contains,
                        value1: busquedaFactura
                    }),
                    new Filter({
                        path: "CreationDate",
                        operator: FilterOperator.EQ,
                        value1: busquedaFactura
                    }), 
                    new Filter({
                        path: "CustomerPaymentTermsName",
                        operator: FilterOperator.Contains,
                        value1: busquedaFactura
                    }),
                    new Filter({
                        path: "TransactionCurrency",
                        operator: FilterOperator.Contains,
                        value1: busquedaFactura
                    }),
                    new Filter({
                        path: "TaxAmount",
                        operator: FilterOperator.Contains,
                        value1: busquedaFactura
                    }), 
                    new Filter({
                        path: "TotalNetAmount",
                        operator: FilterOperator.Contains,
                        value1: busquedaFactura
                    }),
                    new Filter({
                        path: "DocumentReferenceID",
                        operator: FilterOperator.Contains,
                        value1: busquedaFactura
                    }),
                    new Filter({
                        path: "to_Item/results/0/ReferenceSDDocument",
                        operator: FilterOperator.Contains,
                        value1: busquedaFactura
                    }),
                ],
                  
                and: false
              })
                         
            var oTable = this.getView().byId("tableFacturas");
            oTable.getBinding("rows").filter(totalFilter);   

        },

        onFilterEntregas: function() {

            var that = this;    

            var fechaDesde = this.byId("fechaDesdePickerEntregas").getValue();
            var fechaHasta = this.byId("fechaHastaPickerEntregas").getValue();
            var entrega = this.byId("inputEntrega").getValue();
            var entregaFiltro= "";
            if (entrega)
                entregaFiltro = " and OutboundDelivery eq'"+ entrega +"'";
            
            fechaHasta = this.formatNewDateToISO(fechaHasta)
            fechaDesde = this.formatNewDateToISO(fechaDesde);
            this._oModel3.read("/ZI_OutboundDeliveryItem", {
                urlParameters: {
                    "$filter": "CreationDate ge datetime'"+ fechaDesde +"' and CreationDate le datetime'"+ fechaHasta +"'" + entregaFiltro
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
        onSearchEntregas: function() {
            
            var inputEntrega = this.byId("inputSearchEntrega");
            var busquedaEntrega = inputEntrega.getValue()
            var totalFilter = new Filter({
                filters: [                      
                    new Filter({
                        path: "OutboundDelivery",
                        operator: FilterOperator.Contains,
                        value1: busquedaEntrega
                    }),
                    new Filter({
                        path: "CreationDate",
                        operator: FilterOperator.EQ,
                        value1: busquedaEntrega
                    }), 
                    new Filter({
                        path: "OutboundDeliveryItem",
                        operator: FilterOperator.Contains,
                        value1: busquedaEntrega
                    }),
                    new Filter({
                        path: "DeliveryDocumentItemText",
                        operator: FilterOperator.Contains,
                        value1: busquedaEntrega
                    }),
                    new Filter({
                        path: "Material",
                        operator: FilterOperator.Contains,
                        value1: busquedaEntrega
                    }), 
                    new Filter({
                        path: "ActualDeliveryQuantity",
                        operator: FilterOperator.Contains,
                        value1: busquedaEntrega
                    }),
                    new Filter({
                        path: "ActualDeliveredQtyInBaseUnit",
                        operator: FilterOperator.Contains,
                        value1: busquedaEntrega
                    }),
                    new Filter({
                        path: "BaseUnit",
                        operator: FilterOperator.Contains,
                        value1: busquedaEntrega
                    }),
                    new Filter({
                        path: "ReferenceSDDocument",
                        operator: FilterOperator.Contains,
                        value1: busquedaEntrega
                    }),
                ],
                  
                and: false
              })
              console.log("salio");
                         
            var oTable = this.getView().byId("tableEntregas");
            oTable.getBinding("rows").filter(totalFilter);   

        },

        getSplitAppObj: function () {
            var result = this.byId("SplitContDemo");
            if (!result) {
                Log.info("SplitApp object can't be found");
            }
            return result;
        },
        formatFilterDate : function (date) {
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
            var date = new Date(dateString);
        
            var year = date.getFullYear();
            var month = ("0" + (date.getMonth() + 1)).slice(-2);
            var day = ("0" + date.getDate()).slice(-2);
            var hours = ("0" + date.getHours()).slice(-2);
            var minutes = ("0" + date.getMinutes()).slice(-2);
            var seconds = ("0" + date.getSeconds()).slice(-2);
        
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