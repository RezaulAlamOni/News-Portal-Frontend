import React, { useState, useEffect } from "react";
import Select from "react-select";
import NewsItem from "./NewsItem";
import Image from "../Resource/Images/img.png";
import InfiniteScroll from "react-infinite-scroll-component";

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
        const url = `https://newsapi.org/v2/top-headlines/sources?apiKey=52b612bf193947bdb4e6024b89524a15`;
        let data = await fetch(url);
        let parsedData = await data.json();
        setSourcesList(parsedData.sources);
    };

    let resultNews = async () => {
        let sourcesParam = '';
        sourcesParam = source.map(s => s.value).join(',');
        let  url = `https://newsapi.org/v2/top-headlines?category=${category}&from=${date}&apiKey=52b612bf193947bdb4e6024b89524a15`;
        console.log(sourcesParam)
        if (sourcesParam !== '') {
            url = `https://newsapi.org/v2/everything?q=&from=&to=&sortBy=popularity&sources=${sourcesParam}&page=${page}&apiKey=52b612bf193947bdb4e6024b89524a15`;
        } else if (keyword !== '') {
            url = `https://newsapi.org/v2/everything?q=${keyword}&from=&to=&sortBy=popularity&page=${page}&apiKey=52b612bf193947bdb4e6024b89524a15`;
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
        // const url = `https://newsapi.org/v2/top-headlines?country=in&category=${category}&page=${page + 1}&apiKey=52b612bf193947bdb4e6024b89524a15`;
        let sourcesParam = '';
        sourcesParam = source.map(s => s.value).join(',');
        let  url = `https://newsapi.org/v2/top-headlines?category=${category}&from=${date}&apiKey=52b612bf193947bdb4e6024b89524a15`;
        console.log(sourcesParam)
        if (sourcesParam !== '') {
            url = `https://newsapi.org/v2/everything?q=&from=&to=&sortBy=popularity&sources=${sourcesParam}&page=${page}&apiKey=52b612bf193947bdb4e6024b89524a15`;
        } else if (keyword !== '') {
            url = `https://newsapi.org/v2/everything?q=${keyword}&from=${date}&to=&sortBy=popularity&page=${page}&apiKey=52b612bf193947bdb4e6024b89524a15`;
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
                            return (
                                <div className="col-md-4" key={element.url}>
                                    <NewsItem
                                        sourceName={element.source.name}
                                        title={element.title}
                                        desc={element.description}
                                        imageURL={element.urlToImage ? element.urlToImage : Image}
                                        newsUrl={element.url}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </InfiniteScroll>
        </>
    );
}

export default News;
