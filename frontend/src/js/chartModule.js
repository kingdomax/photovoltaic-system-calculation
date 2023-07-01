import * as d3 from 'd3';

export function drawLineChart(reportData) {
    let svg = d3.select("svg#electricReport");
    svg.selectAll("*").remove(); // Clear the SVG
    const flatData = flatternData(reportData);

    lineChart({
        svg: svg,
        data: flatData,
        attribute: "ep",
    });
}

function lineChart({
    svg,
    data,
    attribute,
    width = 1000,
    height = 500,
    margin = { top: 20, right: 120, bottom: 30, left: 40 },
    //width = 1200,  // increase width
    //height = 600,  // increase height
    //margin = { top: 20, right: 140, bottom: 80, left: 60 },  // adjust margins
}) {
    // Convert string dates to JavaScript Date objects
    data.forEach(d => {
        d.date = new Date(d.date);
    });

    // Set viewbox attribute
    svg.attr('viewBox', [0, 0, width, height]).style('font', '10px sans-serif');

    // scale for the number of days on the x-axis
    const xScale = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.date))
        .range([margin.left, width - margin.right])
        .clamp(true);

    const yScale = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d[attribute]))
        .range([height - margin.bottom, margin.top])
        .nice();

    // group the data by productid
    let products = d3
                    .groups(data, (d) => d.id)
                    .map(([key, values]) => ({ key, values }));

    // Sort the data in ascending order of date before drawing the lines
    products = products.map(({key, values}) => ({ 
        key, 
        values: values.sort((a, b) => d3.ascending(a.date, b.date)) 
    }));

    // draw the x-axis
    svg
        .append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(
        d3
            .axisBottom(xScale)
            .ticks(d3.timeDay.every(1)) // adjust the '1' to change how many ticks are shown
            .tickFormat(d3.timeFormat('%d-%m')) // format the date
            .tickSizeOuter(0)
        )
        .selectAll("text")  
        .style("text-anchor", "end")
        //.style("font-size", "14px") // increase font size
        .attr("dx", "-.4em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    // draw the y-axis with grid lines
    svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale).tickFormat(d => `${d} Watt`)) // Add unit to y-axis
        //.selectAll("text").style("font-size", "14px") // increase font size
        .call((g) =>
        g
            .selectAll('.tick line')
            .clone()
            .attr('stroke-opacity', (d) => (d === 1 ? null : 0.2))
            .attr('x2', width - margin.left - margin.right)
        );

    // color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(products.map(p => p.key));

    // draw a line for each time series as well as labels
    const line = d3.line().curve(d3.curveLinear).x(i => xScale(i.date)).y(i => yScale(i[attribute]));
    svg.append('g').selectAll('path').data(products)
                                        .join('path')
                                        .attr('fill', 'none')
                                        .attr('stroke-width', 2)
                                        .attr('stroke', ({key}) => color(key))
                                        .attr('d', ({values}) => line(values));
    svg.append('g').selectAll('text').data(products)
                                        .join('text')
                                        .attr('font-size', 12)
                                        .attr('font-weight', 700)
                                        .attr('fill', ({key}) => color(key))
                                        .text(({key}) => `Product ID ${key}`)
                                        .attr('x', ({values}) => xScale(values[values.length-1].date))
                                        .attr('y', ({values}) => yScale(values[values.length-1][attribute]))
                                        .attr('transform', 'translate(5, 5)');
}

function flatternData(reportData) {
    const flattenedData = reportData.reduce((acc, curr) => {
        const product = curr.product;
        const electricProductions = curr.electricProductions.map(ep => ({ ...ep, ...product }));
        return acc.concat(electricProductions);
    }, []);

    return flattenedData;
}
