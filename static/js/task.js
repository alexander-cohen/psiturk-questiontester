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
	"instructions/instruct_oneshot-1.html",
	"instructions/instruct_oneshot-2.html",

	"instructions/instruct_20q-1.html",
	"instructions/instruct_20q-2.html",
	"instructions/instruct_20q-3.html",
	"instructions/instruct_20q-4.html",

	"instructions/instruct_20q-objectquiz.html",

	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	"instructions/instruct-ready.html",

	"freeform-resp.html",
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
	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	// "instructions/instruct-3.html",
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
				'-1.0':'<div style="margin-left:-109px"><img src="/static/images/slider_n.png"  alt="Definitely No" width=650></div>',

					 '1':'<div style="margin-left:-109px"><img src="/static/images/slider_y.png"  alt="Definitely Yes" width=650></div>',
					 '0':'<div style="margin-left:-109px"><img src="/static/images/slider_u.png"  alt="Unknown/Not applicable" width=650></div>',
				 	'-1':'<div style="margin-left:-109px"><img src="/static/images/slider_n.png"  alt="Definitely No" width=650></div>'}


// var question_answer_pairs = [ ["Is it mechanical?", "1.0"],
// 															["Is it large?", "-1.0"],
// 															["Can you hold it?", "0.5"],
// 															["Do you like it?", "1.0"] ];

var question_answer_pairs_indx = [[[78, -1.0], [75, -1.0], [8, -1.0], [163, -0.5], [86, 1.0], [89, 0.5], [73, 1.0], [57, 1.0], [206, 1.0], [60, 1.0], [207, -0.5], [24, 1.0], [51, 0.5], [123, 1.0], [68, -1.0], [72, 1.0], [74, -1.0], [160, -1.0], [125, 0.0], [31, -1.0], [120, 0.5], [53, 1.0], [25, 1.0], [66, 0.0], [58, -1.0], [216, -1.0], [63, -1.0], [200, -1.0], [56, 1.0], [165, -1.0]],[[78, -1.0], [75, 1.0], [92, -1.0], [106, 1.0], [183, -1.0], [73, -1.0], [104, 1.0], [154, -1.0], [179, 1.0], [65, 1.0], [156, 1.0], [57, 1.0], [81, -0.5], [23, 1.0], [85, -1.0], [29, 1.0], [216, -0.5], [171, -1.0], [69, 1.0], [204, 0.0], [41, 1.0], [173, -1.0], [105, 1.0], [145, -1.0], [197, -1.0], [131, 0.0], [48, 0.0], [130, 1.0], [38, -1.0], [175, 0.0]],[[78, 0.0], [79, -1.0], [83, -1.0], [8, -1.0], [216, 1.0], [10, 1.0], [60, -1.0], [38, 1.0], [110, -1.0], [58, 1.0], [67, 1.0], [148, -1.0], [62, -1.0], [186, 1.0], [46, 0.5], [24, 1.0], [146, 1.0], [82, -0.5], [106, -1.0], [187, 1.0], [208, -1.0], [157, 0.5], [75, -1.0], [203, 0.0], [149, -1.0], [45, -1.0], [76, 1.0], [1, -1.0], [176, 0.5], [57, 0.5]],[[78, -0.5], [8, -1.0], [75, -1.0], [216, 0.0], [83, 1.0], [62, -1.0], [123, 1.0], [167, 1.0], [38, 1.0], [76, -1.0], [171, 1.0], [21, 1.0], [192, -1.0], [1, 0.5], [164, -1.0], [152, 1.0], [110, -1.0], [200, -1.0], [170, 0.0], [67, 1.0], [57, -1.0], [72, -1.0], [107, 0.0], [190, 1.0], [54, 1.0], [103, -1.0], [24, -1.0], [52, 1.0], [194, -1.0], [37, 0.5]],[[78, -1.0], [75, -1.0], [8, -1.0], [163, -1.0], [89, 0.5], [202, 0.5], [150, 1.0], [88, -1.0], [177, 1.0], [81, -1.0], [211, -1.0], [173, 1.0], [151, -1.0], [54, 1.0], [86, 1.0], [123, -1.0], [68, -1.0], [204, -1.0], [207, 1.0], [57, 1.0], [213, -1.0], [24, 1.0], [148, -1.0], [179, -1.0], [76, -1.0], [114, -1.0], [90, 0.5], [205, 1.0], [21, -1.0], [85, 1.0]],[[78, 1.0], [154, 1.0], [160, -1.0], [62, -0.5], [15, 0.0], [85, 0.0], [70, -0.5], [170, 1.0], [159, -1.0], [158, -0.5], [60, 1.0], [19, 1.0], [169, -1.0], [4, 0.5], [181, 0.0], [195, -1.0], [68, 0.5], [80, 1.0], [215, 0.0], [191, -1.0], [145, 0.0], [86, -1.0], [149, 0.0], [9, 0.0], [156, -1.0], [22, 0.0], [164, 1.0], [204, 0.0], [63, -1.0], [197, -0.5]],[[78, 1.0], [154, -1.0], [152, 0.0], [70, 1.0], [168, 0.0], [111, 0.0], [69, -1.0], [20, 1.0], [211, -1.0], [50, 1.0], [180, 0.5], [147, -1.0], [17, 1.0], [15, -1.0], [191, -1.0], [74, 1.0], [144, -1.0], [209, 1.0], [87, -0.5], [61, 1.0], [118, -1.0], [188, 0.5], [163, 0.5], [186, 0.5], [160, -1.0], [63, -1.0], [142, 0.5], [193, 0.5], [116, 0.0], [33, -1.0]],[[78, -1.0], [75, 1.0], [92, -1.0], [106, -1.0], [1, 1.0], [63, -1.0], [185, 1.0], [183, 1.0], [74, -1.0], [73, 1.0], [68, 1.0], [66, 1.0], [128, 1.0], [193, -0.5], [81, -1.0], [191, 1.0], [195, -1.0], [38, 1.0], [56, 0.5], [149, 0.5], [45, -1.0], [65, 1.0], [116, -1.0], [110, -1.0], [24, 1.0], [43, 1.0], [103, 0.0], [194, 1.0], [77, 0.0], [169, 0.0]],[[78, -1.0], [75, -1.0], [8, -1.0], [163, -1.0], [89, 1.0], [202, 1.0], [82, -1.0], [68, -1.0], [203, -1.0], [121, 1.0], [166, 0.5], [20, 1.0], [151, 0.5], [110, -1.0], [87, 1.0], [198, 1.0], [85, 0.0], [162, 0.0], [108, 0.0], [167, 0.0], [205, -0.5], [159, 0.0], [50, 1.0], [214, -1.0], [42, 0.0], [147, -1.0], [212, -1.0], [211, 1.0], [199, 0.5], [195, 0.0]],[[78, 0.5], [154, -1.0], [87, -1.0], [79, 1.0], [160, -1.0], [73, -0.5], [204, -1.0], [85, -1.0], [62, 1.0], [167, 0.5], [70, -1.0], [67, 0.5], [190, 1.0], [63, 0.5], [16, 0.5], [53, -1.0], [46, 0.5], [142, 0.0], [81, 0.0], [214, 0.0], [64, 0.5], [110, -1.0], [140, -1.0], [152, 0.0], [116, 0.0], [146, 0.0], [165, -1.0], [69, 0.0], [144, -1.0], [207, 1.0]],[[78, -1.0], [75, 0.5], [99, -1.0], [216, 1.0], [13, -1.0], [8, -1.0], [10, -0.5], [110, -1.0], [103, 1.0], [48, 1.0], [210, 1.0], [170, 1.0], [22, 1.0], [62, -1.0], [67, 1.0], [57, 1.0], [156, 1.0], [181, 1.0], [148, -0.5], [123, 1.0], [208, 1.0], [33, 1.0], [91, 0.0], [211, 1.0], [195, 1.0], [185, -1.0], [179, -1.0], [1, 0.5], [212, 0.0], [163, 1.0]],[[78, 1.0], [154, -1.0], [152, -1.0], [111, 1.0], [166, -1.0], [2, -1.0], [140, 1.0], [197, -1.0], [167, -1.0], [203, 1.0], [150, -1.0], [80, -1.0], [160, 1.0], [189, -1.0], [198, -1.0], [127, -1.0], [202, 0.5], [142, 1.0], [190, 1.0], [147, -1.0], [11, -1.0], [211, 1.0], [46, 1.0], [145, -1.0], [53, 1.0], [162, -1.0], [141, 1.0], [120, 0.5], [216, 1.0], [180, 0.0]],[[78, -1.0], [75, -1.0], [8, 0.0], [163, -1.0], [87, 1.0], [168, -1.0], [179, 1.0], [207, -1.0], [70, 1.0], [206, 1.0], [177, 1.0], [159, 0.5], [57, -1.0], [116, 1.0], [114, -1.0], [90, -1.0], [110, 1.0], [58, -1.0], [144, -1.0], [201, -1.0], [73, -1.0], [165, 1.0], [149, -1.0], [46, -1.0], [42, 1.0], [19, -1.0], [50, 0.0], [210, 1.0], [56, -1.0], [217, 1.0]],[[78, -1.0], [75, 1.0], [92, -0.5], [137, -1.0], [106, -1.0], [1, 1.0], [64, 1.0], [165, 1.0], [167, 1.0], [47, 0.0], [59, -1.0], [179, 1.0], [30, -1.0], [203, -0.5], [10, -1.0], [38, -0.5], [29, -1.0], [115, -1.0], [200, 1.0], [118, -1.0], [153, 1.0], [140, -1.0], [127, 0.5], [217, 0.5], [41, -0.5], [174, 1.0], [94, 0.0], [95, 0.0], [40, 0.0], [72, 0.0]],[[78, -1.0], [75, 1.0], [92, 0.0], [94, 1.0], [134, -1.0], [101, -1.0], [91, 1.0], [206, 0.0], [210, -1.0], [95, 0.0], [202, 0.0], [121, 0.0], [90, 0.0], [136, 1.0], [212, 0.5], [126, 0.5], [87, 0.0], [81, 1.0], [59, 0.5], [96, 0.5], [165, 0.0], [93, 0.5], [215, 0.0], [32, 0.0], [181, 0.0], [84, 0.0], [86, 0.0], [40, 0.0], [193, 1.0], [109, 0.0]],[[78, -0.5], [8, -1.0], [75, -1.0], [216, -1.0], [86, 0.0], [110, 1.0], [152, 1.0], [211, -1.0], [173, -1.0], [172, 1.0], [156, -1.0], [54, -1.0], [198, 1.0], [202, -1.0], [176, -1.0], [69, -1.0], [55, 0.5], [87, -1.0], [207, -0.5], [158, -1.0], [25, 0.5], [214, 0.0], [76, -1.0], [123, 0.0], [163, 0.5], [206, 0.0], [167, 0.0], [209, -1.0], [171, -1.0], [155, -1.0]],[[78, 1.0], [154, 1.0], [160, 1.0], [183, -0.5], [204, 0.5], [15, 1.0], [62, -1.0], [99, 1.0], [55, 1.0], [82, -1.0], [171, 0.0], [108, 0.0], [67, -1.0], [195, 1.0], [214, 0.0], [23, -1.0], [127, -1.0], [72, 1.0], [9, 0.0], [32, 1.0], [146, 0.0], [36, 0.0], [35, 1.0], [65, 0.0], [179, 0.5], [84, 1.0], [207, 1.0], [165, 0.5], [81, 0.0], [66, -1.0]],[[78, 0.0], [79, 0.0], [163, 1.0], [183, 1.0], [106, 0.0], [110, 1.0], [182, 1.0], [206, 1.0], [155, 1.0], [152, -0.5], [51, 1.0], [58, -1.0], [196, 1.0], [10, 1.0], [207, -1.0], [193, 1.0], [47, -1.0], [57, 1.0], [208, -0.5], [166, 0.0], [55, 1.0], [164, 1.0], [167, 0.0], [67, 0.0], [76, -1.0], [171, 0.5], [154, 0.5], [161, 1.0], [59, -1.0], [205, 1.0]],[[78, 1.0], [154, -1.0], [152, -1.0], [111, 0.5], [180, 1.0], [113, -0.5], [11, 1.0], [110, -1.0], [3, 1.0], [190, -1.0], [171, -1.0], [166, 1.0], [194, 1.0], [71, 1.0], [205, -1.0], [179, 1.0], [162, 1.0], [189, 1.0], [69, -0.5], [160, -1.0], [164, 1.0], [55, -1.0], [167, 1.0], [208, -0.5], [143, -0.5], [207, -0.5], [181, -1.0], [63, 1.0], [88, -0.5], [168, 1.0]],[[78, -1.0], [75, -1.0], [8, -1.0], [163, 0.5], [216, 0.0], [76, -1.0], [73, 1.0], [154, 1.0], [200, 1.0], [69, -1.0], [164, 1.0], [62, -1.0], [60, 1.0], [191, 1.0], [170, 0.0], [68, -1.0], [24, -1.0], [189, -1.0], [55, 1.0], [174, -1.0], [40, -1.0], [205, 1.0], [165, 0.5], [32, 0.5], [206, -1.0], [79, -1.0], [83, -1.0], [151, -1.0], [183, -1.0], [203, 0.0]],[[78, 0.0], [79, 1.0], [86, 1.0], [168, 1.0], [2, -1.0], [166, -1.0], [197, -1.0], [114, -1.0], [70, -1.0], [53, -1.0], [72, 1.0], [167, 0.5], [67, 1.0], [148, -0.5], [80, -0.5], [150, 0.0], [179, 1.0], [165, -0.5], [217, 1.0], [143, 0.5], [69, -1.0], [90, 1.0], [145, -1.0], [46, 1.0], [188, 0.5], [160, -1.0], [204, 1.0], [38, -0.5], [73, 1.0], [158, 1.0]],[[78, 0.5], [154, 0.5], [160, 1.0], [183, 1.0], [204, 1.0], [8, -1.0], [83, -1.0], [13, 1.0], [26, 1.0], [29, -1.0], [57, 1.0], [74, 0.5], [104, -0.5], [33, -0.5], [73, 0.5], [30, -0.5], [127, -1.0], [24, 1.0], [28, 0.0], [27, -0.5], [58, -1.0], [70, 0.5], [14, -1.0], [21, 1.0], [79, 0.5], [23, -1.0], [60, -1.0], [7, 0.0], [106, 1.0], [71, 0.0]],[[78, 0.0], [79, 0.5], [152, -1.0], [168, -1.0], [163, -1.0], [179, 1.0], [90, -1.0], [216, 1.0], [197, -1.0], [204, -1.0], [68, -1.0], [192, -1.0], [62, -1.0], [208, 1.0], [171, 1.0], [166, 0.5], [67, -0.5], [80, 0.0], [37, 1.0], [198, 1.0], [55, -1.0], [167, 0.0], [207, 0.0], [88, 1.0], [81, 0.0], [61, -1.0], [73, 0.5], [160, -1.0], [162, 0.0], [159, 1.0]],[[78, -0.5], [8, -1.0], [75, -1.0], [216, 1.0], [10, 1.0], [83, 1.0], [14, 1.0], [62, -1.0], [205, -1.0], [26, 1.0], [135, 0.5], [214, 0.5], [84, -1.0], [103, -1.0], [123, 1.0], [178, 1.0], [112, 0.0], [110, 1.0], [155, 0.0], [52, -0.5], [118, 0.5], [70, -1.0], [156, 0.5], [189, -1.0], [207, 0.5], [149, -0.5], [38, -1.0], [81, 1.0], [24, -0.5], [45, 1.0]],[[78, 1.0], [154, 1.0], [160, 0.5], [62, 0.0], [73, 1.0], [85, -0.5], [68, 1.0], [17, 1.0], [164, -1.0], [81, -1.0], [70, -1.0], [147, -1.0], [108, 0.5], [38, -1.0], [217, 1.0], [112, 1.0], [33, -1.0], [36, 1.0], [72, -1.0], [195, -1.0], [209, -1.0], [42, -1.0], [171, 1.0], [214, 0.5], [74, -1.0], [110, 0.5], [60, 1.0], [156, -1.0], [86, -1.0], [71, 0.5]],[[78, 1.0], [154, 0.5], [160, 0.0], [73, -1.0], [62, 1.0], [69, 0.0], [170, 1.0], [64, 1.0], [156, 1.0], [80, -1.0], [164, -1.0], [179, 1.0], [169, 1.0], [60, 1.0], [72, -1.0], [68, -1.0], [167, 0.5], [58, 0.5], [195, -1.0], [54, 1.0], [74, 1.0], [146, 1.0], [85, 0.0], [168, -1.0], [193, -1.0], [15, -1.0], [114, -1.0], [174, 0.5], [49, -1.0], [205, 1.0]],[[78, 1.0], [154, 0.5], [160, 0.0], [73, 0.5], [70, -1.0], [85, 1.0], [156, 1.0], [155, 1.0], [79, -1.0], [67, 1.0], [117, 1.0], [39, 1.0], [147, 1.0], [71, 1.0], [69, -1.0], [15, 0.5], [180, 0.5], [54, -1.0], [165, 0.5], [115, 1.0], [62, 0.0], [204, 1.0], [111, -1.0], [36, -1.0], [63, 0.0], [110, 0.0], [114, 1.0], [149, -1.0], [45, 0.5], [173, -1.0]],[[78, 1.0], [154, 1.0], [160, -1.0], [62, 1.0], [114, -0.5], [70, -0.5], [156, -0.5], [125, 1.0], [201, 1.0], [147, -1.0], [46, 1.0], [76, 0.0], [204, 0.0], [149, -1.0], [9, 1.0], [179, 0.0], [116, -1.0], [195, -1.0], [55, 1.0], [64, -1.0], [123, 0.0], [73, 1.0], [194, -1.0], [86, -0.5], [162, -0.5], [63, -0.5], [127, 0.0], [177, -0.5], [18, 0.5], [165, 0.0]],[[78, 1.0], [154, -0.5], [73, 1.0], [152, -1.0], [111, 1.0], [166, -1.0], [140, 1.0], [202, 1.0], [207, -1.0], [158, -1.0], [151, 1.0], [211, -1.0], [71, -1.0], [115, 1.0], [44, 1.0], [212, 1.0], [108, -1.0], [109, 0.5], [160, 1.0], [87, 1.0], [80, 1.0], [164, 1.0], [88, 1.0], [189, 0.5], [167, 0.0], [66, 0.0], [175, -1.0], [213, 1.0], [15, 1.0], [181, -1.0]],[[78, -1.0], [75, 1.0], [92, -1.0], [106, -1.0], [1, 1.0], [63, -1.0], [185, 0.0], [64, 1.0], [214, -1.0], [138, 1.0], [77, 0.5], [187, 1.0], [59, -1.0], [151, 0.5], [73, -1.0], [209, 1.0], [45, 1.0], [137, -1.0], [28, 1.0], [169, -1.0], [149, -1.0], [133, 0.5], [51, 1.0], [8, 0.0], [182, 0.0], [74, 0.5], [183, 0.0], [69, 0.0], [70, -1.0], [210, 1.0]],[[78, 1.0], [154, -0.5], [73, 1.0], [152, -0.5], [111, -1.0], [70, 1.0], [160, 1.0], [169, 1.0], [63, 1.0], [146, -1.0], [144, 1.0], [181, -1.0], [72, -1.0], [87, -1.0], [15, 1.0], [180, -1.0], [204, 1.0], [217, -1.0], [216, 0.0], [164, 1.0], [69, 1.0], [90, 0.5], [198, -1.0], [203, 0.0], [209, -1.0], [211, 1.0], [17, -1.0], [40, 1.0], [114, 0.0], [210, -1.0]],[[78, 1.0], [154, 0.0], [73, 1.0], [70, -1.0], [160, 1.0], [62, -0.5], [146, -1.0], [165, 1.0], [3, 1.0], [79, -1.0], [26, 1.0], [166, 0.5], [208, -1.0], [46, 1.0], [153, 1.0], [67, 1.0], [87, -1.0], [179, 1.0], [204, 1.0], [60, 1.0], [18, -1.0], [35, -1.0], [144, -1.0], [143, 0.5], [72, 1.0], [85, -0.5], [40, 1.0], [106, -1.0], [173, -1.0], [54, -0.5]],[[78, 0.5], [154, 0.0], [160, 1.0], [183, -1.0], [62, -1.0], [38, 0.0], [204, -1.0], [60, 1.0], [179, 1.0], [164, -1.0], [191, -1.0], [54, -1.0], [87, -1.0], [152, -0.5], [33, -1.0], [207, 1.0], [217, -1.0], [139, 0.0], [197, 1.0], [163, -0.5], [74, -1.0], [146, 1.0], [24, -1.0], [201, 0.0], [90, -1.0], [181, -0.5], [67, 0.0], [29, -1.0], [18, 0.0], [185, -1.0]],[[78, -1.0], [75, 1.0], [92, -1.0], [106, 1.0], [183, -1.0], [73, -1.0], [104, -1.0], [103, 0.5], [85, -1.0], [13, 0.0], [160, -1.0], [187, -1.0], [216, 1.0], [147, 1.0], [164, -1.0], [195, -1.0], [159, 0.0], [137, 0.0], [24, -1.0], [148, 1.0], [171, -0.5], [138, 0.0], [74, -1.0], [179, -1.0], [152, 0.0], [105, 0.0], [211, 1.0], [76, 1.0], [153, 1.0], [154, -1.0]],[[78, -1.0], [75, 1.0], [92, 1.0], [93, -1.0], [91, 1.0], [121, 1.0], [85, -1.0], [34, -1.0], [31, -1.0], [63, -1.0], [26, 1.0], [119, 1.0], [25, -1.0], [209, -1.0], [115, 1.0], [23, 1.0], [61, -1.0], [210, -1.0], [72, 0.0], [57, 0.0], [107, 1.0], [117, -1.0], [152, 1.0], [81, -0.5], [126, -0.5], [27, 0.0], [128, 0.0], [24, 0.0], [55, 0.5], [66, 0.0]],[[78, -1.0], [75, -1.0], [8, -1.0], [163, -1.0], [89, 1.0], [202, 1.0], [82, -1.0], [68, 1.0], [53, -1.0], [205, 1.0], [31, 1.0], [63, 1.0], [191, 1.0], [45, -1.0], [62, 1.0], [150, -1.0], [198, -1.0], [151, -1.0], [21, 1.0], [50, 0.5], [158, -1.0], [74, -1.0], [55, 1.0], [42, 1.0], [168, -1.0], [81, -1.0], [22, -1.0], [110, 0.0], [204, 1.0], [114, -1.0]],[[78, 0.0], [79, 1.0], [86, 1.0], [168, -1.0], [152, -1.0], [197, -1.0], [167, 1.0], [166, -1.0], [160, 1.0], [37, 1.0], [171, -1.0], [165, 1.0], [208, -1.0], [38, -1.0], [58, 0.5], [73, 1.0], [162, 0.5], [177, -1.0], [89, 1.0], [34, 1.0], [204, 0.5], [207, 1.0], [216, -1.0], [186, 0.0], [15, -1.0], [200, -1.0], [50, 0.0], [209, 0.5], [210, -0.5], [90, 0.0]],[[78, 0.5], [154, 0.0], [160, 1.0], [183, -0.5], [62, -0.5], [58, 1.0], [144, 1.0], [110, 1.0], [57, 1.0], [146, -1.0], [100, 0.5], [46, 0.5], [211, -0.5], [42, -1.0], [95, 0.0], [81, 0.0], [79, 0.5], [207, 0.5], [143, 0.0], [170, -1.0], [123, 0.5], [157, 0.0], [38, -0.5], [178, 0.0], [59, -1.0], [10, -1.0], [60, 0.0], [204, 0.0], [20, 0.0], [175, 0.0]],[[78, -1.0], [75, 0.5], [99, -1.0], [216, -1.0], [1, 1.0], [64, -1.0], [62, 1.0], [74, 1.0], [84, 1.0], [119, 1.0], [108, 1.0], [63, -1.0], [44, 1.0], [159, 1.0], [195, -1.0], [194, 1.0], [138, -1.0], [157, 0.5], [69, 1.0], [72, -1.0], [181, -1.0], [60, 1.0], [114, 0.5], [59, -1.0], [48, 0.5], [85, -1.0], [185, 0.0], [38, -0.5], [171, 1.0], [183, -1.0]],[[78, 0.0], [79, 0.0], [163, -1.0], [168, 1.0], [2, 1.0], [216, 1.0], [185, 1.0], [197, 1.0], [191, 1.0], [89, 1.0], [190, 1.0], [17, 1.0], [192, -1.0], [140, 0.0], [171, 1.0], [161, 0.0], [148, 1.0], [193, -1.0], [159, 1.0], [189, -1.0], [176, 0.0], [39, 0.0], [66, 0.0], [67, -0.5], [147, 1.0], [200, 0.0], [214, 0.5], [74, 1.0], [142, 1.0], [208, 1.0]],[[78, 1.0], [154, -1.0], [152, -1.0], [111, 1.0], [166, 1.0], [118, 0.5], [89, 1.0], [121, 1.0], [17, 0.5], [173, -1.0], [165, 0.0], [80, -1.0], [101, 1.0], [211, 0.0], [55, 0.0], [92, -1.0], [113, 1.0], [215, 0.5], [212, 0.5], [123, -0.5], [160, -1.0], [91, 1.0], [187, -1.0], [58, -0.5], [16, -0.5], [200, -0.5], [50, -1.0], [109, 0.5], [216, 0.5], [29, -0.5]],[[78, 0.0], [79, -0.5], [8, 0.0], [163, -1.0], [168, -1.0], [86, -1.0], [181, -1.0], [120, 1.0], [57, 1.0], [83, -1.0], [159, -1.0], [85, -1.0], [213, 1.0], [203, 0.5], [32, 0.5], [215, 0.5], [67, 1.0], [196, -1.0], [110, -1.0], [207, 1.0], [54, 1.0], [153, -1.0], [161, 0.0], [34, -1.0], [212, 0.5], [87, -1.0], [117, 0.0], [142, 0.0], [199, -1.0], [208, -1.0]],[[78, 1.0], [154, 1.0], [160, 0.5], [62, 0.0], [73, 0.5], [70, -1.0], [15, 0.0], [85, -1.0], [79, -1.0], [208, 1.0], [170, 0.5], [157, 0.5], [22, 0.5], [69, 0.5], [8, 0.0], [217, 1.0], [24, -1.0], [58, -1.0], [210, 1.0], [206, 0.0], [18, 0.0], [60, -0.5], [71, 0.0], [47, 1.0], [203, 0.0], [149, -1.0], [66, 0.0], [178, 0.0], [52, -1.0], [148, 0.0]],[[78, 1.0], [154, 1.0], [160, -1.0], [62, 0.5], [70, 1.0], [114, -1.0], [162, 1.0], [185, 1.0], [208, -1.0], [159, 1.0], [60, 1.0], [161, -1.0], [112, -1.0], [7, 0.0], [191, -1.0], [69, -1.0], [209, -1.0], [26, -1.0], [192, 1.0], [81, 0.0], [68, 1.0], [80, 1.0], [38, 1.0], [57, 0.0], [110, 0.0], [58, -1.0], [42, -1.0], [171, 1.0], [40, 1.0], [152, 1.0]],[[78, 1.0], [154, 1.0], [160, 0.0], [73, 0.0], [204, 1.0], [156, 1.0], [155, 1.0], [60, -1.0], [15, -1.0], [118, 1.0], [16, -1.0], [169, 1.0], [71, 1.0], [38, 0.5], [115, -1.0], [51, -1.0], [26, -1.0], [56, 0.0], [123, 1.0], [82, 1.0], [122, -1.0], [205, 1.0], [195, -1.0], [34, -1.0], [67, -1.0], [80, 1.0], [42, -1.0], [45, 0.0], [24, 0.5], [74, 0.0]],[[78, 1.0], [154, -1.0], [152, 1.0], [160, 1.0], [60, 1.0], [85, 1.0], [111, 1.0], [69, -1.0], [64, 1.0], [140, 1.0], [46, -1.0], [80, -1.0], [17, 1.0], [146, -1.0], [38, 1.0], [71, -1.0], [144, 1.0], [114, -1.0], [180, 1.0], [16, -1.0], [205, 1.0], [53, -1.0], [195, -1.0], [159, 1.0], [141, 0.5], [198, 1.0], [116, -1.0], [20, -1.0], [135, 0.0], [190, 1.0]],[[78, 1.0], [154, 0.0], [73, -1.0], [160, 0.0], [170, -1.0], [62, 1.0], [63, 1.0], [180, 1.0], [7, 1.0], [190, -1.0], [70, -0.5], [116, 1.0], [23, -1.0], [140, 1.0], [152, 1.0], [171, 1.0], [146, 1.0], [189, 1.0], [149, -1.0], [46, 0.0], [120, 0.0], [204, -0.5], [207, 0.0], [195, 0.0], [28, -1.0], [141, 1.0], [37, -1.0], [194, -0.5], [191, -1.0], [115, -1.0]],[[78, 1.0], [154, 0.0], [73, 0.0], [160, -1.0], [86, -1.0], [15, 1.0], [74, -1.0], [84, 1.0], [43, 1.0], [204, -1.0], [112, -1.0], [68, -1.0], [38, -0.5], [127, 1.0], [207, 0.0], [36, 1.0], [212, -1.0], [170, 0.0], [44, 0.5], [4, 0.0], [65, 0.5], [146, 1.0], [149, 0.0], [64, 0.0], [72, 0.0], [40, 0.0], [33, -1.0], [50, -1.0], [192, 0.5], [81, 0.0]],[[78, 0.5], [154, -0.5], [73, -1.0], [79, 1.0], [62, 0.0], [170, 1.0], [64, 1.0], [67, 1.0], [57, 1.0], [143, 1.0], [86, -1.0], [144, 1.0], [69, -1.0], [47, -0.5], [164, 1.0], [15, 0.0], [71, 0.5], [179, -0.5], [156, 0.5], [168, 0.0], [157, 0.0], [208, -0.5], [49, -0.5], [74, 1.0], [145, 0.0], [173, -0.5], [185, -1.0], [65, -1.0], [106, 0.0], [201, -1.0]],[[78, -1.0], [75, -0.5], [216, 0.0], [76, 1.0], [99, -1.0], [106, -0.5], [1, 1.0], [178, 1.0], [193, 1.0], [138, 1.0], [160, 1.0], [195, -1.0], [146, -1.0], [154, 0.5], [28, 1.0], [110, -1.0], [164, -1.0], [92, 0.0], [159, 1.0], [183, 0.5], [109, 0.0], [96, 0.0], [143, 0.0], [83, 0.0], [100, 0.0], [59, 0.5], [81, 1.0], [10, 0.0], [194, 1.0], [24, 0.5]]];

var features =  ['IS IT AN ANIMAL?', 'IS IT A BODY PART?', 'IS IT A BUILDING?', 'IS IT A BUILDING PART?', 'IS IT CLOTHING?', 'IS IT FURNITURE?', 'IS IT AN INSECT?', 'IS IT A KITCHEN ITEM?', 'IS IT MANMADE?', 'IS IT A TOOL?', 'CAN YOU EAT IT?', 'IS IT A VEHICLE?', 'IS IT A PERSON?', 'IS IT A VEGETABLE / PLANT?', 'IS IT A FRUIT?', 'IS IT MADE OF METAL?', 'IS IT MADE OF PLASTIC?', 'IS PART OF IT MADE OF GLASS?', 'IS IT MADE OF WOOD?', 'IS IT SHINY?', 'CAN YOU SEE THROUGH IT?', 'IS IT COLORFUL?', 'DOES IT CHANGE COLOR?', 'IS ONE MORE THAN ONE COLORED?', 'IS IT ALWAYS THE SAME COLOR(S)?', 'IS IT WHITE?', 'IS IT RED?', 'IS IT ORANGE?', 'IS IT FLESH-COLORED?', 'IS IT YELLOW?', 'IS IT GREEN?', 'IS IT BLUE?', 'IS IT SILVER?', 'IS IT BROWN?', 'IS IT BLACK?', 'IS IT CURVED?', 'IS IT STRAIGHT?', 'IS IT FLAT?', 'DOES IT HAVE A FRONT AND A BACK?', 'DOES IT HAVE A FLAT / STRAIGHT TOP?', 'DOES IT HAVE FLAT / STRAIGHT SIDES?', 'IS TALLER THAN IT IS WIDE/LONG?', 'IS IT LONG?', 'IS IT POINTED / SHARP?', 'IS IT TAPERED?', 'IS IT ROUND?', 'DOES IT HAVE CORNERS?', 'IS IT SYMMETRICAL?', 'IS IT HAIRY?', 'IS IT FUZZY?', 'IS IT CLEAR?', 'IS IT SMOOTH?', 'IS IT SOFT?', 'IS IT HEAVY?', 'IS IT LIGHTWEIGHT?', 'IS IT DENSE?', 'IS IT SLIPPERY?', 'CAN IT CHANGE SHAPE?', 'CAN IT BEND?', 'CAN IT STRETCH?', 'CAN IT BREAK?', 'IS IT FRAGILE?', 'DOES IT HAVE PARTS?', 'DOES IT HAVE MOVING PARTS?', 'DOES IT COME IN PAIRS?', 'DOES IT COME IN A BUNCH/PACK?', 'DOES IT LIVE IN GROUPS?', 'IS IT PART OF SOMETHING LARGER?', 'DOES IT CONTAIN SOMETHING ELSE?', 'DOES IT HAVE INTERNAL STRUCTURE?', 'DOES IT OPEN?', 'IS IT HOLLOW?', 'DOES IT HAVE A HARD INSIDE?', 'DOES IT HAVE A HARD OUTER SHELL?', 'DOES IT HAVE AT LEAST ONE HOLE?', 'IS IT ALIVE?', 'WAS IT EVER ALIVE?', 'IS IT A SPECIFIC GENDER?', 'IS IT MANUFACTURED?', 'WAS IT INVENTED?', 'WAS IT AROUND 100 YEARS AGO?', 'ARE THERE MANY VARIETIES OF IT?', 'DOES IT COME IN DIFFERENT SIZES?', 'DOES IT GROW?', 'IS IT SMALLER THAN A GOLFBALL?', 'IS IT BIGGER THAN A LOAF OF BREAD?', 'IS IT BIGGER THAN A MICROWAVE OVEN?', 'IS IT BIGGER THAN A BED?', 'IS IT BIGGER THAN A CAR?', 'IS IT BIGGER THAN A HOUSE?', 'IS IT TALLER THAN A PERSON?', 'DOES IT HAVE A TAIL?', 'DOES IT HAVE LEGS?', 'DOES IT HAVE FOUR LEGS?', 'DOES IT HAVE FEET?', 'DOES IT HAVE PAWS?', 'DOES IT HAVE CLAWS?', 'DOES IT HAVE HORNS / THORNS / SPIKES?', 'DOES IT HAVE HOOVES?', 'DOES IT HAVE A FACE?', 'DOES IT HAVE A BACKBONE?', 'DOES IT HAVE WINGS?', 'DOES IT HAVE EARS?', 'DOES IT HAVE ROOTS?', 'DOES IT HAVE SEEDS?', 'DOES IT HAVE LEAVES?', 'DOES IT COME FROM A PLANT?', 'DOES IT HAVE FEATHERS?', 'DOES IT HAVE SOME SORT OF NOSE?', 'DOES IT HAVE A HARD NOSE/BEAK?', 'DOES IT CONTAIN LIQUID?', 'DOES IT HAVE WIRES OR A CORD?', 'DOES IT HAVE WRITING ON IT?', 'DOES IT HAVE WHEELS?', 'DOES IT MAKE A SOUND?', 'DOES IT MAKE A NICE SOUND?', 'DOES IT MAKE SOUND CONTINUOUSLY WHEN ACTIVE?', 'IS ITS JOB TO MAKE SOUNDS?', 'DOES IT ROLL?', 'CAN IT RUN?', 'IS IT FAST?', 'CAN IT FLY?', 'CAN IT JUMP?', 'CAN IT FLOAT?', 'CAN IT SWIM?', 'CAN IT DIG?', 'CAN IT CLIMB TREES?', 'CAN IT CAUSE YOU PAIN?', 'CAN IT BITE OR STING?', 'DOES IT STAND ON TWO LEGS?', 'IS IT WILD?', 'IS IT A HERBIVORE?', 'IS IT A PREDATOR?', 'IS IT WARM BLOODED?', 'IS IT A MAMMAL?', 'IS IT NOCTURNAL?', 'DOES IT LAY EGGS?', 'IS IT CONSCIOUS?', 'DOES IT HAVE FEELINGS?', 'IS IT SMART?', 'IS IT MECHANICAL?', 'IS IT ELECTRONIC?', 'DOES IT USE ELECTRICITY?', 'CAN IT KEEP YOU DRY?', 'DOES IT PROVIDE PROTECTION?', 'DOES IT PROVIDE SHADE?', 'DOES IT CAST A SHADOW?', 'DO YOU SEE IT DAILY?', 'IS IT HELPFUL?', 'DO YOU INTERACT WITH IT?', 'CAN YOU TOUCH IT?', 'WOULD YOU AVOID TOUCHING IT?', 'CAN YOU HOLD IT?', 'CAN YOU HOLD IT IN ONE HAND?', 'DO YOU HOLD IT TO USE IT?', 'CAN YOU PLAY IT?', 'CAN YOU PLAY WITH IT?', 'CAN YOU PET IT?', 'CAN YOU USE IT?', 'DO YOU USE IT DAILY?', 'CAN YOU USE IT UP?', 'DO YOU USE IT WHEN COOKING?', 'IS IT USED TO CARRY THINGS?', 'CAN YOU PICK IT UP?', 'CAN YOU CONTROL IT?', 'CAN YOU SIT ON IT?', 'CAN YOU RIDE ON/IN IT?', 'IS IT USED FOR TRANSPORTATION?', 'COULD YOU FIT INSIDE IT?', 'IS IT USED IN SPORTS?', 'DO YOU WEAR IT?', 'CAN IT BE WASHED?', 'IS IT COLD?', 'IS IT COOL?', 'IS IT WARM?', 'IS IT HOT?', 'IS IT UNHEALTHY?', 'IS IT HARD TO CATCH?', 'CAN YOU PEEL IT?', 'CAN YOU WALK ON IT?', 'CAN YOU SWITCH IT ON AND OFF?', 'CAN IT BE EASILY MOVED?', 'DO YOU DRINK FROM IT?', 'DOES IT GO IN YOUR MOUTH?', 'IS IT TASTY?', 'IS IT USED DURING MEALS?', 'DOES IT HAVE A STRONG SMELL?', 'DOES IT SMELL GOOD?', 'DOES IT SMELL BAD?', 'IS IT USUALLY INSIDE?', 'IS IT USUALLY OUTSIDE?', 'WOULD YOU FIND IT ON A FARM?', 'WOULD YOU FIND IT IN A SCHOOL?', 'WOULD YOU FIND IT IN A ZOO?', 'WOULD YOU FIND IT IN AN OFFICE?', 'WOULD YOU FIND IT IN A RESTAURANT?', 'WOULD YOU FIND IN THE BATHROOM?', 'WOULD YOU FIND IT IN A HOUSE?', 'WOULD YOU FIND IT NEAR A ROAD?', 'WOULD YOU FIND IT IN A DUMP/LANDFILL?', 'WOULD YOU FIND IT IN THE FOREST?', 'WOULD YOU FIND IT IN A GARDEN?', 'WOULD YOU FIND IT IN THE SKY?', 'DO YOU FIND IT IN SPACE?', 'DOES IT LIVE ABOVE GROUND?', 'DOES IT GET WET?', 'DOES IT LIVE IN WATER?', 'CAN IT LIVE OUT OF WATER?', 'DO YOU TAKE CARE OF IT?', 'DOES IT MAKE YOU HAPPY?', 'DO YOU LOVE IT?', 'WOULD YOU MISS IT IF IT WERE GONE?', 'IS IT SCARY?', 'IS IT DANGEROUS?', 'IS IT FRIENDLY?', 'IS IT RARE?', 'CAN YOU BUY IT?', 'IS IT VALUABLE?'];

var quizquestions;
var quizquestion_on = 0;
var oneshot_instruct_on = 1;
var depth = 15;
var QUIZ_QUESTIONS = 2;
var quiz_question_itr = 0;

var fullgame_instruct_on = 1;

var to_log = [];

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

function pad(num, size) {
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}

function log_data(name, dat) {
	to_log.push([name, dat]);
}

function rand_num_incl(min, max) {
  return parseInt((Math.random() * (max - min + 1)), 10) + min;
}

function removeArrValue(arr,index) {
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

var block_clicked = function(blocknum) {
	blocknum_str = blocknum.toString();
	if($("#block"+ blocknum.toString()).css("opacity") == "1") {
		$("#link"+blocknum_str).fadeTo('slow', 0.0, function() {
			$("#answer"+blocknum_str).html(images[question_answer_pairs[(blocknum - 1).toString()][1]]);
			setTimeout(function() {
				if(blocknum >= question_answer_pairs.length) {
					$("#next-button").fadeTo("slow", 1.0,
							function(){
								$("#next").removeAttr("disabled");
							});
				}
				else {
					$("#questions").append(get_quest_ans_pair(blocknum+1, features[question_answer_pairs[blocknum][0]]));
					pageScroll(0, 1000);
					$("#block" + (blocknum+1).toString()).fadeTo('slow', 1.0);
				}

			}, 1000);
		});
	}
}

var get_quest_ans_pair = function(blocknum, q) {
	blocknum_str = blocknum.toString();
	return '<div id="block' + blocknum_str +  '" class="question-block">' +
						'<h3>' + q + '</h3>' +
				  	'<h4 id="answer' + blocknum_str + '">' +
							'<a id="link' +blocknum_str + '">Click to reveal answer</a>' +
						'</h4>' +
						'<hr>' +
						'<script>' +

							'$("#answer' + blocknum_str + '").mouseup(function(){block_clicked(' + blocknum.toString() + ')});' +
						'</script>' +
					'</div>';
}

function pageScroll(times, max) {
		if(times > max) return;
    window.scrollBy(0,1);
    scrolldelay = setTimeout(pageScroll(times+1, max),10);
}

var show_questions = function(first_time) {
	quiz_question_itr = 0;
	first_time = typeof first_time !== 'undefined' ? first_time : true;


	if(first_time) {
		question_answer_pairs = question_answer_pairs_indx[rand_num_incl(0, question_answer_pairs_indx.length - 1)].slice(0, depth);
		log_data('question_answer_pairs', question_answer_pairs);
		psiTurk.showPage('setup.html');

		for(var i = 0; i < 1; i++) {
			$("#questions").append(get_quest_ans_pair((i+1), features[question_answer_pairs[i][0]]))
		}

		$("#block1").css('opacity', '1.0');
	}

	else {
		psiTurk.showPage('setup.html');
		$("#questions").html("");

		for(var k = 0; k < question_answer_pairs.length; k++) {
			var knowledge_piece = question_answer_pairs[k]
			$("#questions").prepend("<h4>" + features[knowledge_piece[0]] + "</h4>" +
										images[knowledge_piece[1]] + "<hr>");
		}

		$("#questions").find( $("img") ).attr("width", 600);
		$("#questions").find( $("div") ).css("margin-left", -103);
		$("#questions").css("margin-left", "50px");
		$("#questions").find( $("div") ).css("margin-right", -103);
		$("#next-button").css('opacity', 1.0);
		$("#next").removeAttr('disabled');
	}

	quizquestions = shuffle(question_answer_pairs.slice());

}

var get_data = function() {
	psiTurk.showPage('freeform-resp.html');

	var knowledge_arr = question_answer_pairs;
	$("#prev-questions").html("");

	for(var k = 0; k < knowledge_arr.length; k++) {
	  var knowledge_piece = knowledge_arr[k]
	  $("#prev-questions").prepend("<h4>" + features[knowledge_piece[0]] + "</h4>" +
	                images[knowledge_piece[1]] + "<hr>");
	}

	$("#prev-questions").find( $("img") ).attr("width", 600);
	$("#prev-questions").find( $("div") ).css("margin-left", -103);
	$("#prev-questions").css("margin-left", "50px");
	$("#prev-questions").find( $("div") ).css("margin-right", -103);

}

var freeform_resp_submitted = function() {
	log_data('quest_freeform', $("#quest-form").val());
	get_data_ranked();
}

var get_data_ranked = function() {
	psiTurk.showPage('stage.html');

	var question_options = ['Question1',
													'Question2',
													'Question3',
													'Question4'];


	var knowledge_arr = question_answer_pairs;
	$("#prev-questions").html("");

	for(var k = 0; k < knowledge_arr.length; k++) {
	  var knowledge_piece = knowledge_arr[k]
	  $("#prev-questions").prepend("<h4>" + features[knowledge_piece[0]] + "</h4>" +
	                images[knowledge_piece[1]] + "<hr>");
	}

	$("#prev-questions").find( $("img") ).attr("width", 600);
	$("#prev-questions").find( $("div") ).css("margin-left", -103);
	$("#prev-questions").css("margin-left", "50px");
	$("#prev-questions").find( $("div") ).css("margin-right", -103);

	for(var i = 0; i < 4; i++) {
		$("#q"+i).find('p').html(question_options[i]);
	}
}

var answer_chosen = function() {
	var ordered = $("#ranked").sortable("toArray");


	if(ordered.length < 4) make_alert("Please rank every question", function(){});


	else {
		var ordered_arr = [ ordered[0].charAt(1), ordered[1].charAt(1), ordered[2].charAt(1), ordered[3].charAt(1) ];
		log_data('ranked_choices', ordered_arr);
		//psiTurk.recordTrialData(["Final choice", question_answer_pairs, ordered_arr]);
		make_alert("Thank you! You will now go back and do the exact same thing, "+
								"but with a <strong>different</strong> game. Remember, we are "+
								"starting completely fresh!", show_questions);
		//setTimeout(function(){psiTurk.showPage('postquestionnaire.html')}, 500);

	}

}

var do_quiz = function() {
	if(quiz_question_itr >= QUIZ_QUESTIONS) {
		quiz_question_itr = 0;
		make_alert("Correct! Please proceed", get_data);
		return;
	}

	if (quizquestions.length == 0) quizquestions = shuffle(question_answer_pairs.slice());
	psiTurk.showPage('quiz.html');
	$('#question-label').html(features[quizquestions[0][0]]);
	$('#question-on').html('Question on: ' + (quiz_question_itr+1) + '/' + 	QUIZ_QUESTIONS);
}

var quizcomplete = function(resp) {
	var correct_resp = quizquestions[0][1];
	var correct = parseInt(resp) == correct_resp;

	log_data('quiz_response', [quizquestion_on.toString(), quiz_question_itr,
		quizquestions[0][0], quizquestions[0][1], resp, correct]);

	quizquestion_on++;

	quizquestions = removeArrValue(quizquestions, 0);

	if(!correct) {
		make_alert("Incorrect, please go back and try again. Really pay attention this time!",
			function(){show_questions(false);} );
	}

	else {
		quiz_question_itr++;
		do_quiz();
	}
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

var show_questions_instructs = function() {
	progress_oneshot_instructs();
}

var show_fullgame_instructs = function() {
	progress_20q_instructs();
}


var progress_oneshot_instructs = function() {
	if(oneshot_instruct_on >= 3) {
		show_questions();
		return;
	}
	psiTurk.showPage('instructions/instruct_oneshot-' + oneshot_instruct_on.toString() + '.html');
	oneshot_instruct_on++;
}

var progress_20q_instructs = function() {
	if(fullgame_instruct_on >= 5) {
		start_20q_game();
		return;
	}
	psiTurk.showPage('instructions/instruct_20q-' + fullgame_instruct_on.toString() + '.html');
	fullgame_instruct_on++;
}

var do_objectquiz = function() {
	psiTurk.showPage('instructions/instruct_20q-objectquiz.html');
}

var objectquiz_submitted = function() {
	var correct_answers = {"Animals":true,
												 "Places":false,
												 "People":false,
												 "Household objects":true,
												 "Plants":true,
												 "Verbs":false,
												 "Tangible things":true,
												 "Adjectives":false};

	var amount_incorrect = 0;
	for(var name in correct_answers) {
		if(correct_answers[name] != $("input[value='" + name + "']").is(':checked'))
			amount_incorrect++;
	}

	if(amount_incorrect == 0) {
		make_alert("Congratulations, you answered the quiz completely correctly!", progress_20q_instructs);
	}
	else {
		make_alert("Unfortunately, you got <strong>" + amount_incorrect +
			"</strong> incorrect. Please take another look at the object list and try again.", function(){psiTurk.showPage('instructions/instruct_20q-2.html')});
	}

}

var complete = function() {
  var comments = document.getElementById("comments").value;
	psiTurk.showPage('complete.html');
  log_data('comments', comments);
	psiTurk.recordTrialData(to_log);
  psiTurk.saveData();
	psiTurk.completeHIT();
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
				progress_20q_instructs();
				//currentview = start_shapegame();
				//currentview = start_20q_game();
    	  //currentview = show_questions();
				//currentview = do_quiz();
				//currentview = start_20q_game();
				//currentview = show_questions();
    	} // what you want to do when you are done with instructions
    );
});
