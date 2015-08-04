// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

associativeArray = {};

// Search history to find up to ten links that a user has typed in,
// and show those links in a popup.
function buildBubbleChart() {
    // To look for history items visited in the last week,
    // subtract a week of microseconds from the current time.
    //var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    //var oneWeekAgo = (new Date).getTime();
    // Track the number of callbacks from chrome.history.getVisits()
    // that we expect to get.  When it reaches zero, we have all results.
    chrome.history.search({
            'text': '',
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
            domainVisitCountmphasis = 20;

            for (var domain in associativeArray) {
                var productivity = null;
                var classification = null;

                $.ajax({
                    url: chrome.extension.getURL('modules/charts/views/classification.json'),
                    async: false,
                    dataType: 'json',
                    success: function (json) {
                        productivity = json[domain]['productivity'];
                        classification = json[domain]['classification'];
                    }
                });

                associativeArray[domain]['radius'] = Math.log(associativeArray[domain]['domainVisitCount']) * 10 + domainVisitCountmphasis;
                associativeArray[domain]['productivity'] = productivity;
                associativeArray[domain]['classification'] = classification;
                associativeArray[domain]['color'] = productivity === "Productive" ? "rgba(46, 204, 113, 1)" : (productivity === 'Unproductive' ? "rgba(230, 85, 13, 1.0)" : (productivity === 'Neutral' ? "rgba(255, 255, 0, 1.0)" : "rgba(107, 174, 214, 1.0)"));
                associativeArray[domain]['text'] = associativeArray[domain]['domain'] + '  Visits: ' + associativeArray[domain]['domainVisitCount'] + ' ' + (typeof productivity === 'undefined' ? 'Unclassified' : productivity)
            }
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
                        .attr("class", "bubble");

                    var node = svg.selectAll(".node")
                        .data(bubble.nodes(classes())
                            .filter(function (d) {
                                return !d.children;
                            }))
                        .enter().append("g")
                        .attr("class", "node")
                        .attr("transform", function (d) {
                            return "translate(" + d.x + "," + d.y + ")";
                        });

                    node.append("title")
                        .text(function (d) {
                            return d.className + ": " + format(d.value);
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
        })
}