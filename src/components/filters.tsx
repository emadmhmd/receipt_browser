import React, { useEffect, useState } from 'react';

import { useFormik } from 'formik';
import {
  Button, FormGroup, Input, FormFeedback, Label,
} from 'reactstrap';
import * as Yup from 'yup';
import '../App.css';

import { getShopNetworks, getShopsByShopNetwork, getShopReceipts } from '../api';
import type IFilter from '../interfaces/IReceiptFilter';
import type IShopNetwork from '../interfaces/IShopNetwork';
import type IShop from '../interfaces/IShop';

interface Props {
  getReceiptsFromFiltersCB: Function;
}

interface EventTarget {
  value: string
}

function Filters({ getReceiptsFromFiltersCB }: Props) {
  const [shopNetworks, setShopNetworks] = useState([]);
  const [shops, setShops] = useState<IShop[]>([]);
  const [filterdShops, setFilterdshops] = useState<IShop[]>([]);
  const [validateFilter, setValidateFilter] = useState('unvalidated');
  const [checked, setChecked] = useState(false);

  const initialValues: IFilter = {
    shopNetworkId: '',
    shopId: '',
    from: '',
    to: '',
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await getShopNetworks();
      const shopNetworkList = res.data.shopNetworks;
      setShopNetworks(shopNetworkList);
    };

    fetchData();

    setValidateFilter('unvalidated');
  }, []);

  async function handleValiedatedFilterChange(value: string) {
    const filterValue = value;
    setValidateFilter(filterValue);
    if (filterValue === 'validated') {
      const validatedReceipts = shops
        .filter((shop: IShop) => shop.receiptLinePattern);
      return setFilterdshops(validatedReceipts);
    }
    if (filterValue === 'unvalidated') {
      const unvalidatedReceipts = shops
        .filter((shop: IShop) => !shop.receiptLinePattern);
      return setFilterdshops(unvalidatedReceipts);
    }
    return setFilterdshops(shops);
  }

  async function handleShopNetworkChange(target: EventTarget) {
    const res = await getShopsByShopNetwork(target.value);
    const shopList = res.data.shops;
    setShops(shopList);
    if (validateFilter === 'validated') {
      return setFilterdshops(shopList.filter((shop: IShop) => shop.receiptLinePattern));
    }
    if (validateFilter === 'unvalidated') {
      return setFilterdshops(shopList.filter((shop: IShop) => !shop.receiptLinePattern));
    }
    return setFilterdshops(shopList);
  }

  async function handleSortBtn(value: boolean) {
    setChecked(value);
    if (value) {
      setFilterdshops(filterdShops.sort((a, b) => Number(b.id) - Number(a.id)));
    } else {
      setFilterdshops(filterdShops.sort((a, b) => Number(a.id) - Number(b.id)));
    }
  }

  const validationSchema = Yup.object().shape({
    shopNetworkId: Yup.number().typeError('Please Select shop Network !').required('Please Select shop Network !'),
    shopId: Yup.number().typeError('Please Select shop !').required('Please Select shop !'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    // validateOnChange: false,
    // validateOnBlur: false,
    onSubmit: async (values: IFilter) => {
      const {
        shopNetworkId, shopId, from, to,
      } = values;
      const network = document.getElementById(shopNetworkId);
      const res = await getShopReceipts(shopNetworkId, shopId, from, to);
      const { receipts } = res.data;
      getReceiptsFromFiltersCB(receipts, Object(network).innerText);
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <FormGroup className="formItem">
          <Input
            type="select"
            name="valiedatedInput"
            onChange={(e) => handleValiedatedFilterChange(e.target.value)}
          >
            <option value="unvalidated">unvalidated</option>
            <option value="validated">validated</option>
            <option value="all">All</option>
          </Input>
        </FormGroup>

        <FormGroup className="formItem">
          <Input
            name="shopNetworkId"
            type="select"
            onChange={(e) => {
              formik.handleChange(e);
              handleShopNetworkChange(e.target);
            }}
            onBlur={formik.handleBlur}
            value={formik.values.shopNetworkId}
          >
            <option>Select Network</option>
            {shopNetworks.map((shopNetwork: IShopNetwork) => (
              <option
                className={shopNetwork.name}
                value={shopNetwork.id}
                id={shopNetwork.id}
                key={shopNetwork.id}
              >
                {shopNetwork.name}
              </option>
            ))}
          </Input>
          {
            formik.errors.shopNetworkId && formik.touched.shopNetworkId
              ? (<FormFeedback>{formik.errors.shopNetworkId}</FormFeedback>)
              : null
          }
        </FormGroup>

        <FormGroup className="formItem">
          <Input
            name="shopId"
            type="select"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.shopId}
          >
            <option>Select Shop</option>
            {filterdShops.map((shop: IShop) => (
              <option value={shop.id} id={shop.id} key={shop.id}>
                {shop.name}
              </option>
            ))}
          </Input>
          <Label className="label">Sort By ZIP Code</Label>
          <Input
            name="sortBtn"
            type="checkbox"
            onChange={() => handleSortBtn(!checked)}
          />
          {
            formik.errors.shopId && formik.touched.shopId
              ? (<FormFeedback>{formik.errors.shopId}</FormFeedback>)
              : null
          }
        </FormGroup>

        <FormGroup className="formItem">
          <Input
            name="from"
            placeholder="Begin date"
            type="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.from}
          />
          {
            formik.errors.from && formik.touched.from
              ? (<FormFeedback>{formik.errors.from}</FormFeedback>)
              : null
          }
        </FormGroup>

        <FormGroup className="formItem">
          <Input
            name="to"
            placeholder="End date"
            type="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.to}
          />
          {
            formik.errors.to && formik.touched.to
              ? (<FormFeedback>{formik.errors.to}</FormFeedback>)
              : null
          }
        </FormGroup>

        <Button className="formBtn" type="submit" disabled={formik.isSubmitting}>
          Search
        </Button>

      </form>
    </div>
  );
}

export default Filters;
