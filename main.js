
$(document).ready(function(){

	$('#add_print').on('click','.submitButton',function()
	{
		addPrint();
	});
	$('#edit_print').on('click','.submitButton', editPrint);
	$('#review_print').on('click','.submitButton', postReview);
	$('#create_login').on('click','.submitButton', addLogin);
	$('#edit_login').on('click','.submitButton', editLogin);


	$('#form_log_attempts').on('click', '.submitButton', function(){
		logAttempts();
	});
	




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





	//$('#add_print').submit(addPrint);
	$('body').on('click','.btn-edit-task',setTask);

	$('body').on('click','.btn-edit-user',setLogin);

	$('body').on('click','.btn-view-task',setTask_view);
	$('body').on('click','.btn-review-task',setTask_review);
	$('body').on('click','.btn-complete-print',attempt_print);
	$('body').on('click','.btn-complete-print',completePrint);
	$('body').on('click','.btn-delete-task',deleteTask);

	$('body').on('click','.btn-delete-user',deleteUser);

	$('body').on('click','.btn-show-all',getPrints);
	$('body').on('click','.btn-search-by-name',getPrintsByName);
	$('body').on('click','.btn-search-by-ID',getPrintsByID);

	$('#btn_login').click( function(){
		console.log('clicked');
		testLogins();
	});

	/*
	$('#login_display').on('click','.btn_logout', function(){
		console.log('clicked');
		sessionStorage.removeItem('current_login');
		window.location.href='Factory_Login.html';
	});
	*/
	$('body').on('click','.btn_logout',abc);





});

function abc(){
	console.log('clicked');
	sessionStorage.removeItem('current_login');
	window.location.href='Factory_Login.html';
}

//This is a testing URL
var url='http://johnknowlesportfolio.com:443';

function getPrints(){
	//var workRequest=$('#p_WorkRequestType').val();
	//console.log(workRequest);
	$.get(url+'/api/jobs',function(data){
		let output= '<ul class= "list-group">';
		$.each(data, function(key,print){
			output += '<li class="list-group-item">';
			output += 'Patron Name: '+print.p_fName + '<br>';
			output+='Job Type: '+print.p_JobType +'<br>';
			output+= 'File Name: '+print.p_FileName +'<br>';
			output+='Date Submitted: ' +dateFromObjectId(print._id)+'<br>';
			output+='Job Reviewed: ' + print.p_isReviewed+'      ';
			output+='<a class="btn btn-danger btn_ClearReview" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">Clear Print Review</a>' + '<br>'
			output+='Job Approved: ' + print.p_Approved;
			output+='<a class="btn btn-danger btn_ClearApproval" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">Clear Print Approval</a>' + '<br>'
			output+='Job Completed: ' + print.p_isComplete;
			output+='<a class="btn btn-danger btn_ClearCompletion" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">Clear Print Completetion</a>' + '<br>'

			output += `<h4>
			<a href="`+url +`/uploads/`+print.p_FileName+`" download>download file</a>    
			</h4>`;
			output += '<a class="btn btn-success btn-edit-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">Edit Print</a> <a class="btn btn-success btn-view-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">View</a> ';
			output+= '</li>'
			
		});
		output+='</ul>';
		$('#prints').html(output);
	});
}


function generatePrintStats(){
	var newPrints=0;
	var newCNC=0;
	var newLaser=0;
	var jobsAwaitingPrinting=0;
	var jobsAwaitingPickup=0;
	$.get(url+'/api/jobs',function(data){
		console.log(data);
		$.each(data, function(key,print){
			if(print.p_Approved==false)
			{
				console.log('newPrints ++');
				newPrints++;
			}
			else if(print.p_isComplete==false)
			{
				jobsAwaitingPrinting++;
			}
			else if(print.p_isPickedUp==false)
			{
				jobsAwaitingPickup++;
			}

		});
		let output=`<p> New Prints: `+newPrints +`<br>
		Waiting to Print: `+jobsAwaitingPrinting+`<br>
		Waiting to be Picked Up: `+jobsAwaitingPickup+`</p>`;
		console.log(output);

		$('#PrintStats').html(output);
	});

}

	//Display actively logged in user
	function displayLogin(e){
		var user=sessionStorage.getItem('current_login');
		var output=``;
		if(user != null)
		{
			output+=`
			<label class="col-sm-3" align="left">Logged in as: `+user+`</label>
			<button class="btn_logout" align="right"> Log Out </button>
			`;
		}
		$('#login_display').html(output);



	}

//Test login information against feilds
function testLogins(e){
		//Get login from server here
		$.get(url+'/api/logins',function(data){
			$.each(data,function(key, login){
				console.log(login);
				console.log($('#l_User').val());
				console.log($('#l_Password').val());
				if($('#l_User').val() == login.s_UserName && $('#l_Password').val() == login.s_Password)
				{
					console.log('login success');
					sessionStorage.setItem('current_login',login.s_UserName);
					window.location.href='StaffLandingPage.html';
					return;
				}
			});
		});

	}

	function testPermissions(permission_Required){
		var user_sess=sessionStorage.getItem('current_login');
		var user;

		$.get(url+'/api/login/findByName/'+user_sess,function(data){
			//console.log(data);
			if(data==undefined)
			{
				alert('You dont have permission to view this page undefined');
				window.location.href='index.html';
			}
			if(data.s_Permission=='Admin')
			{
				return;
			}
			if(data.s_Permission!=permission_Required){
				alert('You dont have permission to view this page');
				window.location.href='StaffLandingPage.html';
			}
		});

	}

	function attempt_print(e){
		console.log('test');
		var job_id=$(this).data('task-id');
		console.log(job_id);
		sessionStorage.setItem('current_id',job_id);
		window.location.href='AttemptPrint.html';
		return false;
	}

	//log attempts here
	function logAttempts(e){
		console.log('event fired');
		var printCount=$('#p_AttemptCount').val();
		var attempts=[];
		var task_id=sessionStorage.getItem('current_id');

		for(var i=0; i<printCount; i++){

			var id_start="#p_startTime"+i;
			var id_finish="#p_endTime"+i;
			var id_Mass="#p_Mass"+i;
			var id_success="#p_PrintSucceeded"+i;
			var temp ={
				p_AttemptNumber : i,
				p_TimeS : $(id_start).val(),
				p_TimeF : $(id_finish).val(),
				p_Mass : $(id_Mass).val(),
				p_Status : $(id_success).is(":checked")
			};
			attempts.push(temp);
		}

		console.log('putting');
		$.ajax({
			url: url+'/api/jobs/logAttempts/'+task_id,
			data: JSON.stringify({
				"p_Attempts":attempts
			}),
			type:'PUT',
			contentType:'application/json',
			success: function(data){
				window.location.href='StaffLandingPage.html';
			},
			error:function(xhr ,status, err){
				console.log(err);
			}
		});
		console.log(attempts);
	}

	//Display attempts on a web page.
	function displayAttempts(e){
		var task_id=sessionStorage.getItem('current_id');

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
	var workRequest=$('#p_WorkRequestType').val();
	console.log(workRequest);
	$.get(url+'/api/jobs/findByReviewStatus/'+isReviewed,function(data){
		let output= '<ul class= "list-group">';
		$.each(data, function(key,print){
			if(print.p_JobType==workRequest || workRequest=='All')
			{
				output += '<li class="list-group-item">';
				output += 'Patron Name: '+print.p_fName + '<br>';
				output+='Job Type: '+print.p_JobType +'<br>';
				output+= print.p_FileName;
				output += `<h4>
				<a href="`+url +`/uploads/`+print.p_FileName+`" download>download file</a>    
				</h4>`;
				output += '<a class="btn btn-success btn-review-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">Review Print</a> <a class="btn btn-success btn-view-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">View</a> ';
				output+= '</li>'
			}
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
	var workRequest=$('#p_WorkRequestType').val();
	console.log(workRequest);
	$.get(url+'/api/jobs/findByPrintComplete/'+isDone,function(data){
		let output= '<ul class= "list-group">';
		$.each(data, function(key,print){
			if(print.p_JobType==workRequest || workRequest=='All')
			{
				output += '<li class="list-group-item">';
				output += 'Patron Name: '+print.p_fName + '<br>';
				output+='Job Type: '+print.p_JobType +'<br>';
				output+= print.p_FileName;
				output += `<h4>
				<a href="`+url +`/uploads/`+print.p_FileName+`" download>download file</a>    
				</h4>`;
				output += '<a class="btn btn-success btn-pickup-print" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">Mark Print as Picked Up</a> <a class="btn btn-success btn-view-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">View</a> ';
				output+= '</li>'
			}
		});
		output+='</ul>';
		$('#prints').html(output);
	});
}



function getReadyPrints(){
	var isDone=true;
	var workRequest=$('#p_WorkRequestType').val();
	console.log(workRequest);
	$.get(url+'/api/jobs/findByReviewStatus/'+isDone,function(data){
		let output= '<ul class= "list-group">';
		$.each(data, function(key,print){
			if(print.p_JobType==workRequest || workRequest=='All')
			{
				output += '<li class="list-group-item">';
				output += 'Patron Name: '+print.p_fName + '<br>';
				output+='Job Type: '+print.p_JobType +'<br>';
				output+= print.p_FileName;
				output += `<h4>
				<a href="`+url +`/uploads/`+print.p_FileName+`" download>download file</a>    
				</h4>`;
				output += '<a class="btn btn-success btn-complete-print" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">Log Print Attempts</a> <a class="btn btn-success btn-view-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">View</a> ';
				output+= '</li>'
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
			output += 'User Name: '+login.s_UserName + '<br>';
			output += 'Permission Level: ' +login.s_Permission + '<br>';
			output+='<a class="btn btn-primary btn-edit-user" data-task-name="'+login.s_UserName+'" data-task-id="'+login._id+'">Edit</a>';
			output += '<a class="btn btn-danger btn-delete-user" data-task-id="'+login._id+'">Delete</a>';
			output+='</li>'
		});
		output+='</ul>';
		$('#logins').html(output);
	});
}





function addLogin()
{

	console.log('got here');

	var s_UserName=$('#s_UserName').val();
	var s_Password=$('#s_Password').val();
	var s_Password_Retype=$('#s_Password_Retype').val();
	var s_Name=$('#s_Name').val();
	var s_Permission=$('#s_Permission').val();

	console.log('got jere');
	console.log(s_Permission);

	if(s_Password != s_Password_Retype)
	{
		alert('Password Mismatch!')
		return;
	}
	console.log('posting');
	$.ajax({
		url: url+'/api/logins',
		data: JSON.stringify({
			"s_UserName":s_UserName,
			"s_Password": s_Password,
			"s_Name":s_Name,
			"s_Permission" :s_Permission
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
	var job_id=$(this).data('task-id');
	alert(job_id);
	sessionStorage.setItem('current_id',job_id);

	window.location.href='EditPrint.html';
	return false;
}

function setLogin(){
	var job_id=$(this).data('task-id');
	console.log(job_id);
	sessionStorage.setItem('current_id',job_id);
	window.location.href='EditLogin.html';
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
		console.log(print);
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

		var i=0;
		console.log(print.p_Attempts[0].p_TimeS);
		var output='<hr>'
		while(i<print.p_Attempts.length)
		{
			console.log('attempt '+i);
			output +=`
			<h4> Attempt `+i+` </h4>
			<div class="form-group row">
			<label class='control-label col-sm-4'>Start time:</label>
			<div class="col-sm-8">
			<input type="time"  class="form-control" value = `+print.p_Attempts[i].p_TimeS+` disabled>
			</div>
			</div>`;
			output +=`<div class="form-group row">
			<label class='control-label col-sm-4' >End time:</label>
			<div class="col-sm-8">
			<input type="time"  class="form-control" value = `+print.p_Attempts[i].p_TimeF+` disabled>
			</div>
			</div>`;
			output +=`<div class="form-group row">
			<label class='control-label col-sm-4'>Mass:</label>
			<div class="col-sm-8">
			<input type="number" class="form-control" value = `+print.p_Attempts[i].p_Mass+` disabled>
			</div>
			</div>`


			output+=`<div class="form-group row">
			<label class="control-label col-sm-4">Print Success:</label>
			<div class="col-sm-8">
			<input type="text" class="form-check-input" value = "`+print.p_Attempts[i].p_Status+`" disabled>
			</div>
			</div>`;
			i++;

		}
		console.log(output);
		$('#view_print').html(output);


	});
}
function getLoginForEditing(id){
	console.log(id);
	$.get(url+'/api/login/' + id,function(login){
		console.log(login);
		$('#s_UserName').val(login.s_UserName);
		$('#s_Password').val(login.s_Password);
		$('#s_Password_Retype').val(login.s_Password);
		$('#s_Name').val(login.s_Name);
	});
}
//Edit Login
function editLogin(e)
{
	var task_id=sessionStorage.getItem('current_id');
	var s_UserName=$('#s_UserName').val();
	var s_Password=$('#s_Password').val();
	var s_Password_Retype=$('#s_Password_Retype').val();
	var s_Name=$('#s_Name').val();
	var s_Permission=$('#s_Permission').val();


	if(s_Password != s_Password_Retype)
	{
		alert('Password Mismatch!')
		return;
	}
	console.log('putting');
	$.ajax({
		url: url+'/api/logins/'+task_id,
		data: JSON.stringify({
			"s_UserName":s_UserName,
			"s_Password": s_Password,
			"s_Name":s_Name,
			"s_Permission" :s_Permission
		}),
		type:'PUT',
		contentType:'application/json',
		success: function(data){
			window.location.href='CreateViewLogins.html';
		},
		error:function(xhr ,status, err){
			console.log(err);
		}
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


	
}

function deleteUser(){
	var user_id=$(this).data('task-id');
	$.ajax({
		url: url+'/api/login/'+user_id,
		type:'DELETE',
		async: true,
		contentType:'application/json',
		success: function(data){
			window.location.href='CreateViewLogins.html';
		},
		error:function(xhr ,status, err){
			console.log(err);
		}
	});

};
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

//Utility Functions!
var objectIdFromDate = function (date) {
	return Math.floor(date.getTime() / 1000).toString(16) + "0000000000000000";
};

var dateFromObjectId = function (objectId) {
	return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
};
