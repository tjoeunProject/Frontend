import { useState, useEffect } from 'react';
import api from '../../api/travelApi'; // API 서비스 모듈

export const useTravelListViewModel = () => {
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTravels = async () => {
    setLoading(true);
    try {
      // **핵심: API 요청 로직이 ViewModel에 있습니다.**
      const data = await api.getTravelList(); 
      setTravels(data);
    } catch (error) {
      console.error("여행 목록 조회 실패", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTravels();
  }, []);

  return {
    travels,
    loading,
    fetchTravels,
  };
};

