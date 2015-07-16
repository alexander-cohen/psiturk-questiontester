var img_attr_choies = [ ['Rectangle', 'Triangle'],
                        ['Black', 'Red'],
                        ['Green', 'Grey'],
                        ['Dot', 'NoDot'] ]

var possible_questions_full = [  [
                                    ['Is it a rectangle?', [0, 0]],
                                    ['Is it a triangle?', [0, 1]]
                                  ],

                                  [
                                    ['Does it have a black outline?', [1, 0]],
                                    ['Does it have a red outline?', [1, 1]]
                                  ],

                                  [
                                    ['Does it have a green fill?', [2, 0]],
                                    ['Does it have a gray fill?', [2, 1]]
                                  ],

                                  [
                                    ['Does it have a dot?', [3, 0]],
                                    ['Does it have a dot?', [3, 0]],
                                  ]
                              ];

var good_questions_full =  [  ['Is it a rectangle?', [0, 0]],
                              ['Is it a triangle?', [0, 1]],
                              ['Does it have a black outline?', [1, 0]],
                              ['Does it have a red outline?', [1, 1]],
                              ['Does it have a gray fill?', [2, 1]],
                              ['Does it have a dot?', [3, 0]] ];

var possible_questions = possible_questions_full.slice();
var good_questions = good_questions_full.slice();

var shape_imgs = [];
var shape_choice = '';
var knowledge_arr = [];
var question_on = 0;
var game_on = 0;


function base2str(num) {
  return pad(num.toString(2), 4);
}

function load_img_names_noshuffle() {
  var shape_imgs = [];
  for(var i = 0; i < 16; i++) {
    var base2 = base2str(i);

    var choice_str = "";
    for(var j = 0; j < 4; j++) {
      choice_str += img_attr_choies[j][parseInt(base2.charAt(j))];
      if(j < 3) choice_str += '-';
    }
    shape_imgs.push('<img src="/static/images/shapes/' + choice_str + '.png"  alt=' +
                      choice_str + ' width=150 bin_rep=' + base2 + '>');
  }
  return shape_imgs;
}

function load_img_names() {
  return shuffle(load_img_names_noshuffle());
}


function add_option(q_num, q) {
  $("#answers").append(
    '<div class="radio-question" id = "radio-question-1">' +
      '<input type="radio" name="q1" value="a" id="q' + q_num.toString() + '">' +
      '<label style="margin:0.5em" knowledge_val="' + q[1].join() + '"' +
      'for="q' + q_num.toString() + '">' + q[0] + '</label>' +
    '</div>'
  );

}

function start_shapegame() {
  good_questions = shuffle(good_questions_full);
  shape_imgs = load_img_names();
  shape_choice = base2str(rand_num_incl(0, 15));
  possible_questions = possible_questions_full.slice();
  good_questions = shuffle(good_questions_full);
  question_on = 0;
  knowledge_arr = [];
  give_question_options();
}

function let_them_choose() {
  psiTurk.showPage('shape_choice.html');
  load_cur_knowledge();
  load_shape_imgs();
  $("#question-form").html('');
  $("td").each(function() {
    var inner = $(this).html();
    var shape_bin = $(this).find('div').find('img').attr('bin_rep');
    $(this).html('<a href="javascript:shape_chosen(\'' +
                  shape_bin + '\')">' + inner + '</a>')
  })
}

function shape_chosen(obj) {
  var correct = obj == shape_choice;
  make_alert((correct ?
              'Correct! Great Job! Now move on to Part II of this HIT' :
              'Incorrect, sorry. You must now redo the task.'), function(){
                                    if(correct) show_fullgame_instructs();
                                    else start_shapegame();
                                  });
}

function load_shape_imgs() {
  for(var i = 0; i < 16; i++) {
    $("#shape" + (i+1).toString()).html(shape_imgs[i]);
  }
}

function load_cur_knowledge() {
  for(var i = 0; i < knowledge_arr.length; i++) {
    q = knowledge_arr[i][2];
    resp = knowledge_arr[i][3];
    $("#prev-questions").append('<div class="prev-info" style="margin-bottom:30px">' +
                                    '<h3>' + q + '</h3>' +
                                    '<h4>' + resp + '</h4></div>');
  }
}


function give_question_options() {
  good_questions = shuffle(good_questions);

  if(question_on >= 4) {
    let_them_choose();
    return;
  }

  psiTurk.showPage('shape_game.html');
  $("#question-number").html('Question on: ' + (question_on+1) + '/ 4');
  load_shape_imgs();
  load_cur_knowledge();
  for(var i = 0; i < good_questions.length; i++) {
    add_option(i, good_questions[i]);
  }
	question_on++;
}

var choicecomplete_shape = function() {
	if($("#submit-button").html() == "Submit") {
		var choice = $("input[name=q1]:checked").next('label').html();
    var knowledge_val = $("input[name=q1]:checked").next('label').attr('knowledge_val').split(',');

    var q_indx = parseInt($("input[name=q1]:checked").attr('id').charAt(1));

    //removeArrValue(good_questions, q_indx);

    var true_val = shape_choice.charAt(knowledge_val[0]);

    var resp = true_val == knowledge_val[1] ? 'Yes' : 'No';

    knowledge_arr.push([knowledge_val[0], true_val, choice, resp]);

		$("#prev-questions").css("margin-left", "0px");
		$("#answer").html('<h1 style="margin-top: 0">' + resp + '</h1>');
		$("#answer").fadeTo('slow', 1.0);
		$("#submit-button").html("Next");
		$("#submit-button").removeClass('btn-success');
		$("#submit-button").addClass("btn-primary");
    $("#answers").remove();
    $("#form-label").html(choice);
	}

	else {
		give_question_options();
	}

}
