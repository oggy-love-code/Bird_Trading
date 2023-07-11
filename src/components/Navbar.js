import Wrapper from '../assets/wrappers/Navbar';
import { FaAlignLeft, FaUserCircle, FaCaretDown } from 'react-icons/fa';
import Logo from './Logo';
import { useState  } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, clearStore } from '../features/user/userSlice';
import { useNavigate} from 'react-router-dom';
import { toast } from "react-toastify";

const Navbar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPrivate, SetIsPrivate] = useState(false);

  const profile = JSON.parse(localStorage.getItem("profile"));
  console.log(profile);

  const toggle = () => {
    dispatch(toggleSidebar());
  };

  const logout = () => {
    localStorage.removeItem('profile');
    localStorage.clear();
    setShowLogout(true);
    SetIsPrivate(false);
    navigate('/login');
    toast.success('Logout success');
  };

  return (
    <Wrapper>
      <div className='nav-center'>
        <button type='button' className='toggle-btn' onClick={toggle}>
          <FaAlignLeft />
        </button>
        <div>
          <Logo />
          <h3 
          className='logo-text'>Welcome ,{profile.fullName} !
          </h3>
        </div>
        <div className='btn-container'>
          <button
            type='button'
            className='btn'
            onClick={() => setShowLogout(!showLogout)}
          >
            <FaUserCircle />
            {user?.name}Info
            <FaCaretDown />
          </button>
          <div className={showLogout ? 'dropdown show-dropdown' : 'dropdown'}>
            <button
              type='button'
              className='dropdown-btn'
              onClick={() => dispatch(clearStore('Logging out...'))}
              onClickCapture={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
export default Navbar;
