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

const init = () => {
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
            loadScript.load('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js', init);
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

        const type = chart.getAttribute('data-type') || 'bar';

        const config = {
            labels: data.labels,
            datasets: data.dataSets.map(dataSet => {
                return {
                    label: dataSet.label,
                    data: dataSet.data,
                    borderWidth: 1,
                    backgroundColor: (type === 'doughnut' || type === 'pie' || type === 'polarArea') ? 
                        data.dataSets.map(ds => {
                            return `rgba(${getColour(ds)}, 0.25)`;
                        }) :
                        
                        `rgba(${getColour(dataSet)}, 0.25)`,

                    borderColor: (type === 'doughnut' || type === 'pie' || type === 'polarArea') ? 
                        data.dataSets.map(ds => {
                            return `rgb(${getColour(ds)})`;
                        })
                        : 
                        
                        `rgb(${getColour(dataSet)})`
                };
            })
        };
        
        if (typeof chart.getContext !== 'function') {
            window.console.warn('Honeycomb: The chart element doesn\'t have a context, so therefore will not render.');
            return false;
        }

        new window.Chart(chart.getContext('2d'), {
            type,
            data: config
        });
    });
};

const setGlobalSettings = () => {
    window.Chart.defaults.global.defaultFontFamily = 'Roboto';
    window.Chart.defaults.global.legend.position = 'bottom';
};

const getData = chart => {
    const $deferred = window.jQuery.Deferred();

    // Get data from inline JavaScript.
    if (chart.hasAttribute('data-source')) {
        const dataSource = chart.getAttribute('data-source');
        $deferred.resolve((typeof window[dataSource] !== 'undefined') ? window[dataSource] : (typeof this[dataSource] !== 'undefined') ? this[dataSource] : null);

    // Get data from an ajax request (JSON).
    } else if (chart.hasAttribute('data-url')) {
        const dataSource = chart.getAttribute('data-url');
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