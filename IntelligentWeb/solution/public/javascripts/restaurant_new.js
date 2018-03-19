console.log('Loaded restaurant_new.js');

$(function () {
    $('#opening-time').timepicker({
        timeFormat: 'HH:mm',
        interval: 30,
        minTime: '0',
        maxTime: '23:30',
        defaultTime: '09',
        startTime: '00:00',
        dynamic: false,
        dropdown: false,
        scrollbar: false
    });

    $('#closing-time').timepicker({
        timeFormat: 'HH:mm',
        interval: 30,
        minTime: '0',
        maxTime: '23:30',
        defaultTime: '23',
        startTime: '00:00',
        dynamic: false,
        dropdown: false,
        scrollbar: false
    });
});

function addTimes() {
    var openTimeString = $("#opening-time").val();
    var closeTimeString = $("#closing-time").val();

    if ((openTimeString !== "") && (closeTimeString !== "")) {
        var openTimeInt = (openTimeString.split(':')[0] * 60) + parseInt(openTimeString.split(':')[1]);
        var closeTimeInt = (closeTimeString.split(':')[0] * 60) + parseInt(closeTimeString.split(':')[1]);

        if (openTimeInt < closeTimeInt) {
            var dayInput = $("#days-of-week");
            var dayString = dayInput.children("option").filter(":selected").text();
            var dayValue = dayInput.val();


            var selectedTimes = $("#selected-opening-times");

            var newHTML = "\
                <div class='form-row' id='selected-day-" + dayString + "'> \
                    <div class='col-3 text-center'> \
                        <p style='margin-bottom:5px'>" + dayString + "</p> \
                    </div> \
                    <div class='col-6 text-center'> \
                        <p style='margin-bottom:5px'>" + openTimeString + " - " + closeTimeString + "</p> \
                    </div> \
                    <div class='col-3 text-center'> \
                        <a onclick='removeSelectedDay(this);' href='javascript:void(0);' id=" + dayString + " style='padding:4px'>Remove</a> \
                    </div> \
               </div> \
                ";

            dayInput.find("option[value=" + dayValue + "]").remove();
            $("#selected-times-row").prop({hidden: false});
            if (dayInput.children('option').length === 0) {
                $(".opening-times-form").prop({"disabled": true, hidden: true});
            }
            selectedTimes.append(newHTML);
            $("input[name='" + dayString.toLowerCase() + "Open']").val(openTimeInt);
            $("input[name='" + dayString.toLowerCase() + "Close']").val(closeTimeInt);

        } else {
            console.log("Invalid time choice");
        }
    } else {
        console.log("Empty time(s)");
    }
}

function removeSelectedDay(button) {
    var dayInput = $("#days-of-week");
    var daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var day = button.id;

    $("#selected-day-" + day).remove();
    $("input[name='" + day.toLowerCase() + "Open']").val(null);
    $("input[name='" + day.toLowerCase() + "Close']").val(null);
    $(".opening-times-form").attr({"disabled": false, hidden: false});
    dayInput.append($("<option></option>").attr("value", daysOfWeek.indexOf(day)).text(day));

    if (dayInput.children('option').length === 7) {
        $("#selected-times-row").prop({hidden: true});
    }
}