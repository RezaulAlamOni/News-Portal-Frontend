import React, { useRef } from "react";

import "../assets/css/header.css";

import Logo from "../assets/images/logo.png";
import Avatar from "../assets/images/avatar.jpg";

import { useDispatch } from "react-redux";
import { openSideBar } from "../library/store/sidebar";
import { Badge } from "primereact/badge";

import { Menu } from "primereact/menu";
import { OverlayPanel } from "primereact/overlaypanel";
import {Link, useNavigate} from "react-router-dom";
import {CheckToken, getAuthUser} from "../library/helper";

export default function NavBar1() {
    const history = useNavigate();
    const userMenuRef = useRef(null);
    const notificationRef = useRef(null);

    const dispatch = useDispatch();

    const authUser = getAuthUser();

    const userMenu = [
        {
            label: "Hi, "+ authUser?.name,
            items: [
                {
                    label: "Home",
                    icon: "pi pi-home",
                    command: (e) => {
                        history("/dashboard");
                    },
                },
                {
                    label: "Profile",
                    icon: "pi pi-user",
                    command: (e) => {
                        history("/user-profile");
                    },
                },
                {
                    label: "Logout",
                    icon: "pi pi-power-off",
                    command: (e) => {
                        localStorage.clear();
                        history("/login");
                    },
                },
            ],
        },
    ];

    const togglePanel = (e, ref) => {
        e.preventDefault();
        e.stopPropagation();

        document.querySelector(".emptyBoxForMenuClick").click();

        ref.current.toggle(e);
    };

    const not = [1, 2];

    const notificationPanelSetting = {
        "960px": "400px",
        "475px": "100vw",
    };

    return (
        <>
            <div className="header-box d-flex p-ai-center">
                <div>
                    <Link to={`/`}>
                        <img src={Logo} alt="Logo" className="img img-fluid logo" />
                    </Link>
                </div>
                <div className="ml-auto menu-items mr-0">
                    { CheckToken() ?
                    <ul className="nav-list d-flex p-ai-center flex-row-reverse">
                        <li>
                            <img
                                src={Avatar}
                                alt="user"
                                id="avatar"
                                className="avatar"
                                onClick={(e) => togglePanel(e, userMenuRef)}
                            />
                        </li>
                        <li style={{padding: '10px'}}>
                            <i
                                className="pi pi-bell p-overlay-badge"
                                onClick={(e) => togglePanel(e, notificationRef)}
                            >
                                <Badge value="0"></Badge>
                            </i>
                        </li>
                    </ul> :
                    <ul className="nav-list d-flex p-ai-center flex-row-reverse">
                        <li >
                            <Link className="nav-link" to={`/login`}>
                                Sign In
                            </Link>
                        </li>
                        <li>
                            <Link className="nav-link" to={`/register`}>
                                Sign Up
                            </Link>
                        </li>
                    </ul> }
                </div>
            </div>
            <Menu model={userMenu} popup ref={userMenuRef} id="user_pop_menu" />

            <OverlayPanel
                ref={notificationRef}
                breakpoints={notificationPanelSetting}
                style={{ width: "450px" }}
            >
                <div className="popup-notification">
                    <p className="title mb-1">
                        <b>Notifications</b>
                    </p>
                    <p className="sub-title font-light">You have 2 Unread messages</p>
                    <hr className="mb-0" />
                    {not.map((item, index) => (
                        <div key={index} className="d-flex message-container">
                            <div className="col-3 p-0">
                                <img src={Logo} alt="Logo" className="img img-fluid" />
                            </div>
                            <div className="col-9 message-box">
                                <p className="message">
                                    Your order is placed waiting for shipping
                                </p>
                                <p className="time d-flex p-ai-center mt-3">
                                    <i className="pi pi-clock mr-2" />4 Hours ago
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </OverlayPanel>
            <div className="emptyBoxForMenuClick"></div>
        </>
    );
}
