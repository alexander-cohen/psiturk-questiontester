
import numpy as np
from scipy.stats import entropy
import math
import cPickle as pickle

data_matrix = np.loadtxt("data/intel_dat.txt")

with open("pickled_data/data_probs.pickle", 'r') as d_probs:
    data_probs = pickle.load(d_probs)

with open("data/intel_feat.txt", "r") as feats:
    features = [l[:-2] for l in feats]

with open("data/intel_items.txt", "r") as items:
    items = [l[:-2] for l in items]

num_items_tot = len(items)

feature_blacklist = []


def prob_to_index(prob):
    return (prob+1)*2

def index_to_prob(index):
    return (float(index)/2) - 1



class Player: #ALL ITEMS AND FEATURES WILL BE REFERRED TO BY INDEX
    def __init__(self):
        self.items_left = range(len(items)) #list of items that can be guessed
        self.items_guessed = [] #list of items that have been guessed
        self.question_num = 1
        self.num_items_left = len(self.items_left) #this variable should always refer to the number of items left
        self.prior_prob = 1.0 / self.num_items_left #prior distribution over items (uniform for now)

        self.features_left = range(len(features)) #features are referred to by index, this is the features we cn still choose

        for f in feature_blacklist:
            self.features_left.remove(features.index(f)) #remove bad features

        self.probabilities = np.tile(self.prior_prob, self.num_items_left) #for now, everything has prior prob

        self.prob_knowledge_from_items = np.tile(1.0, self.num_items_left) #empty knowledge set, so 1.0 prob

        self.knowledge = [] #will add feature/response pairs

        self.entropy = entropy(self.probabilities) #entropy of distribution

        self.update_all() #updates all information

    def prob_knowledge_from_item(self, item):
        item_probs = data_probs[:, item] #a 2D slice of the array, rows being prob and column being feature
        return np.prod( np.fromiter((item_probs[prob_to_index(r)][f] for f, r in self.knowledge), np.float64)) * \
                self.prior_prob

    def get_prob_knowledge_from_items(self):
        return np.fromiter( ((self.prob_knowledge_from_item(item)) for item in self.items_left ), np.float64)

    def update_all(self):
        self.num_items_left = len(self.items_left)
        self.prior_prob = 1.0 / self.num_items_left

        self.prob_knowledge_from_items = self.get_prob_knowledge_from_items()
        self.prob_knowledge_overall = np.sum(self.prob_knowledge_from_items)


#         if len(self.items_guessed) > 0: self.prob_knowledge_from_items[np.array(self.items_guessed)] = 0



        self.probabilities = self.prob_knowledge_from_items / self.prob_knowledge_overall

        self.entropy = entropy(self.probabilities)

    def entropy_with_new_knowledge(self, new_knowledge):
        feature, response = new_knowledge

        prob_response_for_animal = data_probs[prob_to_index(response), :, feature] #2d slice, row is prob col is animal

        new_prob_knowledge_from_items = self.prob_knowledge_from_items * \
                                               np.fromiter(  (prob_response_for_animal[o]  for o in self.items_left), np.float64)

        new_prob_knowledge_overall = np.sum(new_prob_knowledge_from_items)

        ent =  entropy(new_prob_knowledge_from_items/new_prob_knowledge_overall)
        return self.entropy if math.isinf(ent) else ent

    def prob_response(self, feature, val):
        prob_of_val = data_probs[prob_to_index(val), self.items_left, feature]
        return np.sum(self.probabilities * prob_of_val)

    def expected_info_gain(self, feature):
        eig = 0
        for i in range(5):
            eig += self.prob_response(feature, index_to_prob(i)) * self.info_gain_ent(self.entropy_with_new_knowledge((feature, index_to_prob(i))))
        return  eig

    def expected_info_gains(self):
        return_arr = []
        for f in self.features_left:
            return_arr.append(self.expected_info_gain(f))
        return np.nan_to_num(np.array(return_arr))

    def get_best_feature(self):
        return self.features_left[np.argmax(self.expected_info_gains())]

    def get_best_feature_and_gain(self):
        gains = self.expected_info_gains()
        best_indx = np.argmax(gains)
        return self.features_left[best_indx], gains[best_indx]

    def add_knowledge(self, feature, response):
        self.knowledge.append((feature, float(response)))
        self.features_left.remove(feature)
        self.update_all()

    def add_knowledge_name(self, feature, response):
        self.add_knowledge(features.index(feature), response)

    def ordered_features_name_and_gain_str(self):
        info_gains = self.expected_info_gains()
        ordered_names = [features[self.features_left[f]] for f in np.argsort(info_gains)[::-1]]
        return ":".join(ordered_names) + "," + ":".join([str(elem) for elem in list(np.sort(info_gains)[::-1])])

    def finish(self, choices):
        dummie = Player()
        for k in self.knowledge:
            dummie.knowledge.append(k)
            dummie.update_all()
            print '\n\n***************\nFeature:', features[k[0]], ', Your response:', k[1]
            for o in choices:
                try:
                    print 'For', o.upper(), ':', data_matrix[items.index(o.lower()), k[0]], 'prob:', dummie.probabilities[items.index(o.lower())]
                except:
                    pass

    def info_gain_ent(self, new_entropy):
        return self.entropy - new_entropy

    def info_gain_probs(self, probs):
        return self.info_gain_ent(entropy(probs))

    def guess_object(self, item):
        while True:
            response = raw_input("Is it a " + items[item] + "? (y/n): ")
            if response == 'y':
                print "Yay! I win!"
                self.finish([items[item]])
                return True

            elif response == 'n':
                print self.items_left, item
                self.items_left.remove(item)
                self.items_guessed.append(item)
                self.num_items_left -= 1
                self.prior_prob = 1.0 / self.num_items_left
                self.update_all()
                return False

            else:
                continue

    def iterate(self):
        print self
        best_feature, gain = self.get_best_feature_and_gain()
        print "Best gain: ", gain
        for o_indx, p in zip(range(1000), self.probabilities):
            probs_without = np.array(list(self.probabilities)[:o_indx] + list(self.probabilities)[o_indx+1:])
            probs_without /= np.sum(probs_without)
            eig = p*self.entropy + (1-p)*self.info_gain_probs(probs_without)
            if p >= 0.9:
                print "Better to choose object, info gain best question:", gain, "for object total:", eig, \
                    "if yes:", p*self.entropy, "if no:", (1-p)*self.info_gain_probs(probs_without)
                self.question_num += 1
                if self.guess_object(self.items_left[o_indx]): return
                else: self.iterate()

        prob_responses = [self.prob_response(best_feature, 1.0),
                          self.prob_response(best_feature, 0.5),
                          self.prob_response(best_feature, 0.0),
                          self.prob_response(best_feature, -0.5),
                          self.prob_response(best_feature, -1.0)]


        info_gains = [self.info_gain_ent(self.entropy_with_new_knowledge((best_feature, 1.0))),
                      self.info_gain_ent(self.entropy_with_new_knowledge((best_feature, 0.5))),
                      self.info_gain_ent(self.entropy_with_new_knowledge((best_feature, 0.0))),
                      self.info_gain_ent(self.entropy_with_new_knowledge((best_feature, -0.5))),
                      self.info_gain_ent(self.entropy_with_new_knowledge((best_feature, -1.0)))]


        expected_gains = list(np.array(prob_responses)*np.array(info_gains))


        helper_str = "eig = " + str(self.expected_info_gain(best_feature)) + ':\n'\
                        '   y = {:.4f} * {:.4f} = {:.4f}'.format(prob_responses[0], info_gains[0], expected_gains[0]) + '\n' \
                        '  py = {:.4f} * {:.4f} = {:.4f}'.format(prob_responses[1], info_gains[1], expected_gains[1]) + '\n' \
                        '   u = {:.4f} * {:.4f} = {:.4f}'.format(prob_responses[2], info_gains[2], expected_gains[2]) + '\n' \
                        '  pn = {:.4f} * {:.4f} = {:.4f}'.format(prob_responses[3], info_gains[3], expected_gains[3]) + '\n' \
                        '   n = {:.4f} * {:.4f} = {:.4f}'.format(prob_responses[4], info_gains[4], expected_gains[4]) + '\n'

        while True:

            response = raw_input(helper_str + "\n" + str(self.question_num) + "). " + features[best_feature].upper() + \
                                 " (y/py/u/pn/n or end,item1,item2,item3...): ")
            if response == 'y':
                self.knowledge.append((best_feature, 1))

            elif response == 'n':
                self.knowledge.append((best_feature, -1))

            elif response == 'py':
                self.knowledge.append((best_feature, 0.5))

            elif response == 'pn':
                self.knowledge.append((best_feature, -0.5))

            elif response == 'u':
                self.knowledge.append((best_feature, 0.0))

            elif response.split(',')[0] == 'end':
                return self.finish(response.split(',')[1:])
                return

            else:
                continue
            break
        self.features_left.remove(best_feature)
        self.question_num += 1
        self.update_all()
        self.iterate()

    def ordered_features_indx(self):
        return np.array([self.features_left[f] for f in np.argsort(self.expected_info_gains())[::-1]])

    def ordered_features_name(self):
        return [features[f] for f in self.ordered_features_indx()]

    def __str__(self):
        ordered = sorted([(items[self.items_left[i]], prob) for i, prob in zip(range(10000), self.probabilities)], key=lambda x: -x[1])
        to_print_probs = repr([(item, "{:.3}%".format(prob*100)) for item, prob in ordered][:10])
        return "\nProbabilities: " + to_print_probs + "\n" \
                "Entropy: " + str(self.entropy) + '\n' +\
                "Sum probs: " + str(np.sum(self.probabilities))
