import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { IntlProvider, FormattedNumber } from "react-intl";
import axios from "axios";
import React from "react";
import ReactStars from "react-rating-stars-component";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAllProducts, getProductDetail } from "../../api/index";
import {
  FaImage,
  FaMoneyBill,
  FaDropbox,
  FaGrinStars,
  FaInfo,
  FaEdit,
  FaTrash,
  FaCartPlus,
} from "react-icons/fa";
import {
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination,
} from "@mui/material";
import { Typography } from "@mui/material";

const Product = () => {
  const [refresh, setRefresh] = useState(0);
  const [posts, setPosts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [url, setUrl] = useState(null);
  const [imageUrls, setImageUrls] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [image, setImage] = useState("");
  const [desc, setDesc] = useState("");
  const [rate, setRate] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [status, setStatus] = useState(0);
  const [categoryId, setCategoryId] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openUpdate, setUpdate] = React.useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const paginatedProducts = posts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const times = [
    { id: 1, name: "Bird" },
    { id: 2, name: "Food" },
    { id: 3, name: "Accessory" },
  ];

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

  const onAdd = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("profile"));
    const accessToken = user.token;
    const header = `Bearer ${accessToken}`;

    uploadImage();
    const result = await axios.post(
      `https://birdtrading-api.azurewebsites.net/api/Products/staff/${user.id}`,
      {
        categoryId: categoryId,
        name: name,
        price: price,
        salePrice: salePrice,
        quantity: quantity,
        image: imageUrls,
        desc: desc,
      },
      {
        headers: {
          Authorization: header,
        },
      }
    );
    if (result.data !== null) {
      setOpenAdd(false);
      toast.success("Add product successfully");
    }
    console.log(result.data);
    setRefresh(refresh + 1);
  };

  const handleUpdate = async (id) => {
    var updatedImageUrl = "";
    if (image instanceof File) {
      updatedImageUrl = await uploadImage();
    } else {
      updatedImageUrl = image;
    }
    console.log(updatedImageUrl);
    const user = JSON.parse(localStorage.getItem("profile"));
    const accessToken = user.token;
    const header = `Bearer ${accessToken}`;
    try {
      const res = await axios.put(
        `https://birdtrading-api.azurewebsites.net/api/Products/${id}`,
        {
          categoryId: categoryId,
          name: name,
          price: price,
          salePrice: salePrice,
          quantity: quantity,
          image: updatedImageUrl,
          desc: desc,
        },
        {
          headers: {
            Authorization: header,
          },
        }
      );
      setRefresh(refresh + 1);
      toast.success("Update Product Success");
      setOpen(false);
      return res.data.data;
    } catch (err) {
      toast.error("Please check data input!!");
      console.log(err);
    }
  };

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("profile"));

    const fetchPosts = async () => {
      if (profile && profile.id) {
        const products = await getAllProducts(profile);
        setPosts(products);
      }
    };
    fetchPosts();
  }, [refresh]);

  const handleDetail = async (id) => {
    getProductDetail(id)
      .then((product) => {
        setSelectedProduct(product);
        setCategoryId(product.categoryId);
        setName(product.name);
        setPrice(product.price);
        setSalePrice(product.salePrice);
        setQuantity(product.quantity);
        setDesc(product.desc);
        setImage(product.image);
        setRate(product.rate);
        setStatus(product.status);
        setIsEditMode(true);
        setOpen(true);
        setUrl(product.image);
        console.log(product);
      })
      .catch((err) => {
        toast.error("Some thing error !!");
        console.log(err);
      });
  };

  const handleDelete = async (id) => {
    const user = JSON.parse(localStorage.getItem("profile"));
    const accessToken = user.token;
    const header = `Bearer ${accessToken}`;
    const shouldDelete = window.confirm("Are you sure you want to delete?");
    if (shouldDelete) {
      try {
        await axios.delete(
          `https://birdtrading-api.azurewebsites.net/api/Products/${id}`,
          {
            headers: {
              Authorization: header,
            },
          }
        );
        console.log("DELETED RECORD", id);
        toast.success("Delete Success");
      } catch (err) {
        console.log(err);
      }
      setRefresh(refresh + 1);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setOpenAdd(false);
    setUpdate(false);
  };

  const handleOpenAddProduct = (e) => {
    e.preventDefault();
    setOpenAdd(true);
  };

  return (
    <IntlProvider locale="en">
      <Wrapper>
        <form className="form">
          <div className="container">
            <button
              className="btn btn-primary mb-4"
              onClick={handleOpenAddProduct}
            >
              <FaCartPlus /> New
            </button>
            <table className="table">
              <tbody>
                <tr className="table-header image-header">
                  <th>
                    <FaInfo className="image-icon" /> Name
                  </th>
                  <th>
                    <FaImage className="image-icon" />
                    Image
                  </th>
                  <th>
                    <FaMoneyBill className="image-icon" />
                    Price
                  </th>
                  <th>
                    <FaMoneyBill className="image-icon" />
                    Sale Price
                  </th>
                  <th>
                    <FaDropbox className="image-icon" />
                    Quantity
                  </th>
                  <th>
                    <FaGrinStars className="image-icon" />
                    Rate
                  </th>
                  <th></th>
                </tr>
                {paginatedProducts &&
                  paginatedProducts.length > 0 &&
                  paginatedProducts.map((post) => (
                    <tr key={post.id}>
                      <td>{post.name}</td>
                      <td className="image-cell">
                        <img
                          src={post.image}
                          style={{ width: "100px", height: "auto" }}
                          alt=""
                          className="image-hover"
                        ></img>
                      </td>
                      <td>
                        <FormattedNumber
                          value={post.price}
                          displayType={"text"}
                          thousandSeparator={true}
                          currency="VND"
                          minimumFractionDigits={0}
                        />
                        VND
                      </td>
                      <td>
                        <FormattedNumber
                          value={post.salePrice}
                          displayType={"text"}
                          thousandSeparator={true}
                          currency="VND"
                          minimumFractionDigits={0}
                        />
                        VND
                      </td>
                      <td>{post.quantity}</td>
                      <td>
                        <ReactStars
                          count={5}
                          size={15}
                          value={post.rate}
                          edit={false}
                          isHalf={true}
                          emptyIcon={<i className="far fa-star"></i>}
                          halfIcon={<i className="fa fa-star-half-alt"></i>}
                          fullIcon={<i className="fa fa-star"></i>}
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={() => handleDetail(post.id)}
                        >
                          <FaEdit className="edit-icon" />
                        </button>
                        <button
                          className="btn btn-danger"
                          type="button"
                          onClick={() => handleDelete(post.id)}
                        >
                          <FaTrash className="edit-icon" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </form>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={Math.ceil(posts.length / itemsPerPage)}
            page={currentPage}
            onChange={handleChangePage}
          />
        </div>
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>Detail of Product</DialogTitle>
          <DialogContent>
            {selectedProduct ? (
              <form className="product-form">
                <div className="product-details">
                  <div className="left-details">
                    <div className="form-field">
                      <Typography style={{ fontWeight: "bold", width: "25%" }}>
                        CategoryId:
                      </Typography>
                      <Select
                        id="demo-simple-select"
                        label="CategoryId"
                        name="CategoryId"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                      >
                        {times.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                    <div className="form-field">
                      <Typography style={{ fontWeight: "bold", width: "25%" }}>
                        Name:
                      </Typography>
                      <TextField
                        style={{ flex: 1 }}
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        disabled={!isEditMode}
                        required
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <Typography
                        style={{ fontWeight: "bold", width: "25%" }}
                        htmlFor="price"
                      >
                        Price:
                      </Typography>
                      <TextField
                        style={{ flex: 1 }}
                        type="number"
                        id="price"
                        name="price"
                        value={price}
                        disabled={!isEditMode}
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                        className="text-field"
                      />
                    </div>
                    <div className="form-field">
                      <Typography
                        style={{ fontWeight: "bold", width: "25%" }}
                        htmlFor="salePrice"
                      >
                        Sale Price:
                      </Typography>
                      <TextField
                        style={{ flex: 1 }}
                        type="number"
                        id="salePrice"
                        name="salePrice"
                        value={salePrice ?? 0}
                        inputProps={{ min: 0 }}
                        disabled={!isEditMode}
                        onChange={(e) => setSalePrice(e.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <Typography
                        style={{ fontWeight: "bold", width: "25%" }}
                        htmlFor="quantity"
                      >
                        Quantity:
                      </Typography>
                      <TextField
                        style={{ flex: 1 }}
                        type="text"
                        id="quantity"
                        name="quantity"
                        value={quantity}
                        inputProps={{ min: 0 }}
                        disabled={!isEditMode}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>
                    {selectedProduct.desc && (
                      <div className="form-field">
                        <Typography
                          style={{ fontWeight: "bold", width: "25%" }}
                          htmlFor="desc"
                        >
                          Description:
                        </Typography>
                        <TextField
                          style={{ flex: 1 }}
                          type="text"
                          id="desc"
                          name="desc"
                          rows={3}
                          cols={50}
                          value={desc}
                          disabled={!isEditMode}
                          onChange={(e) => setDesc(e.target.value)}
                        />
                      </div>
                    )}
                    <div className="form-field">
                      <Typography
                        style={{ fontWeight: "bold", width: "25%" }}
                        htmlFor="image"
                      >
                        Image:
                      </Typography>
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <TextField
                          type="file"
                          accept="image/*"
                          disabled={!isEditMode}
                          onChange={handleChangeImg}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="right-details">
                    <div className="image-container">
                      {url ? (
                        <img
                          src={url}
                          alt={`${selectedProduct.name}`}
                          className="product-image"
                        />
                      ) : (
                        <img
                          src={selectedProduct.image}
                          alt={`${selectedProduct.name}`}
                          className="product-image"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div>No product selected.</div>
            )}
          </DialogContent>
          <DialogActions>
            {isEditMode ? (
              <>
                <Button onClick={() => handleUpdate(selectedProduct.id)}>
                  Submit
                </Button>
                <Button onClick={handleClose}>Close</Button>
              </>
            ) : (
              <Button onClick={handleClose}>Close</Button>
            )}
          </DialogActions>
        </Dialog>

        <Dialog open={openAdd} onClose={handleClose}>
          <DialogTitle>Add Product</DialogTitle>
          <DialogContent>
            <FormControl fullWidth color="success">
              <InputLabel id="demo-simple-select-label">CategoryId</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="CategoryId"
                name="CategoryId"
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {times.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Name"
              type="text"
              fullWidth
              margin="normal"
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              margin="normal"
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              inputProps={{ min: 0 }}
            />
            <TextField
              type="number"
              label="salePrice"
              fullWidth
              margin="normal"
              inputProps={{ min: 0 }}
              onChange={(e) => setSalePrice(parseFloat(e.target.value))}
            />
            <TextField
              type="number"
              label="quantity"
              fullWidth
              margin="normal"
              inputProps={{ min: 0 }}
              onChange={(e) => setQuantity(parseFloat(e.target.value))}
            />
            <TextField
              fullWidth
              type="file"
              name="filename"
              accept="images/*"
              margin="normal"
              onChange={handleChangeImg}
            />
            <TextField
              label="desc"
              fullWidth
              margin="normal"
              onChange={(e) => setDesc(e.target.value)}
            />

            <Button variant="contained" onClick={onAdd}>
              Add
            </Button>
            <Button onClick={handleClose} variant="contained">
              Close
            </Button>
          </DialogContent>
        </Dialog>
      </Wrapper>
    </IntlProvider>
  );
};
export default Product;
