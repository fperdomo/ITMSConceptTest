var _Company = "";
var _SitePath = "http://104.196.27.3:3000/api";
var _optionsModal = { "backdrop": "static", keyboard: true }; 

$(function () {  
    // unblock when ajax activity stops 
    $(document).ajaxStop($.unblockUI); 

    initData();      
    
    $("#btnGetCompanies").click(function () {       
        $("#divCompanies").show();
        $("#divTransactions").hide();
        $("#divBatchTransferReq").hide();
        hideActions();
        blockUICustom();
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cache': 'no-cache'
            },
            credentials: 'same-origin',
            url: _SitePath + '/Company',
            dataType: 'json',
            success: function (response) {
                $(function () {
                    $("#companies_table thead").remove();
                    $("#companies_table tbody").remove();
                    var $tr = $('<thead>').append($('<tr>').append(
                        $('<th scope="col">').text("Company Id"),
                        $('<th scope="col">').text("Company Name"),
                        $('<th scope="col">').text("Working Currency"),
                        $('<th scope="col">').text("Fund Balance"),
                        $('<th scope="col">').text(""),
                        $('<th scope="col">').text("")
                    )).appendTo('#companies_table');
                    $('<tbody>').appendTo('#companies_table');
                    $.each(response, function (i, item) {
                        var $tr = $('<tr>').append(
                            $('<td scope="row">').text(item.companyId),
                            $('<td>').text(item.companyName),
                            $('<td>').text(item.workingCurrency),
                            $('<td>').text(item.fundBalance),
                            item.companyId === _Company ? $('<td>').text('') :  $('<td>').append("<button type='button' class='btn btn-primary' id='btnTrxReq_" + item.companyId + "' onClick='showSubmitTrxRequest(\"" + item.companyId +"\")' > Submit Trx </button>"),
                            item.companyId === _Company ? $('<td>').text('') : $('<td>').append("<button type='button' class='btn btn-primary' id='btnPreSett_" + item.companyId + "' onClick='alertPrepareSettlement(\"" + item.companyId + "\")' > Pre Sett </button>")
                        ).appendTo('#companies_table');
                        $('</tbody>').appendTo('#companies_table');
                        $('#companies_table').show();
                    });

                    $('#companies_table').show();
                    if ($.fn.dataTable.isDataTable('#companies_table')) {
                        table = $('#companies_table').DataTable();
                        table.destroy();
                    }
                    $('#companies_table').DataTable();
                   
                });

            },
            error: function (error) {
                console.log(error);
                alertError(error.responseJSON.error.message);
            }
        });
    });

    $("#btnGetTrxs").click(function () {
        $("#divCompanies").hide();
        $("#divTransactions").show();
        $("#divBatchTransferReq").hide();
        hideActions();
        blockUICustom();
        $.ajax({
            url: _SitePath + '/TransferRequest',
            headers: {
                "Content-Type": "application/json"
            },
            xhrFields: {
                withCredentials: true
            },
            success: function (response) {
                $(function () {
                    $("#transactions_table thead").remove();
                    $("#transactions_table tbody").remove();
                    var $tr = $('<thead>').append($('<tr>').append(
                        $('<th scope="col">').text("Request Id"),
                        $('<th scope="col">').text("From Company Id"),
                        $('<th scope="col">').text("To Company Id"),
                        $('<th scope="col">').text("State"),
                        $('<th scope="col">').text("Currency"),
                        $('<th scope="col">').text("Amount"),
                        $('<th scope="col">').text("Date"),
                        $('<th scope="col">').text("Description"),
                        $('<th scope="col">').text("Reasons Rejected"),
                        $('<th scope="col">').text("")
                    )).appendTo('#transactions_table');
                    $('<tbody>').appendTo('#transactions_table');
                    $.each(response, function (i, item) {
                        var $tr = $('<tr>').append(
                            $('<td scope="row">').text(item.requestId),
                            $('<td>').text(item.fromCompany.split("#")[1]),
                            $('<td>').text(item.toCompany.split("#")[1]),
                            $('<td>').text(item.state),
                            $('<td>').text(item.details.currency),
                            $('<td>').text(item.details.amount),
                            $('<td>').text(getDateInFormat(item.details.date)),
                            $('<td>').text(item.details.description),
                            $('<td>').text(item.details.reasonsRejected),
                            item.state === "PENDING" & item.toCompany.split("#")[1] === _Company ? $('<td>').append("<button type='button' class='btn btn-primary' id='btnUpdTrx_" + item.requestId + "' onClick='showUpdateTrxRequest(\"" + item.requestId + "\")' > Update Trx </button>") : $('<td>').text('')
                        ).appendTo('#transactions_table');
                        $('</tbody>').appendTo('#transactions_table');
                       
                    });

                    $('#transactions_table').show();
                    if ($.fn.dataTable.isDataTable('#transactions_table')) {
                        table = $('#transactions_table').DataTable();
                        table.destroy();
                    }

                    $('#transactions_table').DataTable({
                        "order": [[6, "desc"]]
                    });
                   
                });

            },
            error: function (error) {
                console.log(error);
                 alertError(error.responseJSON.error.message);
            }
        });
    });    
    
    $("#btnGetBatchTransferRequest").click(function () {
        $("#divCompanies").hide();
        $("#divTransactions").hide();
        $("#divBatchTransferReq").show();
        hideActions();
        blockUICustom();
        $.ajax({
            url: _SitePath + '/BatchTransferRequest',
            headers: {
                "Content-Type": "application/json"
            },
            xhrFields: {
                withCredentials: true
            },
            success: function (response) {
                $(function () {                    
              
                    $("#batchtransfertequest_table thead").remove();
                    $("#batchtransfertequest_table tbody").remove();
                    var $tr = $('<thead>').append($('<tr>').append(
                        $('<th scope="col">').text("Batch Id"),
                        $('<th scope="col">').text("State"),
                        $('<th scope="col">').text("Settlement Currency"),
                        $('<th scope="col">').text("Settlement Amount"),
                        $('<th scope="col">').text("Settlement Date"),
                        $('<th scope="col">').text("Settlement Creditor"),
                        $('<th scope="col">').text("Settlement Debtor"),
                        $('<th scope="col">').text("Rates to"),
                        $('<th scope="col">').text("Rates rate"),
                        $('<th scope="col">').text(""),
                        $('<th scope="col">').text(""),
                    )).appendTo('#batchtransfertequest_table');
                    $('<tbody>').appendTo('#batchtransfertequest_table');
                    $.each(response, function (i, item) {
                        var $tr = $('<tr>').append(
                            $('<td scope="row">').text(item.batchId),
                            $('<td>').text(item.state),
                            $('<td>').text(item.settlement.currency),
                            $('<td>').text(item.settlement.amount),
                            $('<td>').text(getDateInFormat(item.settlement.date)),
                            $('<td>').text(item.settlement.creditor.split("#")[1]),
                            $('<td>').text(item.settlement.debtor.split("#")[1]),
                            $('<td>').text(item.rates[0].to),
                            $('<td>').text(item.rates[0].rate),
                            item.state === "PENDING" & item.settlement.debtor.split("#")[1] === _Company ? $('<td>').append("<button type='button' class='btn btn-primary' id='btnTransferFunds_" + item.batchId + "' onClick='alertTransferFunds(\"" + item.batchId + "\")' > Transfer Funds </button>") : $('<td>').text(''),
                            item.state === "SETTLED" & item.settlement.creditor.split("#")[1] === _Company ? $('<td>').append("<button type='button' class='btn btn-primary' id='btnCompleteSett_" + item.batchId + "' onClick='alertCompleteSettlement(\"" + item.batchId + "\")' > Complete Sett </button>") : $('<td>').text('')
                        ).appendTo('#batchtransfertequest_table');
                        $('</tbody>').appendTo('#batchtransfertequest_table');
                       
                    });

                    $('#batchtransfertequest_table').show();
                    if ($.fn.dataTable.isDataTable('#batchtransfertequest_table')) {
                        table = $('#batchtransfertequest_table').DataTable();
                        table.destroy();
                    }
                    $('#batchtransfertequest_table').DataTable({
                        "order": [[4, "desc"]]
                    });
                });

            },
            error: function (error) {
                console.log(error);
                 alertError(error.responseJSON.error.message);
            }
        });
    });
   
});

function initData() {
    blockUICustom();
    $("#divCompanies").show();
    $("#divTransactions").show();
    $("#divBatchTransferReq").show();
    $("#divSubmitTrx").hide();
    $("#divUpdateTrx").hide();
    $("#divPrepareSett").hide();
    $("#divTransferFunds").hide();
    $("#divCompleteSett").hide();

    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache': 'no-cache'
        },
        credentials: 'same-origin',
        url: _SitePath + '/wallet',
        dataType: 'json',
        success: function (response) {
            $("#hdButtons").show();  
            $("#company").show();
            $('#wallet').append(response[0].name.split("@")[0]);
            getCompanyByUser(response[0].name.split("@")[0]);
            $('#companies_table').show();

        },
        error: function (error) {
            console.log(error);
            $('#wallet').html("Log in to: <a target='_blank' href='http://104.196.27.3:3000/auth/github'> REST Composer SERVER <a>");
            $("#hdButtons").hide();  
            $("#company").hide();
        }
    });
}

function showSubmitTrxRequest(companyId) {      
    $('#modalMainContent').html($('#divSubmitTrx').html());
    $('#modalMain').modal(_optionsModal);

    $("#requestId").val(makeRequestId());
    $("#requestId").prop('disabled', true);
    $("#toCompanyId").val(companyId);
    $("#toCompanyId").prop('disabled', true);
    $("#amount").val();
    $("#description").val();
    $("#divTransactions").hide(); 
    $("#btnPostTrx").click(function () { actionSubmitTrxRequest() });

    $('#modalMain').modal('show'); 
}

function actionSubmitTrxRequest() {
    if (validateSubmitTrxRequest()) {
        blockUICustom();
        var data = JSON.stringify({
            "$class": "com.itms.SubmitTransferRequest",
            "requestId": $("#requestId").val(),
            "toCompanyId": $("#toCompanyId").val(),
            "details": {
                "$class": "com.itms.Transfer",
                "currency": $("#currency").val(),
                "amount": $("#amount").val(),
                "date": new Date(),
                "description": $("#description").val(),
                "reasonsRejected": ""
            }
        });

        $.ajax({
            url: _SitePath + '/SubmitTransferRequest',
            headers: {
                "Content-Type": "application/json"
            },
            xhrFields: {
                withCredentials: true
            },
            method: "POST",
            data: data,
            success: function (response) {
                $("#btnGetTrxs").click();
                $('#modalMain').modal('hide');
                alertSuccess('POST Transaction Success');
            },
            error: function (error) {
                console.log(error);
                alertError(error.responseJSON.error.message);
            }
        });

    } else 
        alertWarningInputData();   
}

function validateSubmitTrxRequest() {
    var amount = $("#amount").val();
    var description = $("#description").val();
    var isValid = true;
    if (amount === "" || description === "")
        isValid = false;

    return isValid;
}

function showUpdateTrxRequest(requestId) {
    $('#modalMainContent').html($('#divUpdateTrx').html());
    $('#modalMain').modal(_optionsModal);

    $("#requestUpdateId").val(requestId);
    $("#requestUpdateId").prop('disabled', true);
    $("#reasonsUpdateRejected").val("");
    $("#reasonsUpdateRejected").prop('disabled', true);    
    $("#stateUpdate").val('APPROVED');
    $("#stateUpdate").change(function () {
        changeStateUpdate($(this).val());
    })

    $("#btnUpdateTrx").click(function () { actionUpdateTrx() });
    $('#modalMain').modal('show'); 
}

function changeStateUpdate(stateUpdate) {
    if (stateUpdate === "APPROVED") {
        $("#reasonsUpdateRejected").val("");
        $("#reasonsUpdateRejected").prop('disabled', true);        
    } else if (stateUpdate === "REJECTED") {
        $("#reasonsUpdateRejected").val("");
        $("#reasonsUpdateRejected").prop('disabled', false);
    } 
}

function validateUpdateTrxRequest() {
    var stateUpdate = $("#stateUpdate").val();
    var reasonsRejected = $("#reasonsUpdateRejected").val();
    var isValid = true;
    if (stateUpdate === "REJECTED" && reasonsRejected === "")
        isValid = false;

    return isValid;
}

function actionUpdateTrx() {
    if (validateUpdateTrxRequest()) {
        blockUICustom();
        var data = JSON.stringify(
            {
                "$class": "com.itms.UpdateTrasferRequest",
                "requestId": $("#requestUpdateId").val(),
                "state": $("#stateUpdate").val(),
                "reasonsRejected": $("#reasonsUpdateRejected").val(),
                "transactionId": "",
                "timestamp": new Date()
            });

        $.ajax({
            url: _SitePath + '/UpdateTrasferRequest',
            headers: {
                "Content-Type": "application/json"
            },
            xhrFields: {
                withCredentials: true
            },
            method: "POST",
            data: data,
            success: function (response) {
                $("#btnGetTrxs").click();
                $('#modalMain').modal('hide');
                alertSuccess("Update Transaction Success");
            },
            error: function (error) {
                console.log(error);
                alertError(error.responseJSON.error.message);
            }
        });
    } else
        alertWarningInputData(); 
   
}

function alertPrepareSettlement(companyId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You are going to Prepare Settlement for Company: " + companyId,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.value) {
            actionPrepareSettlement(companyId)
        }
    })
}

function actionPrepareSettlement(companyId) {
    blockUICustom();
    var data = JSON.stringify(
        {
            "$class": "com.itms.PrepareSettlement",
            "batchId": makeRequestPrepId(),
            "rates": [{ "$class": "com.itms.ExchangeRate", "to": "EUR", "rate": 0.75 }],
            "companyId": companyId,
            "transactionId": "",
            "timestamp": new Date()
        });

    $.ajax({
        url: _SitePath + '/PrepareSettlement',
        headers: {
            "Content-Type": "application/json"
        },
        xhrFields: {
            withCredentials: true
        },
        method: "POST",
        data: data,
        success: function (response) {
            $("#btnGetTrxs").click();
            $("#divSubmitTrx").hide();
            alertSuccess("PrepareSettlement Transaction Success... WARNING: ExchangeRate is Hardcode");
        },
        error: function (error) {
            console.log(error);
            alertError(error.responseJSON.error.message);
        }
    });
}

function alertCompleteSettlement(batchId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You are going to Complete Settlement with BatchId: " + batchId,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.value) {
            actionCompleteSettlement(batchId)
        }
    })
}

function actionCompleteSettlement(batchId) {
    blockUICustom();
    var data = JSON.stringify(
        {
            "$class": "com.itms.CompleteSettlement",
            "batchId": batchId,
            "transactionId": "",
            "timestamp": new Date()
        });

    $.ajax({
        url: _SitePath + '/CompleteSettlement',
        headers: {
            "Content-Type": "application/json"
        },
        xhrFields: {
            withCredentials: true
        },
        method: "POST",
        data: data,
        success: function (response) {
            $("#btnGetBatchTransferRequest").click();
            $("#divTransferFunds").hide();
            alertSuccess("POST CompleteSettlement Success...");

        },
        error: function (error) {
            console.log(error);
            alertError(error.responseJSON.error.message);
        }
    });
}

function alertTransferFunds(batchId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You are going to Transfer Fund for Batch Id: " + batchId,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.value) {
            actionTransferFunds(batchId)
        }
    })
}

function actionTransferFunds(batchId) {
    blockUICustom();
    var data = JSON.stringify(
        {
            "$class": "com.itms.TransferFunds",
            "batchId": batchId,
            "transactionId": "",
            "timestamp": new Date()
        });

    $.ajax({
        url: _SitePath + '/TransferFunds',
        headers: {
            "Content-Type": "application/json"
        },
        xhrFields: {
            withCredentials: true
        },
        method: "POST",
        data: data,
        success: function (response) {
            $("#btnGetBatchTransferRequest").click();
            $("#divTransferFunds").hide();
            alertSuccess("POST TransferFunds Success");

        },
        error: function (error) {
            console.log(error);
            alertError(error.responseJSON.error.message);
        }
    });
}

function hideActions() {
    $("#divSubmitTrx").hide();
    $("#divUpdateTrx").hide();
    $("#divPrepareSett").hide();
    $("#divTransferFunds").hide();
    $("#divCompleteSett").hide();
}

function getDateInFormat(stringDate) {
    var d = new Date(stringDate);

    var date = d.getDate();
    var dateStr = date;
    if (date < 10)
        dateStr = "0" + date;

    var month = d.getMonth(); //Be careful! January is 0 not 1
    month = month + 1;
    var monthStr = month;
    if (month < 10)
        monthStr = "0" + month;

    var year = d.getFullYear();

    minutes = d.getMinutes().toString().length === 1 ? '0' + d.getMinutes() : d.getMinutes();
    hours = d.getHours().toString().length === 1 ? '0' + d.getHours() : d.getHours();
    return year + "/" + monthStr + "/" + dateStr + ' ' + hours + ':' + minutes;   
}

function makeRequestId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function makeRequestPrepId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function alertSuccess(msgSuccess) {
    Swal.fire({
        position: 'center',
        type: 'success',
        title: msgSuccess,
        showConfirmButton: true,
        timer: 3500
    });
}

function alertError(msgError) {
    Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: msgError
    });
}

function alertWarningInputData() {
    Swal.fire({
        type: 'warning',
        title: 'Something wrong',
        text: 'Please, validate input data'
    });
}

function getCompanyByUser(userName) {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache': 'no-cache'
        },
        credentials: 'same-origin',
        url: _SitePath + '/system/identities',
        dataType: 'json',
        success: function (response) {
            $.each(response, function (i, item) {
                if (item.name === userName) {
                    _Company = item.participant.split("#")[1];
                    $('#company').append(_Company);                    
                    return false;
                }
            });
        },
        error: function (error) {
            $('#wallet').html("Log in to: <a target='_blank' href='http://104.196.27.3:3000/auth/github'> REST Composer SERVER <a>");
        }
    });
    
}

function blockUICustom() {
    $.blockUI({
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5,
            color: '#fff',
            fontSize: '10px'
        },
        baseZ: 2000
    }); 
}