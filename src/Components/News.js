import { React, useState, useEffect } from "react";
import NewsItem from "./NewsItem";
import Image from "../Resource/Images/img.png";
import InfiniteScroll from "react-infinite-scroll-component";

function News(props) {
    let [articles, setArticles] = useState([]);
    let [totalResults, setTotalResults] = useState(0);
    let [page, setPage] = useState(1);
    let [category, setCategory] = useState("");
    let [source, setSource] = useState("");
    let [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    let resultNews = async () => {
        let url = `https://newsapi.org/v2/everything?q=apple&from=${date}&to=${date}&sortBy=popularity&sources=${source}&page=${page}&apiKey=ecfaf9eaaa8d40a5b5d769210f5ee616`;

        if (category !== "" || date !== "") {
            url = `https://newsapi.org/v2/top-headlines?country=in&category=${category}&from=${date}&apiKey=ecfaf9eaaa8d40a5b5d769210f5ee616`;
        }
        let data = await fetch(url);
        let parsedData = await data.json();
        setArticles(parsedData?.articles ?? []);
        setTotalResults(parsedData?.totalResults ?? 0);
    };

    useEffect(() => {
        resultNews();
    }, [category, source, date]);

    let fetchData = async () => {
        const url = `https://newsapi.org/v2/top-headlines?country=in&category=${category}&page=${page + 1}&apiKey=ecfaf9eaaa8d40a5b5d769210f5ee616`;
        setPage(page + 1);
        let data = await fetch(url);
        let parsedData = await data.json();
        setArticles(articles.concat(parsedData.articles));
    };

    return (
        <>
            <div className="container my-2">
                <div className="row mb-3">
                    <div className="col-md-4">
                        <input
                            type="date"
                            className="form-control"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4">
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
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Source"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
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
