function createCustomer() {
  const form = document.querySelector("#bill-form");

  form.addEventListener("submit", function (e) {
    const phone = document.getElementById("phone").value;
    const name = document.getElementById("name").value;
    const amount = document.getElementById("amount").value;
    const discount = document.getElementById("discount").value;
    let cats = document.querySelector('input[name="cats"]:checked').value;
    const http = new EassyHTTP();
    const data = {
      phone: phone,
      name: name,
      amount: amount,
      discount: discount,
      category: cats,
    };

    http
      .post("/bill", data)
      .then((data) => {
        //created division

        const div = document.createElement("div");
        div.className = "alert alert-success";

        div.appendChild(document.createTextNode("Billing done!"));
        const container = document.querySelector("#bill-form");
        //container.insertBefore(div, form);
        container.after(div, form);
        //Time out after 3 sec.
        setTimeout(function () {
          //document.querySelector(".alert-success").value = "";
          document.querySelector(".alert-success").remove();

          document.getElementById("phone").value = "";
          document.getElementById("name").value = "";
          document.getElementById("amount").value = "";
          document.getElementById("discount").value = "";
        }, 3000);
      })
      .catch((err) => console.log(err));

    e.preventDefault();
  });
}

function category() {
  document.querySelector(".category").addEventListener("click", function (e) {
    const cat = document.querySelector(".category").textContent;
    return cat;
    // console.log(cat);
    //e.preventDefault();
  });
}

class EassyHTTP {
  post(url, data) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  }

  //get all
  get(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => response.json())
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  }
}

// const http = new EassyHTTP();
// const data = {
//   phone: 88383839,
//   name: "shruti",
//   amount: 78,
//   discount: 7,
// };

// http
//   .post("/bill", data)
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err));

//GET USAGE FROM

// http.get('/bill')
// .then(data => console.log(data))
// .catch((err) => console.log(err));
//require("../db/mongoose");

//const Customer = require("../models/customers");
//const Customer = require("../../models/customers");
//const db = require("../../db/mongoose");

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      //"Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
  return response.json();
}
//////////////////////////////  IN USE ////////////////////////////////////////////
const httpreq = new easyHTTP();
const catByDate = document.querySelector("#categoryByDate-form");
const searchDate = document.querySelector("input");
const datadiv = document.querySelector("#category-date");
catByDate.addEventListener("submit", async (e) => {
  e.preventDefault();
  datadiv.textContent = "Loading....";

  const date = searchDate.value;

  httpreq
    .post("http://pos.pinga.us/analytics/categoryByDate", {
      date: date,
    })
    .then((data) => {
      let ele = "";
      for (var i = 0; i < data.length; i++) {
        ele += `<tr><td>${data[i]._id.category}</td><td>${data[i].totalEarning}</td><td>${date}</td></tr>`;
      }

      datadiv.innerHTML = `<table class="table table-striped table-hover">
      <thead>
        <tr>
          <th scope="col">Category</th>
          <th scope="col">Total Earning</th>
          <th scope="col">Date</th>
        </tr>
      </thead>
      <tbody>
        ${ele}
      </tbody>
    </table>`;
    })
    .catch((err) => console.log(err));
});

/// search earning by customer

const customer_form = document.querySelector("#customer-form");
const customer_phone = document.querySelector("#phone");
const customer_div = document.querySelector("#customer");
customer_form.addEventListener("submit", async (e) => {
  e.preventDefault();
  customer_div.textContent = "Loading....";

  const phone = customer_phone.value;

  httpreq
    .post("http://pos.pinga.us/analytics/customer", {
      phone: phone,
    })
    .then((data) => {
      let ele = "";
      for (var i = 0; i < data.length; i++) {
        ele += `<tr><td>${data[i]._id.category}</td><td>${data[i].totalEarning}</td></tr>`;
      }

      customer_div.innerHTML = `<table class="table table-striped table-hover">
      <thead>
        <tr>
          <th scope="col">Category</th>
          <th scope="col">Total Earning</th>
          
        </tr>
      </thead>
      <tbody>
        ${ele}
      </tbody>
    </table>`;
    })
    .catch((err) => console.log(err));
});

/////// details by date ////////////////

const detail_date_form = document.querySelector("#detail-date-form");
const by_date = document.querySelector("#by-date");
const details_div = document.querySelector("#details");
detail_date_form.addEventListener("submit", async (e) => {
  e.preventDefault();
  details_div.textContent = "Loading....";

  const date = by_date.value;

  httpreq
    .post("http://pos.pinga.us/analytics/detailsbydate", {
      date: date,
    })
    .then((data) => {
      let ele = "";
      for (var i = 0; i < data.length; i++) {
        ele += `<tr><td>${data[i].phone}</td><td>${data[i].name}</td><td>${data[i].category}</td><td>${data[i].amount}</td><td>${data[i].discount}</td><td>${data[i].total_amount}</td></tr>`;
      }

      details_div.innerHTML = `<table class="table table-striped table-hover">
      <thead>
        <tr>
          <th scope="col">Phone</th>
          <th scope="col">Name</th>
          <th scope="col">Category</th>
          <th scope="col">Amount</th>
          <th scope="col">Discount</th>
          <th scope="col">Earning</th>
          
        </tr>
      </thead>
      <tbody>
        ${ele}
      </tbody>
    </table>`;
    })
    .catch((err) => console.log(err));
});
