// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

associativeArray = {};
links = [];

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
function buildDirectedGraphOfVisitedUrlsAndReferers() {
    //console.log('message');
    // http://blog.thomsonreuters.com/index.php/mobile-patent-suits-graphic-of-the-day/

    var visit = false;
    var k = 0;

    links = [
        {source: "Microsoft", target: "Amazon", type: "licensing"},
        {source: "Microsoft", target: "HTC", type: "licensing"},
        {source: "Samsung", target: "Apple", type: "suit"},
        {source: "Motorola", target: "Apple", type: "suit"},
        {source: "Nokia", target: "Apple", type: "resolved"},
        {source: "HTC", target: "Apple", type: "suit"},
        {source: "Kodak", target: "Apple", type: "suit"},
        {source: "Microsoft", target: "Barnes & Noble", type: "suit"},
        {source: "Microsoft", target: "Foxconn", type: "suit"},
        {source: "Oracle", target: "Google", type: "suit"},
        {source: "Apple", target: "HTC", type: "suit"},
        {source: "Microsoft", target: "Inventec", type: "suit"},
        {source: "Samsung", target: "Kodak", type: "resolved"},
        {source: "LG", target: "Kodak", type: "resolved"},
        {source: "RIM", target: "Kodak", type: "suit"},
        {source: "Sony", target: "LG", type: "suit"},
        {source: "Kodak", target: "LG", type: "resolved"},
        {source: "Apple", target: "Nokia", type: "resolved"},
        {source: "Qualcomm", target: "Nokia", type: "resolved"},
        {source: "Apple", target: "Motorola", type: "suit"},
        {source: "Microsoft", target: "Motorola", type: "suit"},
        {source: "Motorola", target: "Microsoft", type: "suit"},
        {source: "Huawei", target: "ZTE", type: "suit"},
        {source: "Ericsson", target: "ZTE", type: "suit"},
        {source: "Kodak", target: "Samsung", type: "resolved"},
        {source: "Apple", target: "Samsung", type: "suit"},
        {source: "Kodak", target: "RIM", type: "suit"},
        {source: "Nokia", target: "Qualcomm", type: "suit"}
    ];

    // To look for history items visited in the last week,
    // subtract a week of microseconds from the current time.
    // var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    // var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;
    // //alert(oneWeekAgo);
    var oneWeekAgo = 0;

    // Track the number of callbacks from chrome.history.getVisits()
    // that we expect to get.  When it reaches zero, we have all results.
    chrome.history.search({
            'text': '',              // Return every history item....
            'startTime': oneWeekAgo,  // that was accessed less than one week ago.
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

                        //if (visitItems[j].referringVisitId == 0 ){
                        //    //alert('referringVisitId igual a zero');
                        //    alert('url='+historyItems[k].url + '    transition='+visitItems[j].transition );
                        //    //alert('transition='+visitItems[j].transition);
                        //}

                        //alert('visitItem.length=' + visitItems.length);
                        //alert(historyItems[k].url);
                        //alert('visitItem.visitid=' +visitItems[j].visitId);
                        //alert('visitItem.id='+visitItems[j].id);

                        associativeArray[visitItems[j].visitId] = {};
                        associativeArray[visitItems[j].visitId]['visitId'] = visitItems[j].visitId;
                        associativeArray[visitItems[j].visitId]['id'] = visitItems[j].id;
                        if (historyItems[k]) {
                            associativeArray[visitItems[j].visitId]['url'] = historyItems[k].url;
                        }
                        //associativeArray[visitItems[j].visitId]['domain'] = domain;
                        associativeArray[visitItems[j].visitId]['transition'] = visitItems[j].transition;
                        associativeArray[visitItems[j].visitId]['referringVisitId'] = visitItems[j].referringVisitId;

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
                        if (j == visitItems.length -1) {
                            k++;
                        }
                        if (k == historyItems.length -1) {
                            links = [];

                            ////alert(associativeArray.length);

                            //for (var i = 0; i < associativeArray.length;i++) {
                            //    ////alert(associativeArray)
                            //    //alert(i);
                            //}

                            //alert('proximo //alert eh o keys do assossiative array');
                            //alert(Object.keys(associativeArray).length);
                            //alert(dump(associativeArray));
                            i = 0;
                            console.log(dump(associativeArray));
                            for (var key in associativeArray) {
                                ////alert('i' + i);
                                //i++;
                                //if (i < 3900){
                                //    i++;
                                //    continue;
                                //}
                                //console.log('message4');
                                ////alert('test2');
                                reffererId = associativeArray[key]['referringVisitId'];
                                ////alert('test2a');
                                ////alert(reffererId);
                                if (reffererId in associativeArray) {
                                    ////alert('test2b');
                                    source = associativeArray[reffererId]['domain']['name'];
                                }else{
                                    ////alert('test2bb');
                                    //if (!source) {
                                    if (associativeArray[key]['transition'] == 'link') {
                                        alert(dump(associativeArray[key]));
                                        source = 'typed in the search bar';
                                    }else {
                                        source = associativeArray[key]['transition'];
                                    }
                                    //alert('refererid='+associativeArray[key]['referringVisitId']);
                                    //alert('transition='+associativeArray[key]['transition']);
                                }
                                ////alert('test2c');
                                target = associativeArray[key]['domain']['name'];
                                ////alert('test2d');
                                type = "licensing";

                                //productivity = associativeArray[key]['domain']['productivity'];
                                //category = associativeArray[key]['domain']['category'];
                                ////alert('test2e');
                                link = { "source": source, "target": target, "type": type };
                                ////alert('test2f');
                                ////alert(link['source']);

                                links_contain_link = false;
                                if (links.length == 0){
                                    links.push(link);
                                    //alert('entrou no links vazio');
                                    continue;
                                }

                                links_length = links.length;
                                repeated = false;
                                for (var j = 0 ; j < links_length ; j++){
                                    ////alert(links_length + ' jotas');
                                    ////alert('j'+ j);
                                    ////alert(dump(links));
                                    ////alert('estou aqui!');
                                    ////alert(link['source']);
                                    ////alert(link['target']);
                                    ////alert(link['type']);
                                    ////alert(links[j]['source']);
                                    ////alert(links[j]['target']);
                                    ////alert(links[j]['type']);
                                    if ( link['source'] === links[j]['source'] &&
                                        link['target'] === links[j]['target'] &&
                                        link['type'] === links[j]['type'] ) {
                                        ////alert('continue');
                                       repeated = true;
                                        break;
                                    }
                                }
                                if (!repeated) {
                                    links.push(link);
                                }


                                ////alert(dump(links));
                                //i++;
                            }

                            //console.log(dump(links));

                            sourceRepetitionCount = {};
                            repeatedManyTimes = {};
                            for (var l = 0 ; l < links.length ; l++) {
                                if ( links[l]['source'] in sourceRepetitionCount ) {
                                    //alert(sourceRepetitionCount[links[l]['source']][links[l]['target']]);
                                    sourceRepetitionCount[links[l]['source']]['count'] = sourceRepetitionCount[links[l]['source']]['count'] + 1;
                                    if (links[l]['target'] in sourceRepetitionCount[links[l]['source']]['targets']) {

                                        //alert('estou aqui');
                                        sourceRepetitionCount[links[l]['source']]['targets'][links[l]['target']]['numTarget'] = Object.keys(sourceRepetitionCount[links[l]['source']]['targets']).length;
                                    }
                                    else{
                                        sourceRepetitionCount[links[l]['source']]['targets'][links[l]['target']] = {};
                                        sourceRepetitionCount[links[l]['source']]['targets'][links[l]['target']]['targetName'] = links[l]['target'];
                                        sourceRepetitionCount[links[l]['source']]['targets'][links[l]['target']]['numTarget'] = Object.keys(sourceRepetitionCount[links[l]['source']]['targets']).length;
                                    }
                                    if (!(sourceRepetitionCount[links[l]['source']] in repeatedManyTimes) && sourceRepetitionCount[links[l]['source']]['count'] >= 3){
                                        repeatedManyTimes[links[l]['source']] = sourceRepetitionCount[links[l]['source']];
                                    }
                                }else {
                                    sourceRepetitionCount[links[l]['source']] = {};
                                    sourceRepetitionCount[links[l]['source']]['name'] = links[l]['source'];
                                    sourceRepetitionCount[links[l]['source']]['count'] = 1;
                                    sourceRepetitionCount[links[l]['source']]['targets'] = {};
                                    sourceRepetitionCount[links[l]['source']]['targets'][links[l]['target']] = {};
                                    sourceRepetitionCount[links[l]['source']]['targets'][links[l]['target']]['targetName'] = links[l]['target'];
                                    sourceRepetitionCount[links[l]['source']]['targets'][links[l]['target']]['numTarget'] = Object.keys(sourceRepetitionCount[links[l]['source']]['targets']).length;
                                }
                            }

                            function node_in_nodes(name) {
                                for (var n=0;n<graph_data['nodes'].length;n++) {
                                    if (graph_data['nodes'][n]['name'] == name) {
                                        return true;
                                    }
                                }
                                return false;
                            }
                            var graph_data = {};
                            graph_data['nodes'] = []
                            graph_data['links'] = [];


                            alert('aqui');
                            alert(dump(graph_data));

                            var m = 0;
                            for (var name in sourceRepetitionCount) {
                                //alert('1');
                                if (!node_in_nodes(sourceRepetitionCount[name]['name'])) {
                                    //alert('2');
                                    node = {"name": sourceRepetitionCount[name]['name'], group:m};
                                    graph_data["nodes"].push(node);
                                    //alert('3');
                                }
                                for (var target_name in sourceRepetitionCount[name]['targets']) {
                                    //alert('4');
                                    if (!node_in_nodes(target_name)) {
                                        //alert('5');
                                        node = {"name": target_name, group:m};
                                        graph_data["nodes"].push(node);
                                    }
                                }
                                m++;
                                //alert('6');
                            }

                            function get_position(name) {
                                //alert(name);
                                for (var n=0;n<graph_data['nodes'].length;n++) {
                                    //alert(graph_data['nodes']);
                                    if (graph_data['nodes'][n]['name'] == name) {
                                        return n;
                                    }
                                }
                                return -1;
                            }

                            //alert('1');
                            for(var p=0;p<links.length;p++) {
                                //alert('2');
                                if (links[p]['source'] in repeatedManyTimes && !(links[p]['target'] in repeatedManyTimes)){
                                    //alert(sourceRepetitionCount[d.source.name]['numTarget']);
                                    //alert('3');
                                    if (sourceRepetitionCount[links[p]['source']]['targets'][links[p]['target']]['numTarget'] % 2 == 0) {
                                        //sourceRepetitionCount[links[l]['source']]['targets'][links[l]['target']]['numTarget']
                                        //alert('par');
                                        //alert('4');
                                        node = {"source": get_position(links[p]['source']), "target": get_position(links[p]['target']), "value": 130};
                                        graph_data["links"].push(node);
                                        //return 130;
                                    }else {
                                        //alert('5');
                                        //alert('impar');
                                        node = {"source": get_position(links[p]['source']), "target": get_position(links[p]['target']), "value": 100};
                                        graph_data["links"].push(node);
                                        //return 100;
                                    }
                                }
                                //alert('6');
                                node = {"source": get_position(links[p]['source']), "target": get_position(links[p]['target']), "value": 300};
                                graph_data["links"].push(node);
                                //return 300;
                            }



                            alert('aqui');
                            alert(dump(graph_data['nodes']));
                            alert(dump(graph_data["links"]));

                            g2j4d3_init();
                            graphSub_init(graph_data);
                            return;

                            //console.log('sourceRepetitionCount='+dump(sourceRepetitionCount));
                            //console.log('repeatedManyTimes='+dump(repeatedManyTimes));
                            //alert('sourceRepetitionCount='+dump(sourceRepetitionCount));
                            //alert('repeatedManyTimes='+dump(repeatedManyTimes));

//alert('passou do for. proximo //alert eh o dump links');
//alert(dump(links));

                            //reffererId = associativeArray[visitId][referringVisitId];
                            //source = associativeArray[reffererId]['domain']['name'];
                            //if (!source) {
                            //    source = "undefined";
                            //}
                            //target = associativeArray[visitId]['domain']['name'];
                            //type = "licensing";



                            var nodes = {};

// Compute the distinct nodes from the links.
                            links.forEach(function (link) {
                                link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
                                link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
                            });

                            var width = 960,
                                height = 500;

                            var force = d3.layout.force()
                                .nodes(d3.values(nodes))
                                .links(links)
                                .size([width, height])
                                //.linkDistance(120)//60
                                //.linkDistance(function(d) { return Math.sqrt(d.value); })//60
                                .linkDistance(function(d) {
                                    //alert('test');
                                    //alert(dump(d));
                                    //alert(d.source.name);
                                    if (d.source.name in repeatedManyTimes && !(d.target.name in repeatedManyTimes)){
                                        //alert(sourceRepetitionCount[d.source.name]['numTarget']);
                                        if (sourceRepetitionCount[d.source.name]['targets'][d.target.name]['numTarget'] % 2 == 0) {
                                            //alert('par');
                                            return 130;
                                        }else {
                                            //alert('impar');
                                            return 100;
                                        }
                                    }
                                    return 300;
                                })//60
                                .charge(-120)//-300
                                .on("tick", tick)
                                .start();

                            var svg = d3.select("#directedgraphofvisitedurlsandrefererscontent").append("svg")
                                .attr("width", 9999999999999999999999999)
                                .attr("height", 9999999999999999999999999);

// Per-type markers, as they don't inherit styles.
                            svg.append("defs").selectAll("marker")
                                .data(["suit", "licensing", "resolved"])
                                .enter().append("marker")
                                .attr("id", function (d) {
                                    return d;
                                })
                                .attr("viewBox", "0 -5 10 10")
                                .attr("refX", 15)
                                .attr("refY", -1.5)
                                .attr("markerWidth", 6)
                                .attr("markerHeight", 6)
                                .attr("orient", "auto")
                                .append("path")
                                .attr("d", "M0,-5L10,0L0,5");

                            var path = svg.append("g").selectAll("path")
                                .data(force.links())
                                .enter().append("path")
                                .attr("class", function (d) {
                                    return "link " + d.type;
                                })
                                .attr("marker-end", function (d) {
                                    return "url(#" + d.type + ")";
                                });

                            var circle = svg.append("g").selectAll("circle")
                                .data(force.nodes())
                                .enter().append("circle")
                                .attr("r", 10)//6
                                .style("fill", function (d) {
                                    //return d.color;
                                    return "rgba(46, 204, 113, 1)";
                                })
                                .call(force.drag);

                            var text = svg.append("g").selectAll("text")
                                .data(force.nodes())
                                .enter().append("text")
                                .attr("x", 8)
                                .attr("y", ".31em")
                                .text(function (d) {
                                    return d.name;
                                });

// Use elliptical arc path segments to doubly-encode directionality.
                            function tick() {
                                path.attr("d", linkArc);
                                circle.attr("transform", transform);
                                text.attr("transform", transform);
                            }

                            function linkArc(d) {
                                //alert(dump(d));
                                var dx = d.target.x - d.source.x;
                                var dy = d.target.y - d.source.y;
                                var dr = Math.sqrt(dx * dx + dy * dy);
                                //var dr = 160;
                                return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
                            }

                            function transform(d) {
                                return "translate(" + d.x + "," + d.y + ")";
                            }
                            //console.log('fim do codigo');
                        }
                    }
                })
                //console.log('i='+i);
            }
            //console.log('saiu do for do i');
            visit = true;
        })

    //while(!visit) {
    //    console.log('visit='+visit);
    //}

}