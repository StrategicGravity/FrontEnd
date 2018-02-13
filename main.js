
$(document).ready(function(){

	//alert(1);
	//getPrints();
	$('#add_print').on('click','.submitButton',function()
	{
		addPrint(1);
	});
	$('#add_print').on('click','.saveButton',function()
	{
			//0 is incomplete, 1 is complete
			addPrint(0);
		});
	$('#edit_print').on('click','.submitButton', editPrint);
	//$('#add_print').submit(addPrint);
	$('body').on('click','.btn-edit-task',setTask);
	$('body').on('click','.btn-view-task',setTask_view);
	$('body').on('click','.btn-delete-task',deleteTask);
	$('body').on('click','.btn-show-all',getPrints);
	$('body').on('click','.btn-search-by-name',getPrintsByName);
	$('body').on('click','.btn-search-by-ID',getPrintsByID);


	
	$(".dropdown-menu").on('click', 'li a', function(){
		$(this).parent().parent().siblings(".btn:first-child").html($(this).text()+' <span class="caret"></span>');
		$(this).parent().parent().siblings(".btn:first-child").val($(this).text());
	});
});


//Display All Prints
function getPrints(){
	$.get('https://factoryprintform.library.unt.edu:3000/api/prints',function(data){
		let output= '<ul class= "list-group">';
		$.each(data, function(key,print){
			console.log(data);
			output += '<li class="list-group-item">';
			output += print.p_fName + '<span class = "patron_name"></span>';
			output += '<div class="pull-right"> <a class="btn btn-success btn-view-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">View</a> <a class="btn btn-primary btn-edit-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">Edit</a> <a class="btn btn-danger btn-delete-task" data-task-id="'+print._id+'">Delete</a></div>';
		});
		output+='</ul>';
		$('#prints').html(output);
	});
}

//Search prints by name
function getPrintsByName(){
	var p_Name=$('#p_fName').val();
	$.get('https://factoryprintform.library.unt.edu:3000/api/prints/findByName/'+p_fName,function(data){
		let output= '<ul class= "list-group">';
		$.each(data, function(key,print){
			console.log(data);
			output += '<li class="list-group-item">';
			output += print.p_fName + '<span class = "patron_name"></span>';
			output += '<div class="pull-right"> <a class="btn btn-success btn-view-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">View</a> <a class="btn btn-primary btn-edit-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">Edit</a> <a class="btn btn-danger btn-delete-task" data-task-id="'+print._id+'">Delete</a></div>';
		});
		output+='</ul>';
		$('#prints').html(output);
	});
}

function getPrintsByID(){
	var p_ID=$('#p_ID').val();
	$.get('https://johnknowlesportfolio.com:3000/api/prints/findByID/'+p_ID,function(data){
		let output= '<ul class= "list-group">';
		$.each(data, function(key,print){
			console.log(data);
			output += '<li class="list-group-item">';
			output += print.p_fName + '<span class = "patron_name"></span>';
			output += '<div class="pull-right"> <a class="btn btn-success btn-view-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">View</a> <a class="btn btn-primary btn-edit-task" data-task-name="'+print.p_fName+'" data-task-id="'+print._id+'">Edit</a> <a class="btn btn-danger btn-delete-task" data-task-id="'+print._id+'">Delete</a></div>';
		});
		output+='</ul>';
		$('#prints').html(output);
	});
}



function addPrint(form_Complete)
{
	//e.preventDefault();
	//window.alert('submitting');

	var p_fName=$('#p_fName').val();
	var p_lName=$('#p_lName').val();
	var p_ID=$('#p_ID').val();
	var p_Email=$('#p_Email').val();
	var p_Phone=$('#p_Phone').val();



	var p_FileName = $('#file').get(0).files[0];
	var p_Filament = $('#p_Filament').val();
	alert($('#p_Filament').val());

	var p_Infill =$('#p_Infill').val();
	var p_MakerNameA=$('#p_MakerNameA').val();
	var p_MakerNameP=$('#p_MakerNameP').val();
	//var p_Date=$('#p_Date').val();
	//Set up attempts
	
	console.log('posting');
	$.ajax({
		url: 'https://factoryprintform.library.unt.edu:3000/api/prints',
		data: JSON.stringify({
			"p_fName": p_fName,
			"p_lName": p_lName,
			"p_ID": p_ID,
			"p_Email": p_Email,
			"p_FileName": p_FileName,
			"p_Phone": p_Phone,
			"p_Filament":p_Filament,
			"p_Infill":p_Infill,
			//0 is incomplete, 1 is complete
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
	var print_id=$(this).data('task-id');
	console.log(print_id);
	sessionStorage.setItem('current_id',print_id);
	window.location.href='editPrint.html';
	return false;
}

function setTask_view(){
	//console.log('test');
	//alert("Setting task");
	var print_id=$(this).data('task-id');
	console.log(print_id);
	sessionStorage.setItem('current_id',print_id);
	window.location.href='viewPrint.html';
	return false;
}


function getTask(id)
{
	//alert("Getting Task");
	console.log('Get Task Called '+id);
	$.get('https://factoryprintform.library.unt.edu:3000/api/prints/' + id,function(print){
		$('#p_fName').val(print.p_fName);
		$('#p_lName').val(print.p_lName);
		$('#p_ID').val(print.p_ID);
		$('#p_Email').val(print.p_Email);

		var message="File Present";
		if(print.p_STL=="undefined")
		{
			message="File Not Present"
		}
		$('#p_FileName').val(message);
		


		$('#p_Phone').val(print.p_Phone);
		$('#p_Filament').val(print.p_Filament);
		$('p_Infill').val(print.p_Infill);
		

	});
}

function editPrint(e)
{

	var p_fName=$('#p_fName').val();
	var p_lName=$('#p_lName').val();
	var p_ID=$('#p_ID').val();
	var p_Email=$('#p_Email').val();
	var p_Phone=$('#p_Phone').val();



	var p_FileName = $('#p_STL').get(0).files[0];
	var p_Filament = $('#p_Filament').val();
	alert($('#p_Filament').val());

	var p_Infill =$('#p_Infill').val();
	
	console.log('posting');
	$.ajax({
		url: 'https://factoryprintform.library.unt.edu:3000/api/prints',
		data: JSON.stringify({
			"p_fName": p_fName,
			"p_lName": p_lName,
			"p_ID": p_ID,
			"p_Email": p_Email,
			"p_FileName": p_FileName,
			"p_Phone": p_Phone,
			"p_Filament":p_Filament,
			"p_Infill":p_Infill
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

function deleteTask(){
	var print_id=$(this).data('task-id');
	$.ajax({
		url: 'https://factoryprintform.library.unt.edu:3000/api/prints/'+print_id,
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
