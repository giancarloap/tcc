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

    document.getElementById("zoomablecirclesofcategorieslink").addEventListener("click", function () {
        $.ajax({
            url: chrome.extension.getURL('templates/charts/zoomable_circles_of_website_categories.html'),
            async: false,
            dataType: 'html',
            success: function (ZoomableCirclesOfCategories) {
                $("#page-wrapper").html(ZoomableCirclesOfCategories);
            }
        });
        buildZoomableCirclesOfCategories();
    });

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

    document.getElementById("directedgraphofvisitedurlsandrefererslink").addEventListener("click", function () {
        $.ajax({
            url: chrome.extension.getURL('templates/charts/directed_graph_of_visited_urls_and_referers.html'),
            async: false,
            dataType: 'html',
            success: function (DirectedGraphOfUrlsAndReferers) {
                $("#page-wrapper").html(DirectedGraphOfUrlsAndReferers);
            }
        });
        buildDirectedGraphOfVisitedUrlsAndReferers();
    });
}

document.addEventListener('DOMContentLoaded', function () {
    start();
});