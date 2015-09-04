/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */


/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and
* insert them into the document.
*
********************/

var knowledge = "";
var item = "computer";
var iterations = 1;

var num_games = 3;
var game_on = 0;
var options_show = 6;
var questions_to_ask = []

var questions_shown = [];

var game_data = [];
var bonus_start = 0.50;
var bonus_decrement = 0.05;

var bonus = function() {
	return bonus_start - (iterations) * bonus_decrement;
}

var max_iterations = (bonus_start - 0.05) / bonus_decrement;

var start_20q_game = function() {
	game_data = []
	psiTurk.showPage("full_game_eig.html");
	iterations = 0;
	questions_shown = [];
	knowledge = "";
	$.ajax({
		url: "/get_rand_object",
		type: "GET",
		success: function(data) {
			item = data;
			log_data("20q_game_start", [item, game_on], game_data);
			pre_20q();
		}
	})
}

var load_knowledge = function() {
	var knowledge_arr = knowledge.split(",");
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

var pre_20q = function() {
	psiTurk.showPage("full_game_eig.html");
	for(var i = 0; i < options_show; i++) {
		$("#answers").append(
				'<div class="radio-question">' +
			      		'<input type="radio" name="q1" value="b" id="q' + i.toString() + '">' +
			      			'<label style="margin:0.5em" for="q' + i.toString() + '"></label>' +
			      		'</div>'
			);
	}

	load_knowledge();
	$("#game-on").html("Game on: " + (game_on == 0 ? "Practice (No Bonus)" : game_on.toString()) + " / " + num_games.toString());
	if(iterations >= max_iterations) {
		$("#question-number").html("You have used up all your questions,<br>now you must guess an object");
		$("#questions").html("<br><br>");
	}

	else {
		$("#question-number").html("Question number: " + (iterations+1).toString());
		if(game_on > 0) $("#bonus").html("Potential Bonus: $" + bonus().toFixed(2));
		$("#submit-button").html(' <span class="glyphicon glyphicon-refresh spinning"></span> Loading...    ');
		$("#submit-button").attr('disabled')
		$("#answers").css('opacity', 0);

		$.ajax({
			url: "/get_good_questions_norepeat",
			type: "GET",
			data: {"knowledge":knowledge, "shown":questions_shown.join()},
			success: function(data) {
					console.log(data);
					$("#submit-button").html('Submit Question');
					$("#submit-button").removeAttr('disabled');
					new_questions = data.split(',')[0].split(":");
					info_gains = data.split(',')[1].split(":");
					console.log(new_questions);
					var start = 0;
					var end = 218 - iterations*options_show;
					var jump = Math.floor((end - start) / options_show);
					questions_to_ask = [];

					for(var i = start, j = 0; j < options_show; i += jump, j++) {
						console.log(i);
						questions_to_ask[j] = [new_questions[i], info_gains[i]];
						questions_shown.push(new_questions[i]);
					}

					questions_to_ask = shuffle(questions_to_ask);
					for(var i = 0; i < options_show ; i++) {
						$('#q'+ i.toString()).next('label').html('<span class="question-text">' + questions_to_ask[i][0] + '</span>');
						$('#q'+ i.toString()).next('label').attr("info-gain", questions_to_ask[i][1]);
					}
					$("#answers").fadeTo("slow", 1.0);
				}

		});
	}


}

var hide_info_gain = function() {
	$("#answers").find("label").each(function() {
						$(this).find('span').each(function() {
							if(!$(this).hasClass('question-text')) {
								$(this).remove();
							}
						});
					});
}

var show_info_gain = function() {
	$("#answers").find("label").each(function() {
						var num_spans = 0;
						$(this).find("span").each(function() {
							num_spans++;
						})
						if(num_spans == 1) {
							var info_gain = $(this).attr("info-gain");
							$(this).append('<span>, info gain: ' + parseFloat(info_gain).toFixed(3) + "</span>");
						}
					});
}

var choicecomplete_20q = function() {
	if($("#submit-button").hasClass("spinning")) return;
	if($("#submit-button").html() == "Submit Question") {
		var choice = $("input[name=q1]:checked").next('label').find('.question-text').html();
		var info_gain = $("input[name=q1]:checked").next('label').attr("info-gain");
		var all_gains = [];
		$("input[name=q1]").each(function() {
			all_gains.push($(this).next('label').attr('info-gain'));
		});



		$.ajax({
				//  send this user's unique id and get stimuli back
				url: "/get_question_response",
				type: "GET",
				data: {'question': choice, 'item': item},
				success: function(data) {
					console.log(data);
					console.log("Questions_to_ask: " + questions_to_ask);
					log_data('20q_choice', [game_on, item, iterations, choice, data, info_gain, questions_to_ask], game_data);

					if(knowledge == "") knowledge += choice + ":" + data;
					else knowledge += "," + choice + ":" + data;
					//$("#prev-questions").css("margin-left", "0px");
					$("#answer").html(images[data]);
					$("#answer").prepend("<h4>"+choice+"</h4>");
					$("#answer").css("border-style", 'solid');
					$("#answer").css("border-color", 'DarkCyan');
					$("#answer").css("border-width", 'thick');
					$("#answer").css("margin-top", '15px');

					$("#prev-questions").prepend($("#answer"));

					$("#answer").fadeTo('slow', 1.0);

					$("#prev-questions").prepend($("#submit-button"));
					$("#submit-button").html("Next");
					$("#submit-button").removeClass('btn-success');
					$("#submit-button").addClass("btn-primary");
					//$("#question-form").html("<h3 style='margin-bottom: 40px'>"+choice+"</h3>");
					$("#question-form").html("<h3 style='margin-bottom: 40px'></h3>");
					show_info_gain();
				}
			})
	}

	else {
		iterations++;
		pre_20q();
	}

}

function check_correct_color() {
	if($("#guess-box").val() == '') {
		$("#submit-button-guess").attr('class', '');
		$("#submit-button-guess").addClass('btn');
		$("#submit-button-guess").addClass('btn-continue');
	}
	else {
		$("#submit-button-guess").attr('class', '');
		$("#submit-button-guess").addClass('btn');
		$("#submit-button-guess").addClass('btn-primary');
	}
}
/*
var guess_submitted = function() {
	knowledge = ""
	var choice = $("#guess-box").val().toUpperCase();
	$.ajax({
		url: "/get_similarity",
		type: "GET",
		data: {"object": choice.toUpperCase(), 'item':item.toUpperCase()},
		success: function(data) {
			var correct = false;
			var error = parseInt(data, 10);
			if(error <= 1) {
				correct = true;
			}

			log_data("20q_item_chosen", [game_on, correct, choice, item], game_data);

			if(correct) {
				if(game_on == 0) make_alert("Correct! Good job!", finish_guess_submitted);
				else {
					total_bonus += bonus();
					log_data("bonus", bonus(), game_data);
					make_alert("Correct! Good guess! You will recieve a bonus of $" + bonus().toFixed(2), finish_guess_submitted);
				}
			}
			else {
				if(game_on == 0) {
					make_alert("Incorrect, sorry. The object is <strong>" + item + "</strong>.", finish_guess_submitted);
				}
				else {

					$("<p>Incorrect, I am sorry but you do not recieve a bonus. The object is <strong>" + item + "</strong>. Go to next game. If you think you got it right and would like to contest this, your complaint will be recorded and your response will be reviewed. If it is deemed correct, you will recieve your bonus.</p>").dialog(
					    {
					    	dialogClass: "no-close",
					        modal: true, //Not necessary but dims the page background
					        width: 400,
					        buttons: {
										"Complain":function() {
											console.log("in complain");
											log_data("complaint", [game_on, correct, choice, item], game_data);
											finish_guess_submitted();
										},
										'Continue':function() {
												finish_guess_submitted();
											 }
					        },
					        close: function(event, ui) {
					        	finish_guess_submitted();
					        }
					    }
					);
				}
			}
		}
	})

}
*/
var option_clicked_20q = function(item_chosen, indx) {
	var correct = item_chosen == item;
	log_data("20q_item_chosen", [game_on, correct, item_chosen, item], game_data);
	if(correct) {
		if(game_on == 0) make_alert("Correct! Good job!", finish_guess_submitted);
		else {
			total_bonus += bonus();
			log_data("bonus", bonus(), game_data);
			make_alert("Correct! Good guess! You will recieve a bonus of $" + bonus().toFixed(2), finish_guess_submitted)
		}
	}
	else {
		if(game_on == 0) {
			make_alert("Incorrect, sorry. The object is <strong>" + item + "</strong>.", finish_guess_submitted);
		}
		else {

			$("<p>Incorrect, I am sorry but you do not recieve a bonus. The object is <strong>" + item + "</strong>. Go to next game. If you think you got it right and would like to contest this, your complaint will be recorded and your response will be reviewed. If it is deemed correct, you will recieve your bonus.</p>").dialog(
					{
						dialogClass: "no-close",
							modal:true, //Not necessary but dims the page background
							width: 400,
							buttons:{
								'Complain':function() {
										psiTurk.recordUnstructuredData("complaint", game_on + ":" + item_chosen + ":" + item);
										psiTurk.saveData();
										finish_guess_submitted();
									 },
									'Continue':function() {
										finish_guess_submitted();
									 }

							},
							close: function(event, ui) {
								finish_guess_submitted();
							}
					}
			);
		}
	}
}

var end_confirmed = function() {
	$.ajax({
		url: "/get_rand_objects_without",
		type: "GET",
		data: {"object":item, amount:'20'},
		success: function(data) {
			var split = data.split(',');
			var options = split[0].split(':');
			var indexes = split[1].split(':');
			display_object_options(options, indexes, 5, 4, 'option_clicked_20q');
			load_knowledge();
		}
	})
}

var end_pressed = function() {


	$("<p>Are you sure you would like to end the game?</p>").dialog(
					{
						dialogClass: "no-close",
							modal:true, //Not necessary but dims the page background
							width: 400,
							buttons:{
								'Close':function() {
										$(this).parent().remove();
									 },
									'Continue':function() {
											end_confirmed();
									 }

							},
							close: function(event, ui) {
								
							}
					}
			);
		

	


}

var finish_guess_submitted = function() {
	save_data("20q", game_data);

	if(game_on == 0) {
		make_alert("Now you will do the same thing, but if you do well, you will recieve a bonus." +
					"You start with $0.50 of bonus, and after each question it goes down by $0.05. " +
					"If you guess the object correctly, you collect whatever the current bonus is. Good luck!",
						function() {
							game_on++;
							start_20q_game();
						});
	}

	else if(game_on >= num_games) {
		make_alert("That was the final game, you will now move onto part 3 of this HIT", show_questions_instructs);
	}

	else {
		game_on++;
		start_20q_game();
	}
}
