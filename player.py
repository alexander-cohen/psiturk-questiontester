
import numpy as np
from scipy.stats import entropy
import math
import pickle

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



class Player: #ALL itemS AND FEATURES WILL BE REFERRED TO BY INDEX
    def __init__(self):
        self.items_left = range(len(items)) #list of items that can be guessed
        self.items_guessed = [] #list of items that have been guessed
      
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
        
        self.prob_knowledge_from_items[self.items_guessed] = 0
        
        self.probabilities = self.prob_knowledge_from_items / self.prob_knowledge_overall
        
        self.entropy = entropy(self.probabilities)
        self.question_num = 1
        
    def entropy_with_new_knowledge(self, new_knowledge):
        feature, response = new_knowledge

        prob_response_for_animal = data_probs[prob_to_index(response), :, feature] #2d slice, row is prob col is animal

        new_prob_knowledge_from_items = self.prob_knowledge_from_items * \
                                               np.fromiter(  (prob_response_for_animal[o]  for o in self.items_left), np.float64)
                                                
        new_prob_knowledge_overall = np.sum(new_prob_knowledge_from_items)

        ent =  entropy(new_prob_knowledge_from_items/new_prob_knowledge_overall) 
        return self.entropy if math.isinf(ent) else ent
        
    def prob_response(self, feature, val):
        prob_of_val = data_probs[prob_to_index(val), :, feature]
        return np.sum(self.probabilities * prob_of_val)
        
    def expected_info_gain(self, feature):
        eig = 0
        for i in range(5):
            eig += self.prob_response(feature, index_to_prob(i)) * (self.entropy - self.entropy_with_new_knowledge((feature, index_to_prob(i))))
        return  eig
                                                            
    def expected_info_gains(self):
        return_arr = []
        for f in self.features_left:
            return_arr.append(self.expected_info_gain(f))
        return np.nan_to_num(np.array(return_arr))                                              
                     
    def add_knowledge_name(self, feature, response):
        feat_indx = features.index(feature)
        self.knowledge.append((feat_indx, float(response)))
        self.features_left.remove(feat_indx)
        self.update_all()

    def get_best_feature(self):
        return self.features_left[np.argmax(self.expected_info_gains())] 
    
    def ordered_features_indx(self):
        return np.array([self.features_left[f] for f in np.argsort(self.expected_info_gains())[::-1]])
        
    def ordered_features_name(self):
        return [features[f] for f in self.ordered_features_indx()]

    def ordered_features_name_and_gain_str(self):
        info_gains = self.expected_info_gains()
        ordered_names = [features[self.features_left[f]] for f in np.argsort(info_gains)[::-1]]
        return ":".join(ordered_names) + "," + ":".join([str(elem) for elem in list(np.sort(info_gains)[::-1])])

    def __str__(self):
        return "Probabilities: " + repr((sorted([(items[i], prob) for i, prob in zip(range(10000), self.probabilities)], key=lambda x: -x[1]))) + "\n" \
                "Sum probs: " + str(np.sum(self.probabilities)) + "\n" + \
                "Entropy: " + str(self.entropy)
        
