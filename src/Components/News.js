import React, { useState, useEffect } from "react";
import Select from "react-select";
import NewsItem from "./NewsItem";
import Image from "../Resource/Images/img.png";
import InfiniteScroll from "react-infinite-scroll-component";
import {newApiKey} from "../library/constant";

function News(props) {
    let [articles, setArticles] = useState([]);
    let [totalResults, setTotalResults] = useState(0);
    let [page, setPage] = useState(1);
    let [category, setCategory] = useState("general");
    let [source, setSource] = useState([]);
    let [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    let [sourcesList, setSourcesList] = useState([]);
    const [keyword, setKeyword] = useState("");


    useEffect(() => {
        fetchSources();
    }, []);
//ecfaf9eaaa8d40a5b5d769210f5ee616
    let fetchSources = async () => {
        const url = `https://newsapi.org/v2/top-headlines/sources?apiKey=${newApiKey}`;
        let data = await fetch(url);
        let parsedData = await data.json();
        setSourcesList(parsedData.sources);
    };

    let resultNews = async () => {
        let sourcesParam = '';
        sourcesParam = source.map(s => s.value).join(',');
        let  url = `https://newsapi.org/v2/top-headlines?category=${category}&from=${date}&apiKey=${newApiKey}`;
        console.log(sourcesParam)
        if (sourcesParam !== '') {
            url = `https://newsapi.org/v2/top-headlines?sources==${sourcesParam}&page=${page}&apiKey=${newApiKey}`;
        } else if (keyword !== '') {
            url = `https://newsapi.org/v2/top-headlines?q=${keyword}&page=${page}&apiKey=${newApiKey}`;
        }

        let data = await fetch(url);
        let parsedData = await data.json();
        setArticles(parsedData?.articles ?? []);
        setTotalResults(parsedData?.totalResults ?? 0);
    };

    useEffect(() => {
        resultNews();
    }, [category, source, date,keyword]);

    let fetchData = async () => {
        let sourcesParam = '';
        sourcesParam = source.map(s => s.value).join(',');
        let  url = `https://newsapi.org/v2/top-headlines?category=${category}&from=${date}&apiKey=${newApiKey}`;
        console.log(sourcesParam)
        if (sourcesParam !== '') {
            url = `https://newsapi.org/v2/top-headlines?sources==${sourcesParam}&page=${page}&apiKey=${newApiKey}`;
        } else if (keyword !== '') {
            url = `https://newsapi.org/v2/top-headlines?q=${keyword}&page=${page}&apiKey=${newApiKey}`;
        }
        setPage(page + 1);
        let data = await fetch(url);
        let parsedData = await data.json();
        setArticles(articles.concat(parsedData.articles));
    };

    let handleSourceChange = (selectedOptions) => {
        setSource(selectedOptions);
    };

    return (
        <>
            <div className="container my-2">
                <div className="row mb-3">
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Keyword"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="date"
                            className="form-control"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-control"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            <option value="general">General</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="technology">Technology</option>
                            <option value="sports">Sports</option>
                            <option value="business">Business</option>
                            <option value="health">Health</option>
                            <option value="science">Science</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <Select
                            isMulti
                            name="sources"
                            options={sourcesList.map((source) => ({
                                value: source.id,
                                label: source.name
                            }))}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Select Source"
                            value={source}
                            onChange={handleSourceChange}
                        />
                    </div>
                </div>
            </div>

            <InfiniteScroll
                dataLength={articles.length}
                next={fetchData}
                hasMore={articles.length < totalResults}
                loader={<h4 className="text-center">Loading...</h4>}
                endMessage={
                    <p style={{ textAlign: "center" }}>
                        <b>Yay! You have seen it all</b>
                    </p>
                }
            >
                <div className="container">
                    <div className="row">
                        {articles.map((element) => {
                            if (element.title !== '[Removed]') {
                                return (
                                    <div className="col-md-4" key={element.url}>
                                        {/*<NewsItem*/}
                                        {/*    sourceName={element?.source?.name}*/}
                                        {/*    title={element?.title}*/}
                                        {/*    desc={element?.description}*/}
                                        {/*    imageURL={element.urlToImage ? element.urlToImage : Image}*/}
                                        {/*    newsUrl={element.url}*/}
                                        {/*/>*/}

                                        <div>
                                            <div className="card my-3">

                                                <img src={element.urlToImage ? element.urlToImage : Image}
                                                     className="card-img-top" alt="..." />
                                                <div className="card-body">
                                                    <h5 className="card-title">{element?.title}</h5>
                                                    <p className="w-100 fs-6
						text-body-secondary
						text-end">
                                                        - {element?.source?.name}
                                                    </p>
                                                    <p className="card-text">{element?.description}</p>
                                                    <a href={element.url}
                                                       target="_blank"
                                                       className="btn btn-primary btn-sm">
                                                        Read More...
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                        })}
                    </div>
                </div>
            </InfiniteScroll>
        </>
    );
}

export default News;
