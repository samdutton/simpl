"use strict";
var JsSearch;
(function (JsSearch) {
    var AllSubstringsIndexStrategy = (function () {
        function AllSubstringsIndexStrategy() {
        }
        AllSubstringsIndexStrategy.prototype.expandToken = function (token) {
            var expandedTokens = [];
            for (var i = 0, length = token.length; i < length; ++i) {
                for (var j = i; j < length; ++j) {
                    expandedTokens.push(token.substring(i, j + 1));
                }
            }
            return expandedTokens;
        };
        return AllSubstringsIndexStrategy;
    }());
    JsSearch.AllSubstringsIndexStrategy = AllSubstringsIndexStrategy;
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=all-substrings-index-strategy.js.map
"use strict";
var JsSearch;
(function (JsSearch) {
    var ExactWordIndexStrategy = (function () {
        function ExactWordIndexStrategy() {
        }
        ExactWordIndexStrategy.prototype.expandToken = function (token) {
            return token ? [token] : [];
        };
        return ExactWordIndexStrategy;
    }());
    JsSearch.ExactWordIndexStrategy = ExactWordIndexStrategy;
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=exact-word-index-strategy.js.map
"use strict";
var JsSearch;
(function (JsSearch) {
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=index-strategy.js.map
"use strict";
var JsSearch;
(function (JsSearch) {
    var PrefixIndexStrategy = (function () {
        function PrefixIndexStrategy() {
        }
        PrefixIndexStrategy.prototype.expandToken = function (token) {
            var expandedTokens = [];
            for (var i = 0, length = token.length; i < length; ++i) {
                expandedTokens.push(token.substring(0, i + 1));
            }
            return expandedTokens;
        };
        return PrefixIndexStrategy;
    }());
    JsSearch.PrefixIndexStrategy = PrefixIndexStrategy;
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=prefix-index-strategy.js.map
"use strict";
var JsSearch;
(function (JsSearch) {
    var CaseSensitiveSanitizer = (function () {
        function CaseSensitiveSanitizer() {
        }
        CaseSensitiveSanitizer.prototype.sanitize = function (text) {
            return text ? text.trim() : '';
        };
        return CaseSensitiveSanitizer;
    }());
    JsSearch.CaseSensitiveSanitizer = CaseSensitiveSanitizer;
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=case-sensitive-sanitizer.js.map
"use strict";
var JsSearch;
(function (JsSearch) {
    var LowerCaseSanitizer = (function () {
        function LowerCaseSanitizer() {
        }
        LowerCaseSanitizer.prototype.sanitize = function (text) {
            return text ? text.toLocaleLowerCase().trim() : '';
        };
        return LowerCaseSanitizer;
    }());
    JsSearch.LowerCaseSanitizer = LowerCaseSanitizer;
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=lower-case-sanitizer.js.map
"use strict";
var JsSearch;
(function (JsSearch) {
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=sanitizer.js.map
"use strict";
var JsSearch;
(function (JsSearch) {
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=search-index.js.map
"use strict";
var JsSearch;
(function (JsSearch) {
    var TfIdfSearchIndex = (function () {
        function TfIdfSearchIndex(uidFieldName) {
            this.uidFieldName_ = uidFieldName;
            this.tokenToIdfCache_ = {};
            this.tokenMap_ = {};
        }
        TfIdfSearchIndex.prototype.indexDocument = function (token, uid, document) {
            this.tokenToIdfCache_ = {};
            if (typeof this.tokenMap_[token] !== 'object') {
                this.tokenMap_[token] = {
                    $numDocumentOccurrences: 0,
                    $totalNumOccurrences: 1,
                    $uidMap: {}
                };
            }
            else {
                this.tokenMap_[token].$totalNumOccurrences++;
            }
            if (!this.tokenMap_[token].$uidMap[uid]) {
                this.tokenMap_[token].$numDocumentOccurrences++;
                this.tokenMap_[token].$uidMap[uid] = {
                    $document: document,
                    $numTokenOccurrences: 1
                };
            }
            else {
                this.tokenMap_[token].$uidMap[uid].$numTokenOccurrences++;
            }
        };
        TfIdfSearchIndex.prototype.search = function (tokens, corpus) {
            var uidToDocumentMap = {};
            for (var i = 0, numTokens = tokens.length; i < numTokens; i++) {
                var token = tokens[i];
                var tokenMetadata = this.tokenMap_[token];
                if (!tokenMetadata) {
                    return [];
                }
                if (i === 0) {
                    for (var uid in tokenMetadata.$uidMap) {
                        uidToDocumentMap[uid] = tokenMetadata.$uidMap[uid].$document;
                    }
                }
                else {
                    for (var uid in uidToDocumentMap) {
                        if (!tokenMetadata.$uidMap[uid]) {
                            delete uidToDocumentMap[uid];
                        }
                    }
                }
            }
            var documents = [];
            for (var uid in uidToDocumentMap) {
                documents.push(uidToDocumentMap[uid]);
            }
            return documents.sort(function (documentA, documentB) {
                return this.calculateTfIdf_(tokens, documentB, corpus) -
                    this.calculateTfIdf_(tokens, documentA, corpus);
            }.bind(this));
        };
        TfIdfSearchIndex.prototype.calculateIdf_ = function (token, documents) {
            if (!this.tokenToIdfCache_[token]) {
                var numDocumentsWithToken = this.tokenMap_[token] && this.tokenMap_[token].$numDocumentOccurrences || 0;
                this.tokenToIdfCache_[token] = 1 + Math.log(documents.length / (1 + numDocumentsWithToken));
            }
            return this.tokenToIdfCache_[token];
        };
        TfIdfSearchIndex.prototype.calculateTfIdf_ = function (tokens, document, documents) {
            var score = 0;
            for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
                var token = tokens[i];
                var inverseDocumentFrequency = this.calculateIdf_(token, documents);
                if (inverseDocumentFrequency === Infinity) {
                    inverseDocumentFrequency = 0;
                }
                var uid = document && document[this.uidFieldName_];
                var termFrequency = this.tokenMap_[token] &&
                    this.tokenMap_[token].$uidMap[uid] &&
                    this.tokenMap_[token].$uidMap[uid].$numTokenOccurrences || 0;
                score += termFrequency * inverseDocumentFrequency;
            }
            return score;
        };
        return TfIdfSearchIndex;
    }());
    JsSearch.TfIdfSearchIndex = TfIdfSearchIndex;
    ;
    ;
    ;
    ;
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=tf-idf-search-index.js.map
"use strict";
var JsSearch;
(function (JsSearch) {
    var UnorderedSearchIndex = (function () {
        function UnorderedSearchIndex() {
            this.tokenToUidToDocumentMap_ = {};
        }
        UnorderedSearchIndex.prototype.indexDocument = function (token, uid, document) {
            if (!this.tokenToUidToDocumentMap_[token]) {
                this.tokenToUidToDocumentMap_[token] = {};
            }
            this.tokenToUidToDocumentMap_[token][uid] = document;
        };
        UnorderedSearchIndex.prototype.search = function (tokens, corpus) {
            var uidToDocumentMap = {};
            for (var i = 0, numTokens = tokens.length; i < numTokens; i++) {
                var token = tokens[i];
                var currentUidToDocumentMap = this.tokenToUidToDocumentMap_[token] || {};
                if (i === 0) {
                    for (var uid in currentUidToDocumentMap) {
                        uidToDocumentMap[uid] = currentUidToDocumentMap[uid];
                    }
                }
                else {
                    for (var uid in uidToDocumentMap) {
                        if (!currentUidToDocumentMap[uid]) {
                            delete uidToDocumentMap[uid];
                        }
                    }
                }
            }
            var documents = [];
            for (var uid in uidToDocumentMap) {
                documents.push(uidToDocumentMap[uid]);
            }
            return documents;
        };
        return UnorderedSearchIndex;
    }());
    JsSearch.UnorderedSearchIndex = UnorderedSearchIndex;
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=unordered-search-index.js.map
"use strict";
var JsSearch;
(function (JsSearch) {
    var Search = (function () {
        function Search(uidFieldName) {
            this.uidFieldName_ = uidFieldName;
            this.indexStrategy_ = new JsSearch.PrefixIndexStrategy();
            this.searchIndex_ = new JsSearch.TfIdfSearchIndex(uidFieldName);
            this.sanitizer_ = new JsSearch.LowerCaseSanitizer();
            this.tokenizer_ = new JsSearch.SimpleTokenizer();
            this.documents_ = [];
            this.searchableFields = [];
        }
        Object.defineProperty(Search.prototype, "indexStrategy", {
            get: function () {
                return this.indexStrategy_;
            },
            set: function (value) {
                if (this.initialized_) {
                    throw Error('IIndexStrategy cannot be set after initialization');
                }
                this.indexStrategy_ = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Search.prototype, "sanitizer", {
            get: function () {
                return this.sanitizer_;
            },
            set: function (value) {
                if (this.initialized_) {
                    throw Error('ISanitizer cannot be set after initialization');
                }
                this.sanitizer_ = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Search.prototype, "searchIndex", {
            get: function () {
                return this.searchIndex_;
            },
            set: function (value) {
                if (this.initialized_) {
                    throw Error('ISearchIndex cannot be set after initialization');
                }
                this.searchIndex_ = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Search.prototype, "tokenizer", {
            get: function () {
                return this.tokenizer_;
            },
            set: function (value) {
                if (this.initialized_) {
                    throw Error('ITokenizer cannot be set after initialization');
                }
                this.tokenizer_ = value;
            },
            enumerable: true,
            configurable: true
        });
        Search.prototype.addDocument = function (document) {
            this.addDocuments([document]);
        };
        Search.prototype.addDocuments = function (documents) {
            this.documents_ = this.documents_.concat(documents);
            this.indexDocuments_(documents, this.searchableFields);
        };
        Search.prototype.addIndex = function (field) {
            this.searchableFields.push(field);
            this.indexDocuments_(this.documents_, [field]);
        };
        Search.prototype.search = function (query) {
            var tokens = this.tokenizer_.tokenize(this.sanitizer_.sanitize(query));
            return this.searchIndex_.search(tokens, this.documents_);
        };
        Search.prototype.indexDocuments_ = function (documents, searchableFields) {
            this.initialized_ = true;
            for (var di = 0, numDocuments = documents.length; di < numDocuments; di++) {
                var document = documents[di];
                var uid = document[this.uidFieldName_];
                for (var sfi = 0, numSearchableFields = searchableFields.length; sfi < numSearchableFields; sfi++) {
                    var fieldValue;
                    var searchableField = searchableFields[sfi];
                    if (searchableField instanceof Array) {
                        fieldValue = Search.getNestedFieldValue(document, searchableField);
                    }
                    else {
                        fieldValue = document[searchableField];
                    }
                    if (fieldValue != null &&
                        typeof fieldValue !== 'string' &&
                        fieldValue.toString) {
                        fieldValue = fieldValue.toString();
                    }
                    if (typeof fieldValue === 'string') {
                        var fieldTokens = this.tokenizer_.tokenize(this.sanitizer_.sanitize(fieldValue));
                        for (var fti = 0, numFieldValues = fieldTokens.length; fti < numFieldValues; fti++) {
                            var fieldToken = fieldTokens[fti];
                            var expandedTokens = this.indexStrategy_.expandToken(fieldToken);
                            for (var eti = 0, nummExpandedTokens = expandedTokens.length; eti < nummExpandedTokens; eti++) {
                                var expandedToken = expandedTokens[eti];
                                this.searchIndex_.indexDocument(expandedToken, uid, document);
                            }
                        }
                    }
                }
            }
        };
        Search.getNestedFieldValue = function (object, path) {
            path = path || [];
            object = object || {};
            var value = object;
            for (var i = 0; i < path.length; i++) {
                value = value[path[i]];
                if (value == null) {
                    return null;
                }
            }
            return value;
        };
        return Search;
    }());
    JsSearch.Search = Search;
})(JsSearch || (JsSearch = {}));
//# sourceMappingURL=search.js.map
"use strict";
var JsSearch;
(function (JsSearch) {
    JsSearch.StopWordsMap = {
        a: 'a',
        able: 'able',
        about: 'about',
        across: 'across',
        after: 'after',
        all: 'all',
        almost: 'almost',
        also: 'also',
        am: 'am',
        among: 'among',
        an: 'an',
        and: 'and',
        any: 'any',
        are: 'are',
        as: 'as',
        at: 'at',
        be: 'be',
        because: 'because',
        been: 'been',
        but: 'but',
        by: 'by',
        can: 'can',
        cannot: 'cannot',
        could: 'could',
        dear: 'dear',
        did: 'did',
        'do': 'do',
        does: 'does',
        either: 'either',
        'else': 'else',
        ever: 'ever',
        every: 'every',
        'for': 'for',
        from: 'from',
        'get': 'get',
        got: 'got',
        had: 'had',
        has: 'has',
        have: 'have',
        he: 'he',
        her: 'her',
        hers: 'hers',
        him: 'him',
        his: 'his',
        how: 'how',
        however: 'however',
        i: 'i',
        'if': 'if',
        'in': 'in',
        into: 'into',
        is: 'is',
        it: 'it',
        its: 'its',
        just: 'just',
        least: 'least',
        let: 'let',
        like: 'like',
        likely: 'likely',
        may: 'may',
        me: 'me',
        might: 'might',
        most: 'most',
        must: 'must',
        my: 'my',
        neither: 'neither',
        no: 'no',
        nor: 'nor',
        not: 'not',
        of: 'of',
        off: 'off',
        often: 'often',
        on: 'on',
        only: 'only',
        or: 'or',
        other: 'other',
        our: 'our',
        own: 'own',
        rather: 'rather',
        said: 'said',
        say: 'say',
        says: 'says',
        she: 'she',
        should: 'should',
        since: 'since',
        so: 'so',
        some: 'some',
        than: 'than',
        that: 'that',
        the: 'the',
        their: 'their',
        them: 'them',
        then: 'then',
        there: 'there',
        these: 'these',
        they: 'they',
        'this': 'this',
        tis: 'tis',
        to: 'to',
        too: 'too',
        twas: 'twas',
        us: 'us',
        wants: 'wants',
        was: 'was',
        we: 'we',
        were: 'were',
        what: 'what',
        when: 'when',
        where: 'where',
        which: 'which',
        'while': 'while',
        who: 'who',
        whom: 'whom',
        why: 'why',
        will: 'will',
        'with': 'with',
        would: 'would',
        yet: 'yet',
        you: 'you',
        your: 'your'
    };
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=stop-words-map.js.map
"use strict";
var JsSearch;
(function (JsSearch) {
    var TokenHighlighter = (function () {
        function TokenHighlighter(opt_indexStrategy, opt_sanitizer, opt_wrapperTagName) {
            this.indexStrategy_ = opt_indexStrategy || new JsSearch.PrefixIndexStrategy();
            this.sanitizer_ = opt_sanitizer || new JsSearch.LowerCaseSanitizer();
            this.wrapperTagName_ = opt_wrapperTagName || 'mark';
        }
        TokenHighlighter.prototype.highlight = function (text, tokens) {
            var tagsLength = this.wrapText_('').length;
            var tokenDictionary = {};
            for (var i = 0, numTokens = tokens.length; i < numTokens; i++) {
                var token = this.sanitizer_.sanitize(tokens[i]);
                var expandedTokens = this.indexStrategy_.expandToken(token);
                for (var j = 0, numExpandedTokens = expandedTokens.length; j < numExpandedTokens; j++) {
                    var expandedToken = expandedTokens[j];
                    if (!tokenDictionary[expandedToken]) {
                        tokenDictionary[expandedToken] = [token];
                    }
                    else {
                        tokenDictionary[expandedToken].push(token);
                    }
                }
            }
            var actualCurrentWord = '';
            var sanitizedCurrentWord = '';
            var currentWordStartIndex = 0;
            for (var i = 0, textLength = text.length; i < textLength; i++) {
                var character = text.charAt(i);
                if (character === ' ') {
                    actualCurrentWord = '';
                    sanitizedCurrentWord = '';
                    currentWordStartIndex = i + 1;
                }
                else {
                    actualCurrentWord += character;
                    sanitizedCurrentWord += this.sanitizer_.sanitize(character);
                }
                if (tokenDictionary[sanitizedCurrentWord] &&
                    tokenDictionary[sanitizedCurrentWord].indexOf(sanitizedCurrentWord) >= 0) {
                    actualCurrentWord = this.wrapText_(actualCurrentWord);
                    text = text.substring(0, currentWordStartIndex) + actualCurrentWord + text.substring(i + 1);
                    i += tagsLength;
                    textLength += tagsLength;
                }
            }
            return text;
        };
        TokenHighlighter.prototype.wrapText_ = function (text) {
            return "<" + this.wrapperTagName_ + ">" + text + "</" + this.wrapperTagName_ + ">";
        };
        return TokenHighlighter;
    }());
    JsSearch.TokenHighlighter = TokenHighlighter;
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=token-highlighter.js.map
"use strict";
var JsSearch;
(function (JsSearch) {
    var SimpleTokenizer = (function () {
        function SimpleTokenizer() {
        }
        SimpleTokenizer.prototype.tokenize = function (text) {
            return text.split(/[^a-zA-Z0-9\-']+/)
                .filter(function (text) {
                return !!text;
            });
        };
        return SimpleTokenizer;
    }());
    JsSearch.SimpleTokenizer = SimpleTokenizer;
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=simple-tokenizer.js.map
"use strict";
var JsSearch;
(function (JsSearch) {
    var StemmingTokenizer = (function () {
        function StemmingTokenizer(stemmingFunction, decoratedTokenizer) {
            this.stemmingFunction_ = stemmingFunction;
            this.tokenizer_ = decoratedTokenizer;
        }
        StemmingTokenizer.prototype.tokenize = function (text) {
            return this.tokenizer_.tokenize(text)
                .map(function (token) {
                return this.stemmingFunction_(token);
            }, this);
        };
        return StemmingTokenizer;
    }());
    JsSearch.StemmingTokenizer = StemmingTokenizer;
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=stemming-tokenizer.js.map
"use strict";
var JsSearch;
(function (JsSearch) {
    var StopWordsTokenizer = (function () {
        function StopWordsTokenizer(decoratedTokenizer) {
            this.tokenizer_ = decoratedTokenizer;
        }
        StopWordsTokenizer.prototype.tokenize = function (text) {
            return this.tokenizer_.tokenize(text)
                .filter(function (token) {
                return token && JsSearch.StopWordsMap[token] !== token;
            });
        };
        return StopWordsTokenizer;
    }());
    JsSearch.StopWordsTokenizer = StopWordsTokenizer;
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=stop-words-filtering-tokenizer.js.map
"use strict";
var JsSearch;
(function (JsSearch) {
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=tokenizer.js.map
(function (JsSearch) {
  if (typeof module !== 'undefined' && module.exports && JsSearch) { module.exports = JsSearch; }
})(JsSearch || (JsSearch = {}));