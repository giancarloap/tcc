// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

associativeArray = {};

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

// Search history to find up to ten links that a user has typed in,
// and show those links in a popup.
function buildBubbleChart(startTime, endTime) {
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

    // Track the number of callbacks from chrome.history.getVisits()
    // that we expect to get.  When it reaches zero, we have all results.
    chrome.history.search({
            'text': '',
            'startTime': startTime,
            'endTime': endTime,
            'maxResults': 999999999
        },
        function (historyItems) {
            // For each history item, get details on all visits.

            var associativeArray = {};

            chrome.storage.sync.get('data', function(result) {
                try {
                    data = result.data;
                    //alert(data);
                }
                catch (err) {
                    return 'key empty';
                }

                var obj = JSON.parse(data);
                for(var key in obj){
                    if (obj.hasOwnProperty(key)){
                        var value=obj[key];
                        // work with key and value
                    }
                }

                //==========Comeca a iterar sobre o historyItems
                for (var i = 0; i < historyItems.length; ++i) {
                    domain = historyItems[i].url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
                    domain = domain.replace('www.', '');
                    domain = domain.replace('.com', '');
                    domain = domain.replace('.br', '');
                    domain = domain.replace('.org', '');
                    domain = domain.replace('.net', '');
                    domain = domain.replace('.gov', '');

                    if (domain in associativeArray) {
                        associativeArray[domain]['domainVisitCount'] = associativeArray[domain]['domainVisitCount'] + 1;
                    } else {
                        associativeArray[domain] = {};
                        associativeArray[domain]['domain'] = domain;
                        associativeArray[domain]['title'] = historyItems[i].title;
                        associativeArray[domain]['domainVisitCount'] = 1;
                    }
                }
                //==========Termina de iterar sobre o historyItems

                //==========Comeca a categorizar os dominios

                domainVisitCountmphasis = 20;



                for (var domain in associativeArray) {
                    var productivity = null;
                    var category = null;

                    //alert('cheguei aqui');
                    //alert()
                    if (domain in obj) {
                        productivity = obj[domain]['productivity'];
                        category = obj[domain]['category'];
                    }

                    //associativeArray[domain]['radius'] = Math.log(associativeArray[domain]['domainVisitCount']) * 10 + domainVisitCountmphasis;
                    associativeArray[domain]['radius'] = associativeArray[domain]['domainVisitCount'];
                    associativeArray[domain]['productivity'] = productivity;
                    associativeArray[domain]['category'] = category;
                    associativeArray[domain]['color'] = productivity === "Productive" ? "rgba(46, 204, 113, 1)" : (productivity === 'Unproductive' ? "rgba(230, 85, 13, 1.0)" : (productivity === 'Neutral' ? "rgba(255, 255, 0, 1.0)" : "rgba(107, 174, 214, 1.0)"));
                    associativeArray[domain]['text'] = associativeArray[domain]['domain'] + '  Visits: ' + associativeArray[domain]['domainVisitCount'] + ' ' + (typeof productivity === 'undefined' ? 'Unclassified' : productivity)
                }

                //==========Termina de categorizar os dominios


                //==========Comeca a criar o grafico

                $("#bubblechartcontent").html("");

                var diameter = 960,
                    format = d3.format(",d"),
                    color = d3.scale.category20c();

                var bubble = d3.layout.pack()
                    .sort(null)
                    .size([diameter, diameter])
                    .padding(1.5);

                var svg = d3.select("#bubblechartcontent").append("svg")
                    .attr("width", diameter)
                    .attr("height", diameter)
                    .attr("class", "bubble")
                    ;

                var node;
                node = svg.selectAll(".node")
                    .data(bubble.nodes(classes())
                        .filter(function (d) {
                            return !d.children;
                        }))
                    .enter().append("g")
                    .attr("class", "node")
                    .on('click', function (d) { // on mouse in show line, circles and text

                        //alert(d.color);
                        //alert(typeof d.color);
                        //if (d.color === 'rgba(107, 174, 214, 1.0)') {
                        //    alert('é azul');
                        //}

                        var typed_category = prompt("Please enter the category of the website: " + d.className + " (ex: Social Networking, Communication, News & Opinion, Learning, Search, etc.), or press cancel to set category of another website.", "News & Opinion");
                        var typed_productivity = prompt("Please tell if the website " + d.className + " is Productive, Unproductive, or Neutral(neutral websites can be used in a productive or unproductive way (ex: Google, can be used to find source of knowledge for a research, or to find entertainment websites), or press cancel to set category of another website.", "Productive");

                        if (typed_category == null || typed_productivity == null) {

                        }
                        else {
                            chrome.storage.sync.get('data', function(result) {
                                try {
                                    data = result.data;
                                    //alert(data);
                                }
                                catch (err) {
                                    return 'key empty';
                                }

                                //alert(data);
                                //alert(dump(data));
                                var obj = JSON.parse(data);
                                for (var key in obj) {
                                    if (obj.hasOwnProperty(key)) {
                                        var value = obj[key];
                                        // work with key and value
                                    }
                                }

                                var key = d.className;
                                obj[key] = {
                                    "productivity": typed_productivity,
                                    "category": typed_category
                                };

                                //alert(obj);
                                //alert(JSON.stringify(obj));

                                //salvar no storage e atualizar tela.
                                chrome.storage.sync.set({'data': JSON.stringify(obj)}, function() {
                                    d.color = typed_productivity === "Productive" ? "rgba(46, 204, 113, 1)" : (typed_productivity === 'Unproductive' ? "rgba(230, 85, 13, 1.0)" : (typed_productivity === 'Neutral' ? "rgba(255, 255, 0, 1.0)" : "rgba(107, 174, 214, 1.0)"));

                                    node.append("title")
                                        .text(function (d) {
                                            //return d.className + ": " + format(d.value);
                                            return d.className + "  Visited: " + format(associativeArray[d.className]['domainVisitCount']) + " times. Category: " + typed_productivity;
                                        });

                                    node.append("circle")
                                        .attr("r", function (d) {
                                            return d.r;
                                        })
                                        .style("fill", function (d) {
                                            return d.color;
                                        })
                                    ;

                                    node.append("text")
                                        .attr("dy", ".3em")
                                        .style("text-anchor", "middle")
                                        .text(function (d) {
                                            return d.className.substring(0, d.r / 3);
                                        });
                                    return;
                                });
                            });
                        }

                    })
                    .attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    });

                node.append("title")
                    .text(function (d) {
                        //return d.className + ": " + format(d.value);
                        return d.className + "  Visited: " + format(associativeArray[d.className]['domainVisitCount']) + " times. Category: " + associativeArray[d.className]['category'];;
                    });

                node.append("circle")
                    .attr("r", function (d) {
                        return d.r;
                    })
                    .style("fill", function (d) {
                        return d.color;
                    })
                ;

                node.append("text")
                    .attr("dy", ".3em")
                    .style("text-anchor", "middle")
                    .text(function (d) {
                        return d.className.substring(0, d.r / 3);
                    });

                // Returns a flattened hierarchy containing all leaf nodes under the root.
                function classes() {
                    var classes = [];

                    for (var domain in associativeArray) {
                        classes.push({
                            className: associativeArray[domain]['domain'],
                            value: associativeArray[domain]['radius'],
                            color: associativeArray[domain]['color']
                        });
                    }
                    return {children: classes};
                }
                d3.select(self.frameElement).style("height", diameter + "px");

                //==========Termina de criar o grafico

            });




        })
}