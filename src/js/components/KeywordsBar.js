import React from 'react'
import Swiper from 'swiper'
import ReactDOM from 'react-dom'

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


export default KeywordsBar
