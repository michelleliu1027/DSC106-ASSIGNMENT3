// ['mousemove', 'touchmove', 'touchstart'].forEach(function (eventType) {
    document.getElementById('sharedGrid').addEventListener(
        'mousemove',
        function(e) {
            var chart,
                point,
                i,
                event;
            for (i = 0; i < 3; i = i + 1) {
                chart = Highcharts.charts[i];
                console.log(chart)
                // Find coordinates within the chart
                event = chart.pointer.normalize(e);
                // Get the hovered point
                point = chart.series[0].searchPoint(event, true);
                plot_class = chart.renderTo.className
                // console.log(plot_class)


                if (point) {
                    point.highlight(e);
                    pie_data = springfield[point.x]
                    window.total = pie_data[0] + pie_data[1] + pie_data[2] + pie_data[3] + pie_data[5]+pie_data[6]
                    window.bar_plotted.series[0].setData([pie_data[0] / total,
                        pie_data[1] / total,
                        pie_data[2] / total,
                        pie_data[3] / total,
                        pie_data[5] / total])

                    data_for_pie_chart = [pie_data[5],pie_data[3], pie_data[2],pie_data[1],pie_data[0]]
                    window.pie_plotted.series[0].setData(data_for_pie_chart)
                    window.pie_plotted.setTitle({text: parseInt(window.total)+ '  MW'})




                    // ///////////////////// plot the table area ////////////////////////////////
                    sum_sources = 0
                    sum_loads = 0
                    bar_datas = []

                    for (a = 0, j = 2; a < 7; a++) {
                        if (a !== 4 && a !== 6) {

                            window.dynamicTable.rows[j].cells[1].innerHTML = springfield[point.x][a];
                            sum_sources += springfield[point.x][a]
                            j++;
                        } else {
                            if (a == 4) {
                                if(springfield[point.x][a] == 0){
                                    window.dynamicTable.rows[9].cells[1].innerHTML = '-'
                                }else{
                                    window.dynamicTable.rows[9].cells[1].innerHTML = springfield[point.x][a]
                                }
                                sum_loads += springfield[point.x][a]
                            } else if (a == 6) {
                                if (springfield[point.x][a] == 0){
                                    window.dynamicTable.rows[8].cells[1].innerHTML = '-'
                                }else{
                                    window.dynamicTable.rows[8].cells[1].innerHTML = springfield[point.x][a]
                                }
                                sum_loads += springfield[point.x][a]
                            }
                        }
                    }

                    window.dynamicTable.rows[1].cells[1].innerHTML = sum_sources.toFixed(2)
                    if (sum_loads == 0){
                        window.dynamicTable.rows[7].cells[1].innerHTML = '-'
                    }else{
                        window.dynamicTable.rows[7].cells[1].innerHTML = sum_loads.toFixed(2)
                    }
                    window.dynamicTable.rows[10].cells[1].innerHTML = window.total.toFixed(2)
                    document.getElementById('time').innerHTML = Highcharts.dateFormat('%e %b, %l:%M %p', point.x)

                    // window.dynamicTable.rows[0].cells[3].innerHTML = Highcharts.dateFormat('%e %b, %l:%M %p', point.x)

                    for (b = 0, j = 2; b < 7; b++) {
                        if (b !== 4 && b !== 6) {
                                if(j == 3){
                                    window.dynamicTable.rows[j].cells[2].innerHTML = ((springfield[point.x][b] / sum_sources) * 100).toFixed(4).toString() + '%';
                                }else{
                                    window.dynamicTable.rows[j].cells[2].innerHTML = ((springfield[point.x][b] / sum_sources) * 100).toFixed(2).toString() + '%';
                                }
                            j++;
                        } else {
                            if (b == 4) {
                                if (springfield[point.x][b] == 0){
                                    window.dynamicTable.rows[9].cells[2].innerHTML = '-'
                                }else{
                                    window.dynamicTable.rows[9].cells[2].innerHTML = ((springfield[point.x][b] / sum_sources) * 100).toFixed(2).toString() + '%';
                                }
                            } else if (b == 6) {
                                if (springfield[point.x][b] == 0){
                                    window.dynamicTable.rows[8].cells[2].innerHTML = '-'
                                }else{
                                    window.dynamicTable.rows[8].cells[2].innerHTML = ((springfield[point.x][b] / sum_sources) * 100).toFixed(2).toString() + '%';
                                }
                            }
                        }
                    }
                    renewals = parseFloat(window.dynamicTable.rows[5].cells[2].innerHTML.substring(0, window.dynamicTable.rows[5].cells[2].innerHTML.length - 1))
                    + parseFloat(window.dynamicTable.rows[6].cells[2].innerHTML.substring(0, window.dynamicTable.rows[6].cells[2].innerHTML.length - 1))
                    window.dynamicTable.rows[11].cells[2].innerHTML = renewals.toFixed(2).toString() + '%'


                    window.dynamicTable.rows[1].cells[3].innerHTML = '$'+parseInt(price_data_time[point.x])
                    for (row_num = 2; row_num < 12; row_num++){
                        if (row_num == 7 || row_num == 10||row_num ==11){
                            window.dynamicTable.rows[row_num].cells[3].innerHTML = ' '
                        }else{
                            window.dynamicTable.rows[row_num].cells[3].innerHTML = '-'
                        }
                    }
                }
            }
        }
    );
    // console.log(pie_data)
    /**
     * Override the reset function, we don't need to hide the tooltips and
     * crosshairs.
     */
    Highcharts.Pointer.prototype.reset = function() {
        return undefined;
    };
    /**
     * Highlight a point by showing tooltip, setting hover state and draw crosshair
     */
    Highcharts.Point.prototype.highlight = function(event) {
        event = this.series.chart.pointer.normalize(event);
        //this.onMouseOver(); // Show the hover marker
        this.series.chart.tooltip.refresh(this); // Show the tooltip
        this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
    };
    /**
     * Synchronize zooming through the setExtremes event handler.
     */
    function syncExtremes(e) {

        var thisChart = this.chart;
        if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
            Highcharts.each(Highcharts.charts, function(chart) {
                if (chart !== thisChart) {
                    if (chart.xAxis[0].setExtremes) { // It is null while updating
                        chart.xAxis[0].setExtremes(
                            e.min,
                            e.max,
                            undefined,
                            false, {
                                trigger: 'syncExtremes'
                            }
                        );
                    }
                }
            });
        }
    }

    function barChart() {
        ele = document.getElementsByClassName('barGrid')[0];
        ele1 = document.getElementsByClassName('pieGrid')[0];

        ele1.style.display = "none";
        ele1.style.visibility = 'hidden';
        ele.style.visibility = 'visible';
        ele.style.display = "block";


    }

    function pieChart() {
        ele = document.getElementsByClassName('barGrid')[0];
        ele.style.visibility = 'hidden';
        ele.style.display = "none";
        ele1 = document.getElementsByClassName('pieGrid')[0];
        ele1.style.display = "block";
        ele1.style.visibility = 'visible';
    }

    function dynamic_table_changes(time){



    }


    // Get the data. The contents of the data file can be viewed at
    Highcharts.ajax({
        url: "springfield.json",
        dataType: 'text',

        success: function(activity) {
            activity = JSON.parse(activity);
            power_series = []
            to_plot = []
            count = 0


            times = []
            springfield = {}

            power_datas = []

            price_data = []
            price_data_time = {}
            color_for_plot = ['#9966ff', '#006622', '#6699ff', '#4d79ff', '#ff9966', 'red','#000000'].reverse()

            ///////////////////////////////preprocessing data part//////////////////////////////
            for (i = 0, len = activity.length; i < len; i++) {
                if (activity[i].type == 'power' && activity[i].fuel_tech != 'rooftop_solar') {
                    count = count + 1;
                    noted_interval = parseInt(activity[i].history.interval.substring(0)) //inteval for each cate in min
                    plot_data = []
                    power_data = []

                    for (time = 1571579700, placeholder = 0; time < 1572183000; placeholder++) {
                        if ((placeholder * noted_interval) % 30 == 0) {
                            if (times.length < 336) {
                                times.push(time * 1000)
                            }
                            if (activity[i].fuel_tech == 'exports' || activity[i].fuel_tech == 'pumps') {
                                power_data.push(activity[i].history.data[placeholder] * -1)
                                plot_data.push([time * 1000, activity[i].history.data[placeholder]*-1])
                            } else {
                                power_data.push(activity[i].history.data[placeholder])
                                plot_data.push([time * 1000, activity[i].history.data[placeholder]])
                            }
                        }
                        time = time + noted_interval * 60;
                    }
                    power_datas.push(power_data)

                    if(activity[i].fuel_tech == 'exports'){
                        power_series.push({
                            name: activity[i].fuel_tech,
                            data: plot_data,
                            color: color_for_plot[i],
                            opacity:1,
                            stack: 'I'
                        })
                    }
                    else{
                        power_series.push({
                            name: activity[i].fuel_tech,
                            data: plot_data,
                            color: color_for_plot[i],
                            opacity:1,
                            stack: 'II'
                    })
                    }

                    if (count == 7) { ///////with rooftop will become 8
                        to_plot.push({
                            name: 'Generation',
                            series: power_series
                        })
                    }
                } else {
                    if (activity[i].type != 'demand' && activity[i].type != 'power') {
                        noted_interval = parseInt(activity[i].history.interval.substring(0)) //inteval for each cate in min
                        plot_data = []
                        for (time = 1571579700, placeholder = 0; time < 1572183000; placeholder++) {
                            if ((placeholder * noted_interval) % 30 == 0) {
                                info = [time * 1000, activity[i].history.data[placeholder]]
                                plot_data.push(info);
                                if (activity[i].type == 'price') {
                                    price_data.push(activity[i].history.data[placeholder])
                                }
                            }
                            time = time + noted_interval * 60;
                        }
                        to_plot.push({
                            name: activity[i].type,
                            series: plot_data
                        })
                    }
                }
            }
            // console.log(power_series)


            /////////////constructing global datastructure for extracting data/////////////////////////

            for (t = 0; t < times.length; t++) {
                data_to_add = []
                for (d = 0; d < power_datas.length; d++) {
                    data_to_add.push(power_datas[d][t])
                }
                springfield[times[t]] = data_to_add
            }
            for (p = 0; p < price_data.length; p++) {
                price_data_time[times[p]] = price_data[p]
            }
            console.log(springfield)

            /////////////constructing global datastructure for extracting data/////////////////////////
            tot_black_coal = 0
            tot_distillate = 0
            tot_gas_ccgt = 0
            tot_hydro= 0
            tot_wind = 0

            for (a = 0; a <times.length; a++){
                tot_black_coal  += springfield[times[a]][0];
                tot_distillate += springfield[times[a]][1];
                tot_gas_ccgt += springfield[times[a]][2];
                tot_hydro += springfield[times[a]][3];
                tot_wind += springfield[times[a]][5];
            }
            ///////////////preprocessing data part////////////////////////////////////////////////////////////

            //////////////////////////////Synchronized graph///////////////////////////////////////////////////

            to_plot.forEach(function(dataset, i) {
                var chartDiv = document.createElement('div');
                chartDiv.className = 'chart'+i;
                document.getElementById('sharedGrid').appendChild(chartDiv);
                if (dataset.name == 'Generation') {
                    Highcharts.chart(chartDiv, {
                        chart: {
                            type: 'area',
                            marginLeft: 44.5, // Keep all charts left aligned
                            spacingTop: 20,
                            spacingBottom: 20,
                            backgroundColor: 'transparent'

                        },
                        title: {
                            text: dataset.name,
                            align: 'left',
                            margin: 0,
                            x: 30
                        },
                        subtitle: {
                            text: '    MW',
                            align: 'left',
                            margin: 0,
                            x: 133,
                            y:13.5,
                            fill: 'red'
                        },
                        credits: {
                            enabled: false
                        },
                        legend: {
                            enabled: false
                        },
                        xAxis: {
                            type: 'datetime',
                            tickInterval: 24 * 3600 * 1000,
                            labels: {
                                formatter: function() {
                                    return Highcharts.dateFormat("%b %e", this.value)
                                }
                            },
                            crosshair: {
                                    color: 'red',
                                    width: 1,
                                    zIndex:10
                            },
                            tickmarkPlacement:'on',
                            labels: {
                                format: '{value: %a <br>%b-%e}'
                            },
                            events: {
                                setExtremes: syncExtremes
                            },
                            gridLineDashStyle: 'shortdash',
                            gridLineColor: "#DBDBDB",
                            gridLineWidth: 1,
                        },
                        yAxis: {
                            startOnTick: true,
                            endOnTick: true,
                            tickInterval:1000,
                            labels: {
                                formatter: function () {
                                    return this.value;
                                }
                            },
                            title: {
                                text: null
                            },
                            gridLineDashStyle: 'shortdash',
                            gridLineColor: "#DBDBDB",
                            plotLines: [{
                                color: 'rgb(255, 210, 255,0.7)',
                                width: 1.5,
                                value: 5.5,
                                zIndex:10,
                                dashStyle: 'shortdash',

                            }]
                        },
                        pointFormat: 'Total '+'{point.total}'+'MW',
                        tooltip: {
                            useHTML:true,
                            positioner: function() {
                                return {
                                    // right aligned
                                    x: this.chart.chartWidth - this.label.width,
                                    y: 10 // align to title
                                };
                            },
                            formatter: function(){
                                    // time = Highcharts.dateFormat('%e %b, %l:%M %p',this.x);

                                    return '<span style=\"background-color:rgb(203, 76, 89,0.15); border-radius: 15%">'+'<b>'+document.getElementById('time').innerHTML+'</b>'+'  '+'</span> '+
                                    '<span style=\"background-color:rgb(255, 255, 255,0.3); border-radius: 15%">'+'  Total: '+'<b>' + window.total.toFixed(2) +'</b>'+'MW'+'</span> '

                            },
                            borderWidth: 0,
                            backgroundColor: 'none',
                            shadow: false,
                            valueDecimals: dataset.valueDecimals,
                            marker: {
                                lineWidth: 1,
                                lineColor: '#666666'
                            },
                            fillOpacity:1,                        },

                        plotOptions: {
                            area: {
                                stacking: 'normal',
                                lineColor: '#666666',
                                lineWidth: 1,
                                marker: {
                                    lineWidth: 1,
                                    lineColor: '#666666'
                                },
                            fillOpacity:1,
                            },
                            series: {
                                states:{
                                    inactive:{
                                        opacity: 1
                                    }
                                }
                            }
                        },
                        series: power_series.reverse()
                    });
                } else {
                    if (dataset.name == 'price'){
                        Highcharts.chart(chartDiv, {
                            chart: {
                                plot_type: 'line',
                                marginLeft: 40, // Keep all charts left aligned
                                spacingTop: 20,
                                spacingBottom: 20,
                                backgroundColor: 'transparent'
                            },
                            title: {
                                text:dataset.name,
                                align: 'left',
                                margin: 0,
                                x: 30
                            },
                            subtitle: {
                                text: '$/MWh',
                                align: 'left',
                                margin: 0,
                                x: 80,
                                y:13.5,
                            },
                            credits: {
                                enabled: false
                            },
                            legend: {
                                enabled: false
                            },
                            xAxis: {
                                type: 'datetime',
                                tickInterval: 24 * 3600 * 1000,
                                "labels": {
                                    "formatter": function() {
                                        return Highcharts.dateFormat("%b %e", this.value)
                                    }
                                },
                                crosshair: {
                                    color: 'red',
                                    width: 1,
                                    zIndex:10
                                },
                                events: {
                                    setExtremes: syncExtremes
                                },
                                labels: {
                                    format: '{value: %a <br>%b-%e}'
                                },
                                gridLineDashStyle: 'longdash',
                                gridLineColor: "#DBDBDB",
                                gridLineWidth: 1,
                            },
                            yAxis: {
                                title: {
                                    text: null
                                },
                                gridLineDashStyle: 'longdash',
                                gridLineColor: "#DBDBDB",
                            },
                            tooltip: {
                                useHTML:true,
                                positioner: function() {
                                    return {
                                        // right aligned
                                        x: this.chart.chartWidth - this.label.width,
                                        y: 10 // align to title
                                    };
                                },

                                formatter: function(){
                                    console.log(this)
                                        time = Highcharts.dateFormat('%e %b, %l:%M %p',this.x);
                                        price = this.y
                                        return '<span style=\"background-color:rgb(203, 76, 89,0.15); border-radius: 15%">'+'<b>'+time+'</b>'+'</span> '+
                                        '<span style=\"background-color:rgb(255, 255, 255,0.7); border-radius: 15%">'+'     $'+'<b>'+price+'</b>'+'</span> '

                                },

                                backgroundColor: 'none',
                                borderWidth: 0,
                                shadow: false,
                            },
                            series: [{
                                data: dataset.series,
                                name: dataset.name,
                                color: '#CA5131'
                            }]
                        });
                    }else if (dataset.name == 'temperature'){
                        Highcharts.chart(chartDiv, {
                            chart: {
                                plot_type: 'line',
                                marginLeft: 40, // Keep all charts left aligned
                                spacingTop: 20,
                                spacingBottom: 20,
                                backgroundColor: 'transparent'
                            },
                            title: {
                                text:dataset.name,
                                align: 'left',
                                margin: 0,
                                x: 30
                            },
                            subtitle: {
                                text: 'ºF',
                                align: 'left',
                                margin: 0,
                                x: 145,
                                y:13.5,
                            },
                            credits: {
                                enabled: false
                            },
                            legend: {
                                enabled: false
                            },
                            xAxis: {
                                type: 'datetime',
                                tickInterval: 24 * 3600 * 1000,
                                "labels": {
                                    "formatter": function() {
                                        return Highcharts.dateFormat("%b %e", this.value)
                                    }
                                },
                                crosshair: {
                                    color: 'red',
                                    width: 1,
                                    zIndex:10,
                                },
                                events: {
                                    setExtremes: syncExtremes
                                },
                                labels: {
                                    format: '{value: %a <br>%b-%e}'
                                },
                                gridLineDashStyle: 'longdash',
                                gridLineColor: "#DBDBDB",
                                gridLineWidth: 1,
                            },
                            yAxis: {
                                title: {
                                    text: null
                                },
                                gridLineDashStyle: 'longdash',
                                gridLineColor: "#DBDBDB",
                            },
                            tooltip: {
                                useHTML:true,
                                positioner: function() {
                                    return {
                                        // right aligned
                                        x: this.chart.chartWidth - this.label.width,
                                        y: 10 // align to title
                                    };
                                },

                                formatter: function(){
                                    // console.log(i)
                                        time = Highcharts.dateFormat('%e %b, %l:%M %p',this.x);
                                        temperature = this.y
                                        return '<span style=\"background-color:rgb(203, 76, 89,0.15); border-radius: 15%">'+'<b>'+time+'</b>'+'</span> '+
                                        '<span style=\"background-color:rgb(255, 255, 255,0.7); border-radius: 15%; ">'+'Av'+'<b>'+temperature+' ºF </b>'+'</span> '
                                    },

                                backgroundColor: 'none',
                                borderWidth: 0,
                                shadow: false,
                            },
                            series: [{
                                data: dataset.series,
                                name: dataset.name,
                                color: '#CA5131'
                            }]
                        });
                    }

                }
            });


        pie_plot_where = document.getElementsByClassName('pieGrid')[0]
        // console.log(pie_plot_where)

        window.pie_plotted = Highcharts.chart(pie_plot_where, {
                        chart: {
                            type: 'pie',
                            backgroundColor: 'transparent'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: false,
                                }
                            }
                        },
                        title: {
                            text: 'Average <br> 7020MW',
                            align: 'center',
                            verticalAlign: 'middle',
                            y: 20,
                            style:{
                                fontSize: '18px',
                                fontFamily:"Times New Roman",
                            }
                        },
                        legend: false,
                        series: [{
                            colorByPoint: true,
                            size: '100%',
                            innerSize: '50%',
                            data: [{
                                name: 'black_coal',
                                y: tot_black_coal /336,
                                color: '#000000'
                            }, {
                                name: 'distillate',
                                y: tot_distillate / 336,
                                color: 'red'

                            }, {
                                name: 'gas_ccgt',
                                y:tot_gas_ccgt / 336,
                                color: '#ff9966'
                            }, {
                                name: 'hydro',
                                y: tot_hydro / 336,
                                color: '#4d79ff'
                            }, {
                                name: 'wind',
                                y: tot_wind / 336,
                                color: '#006622'
                            }].reverse()
                        }]
                    });


        total = tot_black_coal+tot_distillate+tot_gas_ccgt+tot_hydro+tot_wind
        // console.log(tot_black_coal /336)
        bar_plot_where = document.getElementsByClassName('barGrid')[0]
        window.bar_plotted = Highcharts.chart(bar_plot_where, {
            chart: {
                type: 'bar',
                backgroundColor: 'transparent'
            },
            xAxis: {
                categories: ['black_coal', 'distillate', 'gas_ccgt', 'hydro', 'wind'],
                title: {
                    text: null
                },
                visible: true
            },
            yAxis: {
                visible:false
            },
            title:{
                text:''
            },
            legend: false,
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true,
                        formatter: function ()  {
                            if(this.x == 'distillate'){
                                return (this.y * 100).toFixed(4)+'%'
                            }else{
                                return (this.y * 100).toFixed(2)+'%'
                            }
                    }

                }
            }
        },
            series: [{
                data: [{y: tot_black_coal / total, color: '#000000'},
                    {y: tot_distillate / total, color: 'red'},
                    {y: tot_gas_ccgt / total, color: '#ff9966'},
                    {y: tot_hydro / total, color: '#4d79ff'},
                    {y: tot_wind/ total, color: '#006622'}]
            }]
        })


        window.dynamicTable = document.getElementsByClassName('greaterArea')[0].getElementsByTagName('table')[0];
        }
    });
