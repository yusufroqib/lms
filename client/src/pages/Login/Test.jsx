import axios from 'axios';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Test = ({user, setUser}) => {
    const navigate = useNavigate()
    const getUser = async () => {
		try {
			const url = `http://localhost:3000/auth/google/success`;
			const { data } = await axios.get(url, { withCredentials: true });
			setUser(data.user);
            navigate('/home')
			console.log(data)
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		getUser();
	}, []);

  return (
    <div>Test</div>
  )
}

export default Test