import React, {useEffect} from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { InputMask } from "primereact/inputmask";
import { classNames } from "primereact/utils";
import "../assets/css/login.css";

import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import {Link, useNavigate} from "react-router-dom";
import {postMethod, registrationMethod} from "../library/api";
import {baseUrl, signUpUrl} from "../library/constant";
import axios from "axios";
import {CheckToken} from "../library/helper";

export default function RegisterPage() {
  const navigate = useNavigate();

  const LoginSchema = Yup.object().shape({
    name: Yup.string().required("name is required"),
    location: Yup.string(),
    email: Yup.string().required("email is required"),
    phone: Yup.string(),
    deviceID: Yup.string(),
    password: Yup.string().required("password is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      deviceID: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (data) => {
      console.log(data);
      // call registration method
      registration(data);
    },
  });


  useEffect(() => {
    if (CheckToken()) {
      navigate("/");
    }
  }, []);

  const registration = async (data) =>{
    try {
      axios
          .post(baseUrl + signUpUrl, {
            headers: {
              "Content-Type": "application/json",
            },
            email: data?.email,
            password: data?.password,
            name: data?.name,
          })
          .then(function (response) {
            localStorage.setItem("token", response?.data?.token);
            localStorage.setItem("user", JSON.stringify(response?.data?.user));
            navigate("/");
            formik.setSubmitting(false);
            return response?.data;
          })
          .catch(function (error) {
            formik.setSubmitting(false);
            console.log(error);
            formik.setErrors(error?.response?.data);
            return error;
          });
    } catch (error) {
      formik.setSubmitting(false);
      console.log(error);
      return error;
    }
  }


  const { errors, touched, isSubmitting, handleSubmit } = formik;

  return (
    <div className="form-box">
      <div className="fullHeight p-ai-center p-d-flex p-jc-center">
        <div className="shadow card px-3 py-4 px-sm-4 py-sm-5">
          <h4 className="text-center">Sign Up to App</h4>
          <p className="text-center mb-3">Enter your details below.</p>
          <FormikProvider value={formik}>
            <Form onSubmit={handleSubmit} className="p-fluid">
              <div className="p-field">
                <span className="p-float-label">
                  <InputText
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    className={classNames({
                      "p-invalid": Boolean(touched.name && errors.name),
                    })}
                  />
                  <label
                    htmlFor="name"
                    className={classNames({
                      "p-error": Boolean(touched.name && errors.name),
                    })}
                  >
                    Name*
                  </label>
                </span>
                {Boolean(touched.name && errors.name) && (
                  <small className="p-error">{formik.errors["name"]}</small>
                )}
              </div>

              <div className="p-field">
                <span className="p-float-label">
                  <InputText
                      id="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      className={classNames({
                        "p-invalid": Boolean(touched.email && errors.email),
                      })}
                  />
                  <label
                      htmlFor="name"
                      className={classNames({
                        "p-error": Boolean(touched.email && errors.email),
                      })}
                  >
                    Email*
                  </label>
                </span>
                {Boolean(touched.email && errors.email) && (
                    <small className="p-error">{formik.errors["email"]}</small>
                )}
              </div>

              <div className="p-field">
                <span className="p-float-label">
                  <Password
                    id="password"
                    name="password"
                    toggleMask
                    feedback={false}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    className={classNames({
                      "p-invalid": Boolean(touched.password && errors.password),
                    })}
                  />
                  <label
                    htmlFor="password"
                    className={classNames({
                      "p-error": Boolean(touched.password && errors.password),
                    })}
                  >
                    Password*
                  </label>
                </span>
                {Boolean(touched.password && errors.password) && (
                  <small className="p-error">{formik.errors["password"]}</small>
                )}
              </div>

              <div className="p-field hidden">
                <span className="p-float-label">
                  <InputMask
                    id="phone"
                    name="phone"
                    mask="(999) 999-9999"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    className={classNames({
                      "p-invalid": Boolean(touched.phone && errors.phone),
                    })}
                  />
                  <label
                    htmlFor="phone"
                    className={classNames({
                      "p-error": Boolean(touched.phone && errors.phone),
                    })}
                  >
                    Phone
                  </label>
                </span>
                {Boolean(touched.phone && errors.phone) && (
                  <small className="p-error">{formik.errors["phone"]}</small>
                )}
              </div>

              <div className="submitBtnBox">
                <Button
                  type="submit"
                  label="Register"
                  iconPos="right"
                  loading={isSubmitting}
                  className="mt-4 submitBtn"
                  disabled={isSubmitting}
                />
              </div>

              <div className="signupBox mt-3 text-center">
                Already have an account? <Link to="/login">Log In</Link>
              </div>
              
            </Form>
          </FormikProvider>
        </div>
      </div>
    </div>
  );
}
