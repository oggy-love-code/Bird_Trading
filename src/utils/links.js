import { IoBarChartSharp } from 'react-icons/io5';
import { MdQueryStats } from 'react-icons/md';
import { FaWpforms } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';

const links = [
  { id: 1, text: 'View Chart', path: 'chart', icon: <IoBarChartSharp /> },
  { id: 2, text: 'Manager Order', path: 'order', icon: <MdQueryStats /> },
  { id: 3, text: 'Manager Product', path: 'product', icon: <FaWpforms /> },
  { id: 4, text: 'View Profile', path: 'profile', icon: <ImProfile /> },
];

export default links;
