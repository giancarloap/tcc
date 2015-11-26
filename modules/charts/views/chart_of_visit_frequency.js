/**
 * Function : dump()
 * Arguments: The data - array,hash(associative array),object
 *    The level - OPTIONAL
 * Returns  : The textual representation of the array.
 * This function was inspired by the print_r function of PHP.
 * This will accept some data as the argument and return a
 * text that will be a more readable version of the
 * array/hash/object that is given.
 * Docs: http://www.openjs.com/scripts/others/dump_function_php_print_r.php
 */
function dump(arr, level) {
    var dumped_text = "";
    if (!level) level = 0;

    //The padding given at the beginning of the line.
    var level_padding = "";
    for (var j = 0; j < level + 1; j++) level_padding += "    ";

    if (typeof(arr) == 'object') { //Array/Hashes/Objects
        for (var item in arr) {
            var value = arr[item];

            if (typeof(value) == 'object') { //If it is an array,
                dumped_text += level_padding + "'" + item + "' ...\n";
                dumped_text += dump(value, level + 1);
            } else {
                dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
            }
        }
    } else { //Stings/Chars/Numbers etc.
        dumped_text = "===>" + arr + "<===(" + typeof(arr) + ")";
    }
    return dumped_text;
}

function init_highlight() {
    //alert('hljs');
    //if (typeof(d3) == 'undefined') {
    //    /* load d3 here */
    //    alert('d3 not loaded');
    //} else {
    //    alert('d3 loaded');
    //}
    hljs.initHighlightingOnLoad();
}

function set_data(startTime, endTime) {
    //alert('data');
    //var data = [{'value': 1380854103662},{'value': 1363641921283}];
    //timeseries('timeseries', data, true);

    /* Generate random times between two dates */
    //function getData(start, end, amount) {
    //    var data = [];
    //    for (i = 0; i < amount; i++) {
    //        data.push({
    //            'value': (randomDate(start, end))
    //        })
    //    }
    //    return data;
    //}
    //
    //function randomDate(start, end) {
    //    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).valueOf();
    //}
    //var amount = 100;
    //if (window.innerWidth < 800)
    //    amount = 30;

    var data = [];
    //data.push({
    //    'value': (randomDate(start, end))
    //})
    var visit = false;
    var k = 0;


    var startTimeDate = startTime;
    if (startTime !== -1){
        startTimeDate = startTimeDate.split(" ");

        date = startTimeDate[0];
        time = startTimeDate[1];
        am_pm = startTimeDate[2];

        date = date.split("/");
        time = time.split(":");

        time[0] = parseInt(time[0]);
        time[1] = parseInt(time[1]);

        if(am_pm == "PM" && time[0]<12) time[0] = time[0]+12;
        if(am_pm == "AM" && time[0]==12) time[0] = time[0]-12;
        var sHours = time[0].toString();
        var sMinutes = time[1].toString();
        if(time[0]<10) sHours = "0" + sHours;
        if(time[1]<10) sMinutes = "0" + sMinutes;

        time[0] = sHours;
        time[1] = sMinutes;

        startTimeDate = new Date(date[2],date[0]-1,date[1], time[0], time[1]);

        startTime = startTimeDate.getTime();
    }else {
        startTime = 0;
    }


    var endTimeDate = endTime;
    if (endTime !== -1){
        endTimeDate = endTimeDate.split(" ");

        date = endTimeDate[0];
        time = endTimeDate[1];
        am_pm = endTimeDate[2];

        date = date.split("/");
        time = time.split(":");

        time[0] = parseInt(time[0]);
        time[1] = parseInt(time[1]);

        if(am_pm == "PM" && time[0]<12) time[0] = time[0]+12;
        if(am_pm == "AM" && time[0]==12) time[0] = time[0]-12;
        var sHours = time[0].toString();
        var sMinutes = time[1].toString();
        if(time[0]<10) sHours = "0" + sHours;
        if(time[1]<10) sMinutes = "0" + sMinutes;
        //alert(sHours + ":" + sMinutes);
        time[0] = sHours;
        time[1] = sMinutes;

        endTimeDate = new Date(date[2],date[0] -1,date[1], time[0], time[1]);
        //alert(endTimeDate);
        endTime = endTimeDate.getTime();
    }else {
        endTime = (new Date).getTime();
    }
    //alert(startTime);
    //alert(endTime);
    $(function () {
        $('#datetimepicker1').datetimepicker();
    });
    $(function () {
        $('#datetimepicker2').datetimepicker();
    });
    // To look for history items visited in the last week,
    // subtract a week of microseconds from the current time.
    // var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    // var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;
    // //alert(oneWeekAgo);
    //var oneWeekAgo = 0;

    //var d = new Date(2015, 09, 15);
    //var oneWeekAgo = d.getTime();
    //alert(oneWeekAgo);
    //endtime = new Date(year, month, day, hours, minutes, seconds, milliseconds);
    d2 = new Date(2015, 11, 02);
    endTimeNow = d2.getTime();

    // Track the number of callbacks from chrome.history.getVisits()
    // that we expect to get.  When it reaches zero, we have all results.
    chrome.history.search({
            'text': '',              // Return every history item....
            'startTime': 0,
            'endTime': endTimeNow,
            'maxResults': 999999999
        },
        function (historyItems) {
            // For each history item, get details on all visits.;
            //alert(historyItems.length);
            for (var i = 0; i < historyItems.length; ++i) {

                chrome.history.getVisits({url: historyItems[i].url}, function (visitItems) {

                    domain = historyItems[k].url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
                    domain = domain.replace('www.', '');
                    domain = domain.replace('.com', '');
                    domain = domain.replace('.br', '');
                    domain = domain.replace('.org', '');
                    domain = domain.replace('.net', '');
                    domain = domain.replace('.gov', '');

                    //if (visitItems.length == 1){
                    //    alert('visitItems.length == 1');
                    //}
                    //alert('i='+i);
                    //alert('k='+k);
                    //alert('url='+historyItems[k].url);
                    //alert('historyItems[k].url='+historyItems[k].url);
                    //alert('visitItems.length'+visitItems.length);

                    for (var j = 0; j < visitItems.length; ++j) {

                        //if (visitItems[j].visitTime < startTime || visitItems[j].visitTime > endTime){
                        //    //alert('continue');
                        //    if (j == visitItems.length - 1) {
                        //        k++;
                        //    }
                        //    continue;
                        //}
                        //alert('not continue');


                        associativeArray[visitItems[j].visitId] = {};
                        associativeArray[visitItems[j].visitId]['visitId'] = visitItems[j].visitId;
                        associativeArray[visitItems[j].visitId]['id'] = visitItems[j].id;
                        if (historyItems[k]) {
                            associativeArray[visitItems[j].visitId]['url'] = historyItems[k].url;
                        }
                        //associativeArray[visitItems[j].visitId]['domain'] = domain;
                        associativeArray[visitItems[j].visitId]['transition'] = visitItems[j].transition;
                        associativeArray[visitItems[j].visitId]['referringVisitId'] = visitItems[j].referringVisitId;

                        associativeArray[visitItems[j].visitId]['visitTime'] = visitItems[j].visitTime;


                        //if (domain in associativeArray[visitItems[j].visitId]['domain']) {
                        //    associativeArray[visitItems[j].visitId]['domain']['domainVisitCount'] = associativeArray[domain]['domainVisitCount'] + 1;
                        //} else {

                        associativeArray[visitItems[j].visitId]['domain'] = {};
                        associativeArray[visitItems[j].visitId]['domain']['name'] = domain;
                        associativeArray[visitItems[j].visitId]['domain']['title'] = historyItems[j].title;
                        //associativeArray[visitItems[j].visitId]['domain']['domainVisitCount'] = 1;
                        //}

                        domainVisitCountmphasis = 20;


                        if (j == visitItems.length - 1) {
                            k++;
                        }

                    }
                    if (k == historyItems.length - 1) {
                        //alert('entrou aqui');
                        links = [];

                        for (var key in associativeArray) {
                            if (associativeArray[key][['visitTime']] >= startTime && associativeArray[key][['visitTime']] <= endTime){
                                data.push({
                                    'name': associativeArray[key]['domain']['name'],
                                    'value': associativeArray[key]['visitTime']
                                })
                            }
                        }
                        $("#timeseries").html("");
                        //return;
                        //alert(dump(data));
                        timeseries('timeseries', data, true);
                        //timeseries('timeseries one', getData(new Date(2012, 1, 1), new Date(2015, 1, 2), amount), true);
                        timeseries.getBrushExtent();
                    }
                })
            }
        }
    )

}
