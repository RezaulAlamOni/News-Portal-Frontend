import React, {useState, useEffect} from "react";
import Select from "react-select";
import NewsItem from "./NewsItem";
import Image from "../Resource/Images/img.png";
import InfiniteScroll from "react-infinite-scroll-component";
import {baseUrl, newApiKey, saveCustomizedNewsfeedUrl, signUpUrl, worldNewsApiKey} from "../library/constant";
import CustomNewsFeedModal from './CustomNewsFeedPopup';  // Import the modal component
import axios from 'axios';
import {getAuthUser, getToken} from "../library/helper";
import {useNavigate} from "react-router-dom";
import {array} from "yup";  // For making API calls

function News(props) {
    const authUser = getAuthUser();
    let [articles, setArticles] = useState([]);
    let [totalResults, setTotalResults] = useState(0);
    let [page, setPage] = useState(1);
    let [category, setCategory] = useState("general");
    let [source, setSource] = useState([]);
    let [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    let [sourcesList, setSourcesList] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [search_type, setSearchType] = useState("category");

    useEffect(() => {
            fetchSources();
    }, []);

    let fetchSources = async () => {
        const url = `https://newsapi.org/v2/top-headlines/sources?apiKey=${newApiKey}`;
        axios.get(url)
            .then((response) => {
                let data = response.data;
                setSourcesList(data.sources ?? []);
                setTimeout(() => {
                    console.log(authUser?.custom_newsfeed?.source)
                    data = data.sources;
                    const initialSources = JSON.parse(authUser?.custom_newsfeed?.source || '[]').map(sourceId => {
                        const source = data.find(s => s.id === sourceId);
                        return source ? {value: source.id, label: source.name} : null;
                    }).filter(source => source !== null);
                    setSource(initialSources);
                    setCategory(authUser?.custom_newsfeed?.category || '');
                    setSearchType('source');
                }, 100);
            })
            .catch((error) => {
                console.error('Error fetching sources:', error);
            })
    };

    let resultNews = async () => {
        let url = urlGenerator();

        let data = await fetch(url);
        let parsedData = await data.json();
        setArticles(parsedData?.articles ?? []);
        setTotalResults(parsedData?.totalResults ?? 0);
    };

    useEffect(() => {
        resultNews();
        fetchDataFormworldnewsapi();
    }, [category, source, date, keyword]);

    let handleKeyChange = (val) => {
        setSearchType(val); // Trigger searchType change to 'keyword'
    };

    let fetchData = async () => {
        let url = urlGenerator();
        setPage(page + 1);
        let data = await fetch(url);
        let parsedData = await data.json();
        setArticles(articles.concat(parsedData.articles));
    };

    let fetchDataFormworldnewsapi = async () => {
        let url = `https://api.worldnewsapi.com/top-news?api-key=${worldNewsApiKey}&text=tesla&source-country=us&language=en&headlines-only=false`;
        let data = await fetch(url);
        let parsedData = await data.json();
        console.log(parsedData)
        parsedData = parsedData?.top_news;
        let news = [];
        parsedData = parsedData.map((item) => {
            item = item?.news;
            item.map((item1) => {
                let data1 = {
                    title: item1?.title,
                    description: item1?.summary,
                    url: item1?.url,
                    urlToImage: item1?.image,
                    source: {
                        name: item1?.source
                    }
                }
                news.push(data1)
            })

        })
        if (articles.length <= 0) {
            setArticles(news);
        }
        // setTotalResults(parsedData);
    }


    const urlGenerator = () => {
        let sourcesParam = '';
        sourcesParam = source.map(s => s.value).join(',');
        let url = `https://newsapi.org/v2/top-headlines?apiKey=${newApiKey}`;
        if (search_type == 'source') {
            if (sourcesParam === '') {
                setSearchType('category');
                url += `&category=${category}&from=${date}`;
            } else {
                url += `&sources=${sourcesParam}&page=${page}`;
            }
        } else if (search_type === 'keyword') {
            if (keyword === '') {
                setSearchType('category');
                url += `&category=${category}&from=${date}`;
            } else {
                url += `&q=${keyword}&page=${page}`;
            }
        } else {
            url += `&category=${category}&from=${date}`;
        }
        return url;
    }

    let handleSourceChange = (selectedOptions) => {
        handleKeyChange('source');
        setSource(selectedOptions);
    };

    let saveCustomFeed = async (customFeed) => {
        // Replace this URL with your actual backend endpoint
        const url = baseUrl + saveCustomizedNewsfeedUrl;
        try {
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: url,
                headers: {
                    'Authorization': 'Bearer ' + getToken(),
                },
                data: customFeed
            };

            axios.request(config)
                .then((response) => {
                    console.log(response.data);
                    let data = response.data;
                    localStorage.removeItem('user');
                    localStorage.setItem('user', JSON.stringify(data.user));
                })
                .catch((error) => {
                    console.log(error.response.data);
                    if (error.response.status === 401) {
                        localStorage.clear();
                        navigate('/login');
                    }
                });

        } catch (error) {
            console.error('Error saving custom feed:', error);
        }
    };
    const navigate = useNavigate();
    let showModalCondition = () => {
        let auth = getToken();
        if (!auth) {
            navigate('/login');
        }
        setShowModal(true);
    }


    return (
        <>
            <div className="container my-2">
                <div className="row mb-3">
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Keyword"
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                handleKeyChange('keyword')
                            }}
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            type="date"
                            className="form-control"
                            value={date}
                            onChange={(e) => {
                                setDate(e.target.value);
                            }}
                        />
                    </div>
                    <div className="col-md-4">
                        <select
                            className="form-control"
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                handleKeyChange('category')
                            }}
                        >
                            {/*<option value="">Select Category</option>*/}
                            <option value="general">General</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="technology">Technology</option>
                            <option value="sports">Sports</option>
                            <option value="business">Business</option>
                            <option value="health">Health</option>
                            <option value="science">Science</option>
                        </select>
                    </div>
                    {/*<div className="col-md-3">*/}
                    {/*    {<Select*/}
                    {/*        isMulti*/}
                    {/*        name="sources"*/}
                    {/*        options={sourcesList?.map((source) => ({*/}
                    {/*            value: source.id,*/}
                    {/*            label: source.name*/}
                    {/*        }))}*/}
                    {/*        className="basic-multi-select"*/}
                    {/*        classNamePrefix="select"*/}
                    {/*        placeholder="Select Source"*/}
                    {/*        value={source}*/}
                    {/*        onChange={handleSourceChange}*/}
                    {/*    />}*/}
                    {/*</div>*/}
                </div>
                <div className="row">

                    <div className="col-md-9">
                        {<Select
                            isMulti
                            name="sources"
                            options={sourcesList?.map((source) => ({
                                value: source.id,
                                label: source.name
                            }))}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Select Source"
                            value={source}
                            onChange={handleSourceChange}
                        />}
                    </div>
                    <div className="col-md-3 text-right">
                        <button className="btn btn-primary" onClick={showModalCondition}>
                            Customize News Feed
                        </button>
                    </div>

                </div>
            </div>

            <CustomNewsFeedModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                sourcesList={sourcesList}
                saveCustomFeed={saveCustomFeed}
            />

            <InfiniteScroll
                dataLength={articles.length}
                next={fetchData}
                hasMore={articles.length < totalResults}
                loader={<h4 className="text-center">Loading...</h4>}
                endMessage={
                    <p style={{textAlign: "center"}}>
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

                                        <NewsItem
                                            sourceName={element?.source?.name}
                                            title={element?.title}
                                            desc={element?.description}
                                            imageURL={element.urlToImage ? element.urlToImage : Image}
                                            newsUrl={element.url}
                                        />
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
