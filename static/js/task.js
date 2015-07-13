/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	"instructions/instruct-3.html",
	"instructions/instruct-4.html",
	"instructions/instruct-ready.html",
	"quiz.html",
	"stage.html",
	"setup.html",
	"shape_game.html",
	"shape_choice.html",
	"postquestionnaire.html",
	"complete.html",
	"full_game_eig.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	// "instructions/instruct-1.html",
	// "instructions/instruct-2.html",
	"instructions/instruct-3.html",
];

images = { 'y':'<div style="margin-left:-109px"><img src="/static/images/slider_y.png"  alt="Definitely Yes" width=650></div>',
		  'py':'<div style="margin-left:-109px"><img src="/static/images/slider_py.png" alt="Probably/Sometimes" width=650></div>',
		   'u':'<div style="margin-left:-109px"><img src="/static/images/slider_u.png"  alt="Unknown/Not applicable" width=650></div>',
		  'pn':'<div style="margin-left:-109px"><img src="/static/images/slider_pn.png" alt="Probably not/Rarely" width=650></div>',
		   'n':'<div style="margin-left:-109px"><img src="/static/images/slider_n.png"  alt="Definitely No" width=650></div>',
		 '1.0':'<div style="margin-left:-109px"><img src="/static/images/slider_y.png"  alt="Definitely Yes" width=650></div>',
		 '0.5':'<div style="margin-left:-109px"><img src="/static/images/slider_py.png" alt="Probably/Sometimes" width=650></div>',
		 '0.0':'<div style="margin-left:-109px"><img src="/static/images/slider_u.png"  alt="Unknown/Not applicable" width=650></div>',
		'-0.5':'<div style="margin-left:-109px"><img src="/static/images/slider_pn.png" alt="Probably not/Rarely" width=650></div>',
		'-1.0':'<div style="margin-left:-109px"><img src="/static/images/slider_n.png"  alt="Definitely No" width=650></div>'};



/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and
* insert them into the document.
*
********************/

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}


var show_questions_instructs = function() {
	psiTurk.showPage("instructions/instruct-4.html");
}


var show_questions = function() {
	psiTurk.showPage('setup.html');
	for(var i = 0; i < question_answer_pairs.length; i++) {
		document.getElementById("block" + (i+1).toString()).getElementsByTagName('h2')[0].innerHTML = question_answer_pairs[i][0];
	}
}

var do_quiz = function() {
	psiTurk.showPage('quiz.html');
	document.getElementById("question-label").innerHTML = quizquestions[quizquestion_on][0];
}

var get_data = function() {
	psiTurk.showPage('stage.html');
	var knowledge_arr = question_answer_pairs;
	$("#prev-questions").html("");
	if(knowledge != "") {
		for(var k = 0; k < knowledge_arr.length; k++) {
			var knowledge_piece = knowledge_arr[k].split(":");
			$("#prev-questions").prepend("<h4>" + knowledge_piece[0] + "</h4>" +
										images[knowledge_piece[1]] + "<hr>");
		}
	}
	$("#prev-questions").find( $("img") ).attr("width", 600);
	$("#prev-questions").find( $("div") ).css("margin-left", -103);
	$("#prev-questions").css("margin-left", "50px");
	$("#prev-questions").find( $("div") ).css("margin-right", -103);
}

var answer_chosen = function() {
	if($("#1").val() == "#" ||
		$("#2").val() == "#" ||
		$("#3").val() == "#" ||
		$("#4").val() == "#") make_alert("Please choose a question for each rank", function(){});


	else {
		psiTurk.recordTrialData(["Final choice", question_answer_pairs, [$("#1").val(), $("#2").val(), $("#3").val(), $("#4").val()] ] );
		setTimeout(function(){psiTurk.showPage('postquestionnaire.html')}, 500);
	}

}

var quizcomplete = function() {
	if (quizquestion_on == quizquestions.length) quizquestion_on = 0;
	var correct = ($("input[name=q1]:checked").val() == quizquestions[quizquestion_on][1]);
	psiTurk.recordUnstructuredData("quiz-response", quizquestion_on.toString() + "," +
				quizquestions[quizquestion_on][0] + "," + quizquestions[quizquestion_on][1] + "," + $("input[name=q1]:checked").val());
	quizquestion_on += 1;

	if (correct) {
		make_alert("Correct! Please proceed", get_data);

	}
	else {
		make_alert("Incorrect, please go back and try again. Really pay attention this time!", show_questions);
	}
}

var complete = function() {
    var comments = document.getElementById("comments").value;
	psiTurk.showPage('complete.html');
    psiTurk.recordUnstructuredData('comments', comments);
    psiTurk.saveData();
	psiTurk.completeHIT();
}


var make_alert = function(message, onclose) {
	$("<p>" + message + "</p>").dialog(
	    {
				  dialogClass: 'no-close',
	        modal: true, //Not necessary but dims the page background
	        width: 400,
	        buttons:{
	            'Close': function() {
	            	onclose();
								$(this).parent().remove();
	             }

	        },
	        close: function(event, ui) {
	        	event.preventDefault();
	        	onclose();
	        }
	    }
	);
	$('.no-close').find('.ui-dialog-titlebar-close').css('display','none');
}


// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() {
    		currentview = start_shapegame();
    	} // what you want to do when you are done with instructions
    );
});
