alert('hljs');
if (typeof(d3) == 'undefined') {
/* load d3 here */
alert('d3 not loaded');
}else {
    alert('d3 loaded');
}
hljs.initHighlightingOnLoad();