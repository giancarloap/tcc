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
function buildDirectedGraphOfVisitedUrlsAndReferers() {
    console.log('message');
    // http://blog.thomsonreuters.com/index.php/mobile-patent-suits-graphic-of-the-day/

    var links = [];

    var links = [
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
    alert(dump(links));
    //links=[];

    var rtrefererid = -1;

    // To look for history items visited in the last week,
    // subtract a week of microseconds from the current time.
    // var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    // var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;
    // alert(oneWeekAgo);
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
                domain = historyItems[i].url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
                domain = domain.replace('www.', '');
                domain = domain.replace('.com', '');
                domain = domain.replace('.br', '');
                domain = domain.replace('.org', '');
                domain = domain.replace('.net', '');
                domain = domain.replace('.gov', '');

                //var s = domain;
                //var rescuetime = null;
                ////alert(rescuetime);
                ////return;
                //if (s.indexOf("rescuetime") > -1) {
                //    // alert('tem rescuetime no dominio');
                //    rescuetime = true;
                //    //alert(rescuetime);
                //}
                //else {
                //    rescuetime = false;
                //    //alert(rescuetime);
                //}

                chrome.history.getVisits({url: historyItems[i].url}, function (visitItems) {
                    for (var i = 0; i < visitItems.length; ++i) {
                        //alert(rescuetime);
                        //alert(rtrefererid);
                        //alert(visitItems.length);
                        //alert(visitItems[i].visitId + '' + visitItems[i].url);
                        //if (visitItems[i].id == 0 ){
                        //    alert(visitItems[i].url);
                        //}
                        //if (visitItems[i].visitId == rtrefererid) {
                        //    //alert('referer do rescuetime');
                        //    //alert('url do referer do rescuetime' + historyItems[i].url);
                        //    //alert('id do referer do rescuetime' + visitItems[i].id);
                        //    //alert('visitId do referer do rescuetime' + visitItems[i].visitId);
                        //    //alert('transition do referer do rescuetime' + visitItems[i].transition);
                        //    //alert('referringVisitId do referer do rescuetime' + visitItems[i].referringVisitId);
                        //}
                        //alert('antes do teste');
                        //alert('rescuetime='+rescuetime);
                        //alert(rescuetime);
                        //if (rescuetime) {
                        //    //alert('entrou no rescuetime');
                        //    //alert('visititem do rescuetime');
                        //    //alert('id ' + visitItems[i].id);
                        //    //alert('visitId ' + visitItems[i].visitId);
                        //    //alert('transition ' + visitItems[i].transition);
                        //    //alert('referringVisitId ' + visitItems[i].referringVisitId);
                        //    rtrefererid = referringVisitId;
                        //    //alert(rtrefererid);
                        //}
                        associativeArray[visitItems[i].visitId] = {};
                        associativeArray[visitItems[i].visitId]['visitId'] = visitItems[i].visitId;
                        associativeArray[visitItems[i].visitId]['id'] = visitItems[i].id;
                        associativeArray[visitItems[i].visitId]['url'] = historyItems[i].url;
                        //associativeArray[visitItems[i].visitId]['domain'] = domain;
                        associativeArray[visitItems[i].visitId]['transition'] = visitItems[i].transition;
                        associativeArray[visitItems[i].visitId]['referringVisitId'] = visitItems[i].referringVisitId;
                        //alert(visitItems[i].transition);
                        //alert(visitItems[i].referringVisitId);
                        //alert(associativeArray[referringVisitId]['url']);
                        //if (domain in associativeArray[visitItems[i].visitId]['domain']) {
                        //    associativeArray[visitItems[i].visitId]['domain']['domainVisitCount'] = associativeArray[domain]['domainVisitCount'] + 1;
                        //} else {
                        associativeArray[visitItems[i].visitId]['domain'] = {};
                        associativeArray[visitItems[i].visitId]['domain']['name'] = domain;
                        associativeArray[visitItems[i].visitId]['domain']['title'] = historyItems[i].title;
                        //associativeArray[visitItems[i].visitId]['domain']['domainVisitCount'] = 1;
                        //}
                        //alert(typeof associativeArray);

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
                        //            //productivity = json[domain]['productivity'];
                        //            //category = json[domain]['category'];
                        //        }
                        //    });
                        //
                        //    //associativeArray[domain]['radius'] = Math.log(associativeArray[domain]['domainVisitCount']) * 10 + domainVisitCountmphasis;
                        //    //associativeArray[visitItems[i].visitId]['domain']['productivity'] = productivity;
                        //    //associativeArray[visitItems[i].visitId]['domain']['category'] = category;
                        //    //associativeArray[visitItems[i].visitId]['domain']['color'] = productivity === "Productive" ? "rgba(46, 204, 113, 1)" : (productivity === 'Unproductive' ? "rgba(230, 85, 13, 1.0)" : (productivity === 'Neutral' ? "rgba(255, 255, 0, 1.0)" : "rgba(107, 174, 214, 1.0)"));
                        //    //associativeArray[visitItems[i].visitId]['domain']['text'] = associativeArray[domain]['domain'] + '  Visits: ' + associativeArray[domain]['domainVisitCount'] + ' ' + (typeof productivity === 'undefined' ? 'Unclassified' : productivity)
                        //}
                    }
                })
            }
        })


    links = [];
    alert(associativeArray.length);

    for (var i = 0; i < associativeArray.length;i++) {
        //alert(associativeArray)
        alert(i);
    }
    //alert('test');
    //console.log('message2');
    //while (associativeArray){
    //    console.log('message2b');
    //    break;
    //}
    alert(Object.keys(associativeArray).length);
    alert(dump(associativeArray));
    i =0;
    for (var key in associativeArray) {
        //if (i < 3900){
        //    i++;
        //    continue;
        //}
        //console.log('message4');
        //alert('test2');
        reffererId = associativeArray[key]['referringVisitId'];
        //alert('test2a');
        //alert(reffererId);
        if (reffererId in associativeArray) {
            //alert('test2b');
            source = associativeArray[reffererId]['domain']['name'];
        }else{
            //alert('test2bb');
        //if (!source) {
            source = "undefined" + i;
        }
        //alert('test2c');
        target = associativeArray[key]['domain']['name'];
        //alert('test2d');
        type = "licensing";
        //alert('test2e');
        link = { "source": source, "target": target, "type": type };
        //alert('test2f');
        //alert(link['source']);
        links.push(link);
        //alert(dump(links));
        i++;
    }
alert(dump(links));

        //reffererId = associativeArray[visitId][referringVisitId];
        //source = associativeArray[reffererId]['domain']['name'];
        //if (!source) {
        //    source = "undefined";
        //}
        //target = associativeArray[visitId]['domain']['name'];
        //type = "licensing";

    //console.log(dump(associativeArray));
    //for (var key in associativeArray) {
    //    console.log('message4');
    //    alert('test2');
    //    //reffererId = associativeArray[visitId][referringVisitId];
    //    //source = associativeArray[reffererId]['domain']['name'];
    //    //if (!source) {
    //    //    source = "undefined";
    //    //}
    //    //target = associativeArray[visitId]['domain']['name'];
    //    //type = "licensing";
    //
    //    link = {source: "Microsoft", target: "Amazon", type: "licensing"};
    //    alert('test');
    //    console.log(link['source']);
    //    //alert(link['source']);
    //    links.append(link);
    //    //alert(link['source']);
    //    //links = [
    //    //    {source: "Microsoft", target: "Amazon", type: "licensing"},
    //    //    {source: "Microsoft", target: "HTC", type: "licensing"},
    //    //    {source: "Samsung", target: "Apple", type: "suit"},
    //    //    {source: "Motorola", target: "Apple", type: "suit"},
    //    //    {source: "Nokia", target: "Apple", type: "resolved"},
    //    //    {source: "HTC", target: "Apple", type: "suit"},
    //    //    {source: "Kodak", target: "Apple", type: "suit"},
    //    //    {source: "Microsoft", target: "Barnes & Noble", type: "suit"},
    //    //    {source: "Microsoft", target: "Foxconn", type: "suit"},
    //    //    {source: "Oracle", target: "Google", type: "suit"},
    //    //    {source: "Apple", target: "HTC", type: "suit"},
    //    //    {source: "Microsoft", target: "Inventec", type: "suit"},
    //    //    {source: "Samsung", target: "Kodak", type: "resolved"},
    //    //    {source: "LG", target: "Kodak", type: "resolved"},
    //    //    {source: "RIM", target: "Kodak", type: "suit"},
    //    //    {source: "Sony", target: "LG", type: "suit"},
    //    //    {source: "Kodak", target: "LG", type: "resolved"},
    //    //    {source: "Apple", target: "Nokia", type: "resolved"},
    //    //    {source: "Qualcomm", target: "Nokia", type: "resolved"},
    //    //    {source: "Apple", target: "Motorola", type: "suit"},
    //    //    {source: "Microsoft", target: "Motorola", type: "suit"},
    //    //    {source: "Motorola", target: "Microsoft", type: "suit"},
    //    //    {source: "Huawei", target: "ZTE", type: "suit"},
    //    //    {source: "Ericsson", target: "ZTE", type: "suit"},
    //    //    {source: "Kodak", target: "Samsung", type: "resolved"},
    //    //    {source: "Apple", target: "Samsung", type: "suit"},
    //    //    {source: "Kodak", target: "RIM", type: "suit"},
    //    //    {source: "Nokia", target: "Qualcomm", type: "suit"}
    //    //];
    //}

    //links = [
    //    {source: "Microsoft", target: "Amazon", type: "licensing"},
    //    {source: "Microsoft", target: "HTC", type: "licensing"},
    //    {source: "Samsung", target: "Apple", type: "suit"},
    //    {source: "Motorola", target: "Apple", type: "suit"},
    //    {source: "Nokia", target: "Apple", type: "resolved"},
    //    {source: "HTC", target: "Apple", type: "suit"},
    //    {source: "Kodak", target: "Apple", type: "suit"},
    //    {source: "Microsoft", target: "Barnes & Noble", type: "suit"},
    //    {source: "Microsoft", target: "Foxconn", type: "suit"},
    //    {source: "Oracle", target: "Google", type: "suit"},
    //    {source: "Apple", target: "HTC", type: "suit"},
    //    {source: "Microsoft", target: "Inventec", type: "suit"},
    //    {source: "Samsung", target: "Kodak", type: "resolved"},
    //    {source: "LG", target: "Kodak", type: "resolved"},
    //    {source: "RIM", target: "Kodak", type: "suit"},
    //    {source: "Sony", target: "LG", type: "suit"},
    //    {source: "Kodak", target: "LG", type: "resolved"},
    //    {source: "Apple", target: "Nokia", type: "resolved"},
    //    {source: "Qualcomm", target: "Nokia", type: "resolved"},
    //    {source: "Apple", target: "Motorola", type: "suit"},
    //    {source: "Microsoft", target: "Motorola", type: "suit"},
    //    {source: "Motorola", target: "Microsoft", type: "suit"},
    //    {source: "Huawei", target: "ZTE", type: "suit"},
    //    {source: "Ericsson", target: "ZTE", type: "suit"},
    //    {source: "Kodak", target: "Samsung", type: "resolved"},
    //    {source: "Apple", target: "Samsung", type: "suit"},
    //    {source: "Kodak", target: "RIM", type: "suit"},
    //    {source: "Nokia", target: "Qualcomm", type: "suit"}
    //];
    //alert('test2');
    //alert(typeof links);
    //alert(links[0]);
    console.log('message5');
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
        .linkDistance(60)
        .charge(-300)
        .on("tick", tick)
        .start();

    var svg = d3.select("#directedgraphofvisitedurlsandrefererscontent").append("svg")
        .attr("width", width)
        .attr("height", height);

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
        .attr("r", 6)
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
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    }

    function transform(d) {
        return "translate(" + d.x + "," + d.y + ")";
    }
}