var _Company = "";
var _SitePath = "http://104.196.27.3:3000/api";

$(function () {        
    initData();      
    
    $("#btnGetCompanies").click(function () {
        $("#divCompanies").show();
        $("#divTransactions").hide();
        $("#divBatchTransferReq").hide();
        hideActions();

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
                    $("#companies_table tr").remove();
                    var $tr = $('<tr>').append(
                        $('<th scope="col">').text("Company Id"),
                        $('<th scope="col">').text("Company Name"),
                        $('<th scope="col">').text("Working Currency"),
                        $('<th scope="col">').text("Fund Balance"),
                        $('<th scope="col">').text(""),
                        $('<th scope="col">').text("")
                    ).appendTo('#companies_table');
                    $.each(response, function (i, item) {
                        var $tr = $('<tr>').append(
                            $('<td scope="row">').text(item.companyId),
                            $('<td>').text(item.companyName),
                            $('<td>').text(item.workingCurrency),
                            $('<td>').text(item.fundBalance),
                            item.companyId === _Company ? $('<td>').text('') :  $('<td>').append("<button type='button' class='btn btn-primary' id='btnTrxReq_" + item.companyId + "' onClick='showSubmitTrxRequest(\"" + item.companyId +"\")' > Submit Trx </button>"),
                            item.companyId === _Company ? $('<td>').text('') : $('<td>').append("<button type='button' class='btn btn-primary' id='btnPreSett_" + item.companyId + "' onClick='showPreSett(\"" + item.companyId + "\")' > Pre Sett </button>")
                        ).appendTo('#companies_table');

                        $('#companies_table').show();
                    });
                });

            },
            error: function (error) {
                console.log(error);
                alertError(error.status + " | " + JSON.stringify(error));
            }
        });
    });

    $("#btnGetTrxs").click(function () {
        $("#divCompanies").hide();
        $("#divTransactions").show();
        $("#divBatchTransferReq").hide();
        hideActions();

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
                    $("#transactions_table tr").remove();
                    var $tr = $('<tr>').append(
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
                    ).appendTo('#transactions_table');
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

                        $('#transactions_table').show();
                    });
                });

            },
            error: function (error) {
                console.log(error);
                alertError(error.status + " | " + JSON.stringify(error));
            }
        });
    });

    $("#btnPostTrx").click(function () {

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
                alertSuccess('POST Transaction Success');
                $("#btnGetTrxs").click();
                $("#divSubmitTrx").hide();
            },
            error: function (error) {
                console.log(error);
                alertError(error.status + " | " + JSON.stringify(error));
            }
        });
    });

    $("#btnUpdateTrx").click(function () {

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
                $("#divUpdateTrx").hide();
                alertSuccess("Update Transaction Success");
            },
            error: function (error) {
                console.log(error);
                alertError(error.status + " | " + JSON.stringify(error));
            }
        });
    });

    $("#btnPreSett").click(function () {
        var data = JSON.stringify(
            {
                "$class": "com.itms.PrepareSettlement",
                "batchId": $("#batchIdPreSett").val(),
                "rates": [{ "$class": "com.itms.ExchangeRate", "to": "EUR", "rate": 0.75 }],
                "companyId": $("#companyIdPreSett").val(),
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
                alertSuccess("PrepareSettlement Transaction Success... WARNING: Rates is Hardcode");
            },
            error: function (error) {
                console.log(error);
                alertError(error.status + " | " + JSON.stringify(error));
            }
        });
    });

    $("#btnGetBatchTransferRequest").click(function () {
        $("#divCompanies").hide();
        $("#divTransactions").hide();
        $("#divBatchTransferReq").show();
        hideActions();

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
                    
                    $("#batchtransfertequest_table tr").remove();
                    var $tr = $('<tr>').append(
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
                    ).appendTo('#batchtransfertequest_table');
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
                            item.state === "PENDING" & item.settlement.debtor.split("#")[1] === _Company ? $('<td>').append("<button type='button' class='btn btn-primary' id='btnTransferFunds_" + item.batchId + "' onClick='showTransferFunds(\"" + item.batchId + "\")' > Transfer Funds </button>") : $('<td>').text(''),
                            item.state === "SETTLED" & item.settlement.creditor.split("#")[1] === _Company ? $('<td>').append("<button type='button' class='btn btn-primary' id='btnCompleteSett_" + item.batchId + "' onClick='showCompleteSett(\"" + item.batchId + "\")' > Complete Sett </button>") : $('<td>').text('')
                        ).appendTo('#batchtransfertequest_table');

                        $('#batchtransfertequest_table').show();
                    });
                });

            },
            error: function (error) {
                console.log(error);
                alertError(error.status + " | " + JSON.stringify(error));
            }
        });
    });

    $("#btnTransferFunds").click(function () {

        var data = JSON.stringify(
            {
                "$class": "com.itms.TransferFunds",
                "batchId": $("#batchIdTransferFunds").val(),
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
                alertError(error.status + " | " + JSON.stringify(error));
            }
        });
    });

    $("#btnCompleteSettlement").click(function () {

        var data = JSON.stringify(
            {
                "$class": "com.itms.CompleteSettlement",
                "batchId": $("#batchIdCompleteSett").val(),
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
                alertError(error.status + " | " + JSON.stringify(error));
            }
        });
    });
});

function initData() {
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
            $('#wallet').append(response[0].name);
            getCompanyByUser(response[0].name.split("@")[0]);
            $('#companies_table').show();
        },
        error: function (error) {
            console.log(error);
            $('#wallet').html("Log in to: <a target='_blank' href='http://104.196.27.3:3000/auth/github'> REST Composer SERVER <a>");
        }
    });
}

function showSubmitTrxRequest(companyId) {
    $("#requestId").val(makeRequestId());
    $("#requestId").prop('disabled', true);
    $("#toCompanyId").val(companyId);
    $("#toCompanyId").prop('disabled', true);
    $("#divTransactions").hide();      
    $("#divSubmitTrx").show();  
}

function showUpdateTrxRequest(requestId) {
    $("#requestUpdateId").val(requestId);
    $("#requestUpdateId").prop('disabled', true);
    $("#divUpdateTrx").show();
}

function showPreSett(companyId) {
    $("#batchIdPreSett").val(makeRequestPrepId());
    $("#batchIdPreSett").prop('disabled', true);
    $("#companyIdPreSett").val(companyId);
    $("#companyIdPreSett").prop('disabled', true);
    $("#divPrepareSett").show();
}

function showTransferFunds(batchId) {
    $("#batchIdTransferFunds").val(batchId);
    $("#batchIdTransferFunds").prop('disabled', true);    
    $("#divTransferFunds").show();
}

function showCompleteSett(batchId) {
    $("#batchIdCompleteSett").val(batchId);
    $("#batchIdCompleteSett").prop('disabled', true);
    $("#divCompleteSett").show();
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
    minutes = d.getMinutes().toString().length === 1 ? '0' + d.getMinutes() : d.getMinutes();
    hours = d.getHours().toString().length === 1 ? '0' + d.getHours() : d.getHours();
    return d.toLocaleDateString() + ' ' + hours + ':' + minutes;   
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