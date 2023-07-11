import axios from "axios";
export const baseURL = "https://birdtrading-api.azurewebsites.net";

//Get ALL
export async function getAllProducts(profile) {
  const user = JSON.parse(localStorage.getItem("profile"));
  const accessToken = user.token;
  const header = `Bearer ${accessToken}`;
  try {
    const res = await axios.get(`${baseURL}/api/Products/staff/${profile.id}`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getStaffById(id) {
  const user = JSON.parse(localStorage.getItem("profile"));
  const accessToken = user.token;
  const header = `Bearer ${accessToken}`;
  try {
    const res = await axios.get(`${baseURL}/api/Staffs/${id}`, {
      headers: {
        Authorization: header,
      },
    });
    console.log(res);
    return res.data.data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

// Get Detail
export const getProductDetail = async (id) => {
  const user = JSON.parse(localStorage.getItem("profile"));
  const accessToken = user.token;
  const header = `Bearer ${accessToken}`;
  try {
    const res = await axios.get(`${baseURL}/api/Products/${id}`, {
      headers: {
        Authorization: header,
      },
    });
    console.log(res);
    return res.data.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const addProduct = async (profile, req, res) => {
  const accessToken = localStorage.getItem("token");
  const header = `Bearer ${accessToken}`;
  return await axios
    .post(`${baseURL}/api/Products/staff/${profile.id}`, req.values, {
      headers: {
        Authorization: header,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err.response.data;
    });
};

export const updateProduct = async (id) => {
  const user = JSON.parse(localStorage.getItem("profile"));
  const accessToken = user.token;
  const header = `${accessToken}`;
  console.log(header);
  try {
    const res = await axios.put(
      `https://birdtrading-api.azurewebsites.net/api/Products/${id}`,
      {
        headers: {
          Authorization: header,
        },
      }
    );

    console.log(res);
    return res.data.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const deleteProduct = async (id) => {
  const accessToken = localStorage.getItem("token");
  const header = `Bearer ${accessToken}`;
  try {
    return await axios
      .delete(`${baseURL}/api/Products/${id}`, {
        headers: {
          Authorization: header,
        },
      })
      .catch((err) => {
        return err.response.data;
      });
  } catch (err) {
    console.log(err);
    return null;
  }
};

/*API Store */

//Get Store By Id
export const getStoreId = async (id) => {
  const accessToken = localStorage.getItem("token");
  const header = `Bearer ${accessToken}`;
  try {
    const res = await axios.get(`${baseURL}/api/Stores/${id}`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

//API Order
//Get Order By Staff Id
export async function getAllOrdersByStaffId(id) {
  const user = JSON.parse(localStorage.getItem("profile"));
  const accessToken = user.token;
  const header = `Bearer ${accessToken}`;
  try {
    const res = await axios.get(`${baseURL}/api/Orders/staff/${id}`, {
      headers: {
        Authorization: header,
      },
    });
    console.log(JSON.stringify(res.data.data));
    return res.data.data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

//Get Order By Store Id
export async function getAllOrdersByStore(id) {
  const user = JSON.parse(localStorage.getItem("profile"));
  const accessToken = user.token;
  const header = `Bearer ${accessToken}`;
  try {
    const res = await axios.get(`${baseURL}/api/Orders/${id}`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

//Get All Store
export async function getAllStore() {
  const user = JSON.parse(localStorage.getItem("profile"));
  const accessToken = user.token;
  const header = `Bearer ${accessToken}`;
  try {
    const res = await axios.get(
      `https://birdtrading-api.azurewebsites.net/api/Stores`,
      {
        headers: {
          Authorization: header,
        },
      }
    );
    localStorage.setItem("storeProfile", JSON.stringify(res.data));
    return res.data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export const confirmOrder = (orderId) => {
  const user = JSON.parse(localStorage.getItem("profile"));
  const accessToken = user.token;
  const header = `Bearer ${accessToken}`;
  return axios.post(`${baseURL}/api/orders/confirm/${orderId}`, null, {
    headers: {
      Authorization: header,
    },
  });
};

/*Chart */
export const getChartStatistic = async (id) => {
  const user = JSON.parse(localStorage.getItem('profile'));
  const accessToken = user.token;
  const header = `Bearer ${accessToken}`;
  return await axios.get(`https://birdtrading-api.azurewebsites.net/api/Charts/statictical/${user.id}`, {
    headers: {
      Authorization: header,
    },
  });
};


