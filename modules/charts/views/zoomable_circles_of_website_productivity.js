// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

associativeArray = {};

// Search history to find up to ten links that a user has typed in,
// and show those links in a popup.
function buildZoomableCirclesOfProductivity() {
    productivity_list = {
        "name": "History",
        "children": []
    };
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
            // For each history item, get details on all visits.

            var associativeArray = {};

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
            domainVisitCountEmphasis = 20;

            for (var domain in associativeArray) {
                var productivity = null;
                var category = null;

                $.ajax({
                    url: chrome.extension.getURL('modules/charts/views/category.json'),
                    async: false,
                    dataType: 'json',
                    success: function (json) {
                        productivity = json[domain]['productivity'];
                        category = json[domain]['category'];
                    }
                });

                /*
                Fazer consulta reversa. Todas as categorias que achar.



                opção 1 - colocar a categoria como informação do dominio. Mais facil acho
                opção 2 - criar um array com as categorias e inserir os dominios dentro

                 */

                /*
                Adaptar o código que faz o zoomable circles

                 */

                associativeArray[domain]['radius'] = Math.log(associativeArray[domain]['domainVisitCount']) * 10 + domainVisitCountEmphasis;
                associativeArray[domain]['productivity'] = productivity;
                associativeArray[domain]['category'] = category;
                if ( productivity === null){
                    productivity = "Uncategorized";
                }
                associativeArray[domain]['color'] = productivity === "Productive" ? "rgba(46, 204, 113, 1)" : (productivity === 'Unproductive' ? "rgba(230, 85, 13, 1.0)" : (productivity === 'Neutral' ? "rgba(255, 255, 0, 1.0)" : "rgba(107, 174, 214, 1.0)"));
                associativeArray[domain]['text'] = associativeArray[domain]['domain'] + '  Visits: ' + associativeArray[domain]['domainVisitCount'] + ' ' + (typeof productivity === 'undefined' ? 'Unclassified' : productivity)

                prodExists = false;
                for (var i = 0; i < productivity_list['children'].length; ++i) {
                    if (productivity_list['children'][i]['name'] === productivity ){
                        prodExists = true;
                        children = {};
                        children['name'] = domain;
                        children['size'] = 3812;
                        productivity_list['children'][i]['children'].push(children);
                        break;
                    }
                }
                if (!prodExists){
                    new_prod = {};
                    new_prod['name'] = productivity;
                    new_prod['children'] = [];

                    new_domain = {};
                    new_domain['name'] = domain;
                    new_domain['size'] = 3938;

                    new_prod['children'].push(new_domain);
                    productivity_list['children'].push(new_prod);
                }
            }

            var margin = 20,
                diameter = 960;

            var color = d3.scale.linear()
                .domain([-1, 5])
                .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
                .interpolate(d3.interpolateHcl);

            var pack = d3.layout.pack()
                .padding(2)
                .size([diameter - margin, diameter - margin])
                .value(function(d) { return d.size; })

            var svg = d3.select("#zoomablecirclesofproductivitycontent").append("svg")
                .attr("width", diameter)
                .attr("height", diameter)
                .append("g")
                .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

            d3.json("../../modules/charts/views/category2.json", function(error, root) {
                if (error) throw error;
                root = productivity_list;
                var focus = root,
                    nodes = pack.nodes(root),
                    view;

                var circle = svg.selectAll("circle")
                    .data(nodes)
                    .enter().append("circle")
                    .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
                    .style("fill", function(d) { return d.children ? color(d.depth) : null; })
                    .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

                var text = svg.selectAll("text")
                    .data(nodes)
                    .enter().append("text")
                    .attr("class", "label")
                    .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
                    .style("display", function(d) { return d.parent === root ? null : "none"; })
                    .text(function(d) { return d.name; });

                var node = svg.selectAll("circle,text");

                d3.select("#zoomablecirclesofproductivitycontent")
                    .style("background", color(-1))
                    .on("click", function() { zoom(root); });

                zoomTo([root.x, root.y, root.r * 2 + margin]);

                function zoom(d) {
                    var focus0 = focus; focus = d;

                    var transition = d3.transition()
                        .duration(d3.event.altKey ? 7500 : 750)
                        .tween("zoom", function(d) {
                            var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                            return function(t) { zoomTo(i(t)); };
                        });

                    transition.selectAll("text")
                        .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
                        .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
                        .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
                        .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
                }

                function zoomTo(v) {
                    var k = diameter / v[2]; view = v;
                    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
                    circle.attr("r", function(d) { return d.r * k; });
                }
            });

            d3.select(self.frameElement).style("height", diameter + "px");

        })
}