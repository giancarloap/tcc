function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    query = query.replace('#','');
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return 'Query Variable ' + variable + ' not found';
}

function start() {
    // Test First load on storage database.
    data = test_first_load('data');

    document.getElementById("bubblechartlink").addEventListener("click", function () {
        $.ajax({
            url: chrome.extension.getURL('templates/charts/bubble_chart.html'),
            async: false,
            dataType: 'html',
            success: function (BubbleChartHtml) {
                $("#page-wrapper").html(BubbleChartHtml);

                document.getElementById("filter").addEventListener("click", function () {
                    if ($("#startTimeInput").val()){
                        startTime = $("#startTimeInput").val();
                    }else {
                        startTime = -1;
                    }
                    if ($("#endTimeInput").val()){
                        endTime = $("#endTimeInput").val();
                    }else {
                        endTime = -1;
                    }
                    buildBubbleChart(startTime, endTime);
                });
            }
        });
        buildBubbleChart(-1, -1);
    });

    //document.getElementById("zoomablecirclesofcategorieslink").addEventListener("click", function () {
    //    $.ajax({
    //        url: chrome.extension.getURL('templates/charts/zoomable_circles_of_website_categories.html'),
    //        async: false,
    //        dataType: 'html',
    //        success: function (ZoomableCirclesOfCategories) {
    //            $("#page-wrapper").html(ZoomableCirclesOfCategories);
    //        }
    //    });
    //    buildZoomableCirclesOfCategories();
    //});

    //document.getElementById("zoomablecirclesofproductivitylink").addEventListener("click", function () {
    //    $.ajax({
    //        url: chrome.extension.getURL('templates/charts/zoomable_circles_of_website_productivity.html'),
    //        async: false,
    //        dataType: 'html',
    //        success: function (ZoomableCirclesOfProductivity) {
    //            $("#page-wrapper").html(ZoomableCirclesOfProductivity);
    //        }
    //    });
    //    buildZoomableCirclesOfProductivity();
    //});

    document.getElementById("graphofvisitedurlsandrefererslink").addEventListener("click", function () {
        $.ajax({
            url: chrome.extension.getURL('templates/charts/graph_of_visited_urls_and_referers.html'),
            async: false,
            dataType: 'html',
            success: function (DirectedGraphOfUrlsAndReferers) {
                $("#page-wrapper").html(DirectedGraphOfUrlsAndReferers);

                document.getElementById("filter").addEventListener("click", function () {
                    //alert('test');
                    if ($("#startTimeInput").val()){
                        startTime = $("#startTimeInput").val();
                    }else {
                        startTime = -1;
                    }
                    if ($("#endTimeInput").val()){
                        endTime = $("#endTimeInput").val();
                    }else {
                        endTime = -1;
                    }
                    //alert(startTime);
                    //alert(endTime);
                    buildDirectedGraphOfVisitedUrlsAndReferers(startTime, endTime);
                });
            }
        });
        buildDirectedGraphOfVisitedUrlsAndReferers(-1, -1);
    });

    document.getElementById("chartofvisitfrequencylink").addEventListener("click", function () {
        $.ajax({
            url: chrome.extension.getURL('templates/charts/chart_of_visit_frequency.html'),
            async: false,
            dataType: 'html',
            success: function (ChartOfVisitTime) {
                $("#page-wrapper").html(ChartOfVisitTime);
                document.getElementById("filter").addEventListener("click", function () {
                    //alert('test');
                    if ($("#startTimeInput").val()){
                        startTime = $("#startTimeInput").val();
                    }else {
                        startTime = -1;
                    }
                    if ($("#endTimeInput").val()){
                        endTime = $("#endTimeInput").val();
                    }else {
                        endTime = -1;
                    }
                    //alert(startTime);
                    //alert(endTime);
                    //buildDirectedGraphOfVisitedUrlsAndReferers(startTime, endTime);
                    init_highlight();
                    set_data(startTime, endTime);
                });
                init_highlight();
                set_data(-1, -1);
            }
        });
    });

    if (getQueryVariable('chart') == 'bubble_chart') {
        //alert('bubble_chart no get');
        document.getElementById("bubblechartlink").click();
    }

    document.getElementById("navbar-brand").addEventListener("click", function () {
        window.location.href = window.location.href.split(/[?#]/)[0];
    });
}

document.addEventListener('DOMContentLoaded', function () {
    start();
});