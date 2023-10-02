import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import getCountryIso3 from "country-iso-2-to-3";

// we will use joint function on later(called aggregate)
export const getProducts = async (req, res) => {
  try {
    // get all the products from mongodb
    const products = await Product.find();
    // get all the products with stats
    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        const stat = await ProductStat.find({
          // all product by id
          productId: product._id,
        });
        //return object of array
        return {
          // spread all the stat product info
          ...product._doc,
          // stat of that product
          stat,
        };
      })
    );
    // products with stats
    res.status(200).json(productsWithStats);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    // select('-password') will hide the password in
    // find unly to those who has role "user"
    const customers = await User.find({ role: "user" }).select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// in thsi we are doing server side pagination, sorting, searchx
export const getTransactions = async (req, res) => {
  try {
    // sort should look like this: { "field": "userId", "sort": "desc"}
    // get from the frontend-header-query
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

    // formatted sort should look like { userId: -1 }
    const generateSort = () => {
      // make the object
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
      };
      // gives sort value
      return sortFormatted;
    };
    // if sort is boolean then do sorting else nothing
    const sortFormatted = Boolean(sort) ? generateSort() : {};

    //
    const transactions = await Transaction.find({
      $or: [
        { cost: { $regex: new RegExp(search, "i") } },
        { userId: { $regex: new RegExp(search, "i") } },
      ],
    })
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);

    const total = await Transaction.countDocuments({
      name: { $regex: search, $options: "i" },
    });

    res.status(200).json({
      transactions,
      total,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getGeography = async (req, res) => {
  try {
    const users = await User.find();

    // accumulator is make object
    const mappedLocations = users.reduce((acc, { country }) => {
      // iso will change "IND" to "IN"
      const countryISO3 = getCountryIso3(country);
      if (!acc[countryISO3]) {
        // if coutry is not available make it 0
        acc[countryISO3] = 0;
      }
      acc[countryISO3]++;
      // return object of coutry iso
      return acc;
      
    }, {});

    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count };
      }
    );

    res.status(200).json(formattedLocations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
