import '../css/style.css';
import '../css/swiper.css';

// basic global variables for the whole app
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Swiper from 'swiper';


const CURRENT_ENV = 'dev';

// got the windowHegith at the very beginning in order to prevent the visual keyboard impact this value
const windowHeight = $(window).height();


const url = CURRENT_ENV === 'dev' ? {
                keywordsURL: '../../data/keywords.json',
                defaultContentURL: '../../data/defaultresults.json',
                searchURL: '../../data/keywordresults.json'
            } : {
                keywordsURL: 'search/keyword',
                defaultContentURL: 'search/search?word=""',
                searchURL: 'search/search?word='
            }


const TopBar = ({curKeyword, onDeleteContent, onSearchContentUpdated}) => (
    <div className="top-bar">
        <div className="search-icon"></div>
        <SearchBar value={curKeyword} searchContentUpdate={onSearchContentUpdated}/>
        <span className="delete-btn" onClick={onDeleteContent}></span>
    </div>
);


const SearchBar = ({value, searchContentUpdate}) => (
    <input type="text" placeholder="请输入你想搜索的内容" className="search-bar" value={value}
        onChange={searchContentUpdate}
        onKeyDown={searchContentUpdate}
        onBlur={searchContentUpdate}
    />
);

class KeywordsBar extends React.Component {
    _initSwiper() {
        new Swiper(ReactDOM.findDOMNode(this), {
            slidesPerView: 'auto',
            grabCursor: true,
            slideElement: 'li',
            watchSlidesVisibility: true
        })
    }

    keywordClicked(i) {
        this.props.onKeywordSelected(i.name);
    }

    componentDidUpdate() {
        this._initSwiper();
    }

    render() {
        var thisComponent = this;

        return (
            <div className="swiper-container keywords-bar">
                <ul className="swiper-wrapper">
                    {this.props.keywords.map(function(keyword, index) {
                        return <li
                                className="swiper-slide"
                                key={index}
                                onClick={thisComponent.keywordClicked.bind(thisComponent, keyword)}
                               >
                                {keyword.name}
                            </li>
                    })}
                </ul>
            </div>
        );
    }
}


const ResultItem = ({contentUrl, thumbnail, content}) => (
    <li className="result-item" >
        <a href={contentUrl}>
            <img src={thumbnail} />
            <div className="flex-box">
                <div dangerouslySetInnerHTML={{__html: content}}></div>
            </div>
        </a>
    </li>
);



const ResultList = ({results}) => (
    <ul>
        {results.map(function(result, index) {
            return <ResultItem key={index} contentUrl={result.url} thumbnail={result.pic} content={result.title}/>
        })}
    </ul>
);

const EmptyMsg = () => (
    <div className="empty-result">
        <p>我们暂时还未发布相关内容哦，你可以将关键词</p>
        <p>发送给我们，我会督促小编尽快撰写~</p>
    </div>
);

class SearchApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                curKeyword: '',
                keywords: [],
                isDefault: true,
                resultList: []
        };
    }

    _setScrollAreaHeight() {
        var $scrollArea = $('.scroll-area');
        var wh = windowHeight;
        var th = $('.top-area').height();

        $scrollArea.css('height', wh - th + 'px');
        $scrollArea.scrollTop(0);
    }

    _getKeywordsList() {
        $.ajax({
            url: url.keywordsURL,
            success: function(data) {
                this.setState({
                    keywords: CURRENT_ENV ==='dev'? data : JSON.parse(data)
                });
            }.bind(this)
        });
    }

    _getDefaultContent() {
        $.ajax({
            url: url.defaultContentURL,
            success: function(data) {
                this.setState({
                    isDefault: true,
                    resultList: CURRENT_ENV ==='dev'? data : JSON.parse(data)
                }, this._setScrollAreaHeight);
            }.bind(this)
        });
    }

    _getContentWithInputValue() {
        $.ajax({
            url: url.searchURL + (CURRENT_ENV ==='dev' ? '' : this.state.curKeyword),
            success: function(data) {
                this.setState({
                    isDefault: false,
                    resultList: CURRENT_ENV ==='dev'? data : JSON.parse(data)
                }, this._setScrollAreaHeight);
            }.bind(this)
        });
    }

    updateWithKeyword(keywordBeSelected) {
        this.setState({
            curKeyword: keywordBeSelected
        }, this._getContentWithInputValue);
    }

    componentDidMount() {
       this._getKeywordsList();
       this._getDefaultContent();
    }

    updateWithSearchContent(e) {
        if (e.keyCode === 13 || e.type === 'blur') {
            this._getContentWithInputValue();
        } else {
            this.setState({
                curKeyword: e.target.value
            })
        }
    }

    deleteInputContent() {
        this.setState({
            curKeyword: ''
        }, this._getDefaultContent);
    }

    componentDidUpdate() {
        this._setScrollAreaHeight();
    }

    render() {
        return (
            <div className="search-view">
                <div className="top-area">
                    <TopBar curKeyword={this.state.curKeyword}
                        onSearchContentUpdated={this.updateWithSearchContent.bind(this)}
                        onDeleteContent={this.deleteInputContent.bind(this)}
                    />
                    <KeywordsBar
                        keywords={this.state.keywords}
                        onKeywordSelected={this.updateWithKeyword.bind(this)}
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
}

ReactDOM.render(<SearchApp />, document.getElementById('search-app'));
