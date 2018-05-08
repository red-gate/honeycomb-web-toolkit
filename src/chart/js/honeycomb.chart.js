import loadScript from '../../document/js/honeycomb.document.load-script';

// Default colours if not supplied.
const colours = [
    '204, 0, 0',        // Red
    '60, 133, 223',     // Blue
    '26, 172, 30',      // Green
    '252, 144, 3',      // Orange
    '254, 209, 0',      // Yellow
    '118, 118, 118',    // Grey
];

const init = ( config = {} ) => {
    const charts = document.querySelectorAll('.js-chart');
    if (charts.length > 0) {
        if (typeof window.Chart === 'function') {
            setGlobalSettings();
            for (let i=0; i<charts.length; i++) {
                let chart = charts[i];
                chart = ensureIsCanvas(chart);
                renderChart(chart);
            }
        } else {
            if (typeof config.url === 'undefined') {
                config.url = 'chart/vendor/chart.js.2.4.0.min.js';
            }

            loadScript.load(config.url, init);
        }
    }
};

const getColour = dataSet => {
    return (typeof dataSet.colour !== 'undefined') ? dataSet.colour : getRandomColour();
};

const getRandomColour = () => {
    const randomNumber = Math.ceil(Math.random() * colours.length) -1;
    return colours[randomNumber];
};

const setBackgroundColour = ( type, opacity, dataSets, dataSet ) => {
    if (type === 'doughnut' || type === 'pie' || type === 'polarArea') {
        return dataSets.map(ds => {
            return `rgba(${getColour(ds)}, ${opacity})`;
        });
    }

    if (type === 'scatter') {
        return 'rgba(0, 0, 0, 0)';
    }

    return `rgba(${getColour(dataSet)}, ${opacity})`;
};

const setBorderColour = ( type, opacity, dataSets, dataSet ) => {
    if (type === 'doughnut' || type === 'pie' || type === 'polarArea') {
        return dataSets.map(ds => {
            return `rgb(${getColour(ds)})`;
        });
    }

    return `rgb(${getColour(dataSet)})`;
};

const ensureIsCanvas = chart => {
    const chartNodeName = chart.nodeName.toLowerCase();
    
    if (chartNodeName !== 'canvas') {
        const chartAttributes = [];
                
        for (let i=0; i<chart.attributes.length; i++) {
            chartAttributes.push({
                attr: chart.attributes[i].nodeName,
                value: chart.attributes[i].nodeValue
            });
        }

        const canvas = document.createElement('canvas');
        for (let i=0; i<chartAttributes.length; i++) {
            canvas.setAttribute(chartAttributes[i].attr, chartAttributes[i].value);
        }
        canvas.innerHTML = chart.innerHTML;

        chart.parentElement.insertBefore(canvas, chart);
        if (typeof chart.remove === 'function') {
            chart.remove();
        } else {
            chart.removeNode(true);
        }

        chart = canvas;
    }

    return chart;
};

const renderChart = chart => {
    window.jQuery.when(getData(chart)).then(data => {

        if (!data) {
            window.console.warn('Honeycomb: No data supplied for the chart, so the chart will therefore not render.');
            return false;
        }

        const type = chart.getAttribute('data-chart-type') || 'bar';
        const config = setConfig(chart, data);
        const options = setOptions(chart);

        if (typeof chart.getContext !== 'function') {
            window.console.warn('Honeycomb: The chart element doesn\'t have a context, so therefore will not render.');
            return false;
        }

        window.Honeycomb.charts.push(new window.Chart(chart.getContext('2d'), {
            type,
            data: config,
            options
        }));
    });
};

const setConfig = ( chart, data ) => {
    const type = chart.getAttribute('data-chart-type') || 'bar';
    const colourOpacity = (chart.hasAttribute('data-chart-colour-opacity')) ? chart.getAttribute('data-chart-colour-opacity') : 0.25;

    const config = {
        labels: data.labels,
        datasets: data.dataSets.map(dataSet => {
            return {
                label: dataSet.label,
                data: dataSet.data,
                borderWidth: 1,
                backgroundColor: setBackgroundColour(type, colourOpacity, data.dataSets, dataSet),
                borderColor: setBorderColour(type, colourOpacity, data.dataSets, dataSet)
            };
        })
    };

    return config;
};

const setOptions = chart => {
    const type = chart.getAttribute('data-chart-type') || 'bar';
    const stacked = (chart.getAttribute('data-chart-stacked') === 'true') ? true : false;
    const verticalGridlines = (chart.getAttribute('data-chart-vertical-gridLines') === 'false') ? false : true;
    const horizontalGridlines = (chart.getAttribute('data-chart-horizontal-gridLines') === 'false') ? false : true;
    const legendPosition = (chart.hasAttribute('data-chart-legend-position')) ? chart.getAttribute('data-chart-legend-position') : false;
    const legendOnClick = (chart.hasAttribute('data-chart-legend-click')) ? chart.getAttribute('data-chart-legend-click') : false;
    const legend = (chart.hasAttribute('data-chart-legend')) ? chart.getAttribute('data-chart-legend') : true;
    const animation = (chart.hasAttribute('data-chart-animation')) ? chart.getAttribute('data-chart-animation') : true;
    const verticalAxis = (chart.getAttribute('data-chart-vertical-axis')) ? chart.getAttribute('data-chart-vertical-axis') : true;
    const horizontalAxis = (chart.getAttribute('data-chart-horizontal-axis')) ? chart.getAttribute('data-chart-horizontal-axis') : true;

    const options = {};

    // Stacked bar chart.
    if ((type === 'bar' || type === 'horizontalBar') && stacked) {
        options.scales = options.scales || {};

        options.scales.xAxes = options.scales.xAxes || [];
        options.scales.xAxes[0] = options.scales.xAxes[0] || {};
        options.scales.xAxes[0].stacked = true;

        options.scales.yAxes = options.scales.yAxes || [];
        options.scales.yAxes[0] = options.scales.yAxes[0] || {};
        options.scales.yAxes[0].stacked = true;
    }

    // Gridlines (on by default).
    if (!verticalGridlines) {
        options.scales = options.scales || {};
        options.scales.xAxes = options.scales.xAxes || [];
        options.scales.xAxes[0] = options.scales.xAxes[0] || {};
        options.scales.xAxes[0].gridLines = options.scales.xAxes[0].gridLines || {};
        options.scales.xAxes[0].gridLines.display = false;
    }
    if (!horizontalGridlines) {
        options.scales = options.scales || {};
        options.scales.yAxes = options.scales.yAxes || [];
        options.scales.yAxes[0] = options.scales.yAxes[0] || {};
        options.scales.yAxes[0].gridLines = options.scales.yAxes[0].gridLines || {};
        options.scales.yAxes[0].gridLines.display = false;
    }

    // Legend.
    if (legend === 'false') {
        options.legend = options.legend || {};
        options.legend.display = false;
    }

    // Legend position.
    if (legendPosition) {
        options.legend = options.legend || {};
        options.legend.display = true;
        options.legend.position = legendPosition;
    }

    // Legend callback.
    if (legendOnClick !== 'true') {
        options.legend = options.legend || {};
        options.legend.onClick = () => {};
    }

    // Animation.
    if (animation === 'false') {
        options.animation = options.animation || {};
        options.animation.duration = 0;
    }

    // Vertical axis
    if (verticalAxis === 'false') {
        options.scales = options.scales || {};
        options.scales.xAxes = options.scales.xAxes || [];
        options.scales.xAxes[0] = options.scales.xAxes[0] || {};
        options.scales.xAxes[0].display = false;
    }

    // Horizontal axis
    if (horizontalAxis === 'false') {
        options.scales = options.scales || {};
        options.scales.yAxes = options.scales.yAxes || [];
        options.scales.yAxes[0] = options.scales.yAxes[0] || {};
        options.scales.yAxes[0].display = false;
    }

    return options;
};

const setGlobalSettings = () => {
    window.Chart.defaults.global.defaultFontFamily = 'Roboto';
    window.Chart.defaults.global.legend.position = 'bottom';

    window.Honeycomb = window.Honeycomb || {};
    window.Honeycomb.charts = window.Honeycomb.charts || [];
};

const getData = chart => {
    const $deferred = window.jQuery.Deferred();

    // Get data from inline JavaScript.
    if (chart.hasAttribute('data-chart-source')) {
        const dataSource = chart.getAttribute('data-chart-source');
        $deferred.resolve((typeof window[dataSource] !== 'undefined') ? window[dataSource] : (typeof this[dataSource] !== 'undefined') ? this[dataSource] : null);

    // Get data from an ajax request (JSON).
    } else if (chart.hasAttribute('data-chart-url')) {
        const dataSource = chart.getAttribute('data-chart-url');
        window.jQuery.getJSON(dataSource, data => {
            $deferred.resolve(data);
        });

    // No data source, return null.
    } else {
        $deferred.resolve(null);
    }

    return $deferred;
};

export default {
    init
};