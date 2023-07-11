import { useState } from 'react';
import { Logo } from '../components';
import Wrapper from '../assets/wrappers/RegisterPage';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { storage  }  from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import axios from 'axios';



function CreateProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState(null);
  const [desc, setDesc] = useState('');

  const [url, setUrl] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  const imagesListRef = ref(storage, 'images/');

  const handleChange = (e) => {
    if(e.target.files[0]){
      setImage(e.target.files[0]);
      setUrl(URL.createObjectURL(e.target.files[0]));
    }
  }

  const uploadImage = () => {
    if(image == null) return;
    const imageRef = ref(storage, `images/${image.name}`);
    uploadBytes(imageRef, image).then(async () => {
       const ref = await getDownloadURL(imageRef);
       console.log(ref);
       setImage(ref);
    });
  };

  // useEffect(() => {
  //   listAll(imagesListRef).then((response) => {
  //     response.items.forEach((item) => {
  //       getDownloadURL(item).then((url) => {
  //         setImageUrls((prev) => [...prev, url]);
  //       });
  //     });
  //   });
  // }, []);
  
  const onRegister = async (e) => {
    e.preventDefault();
    if (!name || !price || !quantity || !desc) {
      toast.error('Please fill out all fields');
      return;
    }
    const profile = JSON.parse(localStorage.getItem("profile"));
    const accessToken = localStorage.getItem("token");
    const header = `Bearer ${accessToken}`;
    console.log(name, price, salePrice, quantity, image, desc, profile.id, header);
    const result = await axios.post(`https://birdtrading-api.azurewebsites.net/api/Products/staff/${profile.id}`, {
      name: name,
      price: price,
      salePrice: salePrice,
      quantity: quantity,
      image: image,
      desc: desc
    });

    console.log(result);
    if(result.data !== null){
      navigate('/');
      toast.success('Create Product Success');
    }
  };

  return (
    <Wrapper>
      <form className='form'>
        <h3>Create Product</h3>
        <div className='form-center'>
          <input
            className='form-input'
            type='text'
            name='name'
            onChange={(e) => setName(e.target.value)}  
          />
          <input
            className='form-input'
            type='number'
            labelText='last name'
            name='price'
            onChange={(e) => setPrice(e.target.value)}  
          />
          <input
            className='form-input'
            type='number'
            name='salePrice'
            onChange={(e) => setSalePrice(e.target.value)}  
          />
          <input
            className='form-input'
            type='number'
            name='quantity'
            onChange={(e) => setQuantity(e.target.value)}  
          />
          <input
            className='form-input'
            type='file'
            id="file-input"
            name='images'
            accept="images/*"
            required
            onChange={(e) => setImage(e.target.value)}  
          />
          <input
            className='form-input'
            type='text'
            name='description'
            onChange={(e) => setDesc(e.target.value)}  
          />
          <button type='submit' className='btn btn-block' >
            Submit
          </button>
        </div>
      </form>
    </Wrapper>
  );
}
export default CreateProduct;
