sap.ui.define([], function() {
    "use strict";
    return {
// All your formatted functions like below
/**
* Returns Timestamp 
 * @public
 * @param {string} sValue the number string to be timestamp formatted
* @returns {string} sValue in DD-MM-YYYY: HH:MM:SS
*/
    stringDate: function(sValue) {
                if (!sValue) {
                    return "";
                }
                var date = new Date(sValue);

                // Extract the day, month, and year
                var day = date.getDate();
                var month = date.getMonth() + 1; // Months are zero-based
                var year = date.getFullYear();

                // Pad day and month with leading zeros if necessary
                if (day < 10) {
                    day = '0' + day;
                }
                if (month < 10) {
                    month = '0' + month;
                }

                // Format the date as DD/MM/YYYY
                var formattedDate = day + '/' + month + '/' + year;

                return formattedDate;              
                //return (sValue[6] + sValue[7] + '/' +  sValue[4] + sValue[5]  + '/' + sValue[0] + sValue[1] + sValue[2] + sValue[3]);               
               
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
    timeDate: function(sValue) {
                if (!sValue) {
                    return "";
                }
                var date = sValue.getDate().toString().padStart(2, '0');
                var month = sValue.getMonth() + 1;
                month = month.toString().padStart(2, '0');
                return (date + "/" + month + "/" + sValue.getFullYear());
                                      
            },
    statusIcon: function (sValue){
        switch (sValue) {
            case true: return ("sap-icon://sys-enter-2");
                        break;
            case false: return ("sap-icon://error");
                        break;
            case "A": return ("sap-icon://alert");
                        break;
        }
        
    },
    statusColor: function (sValue){
        switch (sValue) {
            case true: return ("Success");
                        break;
            case false: return ("Error");
                        break;
            case "A": return ("Warning");
                        break;
        }
        
    },
    removeZeros: function (sValue){
        if (sValue)
            return (parseFloat(sValue))        
    },
    replaceZeros: function (sValue){
        if (sValue)
            return (sValue.replace(".000",",00"));       
    },
    stringBloq: function (sValue){
        if (sValue == "X")
            return ("Bloqueado")
        else    
            return ("Desbloqueado")        
    }
       
    };
});