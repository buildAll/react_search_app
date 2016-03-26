var React = require('react'),
    ReactDOM = require('react-dom'),
    $ = require('jquery');

var Swiper = require('swiper');

var TopBar = React.createClass({
    render: function() {
        return (
            <div className="top-bar">
                <SearchBar value={this.props.curKeyword}/>
                <span>取消</span>
            </div>
        );
    }
});

var SearchBar = React.createClass({
    getInitialState: function() {
        return {
            searchContent: ''
        }
    },
    render: function() {
        return (
            <input type="text" placeholder="请输入你想搜索的内容" className="search-bar" value={this.props.value}/>
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
    updateCurKeyWord: function(keywordBeSelected) {
        this.setState({
            isDefault: false,
            curKeyword: keywordBeSelected
        });
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

        $.ajax({
            url: 'data/keywords.json',
            dataType: 'json',
            success: function(data) {
                this.setState({
                    keywords: data
                });
            }.bind(this)
        });

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
    componentDidUpdate: function() {
        this._setScrollAreaHeight();
    },
    render: function() {
        return (
            <div className="search-view">
                <div className="top-area">
                    <TopBar curKeyword={this.state.curKeyword} />
                    <KeywordsBar keywords={this.state.keywords} onKeywordSelected={this.updateCurKeyWord}/>
                    {this.state.isDefault ? <p className="msg">大家都在看:</p> : null}
                </div>
                <ResultList results={this.state.resultList}/>
            </div>
        );
    }
});

ReactDOM.render(<SearchApp />, document.getElementById('search-app'));
