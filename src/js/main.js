require('../css/style.css');
require('../css/swiper.css');


var CURRENT_ENV = 'dev';


// basic global variables for the whole app
var React = require('react'),
    ReactDOM = require('react-dom'),
    $ = require('jquery'),
    Swiper = require('swiper');

// got the windowHegith at the very beginning in order to prevent the visual keyboard impact this value
var windowHeight = $(window).height();


var url = CURRENT_ENV === 'dev' ? {
                keywordsURL: '../../data/keywords.json',
                defaultContentURL: '../../data/defaultresults.json',
                searchURL: '../../data/keywordresults.json'
            } : {
                keywordsURL: 'search/keyword',
                defaultContentURL: 'search/search?word=""',
                searchURL: 'search/search?word='
            }


var TopBar = React.createClass({
    render: function() {
        return (
            <div className="top-bar">
                <div className="search-icon"></div>
                <SearchBar value={this.props.curKeyword} searchContentUpdate={this.props.onSearchContentUpdated}/>
                <span className="delete-btn" onClick={this.props.onDeleteContent}></span>
            </div>
        );
    }
});

var SearchBar = React.createClass({
    render: function() {
        return (
            <input type="text" placeholder="请输入你想搜索的内容" className="search-bar" value={this.props.value}
            onChange={this.props.searchContentUpdate}
            onKeyDown={this.props.searchContentUpdate}
            onBlur={this.props.searchContentUpdate}
            />
        );
    }
});

var KeywordsBar = React.createClass({
    _initSwiper: function() {
        new Swiper(ReactDOM.findDOMNode(this), {
            slidesPerView: 'auto',
            grabCursor: true,
            slideElement: 'li',
            watchSlidesVisibility: true
        })
    },
    keywordClicked: function(i) {
        this.props.onKeywordSelected(i.name);
    },
    componentDidUpdate: function() {
        this._initSwiper();
    },
    render: function() {
        var thisComponent = this;
        return (
            <div className="swiper-container keywords-bar">
                <ul className="swiper-wrapper">
                    {this.props.keywords.map(function(keyword, index) {
                        return <li className="swiper-slide" key={index}  onClick={thisComponent.keywordClicked.bind(null, keyword)}>{keyword.name}</li>
                    })}
                </ul>
            </div>
        );
    }
});


var ResultItem = React.createClass({
    render: function() {
        return (
            <li className="result-item" >
                <a href={this.props.contentUrl}>
                    <img src={this.props.thumbnail} />
                    <div className="flex-box">
                        <div dangerouslySetInnerHTML={{__html: this.props.content}}></div>
                    </div>
                </a>
            </li>
        );
    }
});

var ResultList = React.createClass({
    render: function() {
        return (
            <ul>
                {this.props.results.map(function(result, index) {
                    return <ResultItem key={index} contentUrl={result.url} thumbnail={result.pic} content={result.title}/>
                })}
            </ul>
        );
    }
});

var EmptyMsg = React.createClass({
    render: function() {
        return (
            <div className="empty-result">
                <p>我们暂时还未发布相关内容哦，你可以将关键词</p>
                <p>发送给我们，我会督促小编尽快撰写~</p>
            </div>
        );
    }
});

var SearchApp = React.createClass({
    _setScrollAreaHeight: function() {
        var $scrollArea = $('.scroll-area');
        var wh = windowHeight;
        var th = $('.top-area').height();

        $scrollArea.css('height', wh - th + 'px');
        $scrollArea.scrollTop(0);
    },
    _getKeywordsList: function() {
        $.ajax({
            url: url.keywordsURL,
            success: function(data) {
                this.setState({
                    keywords: CURRENT_ENV ==='dev'? data : JSON.parse(data)
                });
            }.bind(this)
        });
    },
    _getDefaultContent: function() {
        $.ajax({
            url: url.defaultContentURL,
            success: function(data) {
                this.setState({
                    isDefault: true,
                    resultList: CURRENT_ENV ==='dev'? data : JSON.parse(data)
                }, this._setScrollAreaHeight);
            }.bind(this)
        });
    },
    _getContentWithInputValue: function() {
        $.ajax({
            url: url.searchURL + (CURRENT_ENV ==='dev' ? '' : this.state.curKeyword),
            success: function(data) {
                this.setState({
                    isDefault: false,
                    resultList: CURRENT_ENV ==='dev'? data : JSON.parse(data)
                }, this._setScrollAreaHeight);
            }.bind(this)
        });
    },
    updateWithKeyword: function(keywordBeSelected) {
        this.setState({
            curKeyword: keywordBeSelected
        }, this._getContentWithInputValue);
    },
    getInitialState: function() {
        return {
                curKeyword: '',
                keywords: [],
                isDefault: true,
                resultList: []
        };
    },
    componentDidMount: function() {
       this._getKeywordsList();
       this._getDefaultContent();
    },
    updateWithSearchContent: function(e) {
        if (e.keyCode === 13 || e.type === 'blur') {
            this._getContentWithInputValue();
        } else {
            this.setState({
                curKeyword: e.target.value
            })
        }
    },
    deleteInputContent: function() {
        this.setState({
            curKeyword: ''
        }, this._getDefaultContent);
    },
    componentDidUpdate: function() {
        this._setScrollAreaHeight();
    },
    render: function() {
        return (
            <div className="search-view">
                <div className="top-area">
                    <TopBar curKeyword={this.state.curKeyword}
                        onSearchContentUpdated={this.updateWithSearchContent}
                        onDeleteContent={this.deleteInputContent}
                    />
                    <KeywordsBar
                        keywords={this.state.keywords}
                        onKeywordSelected={this.updateWithKeyword}
                    />
                </div>
                <div className="scroll-area">
                    {this.state.isDefault ? <p className="msg">大家都在看:</p> : null}
                    {this.state.resultList.length === 0 && !this.state.isDefault? <EmptyMsg /> : null}
                    <ResultList results={this.state.resultList}/>
                </div>
            </div>
        );
    }
});

ReactDOM.render(<SearchApp />, document.getElementById('search-app'));
