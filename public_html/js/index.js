var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbURL = "/api/irl";
var jpdbIML = "/api/iml";
var empDBName = "EMP-DB";
var empRelationName = "EmpData";
var connToken = "90931305|-31949328535518490|90950451";

$(document).ready(function () {
    $("#empid").focus();
});

function resetForm() {
    $("#empid, #empname, #empsal, #hra, #da, #deduct").val("");
    $("#empid").prop("disabled", false);
    $("#save, #change, #reset").prop("disabled", true);
    $("#empid").focus();
}

function validateData() {
    var empid = $("#empid").val();
    var empname = $("#empname").val();
    var empsal = $("#empsal").val();
    var hra = $("#hra").val();
    var da = $("#da").val();
    var deduct = $("#deduct").val();

    if (empid === "") {
        alert("Employee ID is missing");
        $("#empid").focus();
        return "";
    }
    if (empname === "") {
        alert("Employee Name is missing");
        $("#empname").focus();
        return "";
    }
    if (empsal === "") {
        alert("Employee salary is missing");
        $("#empsal").focus();
        return "";
    }
    if (hra === "") {
        alert("HRA is missing");
        $("#hra").focus();
        return "";
    }
    if (da === "") {
        alert("DA is missing");
        $("#da").focus();
        return "";
    }
    if (deduct === "") {
        alert("Deduction is missing");
        $("#deduct").focus();
        return "";
    }

    var jsonStrObj = {
        hra: hra,
        id: empid,
        name: empname,
        salary: empsal,
        da: da,
        deduction: deduct
    };
    return JSON.stringify(jsonStrObj);
}

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getEmpIdAsJsonObj() {
    var empid = $("#empid").val();
    var jsonStr = {
        id: empid
    };
    return JSON.stringify(jsonStr);
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return;
    }

    var putRequest = createPUTRequest(connToken, jsonStrObj, empDBName, empRelationName);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    resetForm();
    $("#empid").focus();
}

function changeData() {
    $("#change").prop("disabled", true);
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return;
    }

    var updateRequest = createUPDATERecordRequest(connToken, jsonStrObj, empDBName, empRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    console.log(resJsonObj);
    resetForm();
    $("#empid").focus();
}

function getEmp() {
    var empIdJsonObj = getEmpIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, empDBName, empRelationName, empIdJsonObj);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbURL);
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status === 400) {
        $("#save, #reset").prop("disabled", false);
        $("#empname").focus();
    } else if (resJsonObj.status === 200) {
        $("#empid").prop("disabled", true);
        fillData(resJsonObj);
        $("#change, #reset").prop("disabled", false);
        $("#empname").focus();
    }
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#empname").val(record.name);
    $("#empsal").val(record.salary);
    $("#hra").val(record.hra);
    $("#da").val(record.da);
    $("#deduct").val(record.deduction);
}
