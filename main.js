
$(document).ready(function(){

	//alert(1);
	//getPrints();
	$('#add_print').on('click','.submitButton',function()
	{
		addPrint();
	});
	$('#edit_print').on('click','.submitButton', editPrint);
	$('#review_print').on('click','.submitButton', postReview);

	//$('#add_print').submit(addPrint);
	$('body').on('click','.btn-edit-task',setTask);
	$('body').on('click','.btn-view-task',setTask_view);
	$('body').on('click','.btn-review-task',setTask_review);
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



function addPrint()
{
	//e.preventDefault();
	//window.alert('submitting');

	var p_fName=$('#p_fName').val();
	var p_lName=$('#p_lName').val();
	var p_ID=$('#p_ID').val();
	var p_Email=$('#p_Email').val();
	var p_Phone=$('#p_Phone').val();



	var p_Filament = $('#p_Filament').val();
	var p_Instructions = $('#p_Instructions').val();
	alert($('#p_Filament').val());

	var p_Infill =$('#p_Infill').val();
	//var p_Date=$('#p_Date').val();
	//Set up attempts
	
	console.log('posting');
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
			"p_Instructions":p_Instructions

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
