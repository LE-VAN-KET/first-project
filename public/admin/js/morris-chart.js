(function () {
    var $, MyMorris;

    MyMorris = window.MyMorris = {};
    $ = jQuery;

    MyMorris = Object.create(Morris);

    MyMorris.Grid.prototype.gridDefaults["gridIntegers"] = false;

    MyMorris.Grid.prototype.setData = function (data, redraw) {
        var e, idx, index, maxGoal, minGoal, ret, row, step, total, y, ykey, ymax, ymin, yval, _ref;
        if (redraw == null) {
            redraw = true;
        }
        this.options.data = data;
        if ((data == null) || data.length === 0) {
            this.data = [];
            this.raphael.clear();
            if (this.hover != null) {
                this.hover.hide();
            }
            return;
        }
        ymax = this.cumulative ? 0 : null;
        ymin = this.cumulative ? 0 : null;
        if (this.options.goals.length > 0) {
            minGoal = Math.min.apply(Math, this.options.goals);
            maxGoal = Math.max.apply(Math, this.options.goals);
            ymin = ymin != null ? Math.min(ymin, minGoal) : minGoal;
            ymax = ymax != null ? Math.max(ymax, maxGoal) : maxGoal;
        }
        this.data = (function () {
            var _i, _len, _results;
            _results = [];
            for (index = _i = 0, _len = data.length; _i < _len; index = ++_i) {
                row = data[index];
                ret = {
                    src: row
                };
                ret.label = row[this.options.xkey];
                if (this.options.parseTime) {
                    ret.x = Morris.parseDate(ret.label);
                    if (this.options.dateFormat) {
                        ret.label = this.options.dateFormat(ret.x);
                    } else if (typeof ret.label === 'number') {
                        ret.label = new Date(ret.label).toString();
                    }
                } else {
                    ret.x = index;
                    if (this.options.xLabelFormat) {
                        ret.label = this.options.xLabelFormat(ret);
                    }
                }
                total = 0;
                ret.y = (function () {
                    var _j, _len1, _ref, _results1;
                    _ref = this.options.ykeys;
                    _results1 = [];
                    for (idx = _j = 0, _len1 = _ref.length; _j < _len1; idx = ++_j) {
                        ykey = _ref[idx];
                        yval = row[ykey];
                        if (typeof yval === 'string') {
                            yval = parseFloat(yval);
                        }
                        if ((yval != null) && typeof yval !== 'number') {
                            yval = null;
                        }
                        if (yval != null) {
                            if (this.cumulative) {
                                total += yval;
                            } else {
                                if (ymax != null) {
                                    ymax = Math.max(yval, ymax);
                                    ymin = Math.min(yval, ymin);
                                } else {
                                    ymax = ymin = yval;
                                }
                            }
                        }
                        if (this.cumulative && (total != null)) {
                            ymax = Math.max(total, ymax);
                            ymin = Math.min(total, ymin);
                        }
                        _results1.push(yval);
                    }
                    return _results1;
                }).call(this);
                _results.push(ret);
            }
            return _results;
        }).call(this);
        if (this.options.parseTime) {
            this.data = this.data.sort(function (a, b) {
                return (a.x > b.x) - (b.x > a.x);
            });
        }
        this.xmin = this.data[0].x;
        this.xmax = this.data[this.data.length - 1].x;
        this.events = [];
        if (this.options.events.length > 0) {
            if (this.options.parseTime) {
                this.events = (function () {
                    var _i, _len, _ref, _results;
                    _ref = this.options.events;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        e = _ref[_i];
                        _results.push(Morris.parseDate(e));
                    }
                    return _results;
                }).call(this);
            } else {
                this.events = this.options.events;
            }
            this.xmax = Math.max(this.xmax, Math.max.apply(Math, this.events));
            this.xmin = Math.min(this.xmin, Math.min.apply(Math, this.events));
        }
        if (this.xmin === this.xmax) {
            this.xmin -= 1;
            this.xmax += 1;
        }
        this.ymin = this.yboundary('min', ymin);
        this.ymax = this.yboundary('max', ymax);
        if (this.ymin === this.ymax) {
            if (ymin) {
                this.ymin -= 1;
            }
            this.ymax += 1;
        }
        if (((_ref = this.options.axes) === true || _ref === 'both' || _ref === 'y') || this.options.grid === true) {
            if (this.options.ymax === this.gridDefaults.ymax && this.options.ymin === this.gridDefaults.ymin) {
                this.grid = this.autoGridLines(this.ymin, this.ymax, this.options.numLines);
                this.ymin = Math.min(this.ymin, this.grid[0]);
                this.ymax = Math.max(this.ymax, this.grid[this.grid.length - 1]);
            } else {
                step = (this.ymax - this.ymin) / (this.options.numLines - 1);
                if (this.options.gridIntegers) {
                    step = Math.max(1, Math.round(step));
                }
                this.grid = (function () {
                    var _i, _ref1, _ref2, _results;
                    _results = [];
                    for (y = _i = _ref1 = this.ymin, _ref2 = this.ymax; step > 0 ? _i <= _ref2 : _i >= _ref2; y = _i += step) {
                        _results.push(y);
                    }
                    return _results;
                }).call(this);
            }
        }
        this.dirty = true;
        if (redraw) {
            return this.redraw();
        }
    };
}).call(this);

Morris.Area({
    element: 'morris-area-chart',
    data: [{
        period: '2010 Q1',
        iphone: 2666,
        ipad: null,
        itouch: 2647
    }, {
        period: '2010 Q2',
        iphone: 2778,
        ipad: 2294,
        itouch: 2441
    }, {
        period: '2010 Q3',
        iphone: 4912,
        ipad: 1969,
        itouch: 2501
    }, {
        period: '2010 Q4',
        iphone: 3767,
        ipad: 3597,
        itouch: 5689
    }, {
        period: '2011 Q1',
        iphone: 6810,
        ipad: 1914,
        itouch: 2293
    }, {
        period: '2011 Q2',
        iphone: 5670,
        ipad: 4293,
        itouch: 1881
    }, {
        period: '2011 Q3',
        iphone: 4820,
        ipad: 3795,
        itouch: 1588
    }, {
        period: '2011 Q4',
        iphone: 15073,
        ipad: 5967,
        itouch: 5175
    }, {
        period: '2012 Q1',
        iphone: 10687,
        ipad: 4460,
        itouch: 2028
    }, {
        period: '2012 Q2',
        iphone: 8432,
        ipad: 5713,
        itouch: 1791
    }],
    xkey: 'period',
    ykeys: ['iphone', 'ipad', 'itouch'],
    labels: ['iPhone', 'iPad', 'iPod Touch'],
    pointSize: 2,
    hideHover: 'auto',
    resize: true
});

Morris.Bar({
    element: 'morris-bar-chart',
    data: [{
        y: '2006',
        a: 100,
        b: 90
    }, {
        y: '2007',
        a: 75,
        b: 65
    }, {
        y: '2008',
        a: 50,
        b: 40
    }, {
        y: '2009',
        a: 75,
        b: 65
    }, {
        y: '2010',
        a: 50,
        b: 40
    }, {
        y: '2011',
        a: 75,
        b: 65
    }, {
        y: '2012',
        a: 100,
        b: 90
    }],
    xkey: 'y',
    ykeys: ['a', 'b'],
    labels: ['Series A', 'Series B'],
    hideHover: 'auto',
    resize: true
});

Morris.Donut({
    element: 'morris-donut-chart',
    data: [{
        label: "Download Sales",
        value: 12
    }, {
        label: "In-Store Sales",
        value: 30
    }, {
        label: "Mail-Order Sales",
        value: 20
    }],
    resize: true
});