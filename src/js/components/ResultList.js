import React from 'react'

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


export default ResultList
