import Wrapper from "../../assets/wrappers/DashboardFormPage";
import React, { useRef } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Avatar, TextField, Grid, Typography, Button } from "@mui/material";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getStaffById } from "../../api";

const Profile = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(null);
  const [imageUrls, setImageUrls] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const user = JSON.parse(localStorage.getItem("profile"));
  const accessToken = user.token;
  const header = `Bearer ${accessToken}`;
  const handleUpdate = async (e) => {
    try {
      const res = await axios.put(
        `https://birdtrading-api.azurewebsites.net/api/Staffs/${selectedUser.id}`,
        {
          staffId: selectedUser.id,
          fullName: fullName,
          email: email,
          address: address,
          phone: phone,
          image: image,
        },
        {
          headers: {
            Authorization: header,
          },
        }
      );
      toast.success("Update Profile Success");
      return res.data.data;
    } catch (err) {
      toast.error("Please check data input!!");
      console.log(err);
    }
  };

  const fetchData = async () => {
    if (user && user.id) {
      const profile = await getStaffById(user.id);
      setSelectedUser(profile);
      setFullName(profile.fullName);
      setEmail(profile.email);
      setPhone(profile.phone);
      setImage(profile.image);
      setAddress(profile.address);
      console.log(profile);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangeImg = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setUrl(imageUrl);
    }
    console.log("handleImage", url);
  };

  const uploadImage = async () => {
    if (image == null) {
      toast.message("image is null choose again");
      return;
    }
    const imageRef = ref(storage, `images/${image.name}`);
    try {
      const res = await uploadBytes(imageRef, image);
      const downloadUrl = await getDownloadURL(res.ref);
      setImageUrls(downloadUrl);
      return downloadUrl;
    } catch (error) {
      console.log("Error uploading image:", error);
      return null;
    }
  };
  return (
    <Wrapper>
      <form className="form">
        <Grid container alignItems="center" spacing={2}>
        <Grid container alignItems="center" spacing={2}>
  <Grid container alignItems="center">
    <Grid item xs={1}>
      <Avatar
        className="avatar"
        alt="Image"
        src={image}
        onChange={handleChangeImg}
        sx={{
          marginLeft: "2rem",      // Adjust the margin value here
          border: "2px solid black",
          borderRadius: "50%",
        }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleChangeImg}
        style={{ display: "none" }}
      />
    </Grid>
    <Grid item xs={10}>
      <Typography
        variant="h4"
        component="h3"
        className="profile-heading"
      >
        Profile Staff
      </Typography>
    </Grid>
  </Grid>
</Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="fullName"
              name="fullName"
              label="Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="phone"
              name="phone"
              label="Phone"
              value={phone}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              id="address"
              name="address"
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              fullWidth
              multiline
            />
          </Grid>
          <Grid item xs={12} container justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              onClick={handleUpdate}
              sx={{
                width: "30%",
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            >
              Update
            </Button>
          </Grid>
        </Grid>
      </form>
    </Wrapper>
  );
};
export default Profile;
