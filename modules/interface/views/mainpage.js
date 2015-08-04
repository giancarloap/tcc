function loadBubbleChart() {
    buildBubbleChart();
}

function start() {
    document.getElementById("bubblechartlink").addEventListener("click", function () {
        $.ajax({
            url: chrome.extension.getURL('templates/bubble_chart/bubble_chart.html'),
            async: false,
            dataType: 'html',
            success: function (BubbleChartHtml) {
                $("#page-wrapper").html(BubbleChartHtml);
            }
        });
        loadBubbleChart();
    });
}

document.addEventListener('DOMContentLoaded', function () {
    start();
});