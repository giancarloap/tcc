function start() {
    document.getElementById("bubblechartlink").addEventListener("click", function () {
        $.ajax({
            url: chrome.extension.getURL('templates/charts/bubble_chart.html'),
            async: false,
            dataType: 'html',
            success: function (BubbleChartHtml) {
                $("#page-wrapper").html(BubbleChartHtml);
            }
        });
        buildBubbleChart();
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

    document.getElementById("zoomablecirclesofproductivitylink").addEventListener("click", function () {
        $.ajax({
            url: chrome.extension.getURL('templates/charts/zoomable_circles_of_website_productivity.html'),
            async: false,
            dataType: 'html',
            success: function (ZoomableCirclesOfProductivity) {
                $("#page-wrapper").html(ZoomableCirclesOfProductivity);
            }
        });
        buildZoomableCirclesOfProductivity();
    });
}

document.addEventListener('DOMContentLoaded', function () {
    start();
});