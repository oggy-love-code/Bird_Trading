import { useState } from "react";
import { Logo } from "../components";
import Wrapper from "../assets/wrappers/RegisterPage";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(null);
  const [url2, setUrl2] = useState(null);
  const [address, setAddress] = useState("");
  const [imageUrls, setImageUrls] = useState("");
  const [name, setName] = useState("");
  const [emailStore, setEmailStore] = useState("");
  const [imageStore, setImageStore] = useState("");
  const [imageUrlStore, setImageUrlStore] = useState("");
  const [addressStore, setAddressStore] = useState("");
  const [phoneStore, setPhoneStore] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setUrl(imageUrl);
    }
    console.log("handleImage", url);
  };

  const handleChangeImgStore = (e) => {
    if (e.target.files[0]) {
      setImageStore(e.target.files[0]);
      setUrl2(URL.createObjectURL(e.target.files[0]));
      console.log(url2);
    }
  };

  const uploadImage = () => {
    const imageRef = ref(storage, `images/${image.name}`);
    const imageRefStore = ref(storage, `images/${imageStore.name}`);
    uploadBytes(imageRef, image).then((res) => {
      getDownloadURL(res.ref).then((url) => {
        setImageUrls(url);
      });
    });
    uploadBytes(imageRefStore, imageStore).then((res) => {
      getDownloadURL(res.ref).then((url) => {
        setImageUrlStore(url);
      });
    });
  };

  const onRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !userName || !phone || !imageUrls) {
      toast.error("Please fill out all fields");
      return;
    }
    const result = await axios.post(
      "https://birdtrading-api.azurewebsites.net/api/Staffs",
      {
        email: email,
        password: password,
        userName: userName,
        fullName: fullName,
        phone: phone,
        imageUrls: imageUrls,
        address: address,
        storeCreate: {
          name: name,
          email: emailStore,
          image: imageUrlStore,
          address: addressStore,
          phone: phoneStore,
        },
      }
    );
    console.log(result);
    if (result.data !== null) {
      navigate("/");
      toast("Register success", {
        icon: "👏",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  return (
    <Wrapper className="full-page">
      <div className="forms-containers">
        <form className="login-form" onSubmit={onRegister}>
          <Logo />
          {/* userName field */}
          <label htmlFor="username" className="form-label">
            UserName
          </label>
          <input
            className="form-input"
            type="text"
            name="userName"
            required
            minLength={6}
            onChange={(e) => setUserName(e.target.value)}
          />
          {/* email field */}
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            className="form-input"
            type="email"
            name="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* password field */}
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            className="form-input"
            type="password"
            name="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* fullName field */}
          <label htmlFor="fullName" className="form-label">
            FullName
          </label>
          <input
            className="form-input"
            type="fullName"
            name="fullName"
            minLength={6}
            required
            onChange={(e) => setFullName(e.target.value)}
          />
          {/* phone field */}
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            className="form-input"
            type="text"
            name="phone"
            pattern="[0-9]*"
            required
            onChange={(e) => setPhone(e.target.value)}
          />
          {/* image field */}
          <label htmlFor="file" className="form-label">
            File
          </label>
          <input
            className="form-input"
            type="file"
            id="file-input"
            name="imageUrls"
            accept="images/*"
            required
            onChange={handleChange}
          />
          {/* fullName field */}
          <label htmlFor="address" className="form-label">
            address
          </label>
          <input
            className="form-input"
            type="text"
            name="address"
            minLength={10}
            onChange={(e) => setAddress(e.target.value)}
          />
          {/* StoreName field */}
          <label htmlFor="password" className="form-label">
            Name Store
          </label>
          <input
            className="form-input"
            type="text"
            name="Name"
            required
            minLength={6}
            onChange={(e) => setName(e.target.value)}
          />
          {/* Email field */}
          <label htmlFor="password" className="form-label">
            Email Store
          </label>
          <input
            className="form-input"
            type="email"
            name="emailStore"
            onChange={(e) => setEmailStore(e.target.value)}
          />
          {/* Image field */}
          <label htmlFor="file" className="form-label">
            Image Store
          </label>
          <input
            className="form-input"
            type="file"
            id="file-inputStore"
            name="imageUrlsStore"
            accept="images/*"
            required
            onChange={handleChangeImgStore}
          />
          {/* Address field */}
          <label htmlFor="password" className="form-label">
            Address Store
          </label>
          <input
            className="form-input"
            type="text"
            name="addressStore"
            required
            onChange={(e) => setAddressStore(e.target.value)}
          />
          {/* Phone field */}
          <label htmlFor="password" className="form-label">
            Phone Store
          </label>
          <input
            className="form-input"
            type="text"
            name="phone"
            pattern="[0-9]*"
            onChange={(e) => setPhoneStore(e.target.value)}
          />
          <button type="submit" className="btn btn-block" onClick={uploadImage}>
            Register
          </button>
          <Link to="/login" className="btn btn-block">
            Login
          </Link>
        </form>
      </div>
    </Wrapper>
  );
}
export default Register;
