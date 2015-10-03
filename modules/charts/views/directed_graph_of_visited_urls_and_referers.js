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
    console.log('message');
    // http://blog.thomsonreuters.com/index.php/mobile-patent-suits-graphic-of-the-day/

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

                alert(historyItems.length);
                alert(historyItems[i].url);

                chrome.history.getVisits({url: historyItems[i].url}, function (visitItems) {

                    for (var j = 0; j < visitItems.length; ++j) {

                        alert('visitItem.length=' + visitItems.length);
                        alert(historyItems[i].url);
                        alert('visitItem.visitid=' +visitItems[j].visitId);
                        alert('visitItem.id='+visitItems[j].id);

                        associativeArray[visitItems[j].visitId] = {};
                        associativeArray[visitItems[j].visitId]['visitId'] = visitItems[j].visitId;
                        associativeArray[visitItems[j].visitId]['id'] = visitItems[j].id;
                        associativeArray[visitItems[j].visitId]['url'] = historyItems[i].url;
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
                        //            //productivity = json[domain]['productivity'];
                        //            //category = json[domain]['category'];
                        //        }
                        //    });
                        //
                        //    //associativeArray[domain]['radius'] = Math.log(associativeArray[domain]['domainVisitCount']) * 10 + domainVisitCountmphasis;
                        //    //associativeArray[visitItems[j].visitId]['domain']['productivity'] = productivity;
                        //    //associativeArray[visitItems[j].visitId]['domain']['category'] = category;
                        //    //associativeArray[visitItems[j].visitId]['domain']['color'] = productivity === "Productive" ? "rgba(46, 204, 113, 1)" : (productivity === 'Unproductive' ? "rgba(230, 85, 13, 1.0)" : (productivity === 'Neutral' ? "rgba(255, 255, 0, 1.0)" : "rgba(107, 174, 214, 1.0)"));
                        //    //associativeArray[visitItems[j].visitId]['domain']['text'] = associativeArray[domain]['domain'] + '  Visits: ' + associativeArray[domain]['domainVisitCount'] + ' ' + (typeof productivity === 'undefined' ? 'Unclassified' : productivity)
                        //}
                    }
                })
            }
        })


    links = [];

    //alert(associativeArray.length);

    //for (var i = 0; i < associativeArray.length;i++) {
    //    //alert(associativeArray)
    //    alert(i);
    //}

    alert('proximo alert eh o keys do assossiative array');
    alert(Object.keys(associativeArray).length);
    alert(dump(associativeArray));
    i = 0;
    for (var key in associativeArray) {
        //alert('i' + i);
        //i++;
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
            source = associativeArray[key]['transition'];
        }
        //alert('test2c');
        target = associativeArray[key]['domain']['name'];
        //alert('test2d');
        type = "licensing";
        //alert('test2e');
        link = { "source": source, "target": target, "type": type };
        //alert('test2f');
        //alert(link['source']);

        links_contain_link = false;
        if (links.length == 0){
            links.push(link);
            alert('entrou no links vazio');
            continue;
        }

        links_length = links.length;
        repeated = false;
        for (var j = 0 ; j < links_length ; j++){
            //alert(links_length + ' jotas');
            //alert('j'+ j);
            //alert(dump(links));
            //alert('estou aqui!');
            //alert(link['source']);
            //alert(link['target']);
            //alert(link['type']);
            //alert(links[j]['source']);
            //alert(links[j]['target']);
            //alert(links[j]['type']);
            if ( link['source'] === links[j]['source'] &&
                 link['target'] === links[j]['target'] &&
                 link['type'] === links[j]['type'] ) {
                //alert('continue');
                repeated = true;
                break;
            }
        }
        if (!repeated) {
            links.push(link);
        }


        //alert(dump(links));
        //i++;
    }
alert('passou do for. proximo alert eh o dump links');
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
    //    {source: "Nokia", target: "Qualcomm", type: "suit"},
    //    {source: "Microsoft2", target: "Amazon", type: "licensing"},
    //    {source: "Microsoft2", target: "HTC", type: "licensing"},
    //    {source: "Samsung2", target: "Apple", type: "suit"},
    //    {source: "Motorola2", target: "Apple", type: "suit"},
    //    {source: "Nokia2", target: "Apple", type: "resolved"},
    //    {source: "HTC2", target: "Apple", type: "suit"},
    //    {source: "Kodak2", target: "Apple", type: "suit"},
    //    {source: "Microsoft2", target: "Barnes & Noble", type: "suit"},
    //    {source: "Microsoft2", target: "Foxconn", type: "suit"},
    //    {source: "Oracle2", target: "Google", type: "suit"},
    //    {source: "Apple2", target: "HTC", type: "suit"},
    //    {source: "Microsoft2", target: "Inventec", type: "suit"},
    //    {source: "Samsung2", target: "Kodak", type: "resolved"},
    //    {source: "LG2", target: "Kodak", type: "resolved"},
    //    {source: "RIM2", target: "Kodak", type: "suit"},
    //    {source: "Sony2", target: "LG", type: "suit"},
    //    {source: "Kodak2", target: "LG", type: "resolved"},
    //    {source: "Apple2", target: "Nokia", type: "resolved"},
    //    {source: "Qualcomm2", target: "Nokia", type: "resolved"},
    //    {source: "Apple2", target: "Motorola", type: "suit"},
    //    {source: "Microsoft2", target: "Motorola", type: "suit"},
    //    {source: "Motorola2", target: "Microsoft", type: "suit"},
    //    {source: "Huawei2", target: "ZTE", type: "suit"},
    //    {source: "Ericsson2", target: "ZTE", type: "suit"},
    //    {source: "Kodak2", target: "Samsung", type: "resolved"},
    //    {source: "Apple2", target: "Samsung", type: "suit"},
    //    {source: "Kodak2", target: "RIM", type: "suit"},
    //    {source: "Nokia2", target: "Qualcomm", type: "suit"},
    //    {source: "Microsoft2", target: "Amazon", type: "licensing"},
    //    {source: "Microsoft2", target: "HTC", type: "licensing"},
    //    {source: "Samsung2", target: "Apple", type: "suit"},
    //    {source: "Motorola2", target: "Apple", type: "suit"},
    //    {source: "Nokia2", target: "Apple", type: "resolved"},
    //    {source: "HTC2", target: "Apple", type: "suit"},
    //    {source: "Kodak2", target: "Apple", type: "suit"},
    //    {source: "Microsoft2", target: "Barnes & Noble", type: "suit"},
    //    {source: "Microsoft2", target: "Foxconn", type: "suit"},
    //    {source: "Oracle2", target: "Google", type: "suit"},
    //    {source: "Apple2", target: "HTC", type: "suit"},
    //    {source: "Microsoft2", target: "Inventec", type: "suit"},
    //    {source: "Samsung2", target: "Kodak", type: "resolved"},
    //    {source: "LG2", target: "Kodak", type: "resolved"},
    //    {source: "RIM2", target: "Kodak", type: "suit"},
    //    {source: "Sony2", target: "LG", type: "suit"},
    //    {source: "Kodak2", target: "LG", type: "resolved"},
    //    {source: "Apple2", target: "Nokia", type: "resolved"},
    //    {source: "Qualcomm2", target: "Nokia", type: "resolved"},
    //    {source: "Apple2", target: "Motorola", type: "suit"},
    //    {source: "Microsoft2", target: "Motorola", type: "suit"},
    //    {source: "Motorola2", target: "Microsoft", type: "suit"},
    //    {source: "Huawei2", target: "ZTE", type: "suit"},
    //    {source: "Ericsson2", target: "ZTE", type: "suit"},
    //    {source: "Kodak2", target: "Samsung", type: "resolved"},
    //    {source: "Apple2", target: "Samsung", type: "suit"},
    //    {source: "Kodak2", target: "RIM", type: "suit"},
    //    {source: "Nokia2", target: "Qualcomm", type: "suit"},
    //    {source: "Microsoft2", target: "Amazon", type: "licensing"},
    //    {source: "Microsoft2", target: "HTC", type: "licensing"},
    //    {source: "Samsung2", target: "Apple", type: "suit"},
    //    {source: "Motorola2", target: "Apple", type: "suit"},
    //    {source: "Nokia2", target: "Apple", type: "resolved"},
    //    {source: "HTC2", target: "Apple", type: "suit"},
    //    {source: "Kodak2", target: "Apple", type: "suit"},
    //    {source: "Microsoft2", target: "Barnes & Noble", type: "suit"},
    //    {source: "Microsoft2", target: "Foxconn", type: "suit"},
    //    {source: "Oracle2", target: "Google", type: "suit"},
    //    {source: "Apple2", target: "HTC", type: "suit"},
    //    {source: "Microsoft2", target: "Inventec", type: "suit"},
    //    {source: "Samsung2", target: "Kodak", type: "resolved"},
    //    {source: "LG2", target: "Kodak", type: "resolved"},
    //    {source: "RIM2", target: "Kodak", type: "suit"},
    //    {source: "Sony2", target: "LG", type: "suit"},
    //    {source: "Kodak2", target: "LG", type: "resolved"},
    //    {source: "Apple2", target: "Nokia", type: "resolved"},
    //    {source: "Qualcomm2", target: "Nokia", type: "resolved"},
    //    {source: "Apple2", target: "Motorola", type: "suit"},
    //    {source: "Microsoft2", target: "Motorola", type: "suit"},
    //    {source: "Motorola2", target: "Microsoft", type: "suit"},
    //    {source: "Huawei2", target: "ZTE", type: "suit"},
    //    {source: "Ericsson2", target: "ZTE", type: "suit"},
    //    {source: "Kodak2", target: "Samsung", type: "resolved"},
    //    {source: "Apple2", target: "Samsung", type: "suit"},
    //    {source: "Kodak2", target: "RIM", type: "suit"},
    //    {source: "Nokia2", target: "Qualcomm", type: "suit"},
    //    {source: "Microsoft2", target: "Amazon", type: "licensing"},
    //    {source: "Microsoft2", target: "HTC", type: "licensing"},
    //    {source: "Samsung2", target: "Apple", type: "suit"},
    //    {source: "Motorola2", target: "Apple", type: "suit"},
    //    {source: "Nokia2", target: "Apple", type: "resolved"},
    //    {source: "HTC2", target: "Apple", type: "suit"},
    //    {source: "Kodak2", target: "Apple", type: "suit"},
    //    {source: "Microsoft2", target: "Barnes & Noble", type: "suit"},
    //    {source: "Microsoft2", target: "Foxconn", type: "suit"},
    //    {source: "Oracle2", target: "Google", type: "suit"},
    //    {source: "Apple2", target: "HTC", type: "suit"},
    //    {source: "Microsoft2", target: "Inventec", type: "suit"},
    //    {source: "Samsung2", target: "Kodak", type: "resolved"},
    //    {source: "LG2", target: "Kodak", type: "resolved"},
    //    {source: "RIM2", target: "Kodak", type: "suit"},
    //    {source: "Sony2", target: "LG", type: "suit"},
    //    {source: "Kodak2", target: "LG", type: "resolved"},
    //    {source: "Apple2", target: "Nokia", type: "resolved"},
    //    {source: "Qualcomm2", target: "Nokia", type: "resolved"},
    //    {source: "Apple2", target: "Motorola", type: "suit"},
    //    {source: "Microsoft2", target: "Motorola", type: "suit"},
    //    {source: "Motorola2", target: "Microsoft", type: "suit"},
    //    {source: "Huawei2", target: "ZTE", type: "suit"},
    //    {source: "Ericsson2", target: "ZTE", type: "suit"},
    //    {source: "Kodak2", target: "Samsung", type: "resolved"},
    //    {source: "Apple2", target: "Samsung", type: "suit"},
    //    {source: "Kodak2", target: "RIM", type: "suit"},
    //    {source: "Nokia2", target: "Qualcomm", type: "suit"},
    //    {source: "Microsoft2", target: "Amazon", type: "licensing"},
    //    {source: "Microsoft2", target: "HTC", type: "licensing"},
    //    {source: "Samsung2", target: "Apple", type: "suit"},
    //    {source: "Motorola2", target: "Apple", type: "suit"},
    //    {source: "Nokia2", target: "Apple", type: "resolved"},
    //    {source: "HTC2", target: "Apple", type: "suit"},
    //    {source: "Kodak2", target: "Apple", type: "suit"},
    //    {source: "Microsoft2", target: "Barnes & Noble", type: "suit"},
    //    {source: "Microsoft2", target: "Foxconn", type: "suit"},
    //    {source: "Oracle2", target: "Google", type: "suit"},
    //    {source: "Apple2", target: "HTC", type: "suit"},
    //    {source: "Microsoft2", target: "Inventec", type: "suit"},
    //    {source: "Samsung2", target: "Kodak", type: "resolved"},
    //    {source: "LG2", target: "Kodak", type: "resolved"},
    //    {source: "RIM2", target: "Kodak", type: "suit"},
    //    {source: "Sony2", target: "LG", type: "suit"},
    //    {source: "Kodak2", target: "LG", type: "resolved"},
    //    {source: "Apple2", target: "Nokia", type: "resolved"},
    //    {source: "Qualcomm2", target: "Nokia", type: "resolved"},
    //    {source: "Apple2", target: "Motorola", type: "suit"},
    //    {source: "Microsoft2", target: "Motorola", type: "suit"},
    //    {source: "Motorola2", target: "Microsoft", type: "suit"},
    //    {source: "Huawei2", target: "ZTE", type: "suit"},
    //    {source: "Ericsson2", target: "ZTE", type: "suit"},
    //    {source: "Kodak2", target: "Samsung", type: "resolved"},
    //    {source: "Apple2", target: "Samsung", type: "suit"},
    //    {source: "Kodak2", target: "RIM", type: "suit"},
    //    {source: "Nokia2", target: "Qualcomm", type: "suit"},
    //    {source: "Microsoft2", target: "Amazon", type: "licensing"},
    //    {source: "Microsoft2", target: "HTC", type: "licensing"},
    //    {source: "Samsung2", target: "Apple", type: "suit"},
    //    {source: "Motorola2", target: "Apple", type: "suit"},
    //    {source: "Nokia2", target: "Apple", type: "resolved"},
    //    {source: "HTC2", target: "Apple", type: "suit"},
    //    {source: "Kodak2", target: "Apple", type: "suit"},
    //    {source: "Microsoft2", target: "Barnes & Noble", type: "suit"},
    //    {source: "Microsoft2", target: "Foxconn", type: "suit"},
    //    {source: "Oracle2", target: "Google", type: "suit"},
    //    {source: "Apple2", target: "HTC", type: "suit"},
    //    {source: "Microsoft2", target: "Inventec", type: "suit"},
    //    {source: "Samsung2", target: "Kodak", type: "resolved"},
    //    {source: "LG2", target: "Kodak", type: "resolved"},
    //    {source: "RIM2", target: "Kodak", type: "suit"},
    //    {source: "Sony2", target: "LG", type: "suit"},
    //    {source: "Kodak2", target: "LG", type: "resolved"},
    //    {source: "Apple2", target: "Nokia", type: "resolved"},
    //    {source: "Qualcomm2", target: "Nokia", type: "resolved"},
    //    {source: "Apple2", target: "Motorola", type: "suit"},
    //    {source: "Microsoft2", target: "Motorola", type: "suit"},
    //    {source: "Motorola2", target: "Microsoft", type: "suit"},
    //    {source: "Huawei2", target: "ZTE", type: "suit"},
    //    {source: "Ericsson2", target: "ZTE", type: "suit"},
    //    {source: "Kodak2", target: "Samsung", type: "resolved"},
    //    {source: "Apple2", target: "Samsung", type: "suit"},
    //    {source: "Kodak2", target: "RIM", type: "suit"},
    //    {source: "Nokia2", target: "Qualcomm", type: "suit"},
    //    {source: "Microsoft2", target: "Amazon", type: "licensing"},
    //    {source: "Microsoft2", target: "HTC", type: "licensing"},
    //    {source: "Samsung2", target: "Apple", type: "suit"},
    //    {source: "Motorola2", target: "Apple", type: "suit"},
    //    {source: "Nokia2", target: "Apple", type: "resolved"},
    //    {source: "HTC2", target: "Apple", type: "suit"},
    //    {source: "Kodak2", target: "Apple", type: "suit"},
    //    {source: "Microsoft2", target: "Barnes & Noble", type: "suit"},
    //    {source: "Microsoft2", target: "Foxconn", type: "suit"},
    //    {source: "Oracle2", target: "Google", type: "suit"},
    //    {source: "Apple2", target: "HTC", type: "suit"},
    //    {source: "Microsoft2", target: "Inventec", type: "suit"},
    //    {source: "Samsung2", target: "Kodak", type: "resolved"},
    //    {source: "LG2", target: "Kodak", type: "resolved"},
    //    {source: "RIM2", target: "Kodak", type: "suit"},
    //    {source: "Sony2", target: "LG", type: "suit"},
    //    {source: "Kodak2", target: "LG", type: "resolved"},
    //    {source: "Apple2", target: "Nokia", type: "resolved"},
    //    {source: "Qualcomm2", target: "Nokia", type: "resolved"},
    //    {source: "Apple2", target: "Motorola", type: "suit"},
    //    {source: "Microsoft2", target: "Motorola", type: "suit"},
    //    {source: "Motorola2", target: "Microsoft", type: "suit"},
    //    {source: "Huawei2", target: "ZTE", type: "suit"},
    //    {source: "Ericsson2", target: "ZTE", type: "suit"},
    //    {source: "Kodak2", target: "Samsung", type: "resolved"},
    //    {source: "Apple2", target: "Samsung", type: "suit"},
    //    {source: "Kodak2", target: "RIM", type: "suit"},
    //    {source: "Nokia2", target: "Qualcomm", type: "suit"},
    //    {source: "Microsoft2", target: "Amazon", type: "licensing"},
    //    {source: "Microsoft2", target: "HTC", type: "licensing"},
    //    {source: "Samsung2", target: "Apple", type: "suit"},
    //    {source: "Motorola2", target: "Apple", type: "suit"},
    //    {source: "Nokia2", target: "Apple", type: "resolved"},
    //    {source: "HTC2", target: "Apple", type: "suit"},
    //    {source: "Kodak2", target: "Apple", type: "suit"},
    //    {source: "Microsoft2", target: "Barnes & Noble", type: "suit"},
    //    {source: "Microsoft2", target: "Foxconn", type: "suit"},
    //    {source: "Oracle2", target: "Google", type: "suit"},
    //    {source: "Apple2", target: "HTC", type: "suit"},
    //    {source: "Microsoft2", target: "Inventec", type: "suit"},
    //    {source: "Samsung2", target: "Kodak", type: "resolved"},
    //    {source: "LG2", target: "Kodak", type: "resolved"},
    //    {source: "RIM2", target: "Kodak", type: "suit"},
    //    {source: "Sony2", target: "LG", type: "suit"},
    //    {source: "Kodak2", target: "LG", type: "resolved"},
    //    {source: "Apple2", target: "Nokia", type: "resolved"},
    //    {source: "Qualcomm2", target: "Nokia", type: "resolved"},
    //    {source: "Apple2", target: "Motorola", type: "suit"},
    //    {source: "Microsoft2", target: "Motorola", type: "suit"},
    //    {source: "Motorola2", target: "Microsoft", type: "suit"},
    //    {source: "Huawei2", target: "ZTE", type: "suit"},
    //    {source: "Ericsson2", target: "ZTE", type: "suit"},
    //    {source: "Kodak2", target: "Samsung", type: "resolved"},
    //    {source: "Apple2", target: "Samsung", type: "suit"},
    //    {source: "Kodak2", target: "RIM", type: "suit"},
    //    {source: "Nokia2", target: "Qualcomm", type: "suit"},
    //    {source: "Microsoft2", target: "Amazon", type: "licensing"},
    //    {source: "Microsoft2", target: "HTC", type: "licensing"},
    //    {source: "Samsung2", target: "Apple", type: "suit"},
    //    {source: "Motorola2", target: "Apple", type: "suit"},
    //    {source: "Nokia2", target: "Apple", type: "resolved"},
    //    {source: "HTC2", target: "Apple", type: "suit"},
    //    {source: "Kodak2", target: "Apple", type: "suit"},
    //    {source: "Microsoft2", target: "Barnes & Noble", type: "suit"},
    //    {source: "Microsoft2", target: "Foxconn", type: "suit"},
    //    {source: "Oracle2", target: "Google", type: "suit"},
    //    {source: "Apple2", target: "HTC", type: "suit"},
    //    {source: "Microsoft2", target: "Inventec", type: "suit"},
    //    {source: "Samsung2", target: "Kodak", type: "resolved"},
    //    {source: "LG2", target: "Kodak", type: "resolved"},
    //    {source: "RIM2", target: "Kodak", type: "suit"},
    //    {source: "Sony2", target: "LG", type: "suit"},
    //    {source: "Kodak2", target: "LG", type: "resolved"},
    //    {source: "Apple2", target: "Nokia", type: "resolved"},
    //    {source: "Qualcomm2", target: "Nokia", type: "resolved"},
    //    {source: "Apple2", target: "Motorola", type: "suit"},
    //    {source: "Microsoft2", target: "Motorola", type: "suit"},
    //    {source: "Motorola2", target: "Microsoft", type: "suit"},
    //    {source: "Huawei2", target: "ZTE", type: "suit"},
    //    {source: "Ericsson2", target: "ZTE", type: "suit"},
    //    {source: "Kodak2", target: "Samsung", type: "resolved"},
    //    {source: "Apple2", target: "Samsung", type: "suit"},
    //    {source: "Kodak2", target: "RIM", type: "suit"},
    //    {source: "Nokia2", target: "Qualcomm", type: "suit"},
    //    {source: "Microsoft2", target: "Amazon", type: "licensing"},
    //    {source: "Microsoft2", target: "HTC", type: "licensing"},
    //    {source: "Samsung2", target: "Apple", type: "suit"},
    //    {source: "Motorola2", target: "Apple", type: "suit"},
    //    {source: "Nokia2", target: "Apple", type: "resolved"},
    //    {source: "HTC2", target: "Apple", type: "suit"},
    //    {source: "Kodak2", target: "Apple", type: "suit"},
    //    {source: "Microsoft2", target: "Barnes & Noble", type: "suit"},
    //    {source: "Microsoft2", target: "Foxconn", type: "suit"},
    //    {source: "Oracle2", target: "Google", type: "suit"},
    //    {source: "Apple2", target: "HTC", type: "suit"},
    //    {source: "Microsoft2", target: "Inventec", type: "suit"},
    //    {source: "Samsung2", target: "Kodak", type: "resolved"},
    //    {source: "LG2", target: "Kodak", type: "resolved"},
    //    {source: "RIM2", target: "Kodak", type: "suit"},
    //    {source: "Sony2", target: "LG", type: "suit"},
    //    {source: "Kodak2", target: "LG", type: "resolved"},
    //    {source: "Apple2", target: "Nokia", type: "resolved"},
    //    {source: "Qualcomm2", target: "Nokia", type: "resolved"},
    //    {source: "Apple2", target: "Motorola", type: "suit"},
    //    {source: "Microsoft2", target: "Motorola", type: "suit"},
    //    {source: "Motorola2", target: "Microsoft", type: "suit"},
    //    {source: "Huawei2", target: "ZTE", type: "suit"},
    //    {source: "Ericsson2", target: "ZTE", type: "suit"},
    //    {source: "Kodak2", target: "Samsung", type: "resolved"},
    //    {source: "Apple2", target: "Samsung", type: "suit"},
    //    {source: "Kodak2", target: "RIM", type: "suit"},
    //    {source: "Nokia2", target: "Qualcomm", type: "suit"},
    //    {source: "Microsoft2", target: "Amazon", type: "licensing"},
    //    {source: "Microsoft2", target: "HTC", type: "licensing"},
    //    {source: "Samsung2", target: "Apple", type: "suit"},
    //    {source: "Motorola2", target: "Apple", type: "suit"},
    //    {source: "Nokia2", target: "Apple", type: "resolved"},
    //    {source: "HTC2", target: "Apple", type: "suit"},
    //    {source: "Kodak2", target: "Apple", type: "suit"},
    //    {source: "Microsoft2", target: "Barnes & Noble", type: "suit"},
    //    {source: "Microsoft2", target: "Foxconn", type: "suit"},
    //    {source: "Oracle2", target: "Google", type: "suit"},
    //    {source: "Apple2", target: "HTC", type: "suit"},
    //    {source: "Microsoft2", target: "Inventec", type: "suit"},
    //    {source: "Samsung2", target: "Kodak", type: "resolved"},
    //    {source: "LG2", target: "Kodak", type: "resolved"},
    //    {source: "RIM2", target: "Kodak", type: "suit"},
    //    {source: "Sony2", target: "LG", type: "suit"},
    //    {source: "Kodak2", target: "LG", type: "resolved"},
    //    {source: "Apple2", target: "Nokia", type: "resolved"},
    //    {source: "Qualcomm2", target: "Nokia", type: "resolved"},
    //    {source: "Apple2", target: "Motorola", type: "suit"},
    //    {source: "Microsoft2", target: "Motorola", type: "suit"},
    //    {source: "Motorola2", target: "Microsoft", type: "suit"},
    //    {source: "Huawei2", target: "ZTE", type: "suit"},
    //    {source: "Ericsson2", target: "ZTE", type: "suit"},
    //    {source: "Kodak2", target: "Samsung", type: "resolved"},
    //    {source: "Apple2", target: "Samsung", type: "suit"},
    //    {source: "Kodak2", target: "RIM", type: "suit"},
    //    {source: "Nokia2", target: "Qualcomm", type: "suit"},
    //    {source: "Microsoft2", target: "Amazon", type: "licensing"},
    //    {source: "Microsoft2", target: "HTC", type: "licensing"},
    //    {source: "Samsung2", target: "Apple", type: "suit"},
    //    {source: "Motorola2", target: "Apple", type: "suit"},
    //    {source: "Nokia2", target: "Apple", type: "resolved"},
    //    {source: "HTC2", target: "Apple", type: "suit"},
    //    {source: "Kodak2", target: "Apple", type: "suit"},
    //    {source: "Microsoft2", target: "Barnes & Noble", type: "suit"},
    //    {source: "Microsoft2", target: "Foxconn", type: "suit"},
    //    {source: "Oracle2", target: "Google", type: "suit"},
    //    {source: "Apple2", target: "HTC", type: "suit"},
    //    {source: "Microsoft2", target: "Inventec", type: "suit"},
    //    {source: "Samsung2", target: "Kodak", type: "resolved"},
    //    {source: "LG2", target: "Kodak", type: "resolved"},
    //    {source: "RIM2", target: "Kodak", type: "suit"},
    //    {source: "Sony2", target: "LG", type: "suit"},
    //    {source: "Kodak2", target: "LG", type: "resolved"},
    //    {source: "Apple2", target: "Nokia", type: "resolved"},
    //    {source: "Qualcomm2", target: "Nokia", type: "resolved"},
    //    {source: "Apple2", target: "Motorola", type: "suit"},
    //    {source: "Microsoft2", target: "Motorola", type: "suit"},
    //    {source: "Motorola2", target: "Microsoft", type: "suit"},
    //    {source: "Huawei2", target: "ZTE", type: "suit"},
    //    {source: "Ericsson2", target: "ZTE", type: "suit"},
    //    {source: "Kodak2", target: "Samsung", type: "resolved"},
    //    {source: "Apple2", target: "Samsung", type: "suit"},
    //    {source: "Kodak2", target: "RIM", type: "suit"},
    //    {source: "Nokia2", target: "Qualcomm", type: "suit"},
    //    {source: "Microsoft2", target: "Amazon", type: "licensing"},
    //    {source: "Microsoft2", target: "HTC", type: "licensing"},
    //    {source: "Samsung2", target: "Apple", type: "suit"},
    //    {source: "Motorola2", target: "Apple", type: "suit"},
    //    {source: "Nokia2", target: "Apple", type: "resolved"},
    //    {source: "HTC2", target: "Apple", type: "suit"},
    //    {source: "Kodak2", target: "Apple", type: "suit"},
    //    {source: "Microsoft2", target: "Barnes & Noble", type: "suit"},
    //    {source: "Microsoft2", target: "Foxconn", type: "suit"},
    //    {source: "Oracle2", target: "Google", type: "suit"},
    //    {source: "Apple2", target: "HTC", type: "suit"},
    //    {source: "Microsoft2", target: "Inventec", type: "suit"},
    //    {source: "Samsung2", target: "Kodak", type: "resolved"},
    //    {source: "LG2", target: "Kodak", type: "resolved"},
    //    {source: "RIM2", target: "Kodak", type: "suit"},
    //    {source: "Sony2", target: "LG", type: "suit"},
    //    {source: "Kodak2", target: "LG", type: "resolved"},
    //    {source: "Apple2", target: "Nokia", type: "resolved"},
    //    {source: "Qualcomm2", target: "Nokia", type: "resolved"},
    //    {source: "Apple2", target: "Motorola", type: "suit"},
    //    {source: "Microsoft2", target: "Motorola", type: "suit"},
    //    {source: "Motorola2", target: "Microsoft", type: "suit"},
    //    {source: "Huawei2", target: "ZTE", type: "suit"},
    //    {source: "Ericsson2", target: "ZTE", type: "suit"},
    //    {source: "Kodak2", target: "Samsung", type: "resolved"},
    //    {source: "Apple2", target: "Samsung", type: "suit"},
    //    {source: "Kodak2", target: "RIM", type: "suit"},
    //    {source: "Nokia2", target: "Qualcomm", type: "suit"},
    //    {source: "Microsoft2", target: "Amazon", type: "licensing"},
    //    {source: "Microsoft2", target: "HTC", type: "licensing"},
    //    {source: "Samsung2", target: "Apple", type: "suit"},
    //    {source: "Motorola2", target: "Apple", type: "suit"},
    //    {source: "Nokia2", target: "Apple", type: "resolved"},
    //    {source: "HTC2", target: "Apple", type: "suit"},
    //    {source: "Kodak2", target: "Apple", type: "suit"},
    //    {source: "Microsoft2", target: "Barnes & Noble", type: "suit"},
    //    {source: "Microsoft2", target: "Foxconn", type: "suit"},
    //    {source: "Oracle2", target: "Google", type: "suit"},
    //    {source: "Apple2", target: "HTC", type: "suit"},
    //    {source: "Microsoft2", target: "Inventec", type: "suit"},
    //    {source: "Samsung2", target: "Kodak", type: "resolved"},
    //    {source: "LG2", target: "Kodak", type: "resolved"},
    //    {source: "RIM2", target: "Kodak", type: "suit"},
    //    {source: "Sony2", target: "LG", type: "suit"},
    //    {source: "Kodak2", target: "LG", type: "resolved"},
    //    {source: "Apple2", target: "Nokia", type: "resolved"},
    //    {source: "Qualcomm2", target: "Nokia", type: "resolved"},
    //    {source: "Apple2", target: "Motorola", type: "suit"},
    //    {source: "Microsoft2", target: "Motorola", type: "suit"},
    //    {source: "Motorola2", target: "Microsoft", type: "suit"},
    //    {source: "Huawei2", target: "ZTE", type: "suit"},
    //    {source: "Ericsson2", target: "ZTE", type: "suit"},
    //    {source: "Kodak2", target: "Samsung", type: "resolved"},
    //    {source: "Apple2", target: "Samsung", type: "suit"},
    //    {source: "Kodak2", target: "RIM", type: "suit"},
    //    {source: "Nokia2", target: "Qualcomm", type: "suit"},
    //    {source: "Microsoft2", target: "Amazon", type: "licensing"},
    //    {source: "Microsoft2", target: "HTC", type: "licensing"},
    //    {source: "Samsung2", target: "Apple", type: "suit"},
    //    {source: "Motorola2", target: "Apple", type: "suit"},
    //    {source: "Nokia2", target: "Apple", type: "resolved"},
    //    {source: "HTC2", target: "Apple", type: "suit"},
    //    {source: "Kodak2", target: "Apple", type: "suit"},
    //    {source: "Microsoft2", target: "Barnes & Noble", type: "suit"},
    //    {source: "Microsoft2", target: "Foxconn", type: "suit"},
    //    {source: "Oracle2", target: "Google", type: "suit"},
    //    {source: "Apple2", target: "HTC", type: "suit"},
    //    {source: "Microsoft2", target: "Inventec", type: "suit"},
    //    {source: "Samsung2", target: "Kodak", type: "resolved"},
    //    {source: "LG2", target: "Kodak", type: "resolved"},
    //    {source: "RIM2", target: "Kodak", type: "suit"},
    //    {source: "Sony2", target: "LG", type: "suit"},
    //    {source: "Kodak2", target: "LG", type: "resolved"},
    //    {source: "Apple2", target: "Nokia", type: "resolved"},
    //    {source: "Qualcomm2", target: "Nokia", type: "resolved"},
    //    {source: "Apple2", target: "Motorola", type: "suit"},
    //    {source: "Microsoft2", target: "Motorola", type: "suit"},
    //    {source: "Motorola2", target: "Microsoft", type: "suit"},
    //    {source: "Huawei2", target: "ZTE", type: "suit"},
    //    {source: "Ericsson2", target: "ZTE", type: "suit"},
    //    {source: "Kodak2", target: "Samsung", type: "resolved"},
    //    {source: "Apple2", target: "Samsung", type: "suit"},
    //    {source: "Kodak2", target: "RIM", type: "suit"},
    //    {source: "Nokia2", target: "Qualcomm", type: "suit"},
    //    {source: "Microsoft2", target: "Amazon", type: "licensing"},
    //    {source: "Microsoft2", target: "HTC", type: "licensing"},
    //    {source: "Samsung2", target: "Apple", type: "suit"},
    //    {source: "Motorola2", target: "Apple", type: "suit"},
    //    {source: "Nokia2", target: "Apple", type: "resolved"},
    //    {source: "HTC2", target: "Apple", type: "suit"},
    //    {source: "Kodak2", target: "Apple", type: "suit"},
    //    {source: "Microsoft2", target: "Barnes & Noble", type: "suit"},
    //    {source: "Microsoft2", target: "Foxconn", type: "suit"},
    //    {source: "Oracle2", target: "Google", type: "suit"},
    //    {source: "Apple2", target: "HTC", type: "suit"},
    //    {source: "Microsoft2", target: "Inventec", type: "suit"},
    //    {source: "Samsung2", target: "Kodak", type: "resolved"},
    //    {source: "LG2", target: "Kodak", type: "resolved"},
    //    {source: "RIM2", target: "Kodak", type: "suit"},
    //    {source: "Sony2", target: "LG", type: "suit"},
    //    {source: "Kodak2", target: "LG", type: "resolved"},
    //    {source: "Apple2", target: "Nokia", type: "resolved"},
    //    {source: "Qualcomm2", target: "Nokia", type: "resolved"},
    //    {source: "Apple2", target: "Motorola", type: "suit"},
    //    {source: "Microsoft2", target: "Motorola", type: "suit"},
    //    {source: "Motorola2", target: "Microsoft", type: "suit"},
    //    {source: "Huawei2", target: "ZTE", type: "suit"},
    //    {source: "Ericsson2", target: "ZTE", type: "suit"},
    //    {source: "Kodak2", target: "Samsung", type: "resolved"},
    //    {source: "Apple2", target: "Samsung", type: "suit"},
    //    {source: "Kodak2", target: "RIM", type: "suit"},
    //    {source: "Nokia2", target: "Qualcomm", type: "suit"},
    //    {source: "Microsoft2", target: "Amazon", type: "licensing"},
    //    {source: "Microsoft2", target: "HTC", type: "licensing"},
    //    {source: "Samsung2", target: "Apple", type: "suit"},
    //    {source: "Motorola2", target: "Apple", type: "suit"},
    //    {source: "Nokia2", target: "Apple", type: "resolved"},
    //    {source: "HTC2", target: "Apple", type: "suit"},
    //    {source: "Kodak2", target: "Apple", type: "suit"},
    //    {source: "Microsoft2", target: "Barnes & Noble", type: "suit"},
    //    {source: "Microsoft2", target: "Foxconn", type: "suit"},
    //    {source: "Oracle2", target: "Google", type: "suit"},
    //    {source: "Apple2", target: "HTC", type: "suit"},
    //    {source: "Microsoft2", target: "Inventec", type: "suit"},
    //    {source: "Samsung2", target: "Kodak", type: "resolved"},
    //    {source: "LG2", target: "Kodak", type: "resolved"},
    //    {source: "RIM2", target: "Kodak", type: "suit"},
    //    {source: "Sony2", target: "LG", type: "suit"},
    //    {source: "Kodak2", target: "LG", type: "resolved"},
    //    {source: "Apple2", target: "Nokia", type: "resolved"},
    //    {source: "Qualcomm2", target: "Nokia", type: "resolved"},
    //    {source: "Apple2", target: "Motorola", type: "suit"},
    //    {source: "Microsoft2", target: "Motorola", type: "suit"},
    //    {source: "Motorola2", target: "Microsoft", type: "suit"},
    //    {source: "Huawei2", target: "ZTE", type: "suit"},
    //    {source: "Ericsson2", target: "ZTE", type: "suit"},
    //    {source: "Kodak2", target: "Samsung", type: "resolved"},
    //    {source: "Apple2", target: "Samsung", type: "suit"},
    //    {source: "Kodak2", target: "RIM", type: "suit"},
    //    {source: "Nokia2", target: "Qualcomm", type: "suit"},
    //    {source: "Microsoft2", target: "Amazon", type: "licensing"},
    //    {source: "Microsoft2", target: "HTC", type: "licensing"},
    //    {source: "Samsung2", target: "Apple", type: "suit"},
    //    {source: "Motorola2", target: "Apple", type: "suit"},
    //    {source: "Nokia2", target: "Apple", type: "resolved"},
    //    {source: "HTC2", target: "Apple", type: "suit"},
    //    {source: "Kodak2", target: "Apple", type: "suit"},
    //    {source: "Microsoft2", target: "Barnes & Noble", type: "suit"},
    //    {source: "Microsoft2", target: "Foxconn", type: "suit"},
    //    {source: "Oracle2", target: "Google", type: "suit"},
    //    {source: "Apple2", target: "HTC", type: "suit"},
    //    {source: "Microsoft2", target: "Inventec", type: "suit"},
    //    {source: "Samsung2", target: "Kodak", type: "resolved"},
    //    {source: "LG2", target: "Kodak", type: "resolved"},
    //    {source: "RIM2", target: "Kodak", type: "suit"},
    //    {source: "Sony2", target: "LG", type: "suit"},
    //    {source: "Kodak2", target: "LG", type: "resolved"},
    //    {source: "Apple2", target: "Nokia", type: "resolved"},
    //    {source: "Qualcomm2", target: "Nokia", type: "resolved"},
    //    {source: "Apple2", target: "Motorola", type: "suit"},
    //    {source: "Microsoft2", target: "Motorola", type: "suit"},
    //    {source: "Motorola2", target: "Microsoft", type: "suit"},
    //    {source: "Huawei2", target: "ZTE", type: "suit"},
    //    {source: "Ericsson2", target: "ZTE", type: "suit"},
    //    {source: "Kodak2", target: "Samsung", type: "resolved"},
    //    {source: "Apple2", target: "Samsung", type: "suit"},
    //    {source: "Kodak2", target: "RIM", type: "suit"},
    //    {source: "Nokia2", target: "Qualcomm", type: "suit"},
    //    {source: "Microsoft2", target: "Amazon", type: "licensing"},
    //    {source: "Microsoft2", target: "HTC", type: "licensing"},
    //    {source: "Samsung2", target: "Apple", type: "suit"},
    //    {source: "Motorola2", target: "Apple", type: "suit"},
    //    {source: "Nokia2", target: "Apple", type: "resolved"},
    //    {source: "HTC2", target: "Apple", type: "suit"},
    //    {source: "Kodak2", target: "Apple", type: "suit"},
    //    {source: "Microsoft2", target: "Barnes & Noble", type: "suit"},
    //    {source: "Microsoft2", target: "Foxconn", type: "suit"},
    //    {source: "Oracle2", target: "Google", type: "suit"},
    //    {source: "Apple2", target: "HTC", type: "suit"},
    //    {source: "Microsoft2", target: "Inventec", type: "suit"},
    //    {source: "Samsung2", target: "Kodak", type: "resolved"},
    //    {source: "LG2", target: "Kodak", type: "resolved"},
    //    {source: "RIM2", target: "Kodak", type: "suit"},
    //    {source: "Sony2", target: "LG", type: "suit"},
    //    {source: "Kodak2", target: "LG", type: "resolved"},
    //    {source: "Apple2", target: "Nokia", type: "resolved"},
    //    {source: "Qualcomm2", target: "Nokia", type: "resolved"},
    //    {source: "Apple2", target: "Motorola", type: "suit"},
    //    {source: "Microsoft2", target: "Motorola", type: "suit"},
    //    {source: "Motorola2", target: "Microsoft", type: "suit"},
    //    {source: "Huawei2", target: "ZTE", type: "suit"},
    //    {source: "Ericsson2", target: "ZTE", type: "suit"},
    //    {source: "Kodak2", target: "Samsung", type: "resolved"},
    //    {source: "Apple2", target: "Samsung", type: "suit"},
    //    {source: "Kodak2", target: "RIM", type: "suit"},
    //    {source: "Nokia2", target: "Qualcomm", type: "suit"},
    //    {source: "Microsoft3", target: "Amazon", type: "licensing"},
    //    {source: "Microsoft3", target: "HTC", type: "licensing"},
    //    {source: "Samsung3", target: "Apple", type: "suit"},
    //    {source: "Motorola3", target: "Apple", type: "suit"},
    //    {source: "Nokia3", target: "Apple", type: "resolved"},
    //    {source: "HTC3", target: "Apple", type: "suit"},
    //    {source: "Kodak3", target: "Apple", type: "suit"},
    //    {source: "Microsoft3", target: "Barnes & Noble", type: "suit"},
    //    {source: "Microsoft3", target: "Foxconn", type: "suit"},
    //    {source: "Oracle3", target: "Google", type: "suit"},
    //    {source: "Apple3", target: "HTC", type: "suit"},
    //    {source: "Microsoft3", target: "Inventec", type: "suit"},
    //    {source: "Samsung3", target: "Kodak", type: "resolved"},
    //    {source: "LG3", target: "Kodak", type: "resolved"},
    //    {source: "RIM3", target: "Kodak", type: "suit"},
    //    {source: "Sony3", target: "LG", type: "suit"},
    //    {source: "Kodak3", target: "LG", type: "resolved"},
    //    {source: "Apple3", target: "Nokia", type: "resolved"},
    //    {source: "Qualcomm3", target: "Nokia", type: "resolved"},
    //    {source: "Apple3", target: "Motorola", type: "suit"},
    //    {source: "Microsoft3", target: "Motorola", type: "suit"},
    //    {source: "Motorola3", target: "Microsoft", type: "suit"},
    //    {source: "Huawei3", target: "ZTE", type: "suit"},
    //    {source: "Ericsson3", target: "ZTE", type: "suit"},
    //    {source: "Kodak3", target: "Samsung", type: "resolved"},
    //    {source: "Apple3", target: "Samsung", type: "suit"},
    //    {source: "Kodak3", target: "RIM", type: "suit"},
    //    {source: "Nokia3", target: "Qualcomm", type: "suit"},
    //    {source: "Microsoft4", target: "Amazon", type: "licensing"},
    //    {source: "Microsoft4", target: "HTC", type: "licensing"},
    //    {source: "Samsung4", target: "Apple", type: "suit"},
    //    {source: "Motorola4", target: "Apple", type: "suit"},
    //    {source: "Nokia4", target: "Apple", type: "resolved"},
    //    {source: "HTC4", target: "Apple", type: "suit"},
    //    {source: "Kodak4", target: "Apple", type: "suit"},
    //    {source: "Microsoft4", target: "Barnes & Noble", type: "suit"},
    //    {source: "Microsoft4", target: "Foxconn", type: "suit"},
    //    {source: "Oracle4", target: "Google", type: "suit"},
    //    {source: "Apple4", target: "HTC", type: "suit"},
    //    {source: "Microsoft4", target: "Inventec", type: "suit"},
    //    {source: "Samsung4", target: "Kodak", type: "resolved"},
    //    {source: "LG4", target: "Kodak", type: "resolved"},
    //    {source: "RIM4", target: "Kodak", type: "suit"},
    //    {source: "Sony4", target: "LG", type: "suit"},
    //    {source: "Kodak4", target: "LG", type: "resolved"},
    //    {source: "Apple4", target: "Nokia", type: "resolved"},
    //    {source: "Qualcomm4", target: "Nokia", type: "resolved"},
    //    {source: "Apple4", target: "Motorola", type: "suit"},
    //    {source: "Microsoft4", target: "Motorola", type: "suit"},
    //    {source: "Motorola4", target: "Microsoft", type: "suit"},
    //    {source: "Huawei4", target: "ZTE", type: "suit"},
    //    {source: "Ericsson4", target: "ZTE", type: "suit"},
    //    {source: "Kodak4", target: "Samsung", type: "resolved"},
    //    {source: "Apple4", target: "Samsung", type: "suit"},
    //    {source: "Kodak4", target: "RIM", type: "suit"},
    //    {source: "Nokia4", target: "Qualcomm", type: "suit"},
    //    {source: "Microsoft5", target: "Amazon", type: "licensing"},
    //    {source: "Microsoft5", target: "HTC", type: "licensing"},
    //    {source: "Samsung5", target: "Apple", type: "suit"},
    //    {source: "Motorola5", target: "Apple", type: "suit"},
    //    {source: "Nokia5", target: "Apple", type: "resolved"},
    //    {source: "HTC5", target: "Apple", type: "suit"},
    //    {source: "Kodak5", target: "Apple", type: "suit"},
    //    {source: "Microsoft5", target: "Barnes & Noble", type: "suit"},
    //    {source: "Microsoft5", target: "Foxconn", type: "suit"},
    //    {source: "Oracle5", target: "Google", type: "suit"},
    //    {source: "Apple5", target: "HTC", type: "suit"},
    //    {source: "Microsoft5", target: "Inventec", type: "suit"},
    //    {source: "Samsung5", target: "Kodak", type: "resolved"},
    //    {source: "LG5", target: "Kodak", type: "resolved"},
    //    {source: "RIM5", target: "Kodak", type: "suit"},
    //    {source: "Sony5", target: "LG", type: "suit"},
    //    {source: "Kodak5", target: "LG", type: "resolved"},
    //    {source: "Apple5", target: "Nokia", type: "resolved"},
    //    {source: "Qualcomm5", target: "Nokia", type: "resolved"},
    //    {source: "Apple5", target: "Motorola", type: "suit"},
    //    {source: "Microsoft5", target: "Motorola", type: "suit"},
    //    {source: "Motorola5", target: "Microsoft", type: "suit"},
    //    {source: "Huawei5", target: "ZTE", type: "suit"},
    //    {source: "Ericsson5", target: "ZTE", type: "suit"},
    //    {source: "Kodak5", target: "Samsung", type: "resolved"},
    //    {source: "Apple5", target: "Samsung", type: "suit"},
    //    {source: "Kodak5", target: "RIM", type: "suit"},
    //    {source: "Nokia5", target: "Qualcomm", type: "suit"},
    //    {source: "Microsoft6", target: "Amazon", type: "licensing"},
    //    {source: "Microsoft6", target: "HTC", type: "licensing"},
    //    {source: "Samsung6", target: "Apple", type: "suit"},
    //    {source: "Motorola6", target: "Apple", type: "suit"},
    //    {source: "Nokia6", target: "Apple", type: "resolved"},
    //    {source: "HTC6", target: "Apple", type: "suit"},
    //    {source: "Kodak6", target: "Apple", type: "suit"},
    //    {source: "Microsoft6", target: "Barnes & Noble", type: "suit"},
    //    {source: "Microsoft6", target: "Foxconn", type: "suit"},
    //    {source: "Oracle6", target: "Google", type: "suit"},
    //    {source: "Apple6", target: "HTC", type: "suit"},
    //    {source: "Microsoft6", target: "Inventec", type: "suit"},
    //    {source: "Samsung6", target: "Kodak", type: "resolved"},
    //    {source: "LG6", target: "Kodak", type: "resolved"},
    //    {source: "RIM6", target: "Kodak", type: "suit"},
    //    {source: "Sony6", target: "LG", type: "suit"},
    //    {source: "Kodak6", target: "LG", type: "resolved"},
    //    {source: "Apple6", target: "Nokia", type: "resolved"},
    //    {source: "Qualcomm6", target: "Nokia", type: "resolved"},
    //    {source: "Apple6", target: "Motorola", type: "suit"},
    //    {source: "Microsoft6", target: "Motorola", type: "suit"},
    //    {source: "Motorola6", target: "Microsoft", type: "suit"},
    //    {source: "Huawei6", target: "ZTE", type: "suit"},
    //    {source: "Ericsson6", target: "ZTE", type: "suit"},
    //    {source: "Kodak6", target: "Samsung", type: "resolved"},
    //    {source: "Apple6", target: "Samsung", type: "suit"},
    //    {source: "Kodak6", target: "RIM", type: "suit"},
    //    {source: "Nokia6", target: "Qualcomm", type: "suit"}
    //];

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
        .linkDistance(60)//60
        .charge(-300)//-300
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