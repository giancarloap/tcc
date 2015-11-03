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

function set_data() {
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



    // To look for history items visited in the last week,
    // subtract a week of microseconds from the current time.
    // var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    // var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;
    // //alert(oneWeekAgo);
    var oneWeekAgo = 0;

    //var d = new Date(2015, 09, 15);
    //var oneWeekAgo = d.getTime();
    //alert(oneWeekAgo);
    //endtime = new Date(year, month, day, hours, minutes, seconds, milliseconds);
    d2 = new Date(2015, 11, 02);
    endtime = d2.getTime();

    // Track the number of callbacks from chrome.history.getVisits()
    // that we expect to get.  When it reaches zero, we have all results.
    chrome.history.search({
            'text': '',              // Return every history item....
            'startTime': oneWeekAgo,  // that was accessed less than one week ago.
            'endTime': endtime,
            'maxResults': 999999999
        },
        function (historyItems) {
            // For each history item, get details on all visits.;

            for (var i = 0; i < historyItems.length; ++i) {


                //alert(historyItems.length);
                //alert(historyItems[i].url);

                chrome.history.getVisits({url: historyItems[i].url}, function (visitItems) {

                    domain = historyItems[k].url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
                    domain = domain.replace('www.', '');
                    domain = domain.replace('.com', '');
                    domain = domain.replace('.br', '');
                    domain = domain.replace('.org', '');
                    domain = domain.replace('.net', '');
                    domain = domain.replace('.gov', '');

                    for (var j = 0; j < visitItems.length; ++j) {

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

                        //for (var domain in associativeArray) {
                        //    var productivity = null;
                        //    var category = null;
                        //
                        //    $.ajax({
                        //        url: chrome.extension.getURL('modules/charts/views/category.json'),
                        //        async: false,
                        //        dataType: 'json',
                        //        success: function (json) {
                        //            if (domain in json) {
                        //                productivity = json[domain]['productivity'];
                        //                category = json[domain]['category'];
                        //            }
                        //        }
                        //    });
                        //
                        ////associativeArray[domain]['radius'] = Math.log(associativeArray[domain]['domainVisitCount']) * 10 + domainVisitCountmphasis;
                        //associativeArray[visitItems[j].visitId]['domain']['productivity'] = productivity;
                        //associativeArray[visitItems[j].visitId]['domain']['category'] = category;
                        //associativeArray[visitItems[j].visitId]['domain']['color'] = productivity === "Productive" ? "rgba(46, 204, 113, 1)" : (productivity === 'Unproductive' ? "rgba(230, 85, 13, 1.0)" : (productivity === 'Neutral' ? "rgba(255, 255, 0, 1.0)" : "rgba(107, 174, 214, 1.0)"));
                        //associativeArray[visitItems[j].visitId]['domain']['text'] = associativeArray[domain]['domain'] + '  Visits: ' + associativeArray[domain]['domainVisitCount'] + ' ' + (typeof productivity === 'undefined' ? 'Unclassified' : productivity);
                        //}

                        //console.log('i='+i);
                        //console.log('j='+j);
                        //console.log('k='+k);
                        //console.log('historyitems.length='+historyItems.length);
                        if (j == visitItems.length - 1) {
                            k++;
                        }
                        if (k == historyItems.length - 1) {
                            links = [];

                            ////alert(associativeArray.length);

                            //for (var i = 0; i < associativeArray.length;i++) {
                            //    ////alert(associativeArray)
                            //    //alert(i);
                            //}

                            //alert('proximo //alert eh o keys do assossiative array');
                            //alert(Object.keys(associativeArray).length);
                            //alert(dump(associativeArray));
                            //i = 0;
                            for (var key in associativeArray) {
                                data.push({
                                    'value': associativeArray[key]['visitTime']
                                })
                            }

                            //console.log(dump(links));


                        }
                    }
                })
            }
        }
    )
    alert(dump(data));
    timeseries('timeseries', data, true);
    //timeseries('timeseries one', getData(new Date(2012, 1, 1), new Date(2015, 1, 2), amount), true);
    timeseries.getBrushExtent();
    //alert('test');
    //var circle = svg.selectAll("circle")
    //    .style("fill", function() { return "rgba(46, 204, 113, 1)" })
}
