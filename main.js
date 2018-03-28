
$(document).ready(function(){

	//alert(1);
	//getPrints();
	$('#add_print').on('click','.submitButton',function()
	{
		addPrint();
	});
	$('#edit_print').on('click','.submitButton', editPrint);
	$('#review_print').on('click','.submitButton', postReview);
	$('#create_login').on('click','.submitButton', addLogin);
	$('#form_log_attempts').on('click', '.submitButton', function(){
		logAttempts();
	});
	

	$('#btn_login').click( function(){
		console.log('clicked');
		testLogins();
	});

	function testLogins(e){
		//Get login from server here
		var data=[{
			s_UserName: 'Bob',
			s_Password: 'a',
			s_ID:1
		},
		{
			s_UserName: 'Jeff',
			s_Password: 'b',
			s_ID:2
		}];

		$.each(data,function(key, login){
			console.log(data);
						
		});

	}

	//Create html elements based on changed value of attemptCount
	$('#p_AttemptCount').on('change',function(){
		console.log('count changed!');
		var count=$('#p_AttemptCount').val();

		//Inject html elements based on count
		var output='';

		for(var i=0; i<count; i++)
		{

			var id_start="p_startTime"+i;
			var id_finish="p_endTime"+i;
			var id_Mass="p_Mass"+i;
			var id_success="p_PrintSucceeded"+i;
			output +=`
					<h4> Attempt `+i+` </h4>
					<hr class="my-4">
					<div class="form-group row">
						<label class='control-label col-sm-4' for="`+id_start+`"">Start time:</label>
          				<div class="col-sm-8">
            			<input type="time" id="`+id_start+`"" class="form-control">
          				</div>
          			</div>`;
          	output +=`<div class="form-group row">
          				<label class='control-label col-sm-4' for="`+id_finish+`">End time:</label>
          				<div class="col-sm-8">
            			<input type="time" id="`+id_finish+`" class="form-control">
          				</div>
          				</div>`;
          	output +=`<div class="form-group row">
          				<label class='control-label col-sm-4' for="`+id_Mass+`">Mass:</label>
          				<div class="col-sm-8">
            			<input type="number" id="`+id_Mass+`" class="form-control">
          				</div>
          			</div>`


          	output+=`<div class="form-group row">
            		<label class="control-label col-sm-4" for="`+id_success+`">Print Success:</label>
            		<div class="col-sm-8">
            		<input type="checkbox" class="form-check-input" id="`+id_success+`">
            		</div>
          			</div>`;
 		}
 		output+=`<div class="form-group row"> 
              <div class="col-sm-12">
                <button type="button" class="btn btn-primary submitButton" id="btn_LogAttempts">Log</button>
              </div>
          	</div>`;
          	console.log(output);
		$('#form_log_attempts').html(output);

	});

	function logAttempts(e){
		console.log('event fired');
		var printCount=$('#p_AttemptCount').val();
		for(var i=0; i<printCount; i++){
			var mass=$('#p_Mass'+i).val();
			console.log(mass);
		}
	}

	//$('#add_print').submit(addPrint);
	$('body').on('click','.btn-edit-task',setTask);
	$('body').on('click','.btn-view-task',setTask_view);
	$('body').on('click','.btn-review-task',setTask_review);
	$('body').on('click','.btn-complete-print',completePrint);
	$('body').on('click','.btn-delete-task',deleteTask);
	$('body').on('click','.btn-show-all',getPrints);
	$('body').on('click','.btn-search-by-name',getPrintsByName);
	$('body').on('click','.btn-search-by-ID',getPrintsByID);


	
	$(".dropdown-menu").on('click', 'li a', function(){
		$(this).parent().parent().siblings(".btn:first-child").html($(this).text()+' <span class="caret"></span>');
		$(this).parent().parent().siblings(".btn:first-child").val($(this).text());
	});
});

//This is a testing URL
var url='http://www.johnknowlesportfolio.com:3000';
//Display All Prints
function getPrints(){
	$.get(url+'/api/jobs',function(data){
		let output= '<ul class= "list-group">';
		$.each(data, function(key,print){
			console.log(data);
			output += '<li class="list-group-item">';
			output += print.p_fName + '<span class = "patron_name"></span>';
			output += '<div class="pull-right"> <a class="btn btn-success btn-review-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">Review Print</a> <a class="btn btn-success btn-view-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">View</a> <a class="btn btn-primary btn-edit-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">Edit</a> <a class="btn btn-danger btn-delete-task" data-task-id="'+print._id+'">Delete</a></div>';
		});
		output+='</ul>';
		$('#prints').html(output);
	});
}

//Search prints by name
function getPrintsByName(){
	var p_fName=$('#p_fName').val();
	$.get(url+'/api/jobs/findByName/'+p_fName,function(data){
		let output= '<ul class= "list-group">';
		$.each(data, function(key,print){
			console.log(data);
			output += '<li class="list-group-item">';
			output += print.p_fName + '<span class = "patron_name"></span>';
			output += '<div class="pull-right"> <a class="btn btn-success btn-review-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">Review Print</a> <a class="btn btn-success btn-view-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">View</a> <a class="btn btn-primary btn-edit-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">Edit</a> <a class="btn btn-danger btn-delete-task" data-task-id="'+print._id+'">Delete</a></div>';
		});
		output+='</ul>';
		$('#prints').html(output);
	});
}

function getPrintsByID(){
	var p_ID=$('#p_ID').val();
	$.get(url+'/api/jobs/findByID/'+p_ID,function(data){
		let output= '<ul class= "list-group">';
		$.each(data, function(key,print){
			console.log(data);
			output += '<li class="list-group-item">';
			output += print.p_fName + '<span class = "patron_name"></span>';
			output += '<div class="pull-right"> <a class="btn btn-success btn-review-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">Review Print</a> <a class="btn btn-success btn-view-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">View</a> <a class="btn btn-primary btn-edit-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">Edit</a> <a class="btn btn-danger btn-delete-task" data-task-id="'+print._id+'">Delete</a></div>';
		});
		output+='</ul>';
		$('#prints').html(output);
	});
}

function getPrintByID_Field(p_ID){
	console.log(p_ID);
	var data_return
	$.get(url+'/api/jobs/'+p_ID,function(data){
		console.log(data);
		return data;
	});
	console.log(data_return);
	//return data_return;
}



function getPrintsByReviewStatus(){
	var isReviewed=false;
	$.get(url+'/api/jobs/findByReviewStatus/'+isReviewed,function(data){
		let output= '<ul class= "list-group">';
		$.each(data, function(key,print){
			console.log(data);
			output += '<li class="list-group-item">';
			output += print.p_fName + '<span class = "patron_name"></span>';
			output += '<div class="pull-right"> <a class="btn btn-success btn-review-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">Review Print</a> <a class="btn btn-success btn-view-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">View</a> <a class="btn btn-primary btn-edit-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">Edit</a> <a class="btn btn-danger btn-delete-task" data-task-id="'+print._id+'">Delete</a></div>';
		});
		output+='</ul>';
		$('#prints').html(output);
	});
}

//Get prints that have been approved for printing
function getApprovedPrints(){
	var isApproved=true;
	$.get(url+'/api/jobs/findByApprovalStatus/'+isApproved,function(data){
		let output= '<ul class= "list-group">';
		$.each(data, function(key,print){
			console.log(data);
			output += '<li class="list-group-item">';
			output += print.p_fName + '<span class = "patron_name"></span>';
			output += '<div class="pull-right"> <a class="btn btn-success btn-review-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">Review Print</a> <a class="btn btn-success btn-view-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">View</a> <a class="btn btn-primary btn-edit-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">Edit</a> <a class="btn btn-danger btn-delete-task" data-task-id="'+print._id+'">Delete</a></div>';
		});
		output+='</ul>';
		$('#prints').html(output);
	});
}


//Get prints that have been rejected for printing
function getRejectedPrints(){
	var isApproved=false;
	$.get(url+'/api/jobs/findByApprovalStatus/'+isApproved,function(data){
		let output= '<ul class= "list-group">';
		$.each(data, function(key,print){
			console.log(data);
			output += '<li class="list-group-item">';
			output += print.p_fName + '<span class = "patron_name"></span>';
			output += '<div class="pull-right"> <a class="btn btn-success btn-review-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">Review Print</a> <a class="btn btn-success btn-view-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">View</a> <a class="btn btn-primary btn-edit-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">Edit</a> <a class="btn btn-danger btn-delete-task" data-task-id="'+print._id+'">Delete</a></div>';
		});
		output+='</ul>';
		$('#prints').html(output);
	});
}

//Get prints that have been completed
function getCompletePrints(){
	var isDone=true;
	console.log('jkljkl');
	$.get(url+'/api/jobs/findByPrintComplete/'+isDone,function(data){
		let output= '<ul class= "list-group">';
		$.each(data, function(key,print){
			console.log(data);
			output += '<li class="list-group-item">';
			output += print.p_fName + '<span class = "patron_name"></span>';
			output += '<div class="pull-right"> <a class="btn btn-success btn-pickup-print" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">Picking Up Print</a> <a class="btn btn-success btn-view-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">View</a> <a class="btn btn-primary btn-edit-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">Edit</a> <a class="btn btn-danger btn-delete-task" data-task-id="'+print._id+'">Delete</a></div>';
		});
		output+='</ul>';
		$('#prints').html(output);
	});
}


//Get prints that have been reviewed and are waiting to be printed
function getReadyPrints(){
	var isDone=true;
	console.log('executed');
	$.get(url+'/api/jobs/findByApprovalStatus/'+isDone,function(data){
		let output= '<ul class= "list-group">';
		$.each(data, function(key,print){
			console.log(data);
			if(print.p_isComplete)
			{
				//Do nothing
			}
			else
			{
				output += '<li class="list-group-item">';
				output += print.p_fName + '<span class = "patron_name"></span>';
				output += '<div class="pull-right"> <a class="btn btn-success btn-complete-print" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">Log Print Attempts</a> <a class="btn btn-success btn-view-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">View</a> <a class="btn btn-primary btn-edit-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">Edit</a> <a class="btn btn-danger btn-delete-task" data-task-id="'+print._id+'">Delete</a></div>';
			}
		});
		output+='</ul>';
		$('#prints').html(output);
	});
}

function getLogins(){
	$.get(url+'/api/logins',function(data){
		let output= '<ul class= "list-group">';
		$.each(data, function(key,login){
			console.log(data);
			output += '<li class="list-group-item">';
			output += login.s_UserName + '<span class = "patron_name"></span>';
			output += '<div class="pull-right"> <a class="btn btn-danger btn-delete-task" data-task-id="'+login._id+'">Delete</a></div>';
		});
		output+='</ul>';
		$('#logins').html(output);
	});
}
function addPrint()
{
	
	var p_fName=$('#p_fName').val();
	var p_lName=$('#p_lName').val();
	var p_ID=$('#p_ID').val();
	var p_Email=$('#p_Email').val();
	var p_Phone=$('#p_Phone').val();



	var p_Filament = $('#p_Filament').val();
	var p_Instructions=$('#p_Instructions').val();
	var p_Infill =$('#p_Infill').val();

	var p_Mass=0;	
	var p_Hours=0;
	var p_Minutes=0;
	var p_ReviewNotes='none';	
	var p_Approved=false;




	
	console.log('Posting');
	$.ajax({
		url: url+'/api/jobs',
		data: JSON.stringify({
			"p_fName": p_fName,
			"p_lName": p_lName,
			"p_ID": p_ID,
			"p_Email": p_Email,
			"p_Phone": p_Phone,
			"p_Filament":p_Filament,
			"p_Infill":p_Infill,
			"p_Instructions":p_Instructions,
			"p_Mass":p_Mass,			
			"p_Hours":p_Hours,
			"p_Minutes":p_Minutes,
			"p_ReviewNotes":p_ReviewNotes,
			"p_isReviewed":false,
			'p_isComplete':false,
			"p_Approved":p_Approved
		}),
		type:'POST',
		contentType:'application/json',
		success: function(data){
			window.location.href='index.html';
		},
		error:function(xhr ,status, err){
			console.log(err);
		}
	});
}


function addLogin()
{

	console.log('got here');

	var s_UserName=$('#s_UserName').val();
	var s_Password=$('#s_Password').val();
	var s_ID=$('#s_ID').val();

	console.log('got jere');


	
	console.log('posting');
	$.ajax({
		url: url+'/api/logins',
		data: JSON.stringify({
			"s_UserName":s_UserName,
			"s_Password": s_Password,
			"s_ID":s_ID
		}),
		type:'POST',
		contentType:'application/json',
		success: function(data){
			window.location.href='CreateViewLogins.html';
		},
		error:function(xhr ,status, err){
			console.log(err);
		}
	});
}

function setTask(){
	//console.log('test');
	//alert("Setting task");
	var job_id=$(this).data('task-id');
	console.log(job_id);
	sessionStorage.setItem('current_id',job_id);
	window.location.href='EditPrint.html';
	return false;
}

function setTask_view(){
	//console.log('test');
	//alert("Setting task");
	var job_id=$(this).data('task-id');
	console.log(job_id);
	sessionStorage.setItem('current_id',job_id);
	window.location.href='viewPrint.html';
	return false;
}


function setTask_review(){
	//console.log('test');
	//alert("Setting task");
	var job_id=$(this).data('task-id');
	console.log(job_id);
	sessionStorage.setItem('current_id',job_id);
	window.location.href='ReviewPrint.html';
	return false;
}

function complete_Print(){
	//console.log('test');
	//alert("Setting task");
	var job_id=$(this).data('task-id');
	console.log(job_id);
	sessionStorage.setItem('current_id',job_id);
	completePrint();
	//window.location.href='PrintQueue_Ready.html';

	return false;
}



function getTask(id)
{
	//alert("Getting Task");
	console.log('Get Task Called '+id);
	$.get(url+'/api/jobs/' + id,function(print){
		$('#p_fName').val(print.p_fName);
		$('#p_lName').val(print.p_lName);
		$('#p_ID').val(print.p_ID);
		$('#p_Email').val(print.p_Email);

		
		$('#p_Phone').val(print.p_Phone);
		$('#p_Filament').val(print.p_Filament);
		$('#p_Infill').val(print.p_Infill);
		$('#p_Instructions').val(print.p_Instructions);
		$('#p_Mass').val(print.p_Mass);
		$('#p_Hours').val(print.p_Hours);
		$('#p_Minutes').val(print.p_Minutes);
		$('#p_ReviewNotes').val(print.p_ReviewNotes);
		$('#p_Approved').val(print.p_Approved);

	});
}

function editPrint(e)
{

	var task_id=sessionStorage.getItem('current_id');
	var p_fName=$('#p_fName').val();
	var p_lName=$('#p_lName').val();
	var p_ID=$('#p_ID').val();
	var p_Email=$('#p_Email').val();
	var p_Phone=$('#p_Phone').val();



	var p_Filament = $('#p_Filament').val();
	var p_Instructions=$('#p_Instructions').val();
	var p_Infill =$('#p_Infill').val();

	var p_Mass=$('#p_Mass').val();	
	var p_Hours=$('#p_Hours').val();
	var p_Minutes=$('#p_Minutes').val();
	var p_ReviewNotes=$('#p_ReviewNotes').val();	
	var p_Approved=$('#p_Approved').val();




	
	console.log('putting');
	$.ajax({
		url: url+'/api/jobs/'+task_id,
		data: JSON.stringify({
			"p_fName": p_fName,
			"p_lName": p_lName,
			"p_ID": p_ID,
			"p_Email": p_Email,
			"p_Phone": p_Phone,
			"p_Filament":p_Filament,
			"p_Infill":p_Infill,
			"p_Instructions":p_Instructions,
			"p_Mass":p_Mass,			
			"p_Hours":p_Hours,
			"p_Minutes":p_Minutes,
			"p_ReviewNotes":p_ReviewNotes,
			"p_isReviewed":true,
			'p_isComplete':false,

			"p_Approved":p_Approved
		}),
		type:'PUT',
		contentType:'application/json',
		success: function(data){
			window.location.href='index.html';
		},
		error:function(xhr ,status, err){
			console.log(err);
		}
	});
}

function postReview(e)
{
	var task_id=sessionStorage.getItem('current_id');
	var p_fName=$('#p_fName').val();
	var p_lName=$('#p_lName').val();
	var p_ID=$('#p_ID').val();
	var p_Email=$('#p_Email').val();
	var p_Phone=$('#p_Phone').val();



	var p_Filament = $('#p_Filament').val();
	var p_Instructions=$('#p_Instructions').val();
	var p_Infill =$('#p_Infill').val();

	var p_Mass=$('#p_Mass').val();	
	var p_Hours=$('#p_Hours').val();
	var p_Minutes=$('#p_Minutes').val();
	var p_ReviewNotes=$('#p_ReviewNotes').val();	
	var p_Approved=$('#p_Approved').prop('checked');




	
	console.log('putting');
	$.ajax({
		url: url+'/api/jobs/'+task_id,
		data: JSON.stringify({
			"p_fName": p_fName,
			"p_lName": p_lName,
			"p_ID": p_ID,
			"p_Email": p_Email,
			"p_Phone": p_Phone,
			"p_Filament":p_Filament,
			"p_Infill":p_Infill,
			"p_Instructions":p_Instructions,
			"p_Mass":p_Mass,			
			"p_Hours":p_Hours,
			"p_Minutes":p_Minutes,
			"p_ReviewNotes":p_ReviewNotes,
			"p_isReviewed":true,
			'p_isComplete':false,
			"p_Approved":p_Approved
		}),
		type:'PUT',
		contentType:'application/json',
		success: function(data){
			window.location.href='PrintQueue_AwaitingReview.html';
		},
		error:function(xhr ,status, err){
			console.log(err);
		}
	});
}


//Will need some additional work
function completePrint(e)
{
	var task_id=sessionStorage.getItem('current_id');
	var printInfo=$.get(url+'/api/jobs/'+task_id, function(printInfo){
		console.log(printInfo);
		$.ajax({
			url: url+'/api/jobs/'+task_id,
			data: JSON.stringify({
				"p_fName": printInfo.p_fName,
				"p_lName": printInfo.p_lName,
				"p_ID": printInfo.p_ID,
				"p_Email": printInfo.p_Email,
				"p_Phone": printInfo.p_Phone,
				"p_Filament":printInfo.p_Filament,
				"p_Infill":printInfo.p_Infill,
				"p_Instructions":printInfo.p_Instructions,
				"p_Mass":printInfo.p_Mass,			
				"p_Hours":printInfo.p_Hours,
				"p_Minutes":printInfo.p_Minutes,
				"p_ReviewNotes":printInfo.p_ReviewNotes,
				"p_isReviewed":true,
				'p_isComplete':true,
				"p_Approved":printInfo.p_Approved
			}),
			type:'PUT',
			contentType:'application/json',
			success: function(data){
				window.location.href='PrintQueue_Ready.html';
			},
			error:function(xhr ,status, err){
				console.log(err);
			}
		});
	});

	/*
	var p_fName=$('#p_fName').val();
	var p_lName=$('#p_lName').val();
	var p_ID=$('#p_ID').val();
	var p_Email=$('#p_Email').val();
	var p_Phone=$('#p_Phone').val();



	var p_Filament = $('#p_Filament').val();
	var p_Instructions=$('#p_Instructions').val();
	var p_Infill =$('#p_Infill').val();

	var p_Mass=$('#p_Mass').val();	
	var p_Hours=$('#p_Hours').val();
	var p_Minutes=$('#p_Minutes').val();
	var p_ReviewNotes=$('#p_ReviewNotes').val();	
	var p_Approved=$('#p_Approved').prop('checked');

	*/	
	
}


function deleteTask(){
	var print_id=$(this).data('task-id');
	$.ajax({
		url: url+'/api/jobs/'+print_id,
		type:'DELETE',
		async: true,
		contentType:'application/json',
		success: function(data){
			window.location.href='prints.html';
		},
		error:function(xhr ,status, err){
			console.log(err);
		}
	});

};
