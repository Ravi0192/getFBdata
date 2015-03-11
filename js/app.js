function statusChangeCallback(response) {
	console.log('statusChangeCallback');
	console.log(response);

	if (response.status === 'connected') {
		testAPI();
	} else if (response.status === 'not_authorized') {
		document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
		jQuery('#FBdata').hide();
		jQuery('.login').show();
	} else {
		jQuery('#FBdata').hide();
		jQuery('.login').show();
	}
}

function checkLoginState() {
	FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});
}

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "Reporte_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

var parentHeight = jQuery(window).height();
var childHeight = jQuery('.login').height();

jQuery(document).ready(function() {
	jQuery('#FBdata, .fanpage-info').hide();

	jQuery('#datepicker').datepicker();

	jQuery('#getData').click(function(e){
		e.preventDefault();

		var pageID = jQuery('#pageID').val();
		var limit = jQuery('#limit').val();
		var url = pageID.split("/");
		var fanpageName = url[url.length-1];
		var date = jQuery('#datepicker').val();
		var since = new Date(date).getTime() / 1000

		var Fanpage = {};

		FB.api(
			"http://graph.facebook.com/" + fanpageName,
			function (response) {
				if (response && !response.error) {
					Fanpage.id = response['id'];
					Fanpage.name = response['name'];
					Fanpage.pic = response['cover']['source'];
					Fanpage.likes = response['likes'];
					Fanpage.tas = response['talking_about_count'];

					if(Fanpage) {
						FB.api(
						    "/" + Fanpage.id + "/picture/?type=large",
						    function (response) {
						      if (response && !response.error) {
						      	var image = '<img src="' + response.data.url + '" width="132" />';
						        jQuery('.image').html(image);
						      }
						    }
						);
						FB.api(
							"/" + Fanpage.id + "/posts?fields=message,id,shares,likes.limit(1).summary(true),comments.limit(1).summary(true),full_picture&limit=" + limit + "&since=" + since + "",
							function (response) {
						    	if (response && !response.error) {
									var dataTable = jQuery('#fanpageData').dataTable();
									dataTable.fnClearTable();

									var JSONfb = Array();

									jQuery.each( response.data, function( i, val ) {
										var postID    = val['id'];
										var date      = moment(val['created_time']).format('DD/MM/YYYY');
										if( !(val['message']) ){
											var message   = '---';
										} else {
											var message   = val['message'];
										}
										var photo     = '<img src="' + val['full_picture'] + '" width="130" />';

										if( !(val['likes']) ){
											var likes = 0;
										}else{
											var likes = val['likes']['summary']['total_count'];
										}

										if( !(val['comments']) ){
											var comments = 0;
										}else{
											var comments = val['comments']['summary']['total_count'];
										}

										if( !(val['shares']) ){
											var shares = 0;
										}else{
											var shares = val['shares']['count'];
										}

										dataTable.fnAddData([
											postID,
											date,
											photo,
											message,
											likes,
											comments,
											shares
										]);

										newJson = {
											ID: postID,
											fecha: date,
											mensaje: message,
											likes: likes,
											comments: comments,
											shares: shares
										}

										JSONfb.push(newJson);

									});

									jQuery('#JSONdata').text(JSON.stringify(JSONfb));

									jQuery('#fanpageData tr').each(function() {
										jQuery(this).find('td:eq(1)').addClass('text-center');
									    jQuery(this).find('td:eq(3)').addClass('text-center');
									    jQuery(this).find('td:eq(4)').addClass('text-center');
									    jQuery(this).find('td:eq(5)').addClass('text-center');
									});	

									jQuery('.name span').text(Fanpage.name);
									jQuery('.likes span').text(Fanpage.likes);
									jQuery('.tas span').text(Fanpage.tas);

									jQuery('.fanpage-info').show().fadeIn(1000);

									jQuery('.button').click(function(){
								        var data = jQuery('#JSONdata').val();
								        if(data == '')
								            return;
								        
								        JSONToCSVConvertor(data, Fanpage.name, true);
								    });

						    	}
						  	});
					}
				};
			});
	});
})

jQuery(window).load(function(){
	jQuery('.login').animate({'margin-top': (parentHeight - (childHeight + 120) ) / 2});
});