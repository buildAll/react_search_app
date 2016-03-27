var React = require('react'),
    ReactDOM = require('react-dom'),
    $ = require('jquery'),
    Swiper = require('swiper');

var TopBar = React.createClass({
    render: function() {
        return (
            <div className="top-bar">
                <SearchBar value={this.props.curKeyword} searchContentUpdate={this.props.onSearchContentUpdated}/>
                <span>取消</span>
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
                <img src={this.props.thumbnail} />
                <span>{this.props.content}</span>
            </li>
        );
    }
});

var ResultList = React.createClass({
   render: function() {
        return (
            <div className="scroll-area">
                <ul>
                    {this.props.results.map(function(result, index) {
                        return <ResultItem key={index} thumbnail={result.img} content={result.text}/>
                    })}
                </ul>
            </div>
        );
   }
});

var SearchApp = React.createClass({
    _setScrollAreaHeight: function() {
        var wh = $(window).height();
        var th = $('.top-area').height();

        $('.scroll-area').css('height', wh - th + 'px');
    },
    _getKeywordsList: function() {
        $.ajax({
            url: 'data/keywords.json',
            dataType: 'json',
            success: function(data) {
                this.setState({
                    keywords: data
                });
            }.bind(this)
        });
    },
    _getDefaultContent: function() {
        $.ajax({
            url: 'data/defaultresults.json',
            dataType: 'json',
            success: function(data) {
                this.setState({
                    resultList: data
                });
            }.bind(this)
        });
    },
    _getContentWithInputValue: function() {
        $.ajax({
            url: 'data/keywordresults.json',
            success: function(data) {
                this.setState({
                    isDefault: false,
                    resultList: data
                });
            }.bind(this)
        });
    },
    updateWithKeyword: function(keywordBeSelected) {
        this.setState({
            curKeyword: keywordBeSelected
        });
        this._getContentWithInputValue();
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
        this.setState({
            curKeyword: e.target.value
        })

        if (e.keyCode === 13) {
            this._getContentWithInputValue();
        }
    },
    componentDidUpdate: function() {
        this._setScrollAreaHeight();
    },
    render: function() {
        return (
            <div className="search-view">
                <div className="top-area">
                    <TopBar curKeyword={this.state.curKeyword} onSearchContentUpdated={this.updateWithSearchContent}/>
                    <KeywordsBar keywords={this.state.keywords} onKeywordSelected={this.updateWithKeyword}/>
                    {this.state.isDefault ? <p className="msg">大家都在看:</p> : null}
                </div>
                <ResultList results={this.state.resultList}/>
            </div>
        );
    }
});

ReactDOM.render(<SearchApp />, document.getElementById('search-app'));
