import string
import pickle

very_common = ["FOR", "AND", "IS", "WOULD", "HAD", "IF", "DO", "DOES"]

def remove_common_words(sentence):
    returner = sentence
    returner = returner.upper()
    return " ".join([w for w in returner.split() if w not in very_common])
        
    return returner
        
def format_sentence(sentence):
    return remove_common_words(sentence.upper().translate(string.maketrans("",""), string.punctuation))

with open("data/intel_feat.txt", "r") as feat:
    features_raw = [l[:-2] for l in feat]

features_formatted = [format_sentence(f) for f in features_raw]

with open("pickled_data/feature_word_vals2.pickle", 'r') as f:
    feature_word_dict = pickle.load(f)


def similarity(question, feature_dict, feature):
    sum_tot = 0
    for w in question.split():
        sum_tot += sum (sorted([feature_dict[w] if w in feature_dict else 0 for w in question.split()]))
        if w in very_common: sum_tot += 1.0
    return sum_tot - float(len(feature.split()))/100

def get_top_similarities(num, q):
    question = format_sentence(q)
    similarities = [(feature, similarity(question, feature_dict, feature)) for feature, feature_dict in zip(features_raw, feature_word_dict)]
    similarities = [s for s in similarities if s[1] > 0]
    similarities = sorted(similarities, key=lambda x: -x[1])
    similarities = [s[0] for s in similarities]
    return similarities[:num]

def get_ordered_similarities(q):
    return get_top_similarities(10**6, q)