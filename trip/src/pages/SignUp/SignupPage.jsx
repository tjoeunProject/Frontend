import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../Login/axiosConfig.js";

import Header from "../../components/common/Header.jsx";
import Footer from "../../components/common/Footer.jsx";
import SignupComponent from "./SignupComponent.jsx";

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    nickname: '',
    birthdate: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData(prev => ({ ...prev, [id]: value }));

    if (id === 'password') {
      setIsPasswordValid(value.length >= 8);
    }

    if (id === 'password' || id === 'confirmPassword') {
      const p1 = id === 'password' ? value : formData.password;
      const p2 = id === 'confirmPassword' ? value : formData.confirmPassword;

      if (p1 && p2) {
        setPasswordMatch(p1 === p2);
      } else {
        setPasswordMatch(true);
      }
    }
  };

  const isFormValid = formData.password && formData.confirmPassword && passwordMatch && isPasswordValid;

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    try {
      const response = await axios.post("/auth/register", {
        email: formData.email,
        username: formData.nickname,
        password: formData.password,
        gender: formData.gender,
        birthdate: formData.birthdate
      });

      alert("회원가입 성공!");
      navigate("/login");

    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <Header />
      <SignupComponent
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSignup}
        passwordMatch={passwordMatch}
        isPasswordValid={isPasswordValid}
      />
      <Footer />
    </div>
  );
};

export default SignupPage;
