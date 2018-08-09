//setting global map variables
var watchID;
var geo;    // for the geolocation object
var my_location_lat;
var my_location_lnt;
var MAXIMUM_AGE = 200; // miliseconds
var TIMEOUT = 300000;
var HIGHACCURACY = true;

//end of variable settings

function authenticate()
{
	var username = $('#username').val();
	var password = $('#password').val();
	if(username==='' || password==='')
	{
		$('#errordiv').html('Please Enter your username and password');
	}
	else
	{
        $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
		var formData = "username=" + username + "&password=" + password;
		console.log(formData);
		 $.ajax({
        type:'POST',
        url: 'http://location.falcontechng.com/adminlogin.php',
        crossDomain: true,
        data:formData,
		cache:false,
       // contentType: false,
        //processData: false,

        success:function(data){
            console.log('i am in success');
            console.log(data);
            var response = data.response;
            var message = data.message;
            $.mobile.loading('hide');
            if(response==='error')
            {
            	$('#errordiv').html(message);
            }
            else
            {
                $('#global_adminusername').val(username);
                console.log($('#global_adminusername').val());
                console.log(username);
                console.log($('#global_adminusername').val());
            	setCookie("username", username, 1);
            	$('#username').val('');
				$('#password').val('');
				$('#errordiv').html('');
            	redirect_to('#adminlanding');
            }

        },

        fail:function(data){
            console.log('i am in fail');
        console.log(data);
        $.mobile.loading('hide');
		redirect_to('#adminerrorpage');
        },

        error: function(data){
            console.log('i am in error');
           console.log(data);
           $.mobile.loading('hide');
           redirect_to('#adminerrorpage');
        }
    });

	}
}



function redirect_to(newPage) {
      $("body").pagecontainer("change", newPage, {transition: "pop"});
  	}

function goto_sucess(newPage,message) {
      $('#sucessmsg').html(message);
      $("body").pagecontainer("change", newPage, {transition: "pop"});
    }

 function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function checkCookie() {
    var user = getCookie("username");
    if (user != "") {
        return true;
    } else {
        return false;
        }
    }

function logout()
{
	setCookie("username", "", -1);
	redirect_to("#adminloginpage")
}

function loadcourseoptions()
{
	var dataurl = 'http://location.falcontechng.com/loadcourseoptions.php';
	$.ajax({
			    url: dataurl,
			    timeout: 5000,
			    error: function(jqXHR, textStatus) {
			    	console.log(textStatus);
			    	redirect_to('#adminerrorpage');
			    },

			    fail: function(jqXHR, textStatus, errorThrown){
			    	console.log(textStatus);
			    	redirect_to('#adminerrorpage');
			    },

			    success: function (jsondata) {
                    $('#cpre').html(' <option>Select Options:</option>');
			    	   for (var i = 0; i < jsondata.length; i++) {
			    	  $('#cpre').append('<option value="' +jsondata[i].c_code.course_code +'">' +jsondata[i].c_code.course_code +'</option>');  
						console.log(jsondata[i].c_code.course_code);
			    	   }

			    	  $('#cpre').trigger("change");
					
            }


			});
}


function loadcoursecat()
{
    var dataurl = 'http://location.falcontechng.com/course_cat.php';
    $.ajax({
                url: dataurl,
                timeout: 5000,
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    redirect_to('#adminerrorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    console.log(textStatus);
                    redirect_to('#adminerrorpage');
                },

                success: function (jsondata) {
                    $('#ccat').html(' <option>Choose One:</option>');
                       for (var i = 0; i < jsondata.length; i++) {
                      $('#ccat').append('<option value="' +jsondata[i].courses_cat.category_name +'">' +jsondata[i].courses_cat.description +'</option>');  
                        console.log(jsondata[i].courses_cat.category_name);
                       }

                      $('#ccat').trigger("change");
                    
            }


            });
}

function addcourse()
{
   

    var ccode = $('#ccode').val();
    var cname = $('#cname').val();
    var ref_code = $('#ref_code').val();
    var cdscpt = $('#cdscpt').val();
    var emucrt = $('#emucrt').val();
    var ectscrt = $('#ectscrt').val();
    var cpre = $('#cpre').val();
    var ccat = $('#ccat').val();
    var lecture_hour = $('#lecture_hour').val();
    var lab_hour = $('#lab_hour').val();
    var tut_hour = $('#tut_hour').val();
    var semester_taken = $('#semester_taken').val();
    if(ccode==='' || cname==='' || ref_code==='' || cdscpt==='' || emucrt==='' || ectscrt==='' ||ccat==='Choose One:' || semester_taken==='Choose One:' || lecture_hour==='' || lab_hour==='' || tut_hour==='')
    { 
         alert('Please Fill all Information regarding the new course');
        $('#addcourseerrordiv').html('Please Fill all Information regarding the new course');
        $.mobile.silentScroll(0);
    }
    else
    {
      $('#progresspane').html('<img src="images/loading.gif" width="30" height="30">');
        var formData = "ccode=" + ccode + "&cname=" + cname+ "&cdscpt=" +
        cdscpt + "&ref_code="+ref_code+"&emucrt=" + emucrt + "&ectscrt=" +ectscrt + "&cpre=" +
        cpre + "&ccat=" +ccat +  "&semester_taken=" + semester_taken +  "&lecture_hour=" +lecture_hour+ "&lab_hour=" +
        lab_hour + "&tut_hour=" + tut_hour;
        console.log(formData);

        $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
         $.ajax({
        type:'POST',
        url: 'http://location.falcontechng.com/addnewcourse.php',
        data:formData,
        cache:false,
       // contentType: false,
        //processData: false,

        success:function(data){
            console.log(data);
            var response = data.response;
            var message = data.message;
            $.mobile.loading('hide');

            if(response==='error')
            {
                alert(message);
            }
            else
            {
                 $('#progresspane').html('');
                document.getElementById("add_course").reset();
                goto_sucess('#adminsuccesspage',message);
            }

        },

        fail:function(data){
        console.log(data);
            $.mobile.loading('hide');

        redirect_to('#adminerrorpage');
        },

        error: function(data){
            $.mobile.loading('hide');

           console.log(data);
           redirect_to('#adminerrorpage');
        }
    });


    }
}

function addcource_category()
{
    var c_catname = $('#c_catname').val();
    var c_catdesc = $('#c_catdesc').val();

     if(c_catname==='' || c_catdesc==='')
    {
       $('#addcaterrordiv').html('Please Enter Category name and Description');
    }
    else
    {
        $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
        document.getElementById("addcoursecategory").reset();
        var formData = "c_catname=" + c_catname + "&c_catdesc=" + c_catdesc;
        console.log(formData);
         $.ajax({
        type:'POST',
        url: 'http://location.falcontechng.com/add_course_cat.php',
         crossDomain: true,
        data:formData,
        cache:false,
       // contentType: false,
        //processData: false,

        success:function(data){
            console.log(data);
            var response = data.response;
            var message = data.message;
            $.mobile.loading('hide');

            if(response==='error')
            {
               alert(message);
            }
            else
            {
               goto_sucess('#adminsuccesspage',message);
            }

        },

        fail:function(data,textStatus,errorThrown){
        console.log(data);
          console.log(textStatus);
           console.log(errorThrown);
            $.mobile.loading('hide');

        redirect_to('#adminerrorpage');
        },

        error: function(data,textStatus,errorThrown){
           console.log(data);
           console.log(textStatus);
           console.log(errorThrown);
            $.mobile.loading('hide');
           
           redirect_to('#adminerrorpage');
        }
    });

    }
}

function loadcourseinfo()
{
    var ccode = $('#searchfield').val();
    if(ccode=='')
    {
        alert('Please Enter Course Code To Search');
    }
    else
    {
        $('#ccodefordelte').val(ccode);
        var dataurl = "http://location.falcontechng.com/loadupdatecourse.php?c_code=" + ccode;
            $.ajax({
                url: dataurl,
                timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Course Details... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },

                error: function(jqXHR, textStatus) {
                    $.mobile.loading('hide');
                    redirect_to('#adminerrorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                     $.mobile.loading('hide');
                     redirect_to('#adminerrorpage');
                },

                success: function (jsondata) {
                    if(jsondata.response==="error")
                    {
                        alert(jsondata.message);
                    }
                    else
                    {
                         $('#updateformpane').html('');
                         $('#updateformpane').append(' <form id="updatecourseform"><input type="hidden" name="oldccode" id="oldccode" value="'+ccode+'" /> <label for="upccode" >Course Code:</label><input type="text" name="upupccode" id="upccode" value="'+jsondata.message.course_code +'" placeholder="Course Code"/><label for="uprefcode" >Ref Code:</label><input type="text" name="uprefcode" id="uprefcode" value="'+jsondata.message.ref_code +'" placeholder="Ref Code"/><label for="upcname">Course Title:</label><input type="text" name="upcname" id="upcname" value="'+jsondata.message.course_title+'" placeholder="Course Title"/>  <label for="upcdscpt">Course Description:</label><textarea id="upcdscpt" name="upcdscpt" placeholder="Course Description">'+jsondata.message.course_desc+'</textarea><label for="upemucrt">EMU Credit:</label><input type="range" name="upemucrt" id="upemucrt" value="'+ jsondata.message.emu_credit+'" min="0" max="10" /><label for="upectscrt">ECTS Credit:</label><input type="range" name="upectscrt" id="upectscrt" value="'+jsondata.message.ects_credit+'" min="0" max="15" /><label for="upcpre">Course Prerequisite:</label><input name="upcpre" id="upcpre" value="'+ jsondata.message.course_pre+'" placeholder="course Prerequisite" /><label for="upccat">Course Category:</label><input type="text" name="upccat" id="upccat" value="'+jsondata.message.course_cat+'" placeholder="course Category" /><label for="upsemester_taken">Semester Taken:</label><input type="number" name="upsemester_taken" id="upsemester_taken" value="' +jsondata.message.semestertaken+ '" placeholder="Semester Taken" /><label for="uplecture_hour">Lecture Hour:</label><input type="number" name="uplecture_hour" id="uplecture_hour" value="'+jsondata.message.lecture_hour+'" min="0" placeholder="Lecture Hour"/><label for="uplab_hour">Lab Hour:</label><input type="number" name="uplab_hour" id="uplab_hour" value="'+jsondata.message.lab_hour+'" min="0" placeholder="Lab Hour"/><label for="uptut_hour">Tutorial Hour:</label><input type="number" name="uptut_hour" id="uptut_hour" value="'+jsondata.message.tutorial_hour+'" min="0" placeholder="Tutorial Hour"/><input type="button" value="Update" onclick="updatecourse()" /></form>');
                    }
                   
                $.mobile.loading('hide');
                $("#updateformpane").trigger("create");
            }


            });
    }
}

function loadcoursebasicinfo()
{
    var ccode = $('#deletesearchfield').val();
    if(ccode==='')
    {
        alert('Please Enter Course Code To Search');
    }
    else
    {
        $('#ccodefordelte').val(ccode);
        var dataurl = "http://location.falcontechng.com/loadupdatecourse.php?c_code=" + ccode;
            $.ajax({
                url: dataurl,
                timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Course Details... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },

                error: function(jqXHR, textStatus) {
                    $.mobile.loading('hide');
                    redirect_to('#adminerrorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                     $.mobile.loading('hide');
                     redirect_to('#adminerrorpage');
                },

                success: function (jsondata) {
                    if(jsondata.response==="error")
                    {
                        alert(jsondata.message);
                    }
                    else
                    {
                         $('#deletecoursepane').html('');
                         $('#deletecoursepane').append(' <form id="deletecourseform"><input type="hidden" name="oldccode" id="oldccode" value="'+ccode+'" /> <label for="upccode" >Course Code:</label><input type="text" name="upupccode" disabled id="upccode" value="'+jsondata.message.course_code +'" placeholder="Course Code"/><label for="upcname">Course Title:</label><input type="text" name="upcname" disabled id="upcname" value="'+jsondata.message.course_title+'" placeholder="Course Title"/>  <label for="upcdscpt">Course Description:</label><textarea id="upcdscpt" name="upcdscpt" disabled placeholder="Course Description">'+jsondata.message.course_desc+'</textarea><input type="button" value="Delete" onclick="deletecourse()" /></form>');
                    }
                   
                $.mobile.loading('hide');
                $("#deletecourses").trigger("create");
            }


            });
    }
}

function updatecourse()
{
    var ccode = $('#upccode').val();
    var cname = $('#upcname').val();
    var cdscpt = $('#upcdscpt').val();
    var emucrt = $('#upemucrt').val();
    var ectscrt = $('#upectscrt').val();
    var cpre = $('#upcpre').val();
    var ccat = $('#upccat').val();
    var lecture_hour = $('#uplecture_hour').val();
    var lab_hour = $('#uplab_hour').val();
    var tut_hour = $('#uptut_hour').val();
    var oldccode = $('#oldccode').val();
    var uprfcde = $('#uprefcode').val();
    var semester_taken = $('#upsemester_taken').val();
    if(ccode==='' || cname==='' || cdscpt==='' || emucrt==='' || ectscrt==='' ||ccat==='' || semester_taken==='' || lecture_hour==='' || lab_hour==='' || tut_hour==='' || uprfcde==='')
    {
       alert('Please Fill all Information regarding the course');
    }
    else
    {
        $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
        $('#upprogresspane').html('<img src="images/loading.gif" width="30" height="30">');
        var formData = "ccode=" + ccode + "&oldccode=" +oldccode + "&cname=" + cname+ "&cdscpt=" +
        cdscpt + "&emucrt=" + emucrt + "&ectscrt=" +ectscrt + "&cpre=" +
        cpre + "&ccat=" +ccat +  "&semester_taken=" + semester_taken +  "&lecture_hour=" +lecture_hour+ "&lab_hour=" +
        lab_hour + "&ref_code= "+uprfcde+"&tut_hour=" + tut_hour;
        console.log(formData);

         $.ajax({
        type:'POST',
        url: 'http://location.falcontechng.com/updatecourse.php',
        data:formData,
        cache:false,
       // contentType: false,
        //processData: false,

        success:function(data){
            console.log(data);
            var response = data.response;
            var message = data.message;
            $.mobile.loading('hide');

            if(response==='error')
            {
                alert(message);
            }
            else
            {
                 $('#upprogresspane').html(''); 
                 $('#updateformpane').html('');
                goto_sucess('#adminsuccesspage',message);

            }

        },

        fail:function(data){
        console.log(data);
            $.mobile.loading('hide');

        redirect_to('#adminerrorpage');
        },

        error: function(data){
            $.mobile.loading('hide');

           console.log(data);
           redirect_to('#adminerrorpage');
        }
    });

    }
}


function deletecourse()
{
    coursecode = $('#ccodefordelte').val();
    var r = confirm("Are You Sure You want to delete this course?");
    if (r == true) {
        $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
     $.ajax({
        type:'POST',
        url: 'http://location.falcontechng.com/delete_course.php?coursecode=' + coursecode,

        success:function(data){
            console.log(data);
            var response = data.response;
            var message = data.message;
            $.mobile.loading('hide');
            if(response==='error')
            {
               alert(message);
            }
            else
            {
               goto_sucess('#adminsuccesspage',message);
            }

        },

        fail:function(data){
        console.log(data);
           $.mobile.loading('hide');
        redirect_to('#adminerrorpage');
        },

        error: function(data){
           console.log(data);
              $.mobile.loading('hide');
           redirect_to('#adminerrorpage');
        }
    });

    }  
}

function loadstaffinfo(){
     var ccode = $('#searchstaffield').val();
    if(ccode==='')
    {
        alert('Please Enter Staff Email To Search');
    }
    else
    {
        $('#stafemaildelete').val(ccode);
        var dataurl = "http://location.falcontechng.com/loadupdatestaff.php?staffemail=" + ccode;
            $.ajax({
                url: dataurl,
                timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Staff Details... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },

                error: function(jqXHR, textStatus) {
                    $.mobile.loading('hide');
                    redirect_to('#adminerrorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                     $.mobile.loading('hide');
                     redirect_to('#adminerrorpage');
                },

                success: function (jsondata) {
                    if(jsondata.response==="error")
                    {
                        alert(jsondata.message);
                    }
                    else
                    {
                         $('#updatestaffformpane').html('');
                         $('#updatestaffformpane').append('<form id="update_staff" method="post" enctype="multipart/form-data" data-ajax="false"><input type="hidden" name="oldemail" id="oldemail" value="'+ccode+'" /><label for="upstitle" >Staff Title:</label><input type="text" name="upstitle" id="upstitle" value="'+jsondata.message.title +'" required placeholder="Assoc. Prof. Dr"/><label for="upsname">First Name:</label><input type="text" name="upsname" id="upsname" value="'+jsondata.message.fname +'" required placeholder="First Name"/><label for="uplname">Last Name:</label><input type="text" name="uplname" id="uplname" value="'+jsondata.message.lname +'" required placeholder="Last Name"/><label for="upspos">Position:</label><input type="text" name="upspos" id="upspos" value="'+jsondata.message.staff_position +'" required placeholder="Position" /><label for="upemail">Email:</label><input type="email" name="upemail" id="upemail" value="'+jsondata.message.email +'" required placeholder="Email" /><label for="upofficeno">Office No:</label><input type="text" name="upofficeno" id="upofficeno" required placeholder="Office Num" value="'+jsondata.message.office_no +'"/><label for="upphone_num">Phone Number:</label><input type="text" name="upphone_num" id="upphone_num" required placeholder="Phone Num" value="'+jsondata.message.phone +'"/><input type="button" value="Update Staff" onclick="updatestaffinfoaction()" /></form>');
                    }
                   
                $.mobile.loading('hide');
                $("#updatestaffinfo").trigger("create");
            }


            });
    }
}


function updatestaffinfoaction(){
    var sttitle = $('#upstitle').val();
    var fname = $('#upsname').val();
    var lname = $('#uplname').val();
    var posi = $('#upspos').val();
    var email = $('#upemail').val();
    var office_no = $('#upofficeno').val();
    var phone = $('#upphone_num').val();
    var oldemail = $('#oldemail').val();
    if(sttitle==='' || fname==='' || lname==='' || posi==='' || email==='' ||office_no==='' || phone==='')
    {
       alert('Please Fill all Staff Information');
    }
    else
    {
        $('#upstafprogresspane').html('<img src="images/loading.gif" width="30" height="30">');
        var formData = "sttitle=" + sttitle + "&fname=" + fname+ "&lname=" +
        lname + "&posi=" + posi + "&email=" +email + "&office_no=" +
        office_no + "&phone=" +phone + "&oldemail=" +oldemail;
        console.log(formData);
        $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
         $.ajax({
        type:'POST',
        url: 'http://location.falcontechng.com/updatestaff.php',
        data:formData,
        cache:false,
       // contentType: false,
        //processData: false,

        success:function(data){
            console.log(data);
            var response = data.response;
            var message = data.message;
             $.mobile.loading('hide');
            if(response==='error')
            {
                alert(message);
            }
            else
            {
                 $('#upstafprogresspane').html(''); 
                 $('#updatestaffformpane').html('');
                goto_sucess('#adminsuccesspage',message);

            }

        },

        fail:function(data){
        console.log(data);
         $.mobile.loading('hide');
        redirect_to('#adminerrorpage');
        },

        error: function(data){
           console.log(data);
            $.mobile.loading('hide');
           redirect_to('#adminerrorpage');
        }
    });

    }
}

function loadstaffbasicinfo(){
   var ccode = $('#searchstaffielde').val();
    if(ccode==='')
    {
        alert('Please Enter Staff Email To Search');
    }
    else
    {
        $('#estafemaildelete').val(ccode);
        var dataurl = "http://location.falcontechng.com/loadupdatestaff.php?staffemail=" + ccode;
            $.ajax({
                url: dataurl,
                timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Staff Details... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },

                error: function(jqXHR, textStatus) {
                    $.mobile.loading('hide');
                    redirect_to('#adminerrorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                     $.mobile.loading('hide');
                     redirect_to('#adminerrorpage');
                },

                success: function (jsondata) {
                    console.log(jsondata);
                    if(jsondata.response==="error")
                    {
                        alert(jsondata.message);
                    }
                    else
                    {
                          $('#estafemaildelete').val(ccode);
                        $('#stfimg').attr({src:jsondata.message.photo});
                       $('#eupdatestaffformpane').show();
                         $('#sftbdetails').html(jsondata.message.title + ' ' + jsondata.message.lname + ' ' +jsondata.message.fname);
                    }
                   
                $.mobile.loading('hide');
             
            }


            });
    }
}

function findstafftodelete(){
     var ccode = $('#stafemdel').val();
    if(ccode==='')
    {
        alert('Please Enter Staff Email To Search');
    }
    else
    {
        $('#staffemailfordelte').val(ccode);
        var dataurl = "http://location.falcontechng.com/loadupdatestaff.php?staffemail=" + ccode;
            $.ajax({
                url: dataurl,
                timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Staff Details... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },

                error: function(jqXHR, textStatus) {
                    $.mobile.loading('hide');
                    redirect_to('#adminerrorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                     $.mobile.loading('hide');
                     redirect_to('#adminerrorpage');
                },

                success: function (jsondata) {
                    console.log(jsondata);
                    if(jsondata.response==="error")
                    {
                        alert(jsondata.message);
                    }
                    else
                    {
                        $('#deletestaffpane').html('');
                        $('#deletestaffpane').html('<img id="stfimg" src="'+jsondata.message.photo +'" alt="staff image" width="150" height="150" ><p>'+jsondata.message.title + ' ' + jsondata.message.fname + ' ' + jsondata.message.lname +'</p><input type="button" class="ui-btn" value="Delete" onclick="deletestaffinfo()" />');
                        
                    }
                   
                $.mobile.loading('hide');
             
            }


            });
    }
}

function deletestaffinfo(){
    stafemail = $('#stafemdel').val();
    var r = confirm("Are You Sure You want to delete this Staff?");
    if (r == true) {
        $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
     $.ajax({
        type:'POST',
        url: 'http://location.falcontechng.com/delete_staff.php?email=' + stafemail,

        success:function(data){
            console.log(data);
            var response = data.response;
            var message = data.message;
            $.mobile.loading('hide');
            if(response==='error')
            {
               alert(message);
            }
            else
            {
                 $('#deletestaffpane').html('');
               goto_sucess('#adminsuccesspage',message);

            }

        },

        fail:function(data){
        console.log(data);
        $.mobile.loading('hide');
        redirect_to('#adminerrorpage');
        },

        error: function(data){
           console.log(data);
           $.mobile.loading('hide');
           redirect_to('#adminerrorpage');
        }
    });

    }  
}

function hddiv()
{
    $('#eupdatestaffformpane').hide();
}

 function loadannouncementlist(){
    $('#updateannocemnt').hide();
    var dataurl = "http://location.falcontechng.com/mistery.php";
            $.ajax({
                url: dataurl,
                timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Announcement Details... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },

                error: function(jqXHR, textStatus) {
                    $.mobile.loading('hide');
                    redirect_to('#adminerrorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                     $.mobile.loading('hide');
                     redirect_to('#adminerrorpage');
                },

                success: function (jsondata) {
                    console.log(jsondata);
                    console.log(jsondata[0].annoucement.title);
                        $('#annoucementselect1').html('');
                        $('#annoucementselect1').append('<option value="Select">Select</option>');
                        for (var i = 0; i < jsondata.length; i++) {
                             $('#annoucementselect1').append('<option value="'+jsondata[i].annoucement.id+'">'+jsondata[i].annoucement.title+'</option>');
                             
                        };
                        $('#annoucementselect1').trigger("change");
        
                $.mobile.loading('hide');
             
            }


            });
 }

function showupdateannuocementform()
{
    var value = $('#annoucementselect1').val();
    if(value==="Select"){
       return;
    }
    var dataurl = "http://location.falcontechng.com/loadannoucemnt.php?id=" + value;
            $.ajax({
                url: dataurl,
                timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Announcement Details... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },

                error: function(jqXHR, textStatus) {
                    $.mobile.loading('hide');
                    redirect_to('#adminerrorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                     $.mobile.loading('hide');
                     redirect_to('#adminerrorpage');
                },

                success: function (jsondata) {
                    console.log(jsondata);
                    if(jsondata.response==="error")
                    {
                        alert(jsondata.message);
                    }
                    else
                    {
                        $('#id').val(jsondata.message.id);
                        $('#myid').val(jsondata.message.id);
                        console.log($('#id').val());
                        console.log(jsondata.message.title);
                        $('#updateannocemnt').show();
                        console.log(jsondata.message.id);
                        $('#upanntitle').val(jsondata.message.title);
                        $('#upanndetails').val(jsondata.message.details);
                      
                    }
                   
                $.mobile.loading('hide');
             
            }


            });
}

function deleteannoucemt(){
     var id = $('#annoucementselect1').val();
    var r = confirm("Are You Sure You want to delete this Announcement?");
    if (r == true) {
        $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
     $.ajax({
        type:'POST',
        url: 'http://location.falcontechng.com/delete_announcment.php?id=' + id,

        success:function(data){
            console.log(data);
            $.mobile.loading('hide');
            var response = data.response;
            var message = data.message;

            if(response==='error')
            {
               alert(message);
            }
            else
            {
                 $('#updateannocemnt').hide();
               goto_sucess('#adminsuccesspage',message);

            }

        },

        fail:function(data){
        console.log(data);
        $.mobile.loading('hide');
        redirect_to('#adminerrorpage');
        },

        error: function(data){
           console.log(data);
           $.mobile.loading('hide');
           redirect_to('#adminerrorpage');
        }
    });

    }  
}

function loadactitylist(){
     $('#updateactivity').hide();
    var dataurl = "http://location.falcontechng.com/loadactivitytlist.php";
            $.ajax({
                url: dataurl,
                timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading ACtivity Details... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },

                error: function(jqXHR, textStatus) {
                    $.mobile.loading('hide');
                    redirect_to('#adminerrorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                     $.mobile.loading('hide');
                     redirect_to('#adminerrorpage');
                },

                success: function (jsondata) {
                    console.log(jsondata);
                    console.log(jsondata[0].activity.title);
                        $('#activityselect1').html('');
                        $('#activityselect1').append('<option value="Select">Select</option>');
                        for (var i = 0; i < jsondata.length; i++) {
                             $('#activityselect1').append('<option value="'+jsondata[i].activity.id+'">'+jsondata[i].activity.title+'</option>');
                             
                        };
                        $('#activityselect1').trigger("change");
        
                $.mobile.loading('hide');
             
            }


            });
}

function showupdateactivityform(){
     var value = $('#activityselect1').val();
    if(value==="Select"){
       return;
    }
    var dataurl = "http://location.falcontechng.com/loadactivity.php?id=" + value;
            $.ajax({
                url: dataurl,
                timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Activity Details... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },

                error: function(jqXHR, textStatus) {
                    $.mobile.loading('hide');
                    redirect_to('#adminerrorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                     $.mobile.loading('hide');
                     redirect_to('#adminerrorpage');
                },

                success: function (jsondata) {
                    console.log(jsondata);
                    if(jsondata.response==="error")
                    {
                        alert(jsondata.message);
                    }
                    else
                    {
                        $('#id').val(value);
                        console.log(jsondata.message.title);
                        $('#updateactivity').show();
                        $('#upacttitle').val(jsondata.message.title);
                        $('#upactdetails').val(jsondata.message.details);
                      
                    }
                   
                $.mobile.loading('hide');
             
            }


            });
}

function deleteactvity(){
      var id = $('#activityselect1').val();
    var r = confirm("Are You Sure You want to delete this Activity?");
    if (r == true) {
        $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
     $.ajax({
        type:'POST',
        url: 'http://location.falcontechng.com/delete_activity.php?id=' + id,

        success:function(data){
            console.log(data);
            var response = data.response;
            var message = data.message;
            $.mobile.loading('hide');
            if(response==='error')
            {
               alert(message);
            }
            else
            {
                 $('#updateactivity').hide();
               goto_sucess('#adminsuccesspage',message);

            }

        },

        fail:function(data){
        console.log(data);
        $.mobile.loading('hide');
        redirect_to('#adminerrorpage');
        },

        error: function(data){
           console.log(data);
           $.mobile.loading('hide');
           redirect_to('#adminerrorpage');
        }
    });

    }  
}
function loadalbumdeletelist(){
       var dataurl = "http://location.falcontechng.com/loadalbumlist.php";
            $.ajax({
                url: dataurl,
                timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Album List... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },

                error: function(jqXHR, textStatus) {
                    $.mobile.loading('hide');
                    redirect_to('#adminerrorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                     $.mobile.loading('hide');
                     redirect_to('#adminerrorpage');
                },

                success: function (jsondata) {
                    console.log(jsondata);
                    console.log(jsondata[0].album.name);
                        $('#albumtodeletelist').html('');
                        $('#albumtodeletelist').html('<ul data-role="listview">');
                        for (var i = 0; i < jsondata.length; i++) {
                             $('#albumtodeletelist').append('<li><a href="#" onclick="deletealbum('+jsondata[i].album.id+')">'+jsondata[i].album.name+'</a></li>');
                             
                        };
                        $('#albumtodeletelist').append('</ul>');
                        $('#albumtodeletelist').listview().listview('refresh');
        
                $.mobile.loading('hide');
             
            }


            });
}
function deletealbum(id){
     var r = confirm("Are You Sure You want to delete this Album?");
    if (r == true) {
        $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
     $.ajax({
        type:'POST',
        url: 'http://location.falcontechng.com/delete_album.php?albulmid=' + id,

        success:function(data){
            console.log(data);
            var response = data.response;
            var message = data.message;
            $.mobile.loading('hide');
            if(response==='error')
            {
               alert(message);
            }
            else
            {
               goto_sucess('#adminsuccesspage',message);
                redirect_to('#gallerymanagemt');
            }

        },

        fail:function(data){
        console.log(data);
           $.mobile.loading('hide');
        redirect_to('#adminerrorpage');
        },

        error: function(data){
           console.log(data);
              $.mobile.loading('hide');
           redirect_to('#adminerrorpage');
        }
    });

    }  
}
function loadalbumlist(){
     var dataurl = "http://location.falcontechng.com/loadalbumlist.php";
            $.ajax({
                url: dataurl,
                timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Album List... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },

                error: function(jqXHR, textStatus) {
                    $.mobile.loading('hide');
                    redirect_to('#adminerrorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                     $.mobile.loading('hide');
                     redirect_to('#adminerrorpage');
                },

                success: function (jsondata) {
                    console.log(jsondata);
                    console.log(jsondata[0].album.name);
                        $('#albumdropdnw').html('');
                        $('#albumdropdnw').append('<option value="Select">Select</option>');
                        for (var i = 0; i < jsondata.length; i++) {
                             $('#albumdropdnw').append('<option value="'+jsondata[i].album.id+'">'+jsondata[i].album.name+'</option>');
                             
                        };
                        $('#albumdropdnw').trigger("change");
        
                $.mobile.loading('hide');
             
            }


            });
}

 $(function() {

            $("form#add_cafeteria").submit(function(){
                console.log("uploading...");
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/add_cafeteria.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        var response = data.response;
                        var message = data.message;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                        {
                           goto_sucess('#adminsuccesspage',message);
                        document.getElementById("add_cafeteria").reset();
                        }

                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                });

                return false;
            });

$("form#add_buildingform").submit(function(){
                console.log("uploading...");
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/add_building.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        var response = data.response;
                        var message = data.message;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                        {
                           goto_sucess('#adminsuccesspage',message);
                        document.getElementById("add_buildingform").reset();
                        }

                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                });

                return false;
            });

$("form#add_officeform").submit(function(){
                console.log("uploading...");
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/add_office.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        var response = data.response;
                        var message = data.message;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                        {
                           goto_sucess('#adminsuccesspage',message);
                        document.getElementById("add_officeform").reset();
                        }

                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                });

                return false;
            });



$("form#add_atmform").submit(function(){
                console.log("uploading...");
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/add_atm.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        var response = data.response;
                        var message = data.message;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                        {
                           goto_sucess('#adminsuccesspage',message);
                        document.getElementById("add_atmform").reset();
                        }

                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                });

                return false;
            });



$("form#add_busstopform").submit(function(){
                console.log("uploading...");
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/add_busstop.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        var response = data.response;
                        var message = data.message;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                        {
                           goto_sucess('#adminsuccesspage',message);
                        document.getElementById("add_busstopform").reset();
                        }

                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                });

                return false;
            });

              $("form#add_lecturehall_form").submit(function(){
                console.log("uploading...");
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/add_lecturehall.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        var response = data.response;
                        var message = data.message;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                        {
                           goto_sucess('#adminsuccesspage',message);
                        document.getElementById("add_lecturehall_form").reset();
                        }

                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                });

                return false;
            });


              $("form#upload_staffphoto").submit(function(){
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/update_staff_photo.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        var response = data.response;
                        var message = data.message;
                        var imgpath =data.imgpath;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                        {
                           $('#stfimg').attr({src:imgpath});
                           goto_sucess('#adminsuccesspage',message);
                        }
                        document.getElementById("upload_staffphoto").reset();

                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                    });
                return false;
            });

             $("form#add_annoucemnt").submit(function(){
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/add_annoucemnt.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        $.mobile.loading('hide');
                        var response = data.response;
                        var message = data.message;

                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                        {
                           goto_sucess('#adminsuccesspage',message);
                            document.getElementById("add_annoucemnt").reset();
                        }
                       

                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                    });
                return false;
            });
            
     $("form#add_activity").submit(function(){
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/add_activity.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        var response = data.response;
                        var message = data.message;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                        {
                           goto_sucess('#adminsuccesspage',message);
                            document.getElementById("add_activity").reset();
                        }
                       

                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                    });
                return false;
            });


        $("form#update_annoucemnt").submit(function(){
                var formData = new FormData($(this)[0]);
                console.log(formData);
                console.log($('#id').val());
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/update_annoucemnt.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        var response = data.response;
                        var message = data.message;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                        {
                           goto_sucess('#adminsuccesspage',message);
                            document.getElementById("update_annoucemnt").reset();
                            $('#updateannocemnt').hide();
                        }
                       

                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                    });
                return false;
            });

         $("form#update_activity").submit(function(){
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/update_activity.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        $.mobile.loading('hide');
                        var response = data.response;
                        var message = data.message;

                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                        {
                           goto_sucess('#adminsuccesspage',message);
                            document.getElementById("update_activity").reset();
                            $('#updateactivity').hide();
                        }
                       

                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                    });
                return false;
            });
    
         $("form#addalbum").submit(function(){
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/add_album.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        $.mobile.loading('hide');
                        var response = data.response;
                        var message = data.message;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                        {
                           goto_sucess('#adminsuccesspage',message);
                            $('#albumname').val('');
                           
                        }
                       

                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                    });
                return false;
            });
             $("form#addpicture_albul").submit(function(){
                var id= $("#albumdropdnw option:selected").val();
                console.log(id);
                $('#albulmid').val(id);
                console.log("below is the id");
                console.log($('#albulmid').val());
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/add_picture_to_album.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        var response = data.response;
                        var message = data.message;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                        {
                           goto_sucess('#adminsuccesspage',message);
                             document.getElementById("addpicture_albul").reset();
                           
                        }
                       

                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                    });
                return false;
            });
            
            $("form#addnadmin").submit(function(){
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/add_new_admin.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        var response = data.response;
                        var message = data.message;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                        {
                           goto_sucess('#adminsuccesspage',message);
                             document.getElementById("addnadmin").reset();
                           
                        }
                       

                    },
                    error: function(data){
                        $.mobile.loading('hide');
                         console.log(data);
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                    });
                return false;
            });


             $("form#forgetpasswordform").submit(function(){
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/reset_password.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        var response = data.response;
                        var message = data.message;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                        {
                          $('#forgetpasserror').html(message);
                        document.getElementById("forgetpasswordform").reset();
                        }

                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                });

                return false;
            });
    
        
         $("form#chmpsadmin").submit(function(){
            var username = $('#global_adminusername').val();
            console.log(username);
            $('#chnusername').val(username);
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/change_adminpass.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        var response = data.response;
                        var message = data.message;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                        {
                           goto_sucess('#adminsuccesspage',message);
                             document.getElementById("chmpsadmin").reset();
                           
                        }
                       

                    },
                    error: function(data){
                        $.mobile.loading('hide');
                         console.log(data);
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                    });
                return false;
            });

//latest one
 $("form#upload_cafephoto").submit(function(){
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/update_cafe_photo.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        var response = data.response;
                        var message = data.message;
                        var imgpath =data.imgpath;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                        {
                           $('#cafeimg').attr({src:imgpath});
                           goto_sucess('#adminsuccesspage',message);
                        }
                        document.getElementById("upload_cafephoto").reset();

                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                    });
                return false;
            });

$("form#upload_buildingphoto").submit(function(){
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/update_building_photo.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        var response = data.response;
                        var message = data.message;
                        var imgpath =data.imgpath;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                        {
                           $('#buildingimg').attr({src:imgpath});
                           goto_sucess('#adminsuccesspage',message);
                        }
                        document.getElementById("upload_buildingphoto").reset();

                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                    });
                return false;
            });


$("form#upload_libraryphoto").submit(function(){
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/update_library_photo.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        var response = data.response;
                        var message = data.message;
                        var imgpath =data.imgpath;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                        {
                           $('#libraryimg').attr({src:imgpath});
                           goto_sucess('#adminsuccesspage',message);
                        }
                        document.getElementById("upload_libraryphoto").reset();

                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                    });
                return false;
            });



    $("form#update_lecturehall_form").submit(function(){
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/update_lecture.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        var response = data.response;
                        var message = data.message;
                        var imgpath =data.imgpath;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                           goto_sucess('#adminsuccesspage',message);
                        
                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                    });
                return false;
            });



    $("form#update_library_form").submit(function(){
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/update_library.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        var response = data.response;
                        var message = data.message;
                        var imgpath =data.imgpath;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                           goto_sucess('#adminsuccesspage',message);
                        
                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                    });
                return false;
            });



    $("form#update_sport_form").submit(function(){
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/update_sport.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        var response = data.response;
                        var message = data.message;
                        var imgpath =data.imgpath;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                           goto_sucess('#adminsuccesspage',message);
                        
                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                    });
                return false;
            });


    $("form#update_church_form").submit(function(){
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/update_church.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        var response = data.response;
                        var message = data.message;
                        var imgpath =data.imgpath;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                           goto_sucess('#adminsuccesspage',message);
                        
                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                    });
                return false;
            });



    $("form#update_mosque_form").submit(function(){
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/update_mosque.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        var response = data.response;
                        var message = data.message;
                        var imgpath =data.imgpath;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                           goto_sucess('#adminsuccesspage',message);
                        
                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                    });
                return false;
            });


    
    $("form#update_officeform").submit(function(){
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/update_office.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        var response = data.response;
                        var message = data.message;
                        var imgpath =data.imgpath;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                           goto_sucess('#adminsuccesspage',message);
                        
                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                    });
                return false;
            });
    

    $("form#update_atmform").submit(function(){
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/update_atm.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        var response = data.response;
                        var message = data.message;
                        var imgpath =data.imgpath;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                           goto_sucess('#adminsuccesspage',message);
                        
                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                    });
                return false;
            });




    $("form#update_busstopform").submit(function(){
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/update_bustop.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        var response = data.response;
                        var message = data.message;
                        var imgpath =data.imgpath;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                           goto_sucess('#adminsuccesspage',message);
                        
                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                    });
                return false;
            });




      $("form#update_buildingform").submit(function(){
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/update_building.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        var response = data.response;
                        var message = data.message;
                        var imgpath =data.imgpath;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                           goto_sucess('#adminsuccesspage',message);
                        
                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                    });
                return false;
            });


        });
function update_cafe(id){
    var cafe_name = $('#update_cafe_name').val();
    var cafe_dscpt = $('#update_cafe_dscpt').val();
    var cafe_lat = $('#updatecafeteria_lat').val();
    var cafe_long = $('#updatecafeteria_lng').val();
      if(cafe_name==='' || cafe_dscpt==='' || cafe_lat==='' || cafe_long==='')
    { 
         alert('Please Fill all Information regarding the Cafeteria');
        $.mobile.silentScroll(0);
    }
    else
    {
         var formData = "cafe_name=" + cafe_name + "&cafe_dscpt=" + cafe_dscpt+ "&cafe_lat=" +
        cafe_lat + "&cafe_long=" + cafe_long + "&id=" + id;
         console.log(formData);

         $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
        $.ajax({
        type:'POST',
        url: 'http://location.falcontechng.com/update_cafeteria.php',
        data:formData,
        cache:false,
       // contentType: false,
        //processData: false,

        success:function(data){
            console.log(data);
            var response = data.response;
            var message = data.message;
            $.mobile.loading('hide');

            if(response==='error')
            {
                alert(message);
            }
            else
            {
                goto_sucess('#adminsuccesspage',message);

            }

        },

        fail:function(data){
        console.log(data);
            $.mobile.loading('hide');

        redirect_to('#adminerrorpage');
        },

        error: function(data){
            $.mobile.loading('hide');

           console.log(data);
           redirect_to('#adminerrorpage');
        }
    });

    }
}

function get_cafeteria_position(){
    getcurrrentlatlog();
    $('#cafeteria_lat').val(my_location_lat);
    $('#cafeteria_lng').val(my_location_lnt);
    $('#updatecafeteria_lat').val(my_location_lat);
    $('#updatecafeteria_lng').val(my_location_lnt);
    return false;
}

function get_building_position(){
    getcurrrentlatlog();
    $('#building_lat').val(my_location_lat);
    $('#building_lng').val(my_location_lnt);
    $('#upbuilding_lat').val(my_location_lat);
    $('#upbuilding_lng').val(my_location_lnt);
    return false;
}

function get_office_position(){
    getcurrrentlatlog();
    $('#office_lat').val(my_location_lat);
    $('#office_lng').val(my_location_lnt);
    $('#upoffice_lat').val(my_location_lat);
    $('#upoffice_lng').val(my_location_lnt);
    return false;
}

function get_atm_position(){
    getcurrrentlatlog();
    $('#atm_lat').val(my_location_lat);
    $('#atm_lng').val(my_location_lnt);
    $('#upatm_lat').val(my_location_lat);
    $('#upatm_lng').val(my_location_lnt);
    return false;
}

function get_busstop_position(){
    getcurrrentlatlog();
    $('#busstop_lat').val(my_location_lat);
    $('#busstop_lng').val(my_location_lnt);
    $('#upbusstop_lat').val(my_location_lat);
    $('#upbusstop_lng').val(my_location_lnt);
    return false;
}

function get_lecturehall_position(){
    getcurrrentlatlog();
    $('#lecture_lat').val(my_location_lat);
    $('#lecture_long').val(my_location_lnt);
    $('#uplecture_lat').val(my_location_lat);
    $('#uplecture_long').val(my_location_lnt);
    return false;
}

function get_library_position(){
    getcurrrentlatlog();
    $('#library_lat').val(my_location_lat);
    $('#library_long').val(my_location_lnt);
    return false;
}

function get_sport_position(){
    getcurrrentlatlog();
    $('#sport_lat').val(my_location_lat);
    $('#sport_long').val(my_location_lnt);
    return false;
}

function get_church_position(){
    getcurrrentlatlog();
    $('#church_lat').val(my_location_lat);
    $('#church_long').val(my_location_lnt);
    return false;
}

function get_mosque_position(){
    getcurrrentlatlog();
    $('#mosque_lat').val(my_location_lat);
    $('#mosque_long').val(my_location_lnt);
    return false;
}

function load_all_lecture_for_delete(){
     var dataurl = 'http://location.falcontechng.com/list_all_lecture_hall.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    $('#lecture_content_list').html('<ul data-theme="b" data-role="listview">');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#lecture_content_list').append('<li data-theme="b"><a href="#" onclick="delete_lecture('+jsondata[i].lecture_hall.id+')">'+jsondata[i].lecture_hall.name+'</a></li>');
                       }
                       $('#lecture_content_list').append('</ul>');
                         $('#lecture_content_list').listview({filter: true}).listview('refresh');
                    redirect_to('#lecture_list');
                }

            });
}

function load_all_atm_for_delete(){
     var dataurl = 'http://location.falcontechng.com/list_all_atm.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    $('#atm_content_list').html('<ul data-theme="b" data-role="listview">');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#atm_content_list').append('<li data-theme="b"><a href="#" onclick="delete_atm('+jsondata[i].atm_list.id+')">'+jsondata[i].atm_list.name+'</a></li>');
                       }
                       $('#atm_content_list').append('</ul>');
                         $('#atm_content_list').listview({filter: true}).listview('refresh');
                    redirect_to('#atm_list');
                }

            });
}


function load_all_busstop_for_delete(){
     var dataurl = 'http://location.falcontechng.com/list_all_busstop.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    $('#busstop_content_list').html('<ul data-theme="b" data-role="listview">');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#busstop_content_list').append('<li data-theme="b"><a href="#" onclick="delete_busstop('+jsondata[i].busstop.id+')">'+jsondata[i].busstop.name+'</a></li>');
                       }
                       $('#busstop_content_list').append('</ul>');
                         $('#busstop_content_list').listview({filter: true}).listview('refresh');
                    redirect_to('#busstop_list');
                }

            });
}


function load_all_office_for_delete(){
     var dataurl = 'http://location.falcontechng.com/list_all_office.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    $('#office_content_list').html('<ul data-theme="b" data-role="listview">');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#office_content_list').append('<li data-theme="b"><a href="#" onclick="delete_office('+jsondata[i].staff_office.id+')">'+jsondata[i].staff_office.office_no+'</a></li>');
                       }
                       $('#office_content_list').append('</ul>');
                         $('#office_content_list').listview({filter: true}).listview('refresh');
                    redirect_to('#office_list');
                }

            });
}




function load_all_cafe_for_delete() {
     var dataurl = 'http://location.falcontechng.com/list_all_cafeteria.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    $('#cafe_content_list').html('<ul data-theme="b" data-role="listview">');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#cafe_content_list').append('<li data-theme="b"><a href="#" onclick="delete_cafeteria('+jsondata[i].cafeteria_list.id+')">'+jsondata[i].cafeteria_list.name+'</a></li>');
                       }
                       $('#cafe_content_list').append('</ul>');
                         $('#cafe_content_list').listview({filter: true}).listview('refresh');
                    redirect_to('#cafe_list');
                }

            });
}



function load_all_building_for_delete() {
     var dataurl = 'http://location.falcontechng.com/list_all_building.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    $('#building_content_list').html('<ul data-theme="b" data-role="listview">');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#building_content_list').append('<li data-theme="b"><a href="#" onclick="delete_building('+jsondata[i].building_list.id+')">'+jsondata[i].building_list.name+'</a></li>');
                       }
                       $('#building_content_list').append('</ul>');
                         $('#building_content_list').listview({filter: true}).listview('refresh');
                    redirect_to('#building_list');
                }

            });
}


function delete_cafeteria(id){
 var r = confirm("Are You Sure You want to delete this Cafeteria?");
    if (r == true) {
        $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
     $.ajax({
        type:'GET',
        url: 'http://location.falcontechng.com/delete_cafeteria.php?id=' + id,

        success:function(data){
            console.log(data);
            var response = data.response;
            var message = data.message;
            $.mobile.loading('hide');
            if(response==='error')
            {
               alert(message);
            }
            else
            {
               goto_sucess('#adminsuccesspage',message);
               redirect_to('#manage_cafeteria');
            }

        },

        fail:function(data){
        console.log(data);
        $.mobile.loading('hide');
        redirect_to('#adminerrorpage');
        },

        error: function(data){
           console.log(data);
           $.mobile.loading('hide');
           redirect_to('#adminerrorpage');
        }
    });

    }  
}



function delete_building(id){
 var r = confirm("Are You Sure You want to delete this Building?");
    if (r == true) {
        $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
     $.ajax({
        type:'GET',
        url: 'http://location.falcontechng.com/delete_building.php?id=' + id,

        success:function(data){
            console.log(data);
            var response = data.response;
            var message = data.message;
            $.mobile.loading('hide');
            if(response==='error')
            {
               alert(message);
            }
            else
            {
               goto_sucess('#adminsuccesspage',message);
               redirect_to('#manage_building');
            }

        },

        fail:function(data){
        console.log(data);
        $.mobile.loading('hide');
        redirect_to('#adminerrorpage');
        },

        error: function(data){
           console.log(data);
           $.mobile.loading('hide');
           redirect_to('#adminerrorpage');
        }
    });

    }  
}



function delete_lecture(id){
 var r = confirm("Are You Sure You want to delete this Lecture Hall?");
    if (r == true) {
        $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
     $.ajax({
        type:'GET',
        url: 'http://location.falcontechng.com/delete_lecture.php?id=' + id,

        success:function(data){
            console.log(data);
            var response = data.response;
            var message = data.message;
            $.mobile.loading('hide');
            if(response==='error')
            {
               alert(message);
            }
            else
            {
               goto_sucess('#adminsuccesspage',message);
               redirect_to('#manage_lecturehall');
            }

        },

        fail:function(data){
        console.log(data);
        $.mobile.loading('hide');
        redirect_to('#adminerrorpage');
        },

        error: function(data){
           console.log(data);
           $.mobile.loading('hide');
           redirect_to('#adminerrorpage');
        }
    });

    }  
}


function delete_atm(id){
 var r = confirm("Are You Sure You want to delete this ATM ?");
    if (r == true) {
        $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
     $.ajax({
        type:'GET',
        url: 'http://location.falcontechng.com/delete_atm.php?id=' + id,

        success:function(data){
            console.log(data);
            var response = data.response;
            var message = data.message;
            $.mobile.loading('hide');
            if(response==='error')
            {
               alert(message);
            }
            else
            {
               goto_sucess('#adminsuccesspage',message);
               redirect_to('#manage_atm');
            }

        },

        fail:function(data){
        console.log(data);
        $.mobile.loading('hide');
        redirect_to('#adminerrorpage');
        },

        error: function(data){
           console.log(data);
           $.mobile.loading('hide');
           redirect_to('#adminerrorpage');
        }
    });

    }  
}



function delete_busstop(id){
 var r = confirm("Are You Sure You want to delete this Bus Stop ?");
    if (r == true) {
        $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
     $.ajax({
        type:'GET',
        url: 'http://location.falcontechng.com/delete_busstop.php?id=' + id,

        success:function(data){
            console.log(data);
            var response = data.response;
            var message = data.message;
            $.mobile.loading('hide');
            if(response==='error')
            {
               alert(message);
            }
            else
            {
               goto_sucess('#adminsuccesspage',message);
               redirect_to('#manage_busstop');
            }

        },

        fail:function(data){
        console.log(data);
        $.mobile.loading('hide');
        redirect_to('#adminerrorpage');
        },

        error: function(data){
           console.log(data);
           $.mobile.loading('hide');
           redirect_to('#adminerrorpage');
        }
    });

    }  
}


function delete_office(id){
 var r = confirm("Are You Sure You want to delete this Office?");
    if (r == true) {
        $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
     $.ajax({
        type:'GET',
        url: 'http://location.falcontechng.com/delete_office.php?id=' + id,

        success:function(data){
            console.log(data);
            var response = data.response;
            var message = data.message;
            $.mobile.loading('hide');
            if(response==='error')
            {
               alert(message);
            }
            else
            {
               goto_sucess('#adminsuccesspage',message);
               redirect_to('#manage_office');
            }

        },

        fail:function(data){
        console.log(data);
        $.mobile.loading('hide');
        redirect_to('#adminerrorpage');
        },

        error: function(data){
           console.log(data);
           $.mobile.loading('hide');
           redirect_to('#adminerrorpage');
        }
    });

    }  
}


function load_all_cafe_for_cover() {
     var dataurl = 'http://location.falcontechng.com/list_all_cafeteria.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    $('#cafe_content_list').html('<ul data-theme="b" data-role="listview">');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#cafe_content_list').append('<li data-theme="b"><a href="#" onclick="load_cafe_details_for_photo('+jsondata[i].cafeteria_list.id+')">'+jsondata[i].cafeteria_list.name+'</a></li>');
                       }
                       $('#cafe_content_list').append('</ul>');
                         $('#cafe_content_list').listview({filter: true}).listview('refresh');
                    redirect_to('#cafe_list');
                }

            });
}


function load_all_building_for_cover() {
     var dataurl = 'http://location.falcontechng.com/list_all_building.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    $('#building_content_list').html('<ul data-theme="b" data-role="listview">');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#building_content_list').append('<li data-theme="b"><a href="#" onclick="load_building_details_for_photo('+jsondata[i].building_list.id+')">'+jsondata[i].building_list.name+'</a></li>');
                       }
                       $('#building_content_list').append('</ul>');
                         $('#building_content_list').listview({filter: true}).listview('refresh');
                    redirect_to('#building_list');
                }

            });
}



function load_all_lecture(){
    var dataurl = 'http://location.falcontechng.com/list_all_lecture_hall.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    $('#lecture_content_list').html('<ul data-theme="b" data-role="listview">');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#lecture_content_list').append('<li data-theme="b"><a href="#" onclick="load_lecture_details('+jsondata[i].lecture_hall.id+')">'+jsondata[i].lecture_hall.name+'</a></li>');
                       }
                       $('#lecture_content_list').append('</ul>');
                         $('#lecture_content_list').listview({filter: true}).listview('refresh');
                    redirect_to('#lecture_list');
                }

            });
}


function load_all_office(){
    var dataurl = 'http://location.falcontechng.com/list_all_office.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    $('#office_content_list').html('<ul data-theme="b" data-role="listview">');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#office_content_list').append('<li data-theme="b"><a href="#" onclick="load_office_details('+jsondata[i].staff_office.id+')">'+jsondata[i].staff_office.office_no+'</a></li>');
                       }
                       $('#office_content_list').append('</ul>');
                         $('#office_content_list').listview({filter: true}).listview('refresh');
                    redirect_to('#office_list');
                }

            });
}


function load_all_busstop(){
    var dataurl = 'http://location.falcontechng.com/list_all_busstop.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    $('#busstop_content_list').html('<ul data-theme="b" data-role="listview">');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#busstop_content_list').append('<li data-theme="b"><a href="#" onclick="load_busstop_details('+jsondata[i].busstop.id+')">'+jsondata[i].busstop.name+'</a></li>');
                       }
                       $('#busstop_content_list').append('</ul>');
                         $('#busstop_content_list').listview({filter: true}).listview('refresh');
                    redirect_to('#busstop_list');
                }

            });
}


function load_all_atm(){
    var dataurl = 'http://location.falcontechng.com/list_all_atm.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    $('#atm_content_list').html('<ul data-theme="b" data-role="listview">');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#atm_content_list').append('<li data-theme="b"><a href="#" onclick="load_atm_details('+jsondata[i].atm_list.id+')">'+jsondata[i].atm_list.name+'</a></li>');
                       }
                       $('#atm_content_list').append('</ul>');
                         $('#atm_content_list').listview({filter: true}).listview('refresh');
                    redirect_to('#atm_list');
                }

            });
}

function load_all_building(){
    var dataurl = 'http://location.falcontechng.com/list_all_building.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    $('#building_content_list').html('<ul data-theme="b" data-role="listview">');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#building_content_list').append('<li data-theme="b"><a href="#" onclick="load_building_details('+jsondata[i].building_list.id+')">'+jsondata[i].building_list.name+'</a></li>');
                       }
                       $('#building_content_list').append('</ul>');
                         $('#building_content_list').listview({filter: true}).listview('refresh');
                    redirect_to('#building_list');
                }

            });
}



function load_all_cafe() {
     var dataurl = 'http://location.falcontechng.com/list_all_cafeteria.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    $('#cafe_content_list').html('<ul data-theme="b" data-role="listview">');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#cafe_content_list').append('<li data-theme="b"><a href="#" onclick="load_cafe_details('+jsondata[i].cafeteria_list.id+')">'+jsondata[i].cafeteria_list.name+'</a></li>');
                       }
                       $('#cafe_content_list').append('</ul>');
                         $('#cafe_content_list').listview({filter: true}).listview('refresh');
                    redirect_to('#cafe_list');
                }

            });
}

function load_lecture_details(id){
    var dataurl = 'http://location.falcontechng.com/get_lecture_details.php?id='+id;
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Lecture Details.. please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                       for (var i = 0; i < jsondata.length; i++) { 
                        $('#uplechallname').val(jsondata[i].lecture_hall.name);
                        $('#uplecture_opening_hour').val(jsondata[i].lecture_hall.opening_hour);
                        $('#uplecture_closing_hour').val(jsondata[i].lecture_hall.closing_hour);
                        $('#uplecture_lat').val(jsondata[i].lecture_hall.lat);
                        $('#uplecture_long').val(jsondata[i].lecture_hall.lng);
                        $('#uplecture_info').val(jsondata[i].lecture_hall.brief_info);
                        $('#lecture_hall_id').val(id);
                        }
                    redirect_to('#updatelecturehall');
                }


            });
}


function load_office_details(id){
    var dataurl = 'http://location.falcontechng.com/get_office_details.php?id='+id;
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Lecture Details.. please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                       for (var i = 0; i < jsondata.length; i++) { 
                        $('#upoffice_no').val(jsondata[i].staff_office.office_no);
                        $('#upstaff_name').val(jsondata[i].staff_office.staff_name);
                        $('#upoffice_lat').val(jsondata[i].staff_office.lat);
                        $('#upoffice_lng').val(jsondata[i].staff_office.lng);
                        $('#upoffice_ohr').val(jsondata[i].staff_office.opening_hour);
                        $('#upofficechr').val(jsondata[i].staff_office.closing_hour);
                        $('#office_id_update').val(id);
                        }
                    redirect_to('#updateoffice');
                }


            });
}



function load_busstop_details(id){
    var dataurl = 'http://location.falcontechng.com/get_bustop_details.php?id='+id;
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Bus Stop Details.. please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                       for(var i = 0; i < jsondata.length; i++) {
                        $('#upbusstop_name').val(jsondata[i].busstop.name);
                        $('#upbusstop_lat').val(jsondata[i].busstop.lat);
                        $('#upbusstop_lng').val(jsondata[i].busstop.lng);
                        $('#update_busstop_id').val(id);
                        }
                    redirect_to('#updatebusstop');
                }


            });
}





function load_atm_details(id){
    var dataurl = 'http://location.falcontechng.com/get_atm_details.php?id='+id;
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Lecture Details.. please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                       for (var i = 0; i < jsondata.length; i++) {
                        $('#upatm_name').val(jsondata[i].atm_list.name);
                        $('#upatm_currency').val(jsondata[i].atm_list.currency);
                        $('#upatm_dscpt').val(jsondata[i].atm_list.info);
                        $('#upatm_lat').val(jsondata[i].atm_list.lat);
                        $('#upatm_lng').val(jsondata[i].atm_list.lng);
                        $('#update_atm_id').val(id);
                        }
                    redirect_to('#updateatm');
                }


            });
}


function load_building_details(id){
    var dataurl = 'http://location.falcontechng.com/get_building_details.php?id='+id;
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Lecture Details.. please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                       for (var i = 0; i < jsondata.length; i++) { 
                        $('#upbuilding_name').val(jsondata[i].building_list.name);
                        $('#upbuilding_ohr').val(jsondata[i].building_list.opening_hour);
                        $('#upbuilding_chr').val(jsondata[i].building_list.closing_hour);
                        $('#upbuilding_lat').val(jsondata[i].building_list.lat);
                        $('#upbuilding_lng').val(jsondata[i].building_list.lng);
                        $('#upbuilding_dscpt').val(jsondata[i].building_list.brief_info);
                        $('#building_update_id').val(id);
                        }
                    redirect_to('#updatebuildinghall');
                }


            });
}


function load_library_details(){
    var dataurl = 'http://location.falcontechng.com/get_library_details.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Library Details.. please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                       for (var i = 0; i < jsondata.length; i++) { 
                        $('#libraryname').val(jsondata[i].library.name);
                        $('#library_opening_hour').val(jsondata[i].library.opening_hour);
                        $('#library_closing_hour').val(jsondata[i].library.closing_hour);
                        $('#library_lat').val(jsondata[i].library.lat);
                        $('#library_long').val(jsondata[i].library.lng);
                        $('#library_info').val(jsondata[i].library.brief_info);
                        $('#library_email').val(jsondata[i].library.email);
                        $('#library_website').val(jsondata[i].library.website);
                        }
                    redirect_to('#update_library');
                }


            });
}


function load_gym_details(){
    var dataurl = 'http://location.falcontechng.com/get_gym_details.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Sport Center Details.. please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                       for (var i = 0; i < jsondata.length; i++) { 
                        $('#sportname').val(jsondata[i].gym_list.name);
                        $('#sport_opening_hour').val(jsondata[i].gym_list.opening_hour);
                        $('#sport_closing_hour').val(jsondata[i].gym_list.closing_hour);
                        $('#sport_lat').val(jsondata[i].gym_list.lat);
                        $('#sport_long').val(jsondata[i].gym_list.lng);
                        $('#sport_info').val(jsondata[i].gym_list.brief_info);
                        }
                    redirect_to('#update_gym');
                }


            });
}


function load_church_details(){
    var dataurl = 'http://location.falcontechng.com/get_church_details.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Church Details.. please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                       for (var i = 0; i < jsondata.length; i++) { 
                        $('#churchname').val(jsondata[i].church_list.name);
                        $('#church_opening_hour').val(jsondata[i].church_list.opening_hour);
                        $('#church_closing_hour').val(jsondata[i].church_list.closing_hour);
                        $('#church_lat').val(jsondata[i].church_list.lat);
                        $('#church_long').val(jsondata[i].church_list.lng);
                        $('#church_info').val(jsondata[i].church_list.brief_info);
                        }
                    redirect_to('#update_church');
                }


            });
}


function load_mosque_details(){
    var dataurl = 'http://location.falcontechng.com/get_mosque_details.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Mosque Details.. please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                       for (var i = 0; i < jsondata.length; i++) { 
                        $('#mosquename').val(jsondata[i].mosque_list.name);
                        $('#mosque_opening_hour').val(jsondata[i].mosque_list.opening_hour);
                        $('#mosque_closing_hour').val(jsondata[i].mosque_list.closing_hour);
                        $('#mosque_lat').val(jsondata[i].mosque_list.lat);
                        $('#mosque_long').val(jsondata[i].mosque_list.lng);
                        $('#mosque_info').val(jsondata[i].mosque_list.brief_info);
                        }
                    redirect_to('#update_mosque');
                }


            });
}


function load_cafe_details(id){
     var dataurl = 'http://location.falcontechng.com/get_cafeteria_details.php?id='+id;
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Cafeteria Details.. please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    $('#cafe_details_area').html('');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#cafe_details_area').append('<form id="update_cafeteria" method="post" enctype="multipart/form-data" data-ajax="false"><label for="update_cafe_name">Cafeteria Name:</label><input type="text" name="update_cafe_name" id="update_cafe_name" value="'+jsondata[i].cafeteria_list.name+'" required placeholder="Cafeteria Name"/><label for="update_cafe_dscpt">Cafeteria Description:</label><textarea id="update_cafe_dscpt" name="update_cafe_dscpt" placeholder="Cafeteria Description">'+jsondata[i].cafeteria_list.brief_info+'</textarea><label for="updatecafeteria_lat">Lat:</label><input type="text" name="updatecafeteria_lat" id="updatecafeteria_lat" required value="'+jsondata[i].cafeteria_list.lat+'" placeholder="Latitude" /><label for="updatecafeteria_lng">Long:</label><input type="text" name="updatecafeteria_lng" id="updatecafeteria_lng" required value="'+jsondata[i].cafeteria_list.lng+'" placeholder="Longitude" /><a href="#" onclick="get_cafeteria_position()">Click here to set your current position for lat and long</a><input type="button" value="Update Cafeteria" onclick="update_cafe('+id+')" /></form>');
                       }
                      // $('#cgdb').button();
                    redirect_to('#cafe_details');
                }


            });
}


function load_cafe_details_for_photo(id){
     var dataurl = 'http://location.falcontechng.com/get_cafeteria_details.php?id='+id;
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Cafeteria Details.. please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                       for (var i = 0; i < jsondata.length; i++) {
                        $('#cafeupdateid').val(id);
                        $('#cafeimg').attr({src:jsondata[i].cafeteria_list.cover_pics});
                         $('#cafebtdetails').html(jsondata[i].cafeteria_list.name);                   
                       } 
                    redirect_to('#updatecafe_photo');
                }


            });
}



function load_building_details_for_photo(id){
     var dataurl = 'http://location.falcontechng.com/get_building_details.php?id='+id;
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Cafeteria Details.. please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                       for (var i = 0; i < jsondata.length; i++) {
                        $('#buildingupdateid').val(id);
                        $('#buildingimg').attr({src:jsondata[i].building_list.cover_pics});
                         $('#buildingbtdetails').html(jsondata[i].building_list.name);                   
                       } 
                    redirect_to('#updatebuilding_photo');
                }


            });
}

function load_library_details_for_cover(){
     var dataurl = 'http://location.falcontechng.com/get_library_details.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Library Details.. please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                       for (var i = 0; i < jsondata.length; i++) {
                        $('#libraryimg').attr({src:jsondata[i].library.cover_pics});
                         $('#librarybtdetails').html(jsondata[i].library.name);                   
                       } 
                    redirect_to('#updatelibrary_photo');
                }


            });
}



// map functions processing

function getGeoLocation() {
            try {
                if( !! navigator.geolocation ) return navigator.geolocation;
                else return undefined;
            } catch(e) {
                return undefined;
            }
        }

function getcurrrentlatlog(){
    if((geo = getGeoLocation())) {
                getlatlngdetails();
            } else {
                alert('Geolocation not supported.')
            }
}

function getlatlngdetails() {
            watchID = geo.getCurrentPosition(show_cordinates, geo_error, {
                enableHighAccuracy: HIGHACCURACY,
                maximumAge: MAXIMUM_AGE,
                timeout: TIMEOUT
            });
        }

  function show_cordinates(position){
          my_location_lat = position.coords.latitude;
          my_location_lnt= position.coords.longitude;
        }

function geo_error(error) {
            switch(error.code) {
                case error.TIMEOUT:
                    alert('Geolocation Timeout');
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert('Geolocation Position unavailable');
                    break;
                case error.PERMISSION_DENIED:
                    alert('Geolocation Permission denied');
                    break;
                default:
                    alert('Geolocation returned an unknown error code: ' + error.code);
            }
        }