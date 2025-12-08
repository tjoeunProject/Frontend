import { useState } from "react";
// CSS 경로 재수정

import Header from "../../components/common/Header.jsx";
import Footer from "../../components/common/Footer.jsx";
import SignupComponent from "./SignupComponent.jsx";

// 마찬가지로 컨트롤러로 뺄꺼임
const SignupPage = () => {
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
  
  // 비밀번호 일치 여부와 8자 이상 여부를 동시에 관리
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true); // 8자 이상 유효성 상태

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));

    let newPassword = formData.password;
    let newConfirmPassword = formData.confirmPassword;

    if (id === 'password') { // 비밀번호 8개 이상일 때 가능 
        newPassword = value;
        setIsPasswordValid(value.length >= 8); // 비밀번호 길이 검사
    } else if (id === 'confirmPassword') {
        newConfirmPassword = value;
    }

    // 비밀번호 일치 검사 (현재 입력된 값과 다른 쪽 값 비교)
    if (id === 'password' || id === 'confirmPassword') {
      const p1 = id === 'password' ? value : formData.password;
      const p2 = id === 'confirmPassword' ? value : formData.confirmPassword;
      // 두 필드 모두 값이 있을 때만 일치 여부 확인, 아니면 true (오류 메시지 숨김)
      if (p1 && p2) {
        setPasswordMatch(p1 === p2);
      } else {
        setPasswordMatch(true);
      }
    }
  };

  const isFormValid = formData.password && formData.confirmPassword && passwordMatch && isPasswordValid;

  const handleSignup = (e) => {
    e.preventDefault();

    if (!isFormValid) {
        console.error('오류: 입력 필드를 확인해 주세요 (비밀번호 불일치 또는 길이 부족).');
        return;
    }

    // 실제 회원가입 로직이 여기에 들어갑니다.
    console.log('회원가입 시도:', formData);
    console.log('회원가입 성공 (데모)');
  };

  return (
    <div >
      <Header/>
      <SignupComponent />
      <Footer/>
    </div>
  );
};

export default SignupPage;