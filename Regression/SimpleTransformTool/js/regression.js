	
	function standardDeviation(values){
  var avg = average(values);
  
  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });
  
  var avgSquareDiff = average(squareDiffs);
 
  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}
 
function average(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);
 
  var avg = sum / data.length;
  return avg;
}
	
	function tester(_value) {
		var _interny = r2yPlot.internal;
		var _internx = r2xPlot.internal;

		function getTarget(obj) {
			var list = obj.data.targets[0].values;
			var target = "";
			for (index in list) {
				if (list[index].value == _value) {
					target = list[index];
				}
			}
			return target;
		}

		var _dx = getTarget(_internx);
		var _dy = getTarget(_interny);

		function ts(obj, d) {
			base = obj.main.selectAll('.c3-shapes-R2').select('.c3-shape-' + d.index)[0][3];
			shape = obj.d3.select(base);
			isSelected = shape.classed("_selected_");
			toggle = obj.getToggle(base, d).bind(obj);
			return [toggle, isSelected, shape, d, d.index]
		}

		debug = ts(_internx, _dx);
	}

	function makeArrayOf(value, length) {
		var arr = [],
			i = length;
		while (i--) {
			arr[i] = value;
		}
		return arr;
	}
	
	
	// TODO: merge
	function getYBar(){ 
			return average(y);
	}

	
	
	

	data = [
		[6.6694, 0.512221],
		[25.5961, 0.027585],
		[2.1337, 0.448113],
		[40.7267, 0.014174],
		[6.4473, 0.771688],
		[8.1037, 0.461031],
		[1.8794, 0.628908],
		[4.8047, 0.613481],
		[7.7022, 0.685062],
		[13.5427, 0.091405],
		[9.1028, 0.425673],
		[8.0183, 0.209075],
		[10.5591, 0.134369],
		[7.3964, 0.79608],
		[1.9024, 0.510032],
		[31, 0.017],
		[9.5403, 0.249953],
		[11.944, 0.244066],
		[8.2185, 0.508202],
		[38, 0.0145],
		[6.0979, 0.650902],
		[8.2125, 0.362789],
		[10.9553, 0.348639],
		[6.8677, 0.579856]
	]
	
	function updateTable(){
		$("#or2").text(r2.toFixed(4));
		$("#opress").text(press.toFixed(4));
		$("#ossreg").text(ssm.toFixed(4));
		$("#otnse").text(nse.toFixed(4));
		$("#ossres").text(sse.toFixed(4));
		$("#ornse").text(realnse.toFixed(4));
	}
	

	function ols() {
		ybar = getYBar();
		_xat = [ones, x]; // x augmented transpose 
		_xa = numeric.transpose(_xat); // x augmented 
		_xTx = numeric.dot(_xat, _xa) // (xTx)
		_xTx_inv = numeric.inv(_xTx); // (xTx)^(-1)
		_prehat = numeric.dot(_xTx_inv, _xat); // [(xTx)^(-1)][xT] 
		
		hat = numeric.dot(_xa, _prehat); // H = xB
		betas = numeric.dot(_prehat, y);
		yhat = numeric.dot(hat, y); // yhat = Hy
		residuals = numeric.sub(y, yhat); // residuals = y - yhat
		var _ybar = makeArrayOf(ybar, yhat.length);
		var _ssm = numeric.sub(yhat, _ybar);
		ssm = numeric.norm2Squared(_ssm);	// model (explained sum of squares)
		sse = numeric.norm2Squared(residuals);	// residual sum of squares
		mse = sse / (data.length);
		
		var _ex = 1/(ypower[ypower.length-1]); 
		_yhatz = numeric.clone(yhat)
		var _zeros = makeArrayOf(0, data.length);
		var _negative = numeric.lt(yhat, _zeros);
		for(var i = 0; i < data.length; i++){
			if(_negative[i]){
				_yhatz[i] = 0; 
			}
		}
		yhatreal = numeric.pow(_yhatz, _ex);
		realresiduals = numeric.sub(yhatreal, y0);
		var _realssm = numeric.sub(yhatreal, y0bars);
		realssm = numeric.norm2Squared(_realssm);
		realsse = numeric.norm2Squared(realresiduals);
		realmse = realsse / (data.length);
		
		realnse = realmse / y0sd;
		var _ysd = standardDeviation(y);
		nse = mse / _ysd;
		
		
		r2 = 1 - (sse/(sse+ssm));
		hd = numeric.getDiag(hat);
		loo = numeric.sub(ones, hd);
		loo = numeric.div(residuals, loo);		
		
		press = numeric.norm2Squared(loo);
		updateTable();
	}
	
	function xScan(xp){
		xpower[xpower.length] = xp;
		ypower[ypower.length] = ypower[ypower.length-1];
		x = numeric.pow(x0, xpower[xpower.length-1]);
		ols();
		r2s[r2s.length] = r2;
	}
	
	function yScan(yp){
		ypower[ypower.length] = yp;
		xpower[xpower.length] = xpower[xpower.length-1];
		y = numeric.pow(y0, ypower[ypower.length-1]);
		ols();
		r2s[r2s.length] = r2;
	}
	
	
	
	function animate(obj, val, delay){
		setTimeout(function(){
			obj.spinner("value", val);
		}, delay);
	}
	
	function getXScanPoints(){
		var sp = [xrange0];
		for(var i = 1; i < 10; i++){
			sp[sp.length] = xrange0 + (xrange1 - xrange0)/9 * i;
		}
		return sp;
	}
	
	function getYScanPoints(){
		var sp = [yrange0];
		for(var i = 1; i < 10; i++){
			sp[sp.length] = yrange0 + (yrange1 - yrange0)/9 * i;
		}
		return sp;
	}
	
	
	function ascan(){
		var xvals = getXScanPoints();
		var yvals = getYScanPoints();
		var xspin = $("#spinnerx input");
		var yspin = $("#spinnery input");
		var k = 1;
			for(var j = 0; j<yvals.length; j+=1, k+=1){
				animate(yspin, yvals[j], k*1000);
				for(var i = 0; i<xvals.length; i+=1, k+=1){
					animate(xspin, xvals[i], k*1000);
				}
		}	
	
	}
	
			// TODO: These could be combined by passing a Chart object.
		function getXselected(value){
			var list = r2xPlot.internal.data.targets[0].values
			var values;
			for(index in list){
				if(list[index].value == value){
					return index;
				}
			}
		}
		
		function getYselected(value){
			var list = r2yPlot.internal.data.targets[0].values
			var values;
			for(index in list){
				if(list[index].value == value){
					return index;
				}
			}
		}
	
	function scan(){
		var xvals = getXScanPoints();
		var yvals = getYScanPoints();
		for(var j = 0; j<xvals.length; j+=1){
				xScan(xvals[j]);
			for(var i = 0; i<yvals.length; i+=1){
				yScan(yvals[i]);
			}
		}
		getBest();
		$("#spinnerx input").spinner("value", best[0]);
		$("#spinnery input").spinner("value", best[1]);
		refreshX();
		refreshY();
	}
	
	function leverage(){
		hd = numeric.getDiag(hat);
		mp = d3.scale.linear().domain(
		[Math.min.apply(null,hd), 
		Math.max.apply(null, hd)]).range(["green", "red"]);
		
		dataPlot.data.colors({
			observed: function(d){
				if(d != "observed"){
				return mp(hd[d.index]);
				} else {
				return "#000000";
				}
				}
				});
	}
	var test; 
	function mask(){
		getBest();
		r2xPlot.data.colors({
			R2: function(d){
				if(d != "R2"){
					test = d;
					if(d.value == best[2]){
						return "green";
					}
					if(d.value == r2){
						return "red";
					} else {
						return "#AAAAAA";
					}
				} else {
					return "#000000";
				}
			}
		});	
		
		r2yPlot.data.colors({
			R2: function(d){
				if(d != "R2"){
					if(d.value == best[2]){
						return "green"
					}
					if(d.value == r2){
						return "red"
					} else {
						return "#AAAAAA"
					}
				} else {
					return "#000000";
				}
			}
		});	
	}

	function initialize(_data) {
		var first = true;
		x = [0];
		y = [0];
		for(var row in _data) {
			if(first){
				x[0] = _data[row][0];
				y[0] = _data[row][1];
				first = false; 
			} else {
				x[x.length] = _data[row][0];
				y[y.length] = _data[row][1];
			}
		}
		x0 = x;
		y0 = y;
		ones = makeArrayOf(1, y0.length);
		ybar = getYBar();
		y0bar = average(y0);
		y0sd = standardDeviation(y0);
		y0bars = makeArrayOf(y0bar, x0.length);
		xpower = [1];
		ypower = [1];
		ols();
		r2s = [r2];
	}
	

	
	function getBest(){	
		var max = r2s[0];
		var mI = 0;

		for (var i = 1; i < r2s.length; i++) {
   			if (r2s[i] > max) {
  	      		mI = i;
       			max = r2s[i];
    		}
		}
		best = [xpower[mI], ypower[mI], r2s[mI]]
	}

	function refreshY(){
					ypower[ypower.length] = parseFloat($("#spinnery input").attr("aria-valuenow"));
										equation_reference = MathJax.Hub.getAllJax("equation")[0];
				MathJax.Hub.Queue(["Text", equation_reference, "y^{("+ypower[ypower.length-1]+")}=" + betas[0].toFixed(4) +"x^{(" + xpower[xpower.length-1] + ")} +" + betas[1].toFixed(4) + "+ \\epsilon"]);
					
					xpower[xpower.length] = xpower[xpower.length-1];
					y = numeric.pow(y0, ypower[ypower.length-1]);
						ols();
						
						//  ... just resolve...
						//  ybar = getYBar();
						//	yhat = numeric.dot(hat, y);
						//	residuals = numeric.sub(y, yhat);
						//	var _ybar = makeArrayOf(ybar, yhat.length);
						//	var _ssm = numeric.sub(yhat, _ybar);
						//	ssm = numeric.norm2Squared(_ssm);
						//	sse = numeric.norm2Squared(residuals);
						//	r2 = 1 - (sse/(sse+ssm));
							r2s[r2s.length] = r2;

							observed = ["observed"].concat(y);
							predicted = ["predicted"].concat(yhat); 
							residuals = ["residuals"].concat(residuals); 
							_xpower = ["_xpower"].concat(xpower);
							errors = ["errors"].concat(realresiduals);
						observations = ["observations"].concat(y0);
						model = ["model"].concat(yhatreal);
						excluded = ["excluded"].concat(loo);


		_ypower = ["_ypower"].concat(ypower);
		R2 = ["R2"].concat(r2s);
							
							dataPlot.load({
									xs: {
										observed: '_x',
										predicted: '_x'
									},
									columns: [_x, observed, predicted],
									types: {
										observed: 'scatter',
										predicted: 'line'
									},
									colors: {
										observed: "#000000"
									},
								});
							residPlot.load({
									xs: {
										residuals: '_x',
										excluded: '_x',
									},
									columns: [_x, residuals, excluded],
									type: 'scatter',
								});
														realdataPlot.load({
							xs: {
								observations: '_x0',
								model: '_x0'
							},
							columns: [_x0, observations, model],
							types: {
								observations: 'scatter',
								model: 'spline'
							},
						});
						realresidPlot.load({
							xs: {
								errors: '_x0',
							},
							columns: [_x0, errors],
							types: {
								errors: 'scatter',
							},
						});
								
							r2yPlot.load({
							xs: {
								R2: '_ypower',
									},
								columns: [_ypower, R2],
								type: 'scatter',
						});
						r2xPlot.load({
							xs: {
								R2: '_xpower',
									},
								columns: [_xpower, R2],
								type: 'scatter',
						});
						$("#slidery").slider("value", ypower[ypower.length-1]);
						mask();
	}
	
	
	function refreshX(event, ui){
					xpower[xpower.length] = parseFloat($("#spinnerx input").attr("aria-valuenow"));
					equation_reference = MathJax.Hub.getAllJax("equation")[0];
					MathJax.Hub.Queue(["Text", equation_reference, "y^{("+ypower[ypower.length-1]+")}=" + betas[0].toFixed(4) +"x^{(" + xpower[xpower.length-1] + ")} + " + betas[1].toFixed(4) + "+ \\epsilon"]);
					
					
					$("#sliderx").slider("value", xpower[xpower.length-1]);
					ypower[ypower.length] = ypower[ypower.length-1];
						x = numeric.pow(x0, xpower[xpower.length-1]);
						ols();
						r2s[r2s.length] = r2;
						_x = ["_x"].concat(x);
						_x0 = ["_x0"].concat(x0);
						predicted = ["predicted"].concat(yhat);
						residuals = ["residuals"].concat(residuals);
						errors = ["errors"].concat(realresiduals);
						_xpower = ["_xpower"].concat(xpower);
						_ypower = ["_ypower"].concat(ypower);
						excluded = ["excluded"].concat(loo);
						R2 = ["R2"].concat(r2s);
						
						observations = ["observations"].concat(y0);
						model = ["model"].concat(yhatreal);

						dataPlot.load({
							xs: {
								observed: '_x',
								predicted: '_x'
							},
							columns: [_x, observed, predicted],
							types: {
								observed: 'scatter',
								predicted: 'line'
							},
						});
						realdataPlot.load({
							xs: {
								observations: '_x0',
								model: '_x0'
							},
							columns: [_x0, observations, model],
							types: {
								observations: 'scatter',
								model: 'spline'
							},
						});
						realresidPlot.load({
							xs: {
								errors: '_x0',
							},
							columns: [_x0, errors],
							types: {
								errors: 'scatter',
							},
						});
						residPlot.load({
							xs: {
								excluded: '_x',
								residuals: '_x',
							},
							columns: [_x, residuals, excluded],
							type: 'scatter',
						});
						r2yPlot.load({
							xs: {
								R2: '_ypower',
									},
								columns: [_ypower, R2],
								type: 'scatter',
						});
						r2xPlot.load({
							xs: {
								R2: '_xpower',
									},
								columns: [_xpower, R2],
								type: 'scatter',
						});
						leverage();
						mask();
						
	}
	
	function handleFileSelect(evt) {
		var file = evt.target.files[0];
		Papa.parse(file, {
			header: hasHeader,
			dynamicTyping: true,
			complete: function(results) {
				initialize(results.data);
				buildPlots();
			}
		});
		$("#sliderx").slider("value", 1);
		$("#spinnery input").spinner("value", 1);
		$("#slidery").slider("value", 1);
		$("#spinnery input").spinner("value", 1);
	}
	
		
	function generateLinear(){
		errors = numeric.random([2, 50]);
		b0 = [makeArrayOf(7, 50)];
		b1 = [makeArrayOf(2, 50)];
		x = numeric.random([1, 50]);
		y = numeric.mul(b1, x);
		y = numeric.add(y, b0);
		y = numeric.add(y, errors);
		console.log(x,y);
		data = [x[0], y[0]];
		data = numeric.transpose(data);
		initialize(data);
		buildPlots();
		$("#sliderx").slider("value", 1);
		$("#spinnery input").spinner("value", 1);
		$("#slidery").slider("value", 1);
		$("#spinnery input").spinner("value", 1);
	}
	
	function generateLinearOut(){
		errors = numeric.random([2, 50]);
		b0 = [makeArrayOf(7, 50)];
		b1 = [makeArrayOf(2, 50)];
		x = numeric.random([1, 50]);
		y = numeric.mul(b1, x);
		y = numeric.add(y, b0);
		y = numeric.add(y, errors);
		y[0][Math.ceil(Math.random()*50)] = 25;
		data = [x[0], y[0]];
		data = numeric.transpose(data);
		initialize(data);
		buildPlots();
		$("#sliderx").slider("value", 1);
		$("#spinnery input").spinner("value", 1);
		$("#slidery").slider("value", 1);
		$("#spinnery input").spinner("value", 1);
	}
	
	function generateExp(){
		errors = numeric.random([2, 50]);
		b0 = [makeArrayOf(7, 50)];
		b1 = [makeArrayOf(2, 50)];
		x = numeric.random([1, 50]);
		x = numeric.mul(x, b1);
		_ex = numeric.exp(x);
		y = numeric.mul(b1, _ex);
		y = numeric.add(y, b0);
		y = numeric.add(y, errors);
		data = [x[0], y[0]];
		data = numeric.transpose(data);
		initialize(data);
		buildPlots();
		$("#sliderx").slider("value", 1);
		$("#spinnery input").spinner("value", 1);
		$("#slidery").slider("value", 1);
		$("#spinnery input").spinner("value", 1);
	}
	
	function generateNoise(){
		x = numeric.random([1,50])
		y = numeric.random([1,50])
		for(var i = 0; i < 50; i++){
			_x = numeric.random([1,50]);
			_y = numeric.random([1,50]);
			x = numeric.add(x, _x);
			y = numeric.add(y, _y);
		}
		data = [x[0], y[0]];
		data = numeric.transpose(data);
		initialize(data);
		buildPlots();
		$("#sliderx").slider("value", 1);
		$("#spinnery input").spinner("value", 1);
		$("#slidery").slider("value", 1);
		$("#spinnery input").spinner("value", 1);
	}

	function generatex3(){
		errors = numeric.random([2, 50]);
		b0 = [makeArrayOf(7, 50)];
		b1 = [makeArrayOf(2, 50)];
		x = numeric.random([1, 50]);
		var _xxx = numeric.pow(x, 3);
		y = numeric.mul(b1, _xxx);
		y = numeric.add(y, b0);
		y = numeric.add(y, errors);
		data = [x[0], y[0]];
		data = numeric.transpose(data);
		initialize(data);
		buildPlots();
		$("#sliderx").slider("value", 1);
		$("#spinnery input").spinner("value", 1);
		$("#slidery").slider("value", 1);
		$("#spinnery input").spinner("value", 1);
	}
	
	function generateData(){
		if($('#exp').is(':checked')){ generateExp(); }
		if($('#lin').is(':checked')) { generateLinear(); }
		if($('#lino').is(':checked')) { generateLinearOut(); }
		if($('#x3').is(':checked')) { generatex3(); }
		if($('#noise').is(':checked')) { generateNoise(); }
	}
	

	function buildPlots() {
		_x = ["_x"].concat(x0);
		_x0 = ["_x0"].concat(x0);
		observed = ["observed"].concat(y0);
		observations = ["observations"].concat(y0);
		predicted = ["predicted"].concat(yhat);
		model = ["model"].concat(yhat);
		residuals = ["residuals"].concat(residuals);
		excluded = ["excluded"].concat(loo);
		_xpower = ["_xpower"].concat(xpower);
		_ypower = ["_ypower"].concat(ypower);
		R2 = ["R2"].concat(r2s);
		errors = ["errors"].concat(realresiduals);

		dataPlot = c3.generate({
			bindto: '#dataPlot',
			data: {
				xs: {
					observed: '_x',
					predicted: '_x'
				},
				columns: [_x, observed, predicted],
				types: {
					observed: 'scatter',
					predicted: 'spline'
				},
				colors: {
					observed: function(d){ 
						
					}
				},
			},
			point: {
				r: 5
			},
			axis: {
				x: {
					label: 'transformed x',
					tick: {
						fit: false,
						format: function(d) {
							return d.toFixed(2);
						}

					}
				},
				y: {
					label: 'transformed y',
					tick:{
						format: function(d) {
							return d.toFixed(2);
						}
					}
				}
			}
		});

		
		realdataPlot = c3.generate({
			bindto: '#realdataPlot',
			data: {
				xs: {
					observations: '_x0',
					model: '_x0'
				},
				columns: [_x0, observations, model],
				types: {
					observations: 'scatter',
					model: 'line'
				},
				colors: {
					observations: function(d){ 
						
					}
				},
			},
			point: {
				r: 5
			},
			axis: {
				x: {
					label: 'real x',
					tick: {
						fit: false,
						format: function(d) {
							return d.toFixed(2);
						}

					}
				},
				y: {
					label: 'real y',
					tick:{
						format: function(d) {
							return d.toFixed(2);
						}
					}
				}
			}
		});


		realresidPlot = c3.generate({
			bindto: '#realresidPlot',
			data: {
				xs: {
					errors: '_x'
				},
				columns: [_x, errors],
				type: 'scatter',
				colors: {
					errors: "#000000"
				},
			},
			point: {
				r: 5
			},
			axis: {
				x: {
					label: 'real x',
					tick: {
						fit: false,
						format: function(d) {
							return d.toFixed(2);
						}
					}
				},
				y: {
					label: 'real errors',
					tick: {
						format: function(d) {
							return d.toFixed(2);
						}
					}
				}
			}
		});
				
		residPlot = c3.generate({
			bindto: '#residPlot',
			data: {
				xs: {
					residuals: '_x',
					excluded: '_x'
				},
				columns: [_x, residuals, excluded],
				type: 'scatter',
				colors: {
					excluded: "#e51843",
					residuals: "#000000"
				},
			},
			point: {
				r: 5
			},
			axis: {
				x: {
					label: 'transformed x',
					tick: {
						fit: false,
						format: function(d) {
							return d.toFixed(2);
						}
					}
				},
				y: {
					label: 'transformed errors',
					tick: {
						format: function(d) {
							return d.toFixed(2);
						}
					}
				}
			}
		});
				
		r2yPlot = c3.generate({
			bindto: '#r2y',
			data: {
				xs: {
					R2: '_ypower',
				},
				columns: [_ypower, R2],
				types: {
					R2: 'scatter',
				},
				selection:{
					enabled: true,
					grouped: false,
					multiple: false,
				},
				onclick: function(d, element){ 
						if(token){
							token = false;
							var _idx = parseInt(getXselected(d.value));
							console.log(_idx);
							console.log(d);
							r2xPlot.select("R2", [_idx], false);
						} else {
							r2xPlot.unselect("R2");
							token = true;
						}
				},
			},
			point: {
				r: 2.5
			},
			legend: {
        		show: false
    		},
			axis: {
				x: {
					label: '',
					tick: {
						fit: false,
						format: function(d) {
							return d.toFixed(2);
						}

					}
				},
				y: {
					label: '',
					tick: {
							format: function(d) {
							return d.toFixed(2);
						}
					}
				}
			}
		});
		
		r2xPlot = c3.generate({
			bindto: '#r2x',
			data: {
				xs: {
					R2: '_xpower',
				},
				columns: [_xpower, R2],
				types: {
					R2: 'scatter',
				},
				selection:{
					enabled: true,
					grouped: false,
					multiple: false,
				},
				onclick: function(d, element){ 
						if(token){
							token = false;
							var _idx = parseInt(getYselected(d.value));
							r2yPlot.select("R2", [_idx], false);
							console.log(_idx);
							console.log(d);
						} else {
							r2yPlot.unselect("R2");
							token = true;
						}
				},
			},
			point: {
				r: 2.5
			},
			legend: {
        		show: false
   			},
			axis: {
				x: {
					label: '',
					tick: {
						fit: false,
						format: function(d) {
							return d.toFixed(2);
						}

					}
				},
				y: {
					label: '',
					tick:{
						format: function(d) {
							return d.toFixed(2);
						}
					}
				}
			}
		});
		
		leverage();
		mask();
	}

	$(function() {

				initialize(data);
				buildPlots();

				$("#csv").change(handleFileSelect);

				$("#sliderx").slider({
					min: 0.1,
					max: 5,
					step: 0.5,
					value: 1,
					slide: function(event, ui) {
						$("#spinnerx input").spinner("value", ui.value);
					}
				});


			$("#slidery").slider({
						min: 0.1,
						max: 5,
						step: 0.5,
						value: 1,
						slide: function(event, ui) {
							$("#spinnery input").spinner("value", ui.value);
							}						
			});
						
            $("#spinnerx input").spinner({
                  alignment: "horizontal",
						min: 0.1,
						max: 5,
						step: 0.05,
						spin: refreshX,
						change: refreshX
			});
               
            $("#spinnery input").spinner({
                  alignment: "horizontal",
						min: 0.1,
						max: 5,
						step: 0.05,
						spin: refreshY,
						change: refreshY
			});
			
			$('#hasHeader').click(function() {
    			hasHeader = this.checked;
			});
			
			$( "#x-search-range" ).slider({
     			 range: true,
    			  min: 0.1,
    			  max: 5,
    			  step: 0.1,
   				   values: [ 0.1, 5 ],
   				   slide: function( event, ui ) {
   				   		$( "#x-search-range-text" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
   				 r2xPlot.axis.min({x: ui.values[0]});
   				 r2xPlot.axis.max({x: ui.values[1]});

   				   		xrange0 = ui.values[0];
   				   		xrange1 = ui.values[1];
   				   }
   			 });
   			 
   			 $( "#x-search-range-text" ).val($( "#x-search-range" ).slider( "values", 0 ) +
      " - " + $( "#x-search-range" ).slider( "values", 1 ) );


			$( "#y-search-range" ).slider({
     			 range: true,
    			  min: 0.1,
    			  max: 5,
    			  step: 0.1,
   				   values: [ 0.1, 5 ],
   				   slide: function( event, ui ) {
   				   		$( "#y-search-range-text" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
   				 r2yPlot.axis.min({x: ui.values[0]});
   				 r2yPlot.axis.max({x: ui.values[1]});

   				   		yrange0 = ui.values[0];
   				   		yrange1 = ui.values[1];
   				   }
   			 });
   			 
   			 $( "#y-search-range-text" ).val($( "#y-search-range" ).slider( "values", 0 ) +
      " - " + $( "#y-search-range" ).slider( "values", 1 ) );
      
          
   //		$( "#dataPlot" ).resizable();
  // 		$( "#residPlot" ).resizable();
  // 		$( "#realresidPlot" ).resizable();
//		$( "#realdataPlot" ).resizable();
   			$( "#minicontrol" ).draggable();
			
			setTimeout(function(){
			equation_reference = MathJax.Hub.getAllJax("equation")[0];
		console.log(equation_reference);
		MathJax.Hub.Queue(["Text", equation_reference, "y^{("+ypower[ypower.length-1]+")}=" + betas[0].toFixed(4) +"x^{(" + xpower[xpower.length-1] + ")} + " + betas[1].toFixed(4) + "+ \\epsilon"]);
		}, 2000);
			
		});
		
