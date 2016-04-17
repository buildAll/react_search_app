// loading styles
import '../css/style.css'
import '../css/swiper.css'

// basic global variables for the whole app
import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'

// components
import TopBar from './components/TopBar'
import KeywordsBar from './components/KeywordsBar'
import ResultList from './components/ResultList'

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
