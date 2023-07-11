import StatItem from "./StatItem";
import { FaSuitcaseRolling, FaCalendarCheck, FaFirstOrder,FaHourglassStart  } from "react-icons/fa";
import Wrapper from "../assets/wrappers/StatsContainer";
import { useDispatch} from "react-redux";
import { useEffect , useState } from "react";
import axios from "axios";
import { setData } from "../../src/api/index";

const StatsContainer = () => {
  const [data, setData] = useState();
  const dispatch = useDispatch();
  console.log(data);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("profile"));
    const accessToken = user.token;
    const header = `Bearer ${accessToken}`;
    const fetchData = async () => {
      try{
        const res = await axios.get(
          `https://birdtrading-api.azurewebsites.net/api/Charts/statictical/${user.id}`,
          {
            headers: {
              Authorization: header,
            },
          }
        );
        const data = res.data.data;
        dispatch(setData(data));
        
      }catch(err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);


  const defaultStats = [
    {
      title: "orderNumber",
      count: data?.orderNumber  || 0,
      icon: <FaSuitcaseRolling />,
      color: "#66FF66",
      bcg: "#CCFF99",
    },
    {
      title: "feedbackNumbers",
      count: data?.feedbackNumber  || 0,
      icon: <FaCalendarCheck />,
      color: "#6699FF",
      bcg: "#e0e8f9",
    },
    {
      title: "totalRate",
      count: `${data?.totalRate.toFixed(2)}%` || "0%",
      icon: <FaFirstOrder />,
      color: "#e9b949",
      bcg: "#ffeeee",
      isFloat: true,
    },
  ];

  return (
    <Wrapper>
      {defaultStats.map((item, index) => {
        return <StatItem key={index} {...item} />;
      })}
    </Wrapper>
  );
};
export default StatsContainer;
