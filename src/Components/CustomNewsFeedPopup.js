import React, {useEffect, useState} from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import {getAuthUser, getCustomFeed, getToken} from "../library/helper";
import {baseUrl, saveCustomizedNewsfeedUrl} from "../library/constant";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const CustomNewsFeedModal = ({ show, handleClose, sourcesList, saveCustomFeed }) => {

    const user = getAuthUser();

    const [category, setCategory] = useState(user?.custom_newsfeed?.category || '');
    const [sources, setSources] = useState([]);
    const [author, setAuthor] = useState(user?.custom_newsfeed?.author || '');
    const [savedCustomFeed, setSavedCustomFeed] = useState(user?.custom_newsfeed || {});

    useEffect(() => {
        setSavedCustomFeed(user?.custom_newsfeed);
        // Transform initial sources from database format to Select component format
        const initialSources = JSON.parse(savedCustomFeed?.source || '[]').map(sourceId => {
            const source = sourcesList.find(s => s.id === sourceId);
            return source ? { value: source.id, label: source.name } : null;
        }).filter(source => source !== null);

        setSources(initialSources);
        setAuthor(savedCustomFeed?.author || '');
        setCategory(savedCustomFeed?.category || '');

    }, [sourcesList]);

    const handleSave = () => {
        const customFeed = {
            category,
            sources: sources.map(source => source.value),
            author,
        };
        saveCustomFeed(customFeed);
        // handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Setup Custom News Feed</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formCategory">
                        <Form.Label>Category</Form.Label>
                        <Form.Control as="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="">Select Category</option>
                            <option value="general">General</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="technology">Technology</option>
                            <option value="sports">Sports</option>
                            <option value="business">Business</option>
                            <option value="health">Health</option>
                            <option value="science">Science</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formSources">
                        <Form.Label>Sources</Form.Label>
                        <Select
                            isMulti
                            name="sources"
                            options={sourcesList.map(source => ({ value: source.id, label: source.name }))}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            value={sources}
                            onChange={setSources}
                        />
                    </Form.Group>
                    <Form.Group controlId="formAuthor">
                        <Form.Label>Author</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter author"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CustomNewsFeedModal;
