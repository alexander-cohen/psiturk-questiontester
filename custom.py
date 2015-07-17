# this file imports custom routes into the experiment server
import sys
sys.path.append("/opt/local/Library/Frameworks/Python.framework/Versions/2.7/lib/python2.7/site-packages")

from flask import Blueprint, render_template, request, jsonify, Response, abort, current_app, session
from jinja2 import TemplateNotFound
from functools import wraps
from sqlalchemy import or_

from psiturk.psiturk_config import PsiturkConfig
from psiturk.experiment_errors import ExperimentError
from psiturk.user_utils import PsiTurkAuthorization, nocache
# # Database setup
from psiturk.db import db_session, init_db
from psiturk.models import Participant
from json import dumps, loads

from player import Player, items, data_matrix, features
from similarities import *

import editdistance

from random import randint
from random import choice

# load the configuration options
config = PsiturkConfig()
config.load_config()
myauth = PsiTurkAuthorization(config)  # if you want to add a password protect route use this

# explore the Blueprint
custom_code = Blueprint('custom_code', __name__, template_folder='templates', static_folder='static')



###########################################################
#  serving warm, fresh, & sweet custom, user-provided routes
#  add them here
###########################################################


#----------------------------------------------
# Start Player
#----------------------------------------------


#----------------------------------------------
# Get similar questions
#----------------------------------------------
@custom_code.route('/get_similar', methods=['GET'])
def get_similar():
    q = request.args['question']
    try:
        answer = get_ordered_similarities(str(q))
        str_answer = ",".join([repr(elem) for elem in answer])
        return str_answer
    except TemplateNotFound:
        abort(404)


#----------------------------------------------
# Get answer
#----------------------------------------------
@custom_code.route('/get_question_response', methods=['GET'])
def get_question_response():

    item = str(request.args['item'])
    item_indx = items.index(item)

    q_indx = features.index(str(request.args['question']))
    answer = data_matrix[item_indx][q_indx]
    try:
        return str(answer)
    except TemplateNotFound:
        abort(404)


#----------------------------------------------
# Get ordered info gain
#----------------------------------------------
@custom_code.route('/get_good_questions', methods=['GET'])
def get_good_questions():
    try:
        player = Player()
        knowledge = str(request.args['knowledge']).split(",")
        for k in knowledge:
            if k == "": continue
            parts = k.split(":")
            player.add_knowledge_name(parts[0], parts[1])

        return player.ordered_features_name_and_gain_str()
    except TemplateNotFound:
        abort(404)




#----------------------------------------------
# Get if is similar object
#----------------------------------------------
@custom_code.route('/get_similarity', methods=['GET'])
def get_similarity():
    try:
        obj = str(request.args['object'])
        the_item = str(request.args['item'])
        return str( editdistance.eval(obj, the_item) )

    except TemplateNotFound:
        abort(404)


#----------------------------------------------
# get random object
#----------------------------------------------
@custom_code.route('/get_rand_object', methods=['GET'])
def get_rand_object():
    try:
        #return str(items[randint(0, 1000)])
        return str(items[choice([0,1,36,29,833,26,3,1,167,171,402])])

    except TemplateNotFound:
        abort(404)
