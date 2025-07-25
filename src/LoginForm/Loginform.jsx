import React, { use, useContext, useEffect, useState } from "react";
import { Form, Input, Button, Card, Space, Divider, message, Spin } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Loginform.css";
import { SpinningContext } from "../Contexts/SpinningContext";

// Login Form Component
const Loginform = (props) => {
    const { onSwitchToRegister, setuserLoggedIn } = props;
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        setSpinning(true);
        console.log("Login attempt with:", values);
        // Simulate API call
        try {
            console.log(process.env.REACT_APP_API_URL);
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/login`,
                values
            );
            console.log("Login response:", response);
            if (response.status === 200) {
                localStorage.setItem("auth-token", response.data.token);
                setuserLoggedIn(true);
                toast.success(response.data.message, {
                    position: "top-right",
                });

                navigate("/");

                return response;
            }
        } catch (error) {
            console.error("Error logging in:", error);

            // Check for known backend error
            if (error.response && error.response.data && error.response.data) {
                toast.error(error.response.data, {
                    position: "top-right",
                });
            } else {
                toast.error("An unexpected error occurred", {
                    position: "top-right",
                });
            }
        } finally {
            setLoading(false);
            setSpinning(false);
        }
    };

    return (
        <Card
            title={<span style={{ color: "white" }}>Login</span>}
            className="loginCardStyling"
        >
            <Form
                name="login"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: "Please input your email!" }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Email" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: "Please input your password!" }]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Log in
                    </Button>
                </Form.Item>
            </Form>

            <Divider plain style={{ color: "white", borderColor: "white" }}>
                Or
            </Divider>

            <div style={{ textAlign: "center" }}>
                <Button
                    type="link"
                    onClick={() => {
                        onSwitchToRegister(true);
                    }}
                >
                    Register now!
                </Button>
            </div>
        </Card>
    );
};

// Registration Form Component
const RegistrationForm = ({ onSwitchToLogin, onRegisterSuccess }) => {
    const [loading, setLoading] = useState(false);

    const onFinish = (values) => {
        setLoading(true);
        setSpinning(true);
        console.log("Registration attempt with:", values);
        setTimeout(() => {
            setLoading(false);
            setSpinning(false);
            message.success("Registration successful! Please verify your email.");
            onRegisterSuccess(values);
        }, 1000);
    };

    return (
        <Card
            title={<span style={{ color: "white" }}>Register</span>}
            className="loginCardStyling"
        >
            <Form name="register" onFinish={onFinish} layout="vertical">
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: "Please input your email!" },
                        { type: "email", message: "Please enter a valid email!" },
                    ]}
                >
                    <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: "Please input your password!" },
                        { min: 6, message: "Password must be at least 6 characters!" },
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    dependencies={["password"]}
                    rules={[
                        { required: true, message: "Please confirm your password!" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error("The two passwords do not match!")
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Confirm Password"
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Register
                    </Button>
                </Form.Item>
            </Form>

            <Divider plain style={{ color: "white", borderColor: "white" }}></Divider>

            <div style={{ textAlign: "center" }}>
                <Button
                    type="link"
                    onClick={() => {
                        onSwitchToLogin(true);
                    }}
                >
                    Already have an account? Login
                </Button>
            </div>
        </Card>
    );
};

// OTP Verification Component
const OTPVerificationForm = ({ email, handleResendOTP, setCurrentStep }) => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        setSpinning(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/verifyOtp`,
                { email, otp: values.otp }
            );
            toast.success("OTP verified successfully! Please login", {
                position: "top-right",
            });
            setCurrentStep("login");
            return response.data;
        } catch (error) {
            console.error("Error verifying OTP:", error);
            toast.error("Failed to verify OTP. Please try again!", {
                position: "top-right",
            });
        }
    };

    return (
        <Card
            title={<span style={{ color: "white" }}>Verify Your Email</span>}
            className="loginCardStyling"
        >
            <p style={{ textAlign: "center", marginBottom: 24 }}>
                We've sent a 6-digit code to {email}
            </p>

            <Form name="otpVerification" onFinish={onFinish} layout="vertical">
                <Form.Item
                    name="otp"
                    rules={[
                        { required: true, message: "Please input the verification code!" },
                        {
                            pattern: /^.{6}$/,
                            message: "Please enter a valid 6-character code!",
                        },
                    ]}
                >
                    <Input placeholder="Enter 6-digit code" maxLength={6} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Verify
                    </Button>
                </Form.Item>
            </Form>

            <div style={{ textAlign: "center", marginTop: 16 }}>
                <Button type="link" onClick={handleResendOTP}>
                    Resend Code
                </Button>
            </div>
        </Card>
    );
};

// Main component to handle authentication flow
export default function AuthForms(props) {
    const SpinninContext = useContext(SpinningContext);
    const { setuserLoggedIn } = props;
    const [currentStep, setCurrentStep] = useState("login"); // 'login', 'register', or 'verify'
    const [email, setEmail] = useState("");
    const [userDetails, setUserDetails] = useState({});
    const navigate = useNavigate();
    const { setSpinning } = SpinninContext;

    useEffect(() => {
        if (localStorage.getItem("auth-token")) {
            navigate("/");
        }
    }, []);

    const handleRegistrationSuccess = async (userDetails) => {
        setEmail(userDetails.email);
        setUserDetails(userDetails);

        const obj = { email, password: userDetails.password };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/sendmail`,
                obj,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                setCurrentStep("verify");
                toast.success("OTP sent successfully!", {
                    position: "top-right",
                });
                return response;
            }
        } catch (error) {
            console.error("Error fetching OTP:", error);
            toast.error("Failed to fetch OTP. Please try again!", {
                position: "top-right",
            });
        }
    };

    const handleResendOTP = async () => {
        try {
            const obj = { email, password: userDetails.password };
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/sendmail`,
                obj,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log(obj, "obj");
            if (response.data.status === 200) {
                toast.success("OTP sent successfully!", {
                    position: "top-right",
                });
            }
            return response.data;
        } catch (error) {
            console.error("Error fetching OTP:", error);
            toast.error("Failed to fetch OTP. Please try again!", {
                position: "top-right",
            });
        }
    };

    const switchToLogin = async (noCall = false) => {
        if (noCall) {
            setCurrentStep("login");
            return;
        }

        const obj = { email, password: userDetails.password };
        console.log(obj);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/login`,
                obj,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.status === 200) {
                localStorage.setItem("auth-token", response.data.token);
                toast.success(response.data.message, {
                    position: "top-right",
                });
                setCurrentStep("verify");
            }
        } catch (error) {
            console.log(error);
        }

        setCurrentStep("login");
    };

    const switchToRegister = async (noCall = false) => {
        if (noCall) {
            setCurrentStep("register");
            return;
        }
        const obj = { email, password: userDetails.password };
        console.log(obj);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/sendmail`,
                obj,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.data.status === 200) {
                setCurrentStep("verify");
            }
        } catch (error) {
            console.log(error);
        }

        setCurrentStep("register");
    };

    return (
        <div
            style={{
                position: "absolute",
                top: "45%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "400px",
            }}
        >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                {currentStep === "login" && (
                    <Loginform onSwitchToRegister={switchToRegister} setuserLoggedIn={setuserLoggedIn} setSpinning={setSpinning} />
                )}

                {currentStep === "register" && (
                    <RegistrationForm
                        onSwitchToLogin={switchToLogin}
                        onRegisterSuccess={handleRegistrationSuccess}
                        setSpinning={setSpinning}
                    />
                )}

                {currentStep === "verify" && (
                    <OTPVerificationForm
                        setCurrentStep={setCurrentStep}
                        email={email}
                        handleResendOTP={handleResendOTP}
                        setSpinning={setSpinning}
                    />
                )}
            </Space>
        </div>
    );
}
