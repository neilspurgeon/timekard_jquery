$(function() {
	renderAll("client-ul", "client-template", "/:id/clients");
	createClient();
	enterClient();
	addJob();
	startTime();
	stopTime();
	toggleButtons();
	logOut();
	deleteJob();
});

var render = function (parentId, templateId, items) {
	var template = _.template( $("#" + templateId).html() );
	
	_(items).each(function (item) {
		var $item = $(template(item));
		$("#" + parentId).append($item);
	});
	toggleButtons();
};

var renderOne = function (parentId, templateId, item) {
	var template = _.template( $("#" + templateId).html() );
	
	var $item = $(template(item));
	$("#" + parentId).append($item);
};

var renderAll = function (parentId, templateId, path) {
	$.get(path, function(res) {
		console.log(res);
		console.log(res);
		render(parentId, templateId, res);
	});
};

var renderJobs = function (clientId) {
	$("#content").load("/jobs.html", function(){

		$.get("/" + clientId + "/jobs", function (data) {
			//var data = req[0].jobs;
			console.log(data[0].jobs);
			render("job-ul", "job-template", data[0].jobs);
			$("#add-job").attr("data-client-id", clientId);
		});
	});
};

var createClient = function () {

	$("#add-client").on("submit", function (e) {

		e.preventDefault();
		var clientParams = $(this).serialize();
		console.log(clientParams);
		
		$.post("/clients", clientParams, function(req) {
			renderOne("client-ul", "client-template", req);
		});
	});
};

var addJob = function () {
	var $clientId;
	$("section").on("submit", "#add-job", function (e) {

		e.preventDefault();
		var $jobParams = $(this).closest("form").serialize();
		$clientId = $(this).closest("form").attr("data-client-id");
		console.log($jobParams);
		console.log($clientId);
		
		$.post("/" + $clientId + "/jobs", $jobParams, function(req) {
			//console.log("jobs = " + req);
			console.log(req);

			//renderOne("job-ul", "job-template", req);
		}).done(function() {
			renderJobs($clientId);
		});
	});
};

var enterClient = function () {
	$("ul").on("click", ".enter-client", function (e) {
		e.preventDefault();
		var $clientId = $(this).closest("li")[0].id;
		console.log($clientId);
		renderJobs($clientId);
	});	
};


var startTime = function () {

	$("section").on("click", ".start", function (e) {
		e.preventDefault();
		var $jobId = $(this).closest("li")[0].id;
		console.log($jobId);
		var $clientId = $("form#add-job").attr("data-client-id");

		$.ajax({
			url: "/" + $jobId + "/start",
			method: "PUT",
			data: {id: 	$clientId},
			success: function (data) {
						renderJobs($clientId);
			} 
		});
	});
};

var stopTime = function () {

	$("section").on("click", ".stop", function (e) {
		e.preventDefault();
		var $jobId = $(this).closest("li")[0].id;
		console.log($jobId);
		var $clientId = $("form#add-job").attr("data-client-id");

		$.ajax({
			url: "/" + $jobId + "/stop",
			method: "PUT",
			data: {id: 	$clientId},
			success: function (req, res) {
				renderJobs($clientId);
			} 
		});	
	});
};

var deleteJob = function () {

	$("section").on("click", ".delete", function (e) {
		e.preventDefault();
		var $jobId = $(this).closest("li")[0].id;
		console.log($jobId);
		var $clientId = $("form#add-job").attr("data-client-id");

		$.ajax({
			url: "/" + $jobId + "/delete",
			method: "DELETE",
			data: {id: 	$clientId},
			success: function (data) {
						renderJobs($clientId);
			} 
		});
	});
};

var toggleButtons = function () {
	
	var $job = $("#job-ul li");
	$job.each(function () {
		if ( ($(this)[0].dataset.clockOn) === "true" ) {
			$(this).children(".start").hide();
			$(this).children(".stop").show();
		} else {
			$(this).children(".start").show();
			$(this).children(".stop").hide();			
		}
	});
};

var logOut = function () {
	$("#log-out").on("click", function (e) {
		e.preventDefault();
		$.post("/logout", function() {
			window.location = "/";
		});
	});
};


// ===========================================
//                TIMER
// ===========================================

// function Clock(startTime, jobId) {  
//   this.startTime   = startTime;
//   this.elapsed = '0.0';
  
//   var that = this;
//   window.setInterval( function(){
//     that.time = new Date().getTime() - that.startTime;
  
//     that.elapsed = Math.floor(that.time / 100) / 10;
//     if(Math.round(that.elapsed) == that.elapsed) { 	elapsed += '.0'; }

//     $(".clock " + "#"jobId + "").html(elapsed);
//   }, 1000);
// }
	



