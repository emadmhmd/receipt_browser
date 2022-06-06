import React, { useState } from 'react';
import {
  Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input,
} from 'reactstrap';

import { useFormik } from 'formik';

import { getReceiptLines, validatedPattern } from '../api';
import type IReceipt from '../interfaces/IReceipt';
import type IReceiptLine from '../interfaces/IReceiptLine';
import type IFilter from '../interfaces/IPatternFilter';

interface Props {
  receipt: IReceipt,
  shopNetwork: String,
  getValidateMsgCB: Function
}

interface EventTarget {
  value: string
}

function ReceiptDetailsModal({
  receipt, shopNetwork, getValidateMsgCB,
}: Props) {
  const [isOpen, SetIsOpen] = useState(false);
  const [receiptLines, setReceiptLines] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState('');

  async function handlePatternChange(target: EventTarget) {
    setSelectedPattern(target.value);
  }

  async function validate() {
    await validatedPattern(receipt.id, selectedPattern).then((res) => {
      getValidateMsgCB(res.data);
    });
    SetIsOpen(!isOpen);
  }

  // async function saveReceipLines() {
  //   const res = await updateReceipLines(receipt.id, selectedPattern);
  //   console.log(`update Msg : ${res.data}`);
  // }

  // async function parse() {
  //   await getReceiptLines(receipt.id, selectedPattern).then((res) => {
  //     const lines = res.data.receiptLines;
  //     setReceiptLines(lines);
  //   });
  // }

  const initialValues: IFilter = {
    oneLinePattern: '',
    twoLinePattern1: '',
    twoLinePattern2: '',
    endLinePattern: '',
  };

  const formik = useFormik({
    initialValues,
    onSubmit: async (values: IFilter) => {
      const {
        oneLinePattern, twoLinePattern1, twoLinePattern2, endLinePattern,
      } = values;
      await getReceiptLines(
        receipt.id,
        oneLinePattern,
        twoLinePattern1,
        twoLinePattern2,
        endLinePattern,
      )
        .then((res) => {
          const lines = res.data.receiptLines;
          setReceiptLines(lines);
        });
    },
  });

  return (
    <div>
      <div>
        <Button
          color="secondary"
          onClick={() => SetIsOpen(!isOpen)}
        >
          Details
        </Button>
        <Modal
          isOpen={isOpen}
          toggle={() => SetIsOpen(!isOpen)}
          scrollable
          size="xl"
          className="receiptDetails"
        >
          <ModalHeader>
            Receipt Details
          </ModalHeader>
          <ModalBody>
            <div className="modalBody">
              <div className="modalSec secOne">
                <Table className="table" striped bordered hover variant="dark">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Shop Network</th>
                      <th>Shop</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{receipt.id}</td>
                      <td>{shopNetwork}</td>
                      <td>{receipt.shop.name}</td>
                    </tr>
                  </tbody>
                </Table>
                <div className="modalImg">
                  <img className="receiptImg" src={`https://biotopia.corelia.ai/api/receipt/${receipt.id}.png`} alt="receipt-img" />
                </div>
              </div>

              <div className="modalSec secTwo">
                <div className="parseForm">
                  <form onSubmit={formik.handleSubmit}>
                    <FormGroup className="patternInput inputOne">
                      <Input
                        name="oneLinePattern"
                        placeholder="One Line Pattern"
                        type="text"
                        onChange={(e) => {
                          formik.handleChange(e);
                          handlePatternChange(e.target);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.oneLinePattern}
                      />
                    </FormGroup>
                    <FormGroup className="patternInput inputTwo">
                      <Input
                        name="twoLinePattern1"
                        placeholder="Two Line Pattern"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.twoLinePattern1}
                      />
                    </FormGroup>
                    <FormGroup className="patternInput sameHeight inputTwo">
                      <Input
                        name="twoLinePattern2"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.twoLinePattern2}
                      />
                    </FormGroup>
                    <FormGroup className="patternInput inputTwo">
                      <Input
                        name="endLinePattern"
                        type="text"
                        placeholder="End Line"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.endLinePattern}
                      />
                    </FormGroup>
                    <Button className="sameHeight inputTwo" type="submit" disabled={formik.isSubmitting}>
                      Parse
                    </Button>
                  </form>
                </div>
                <h6 className="count">
                  Ocr Text
                </h6>
                <div className="item ocrTextBox">
                  <div className="ocrTxt">
                    {!receipt.ocrText ? <p>The ocr text unavailable ...!</p> : (
                      <pre>
                        {receipt.ocrText}
                      </pre>
                    )}
                  </div>
                </div>
                <h6 className="count">
                  Product Lines
                  {' '}
                  {receiptLines.length}
                </h6>
                <div className="item productLinesBox">
                  <Table className="table" striped bordered hover variant="dark">
                    <thead>
                      <tr>
                        <th>Label</th>
                        <th>Qauntity</th>
                        <th>U.Price</th>
                        <th>T.Price</th>
                        <th>Original Label</th>
                        <th>EAN</th>

                      </tr>
                    </thead>
                    <tbody>
                      {receiptLines.map((receiptLine: IReceiptLine) => (
                        <tr key={Math.random() * 10}>
                          <td className="td">{receiptLine.label}</td>
                          <td>{receiptLine.quantity}</td>
                          <td>{receiptLine.unitPrice}</td>
                          <td>{receiptLine.totalPrice}</td>
                          <td>{receiptLine.originalLabel}</td>
                          <td>{receiptLine.ean}</td>

                        </tr>
                      ))}

                    </tbody>
                  </Table>
                </div>
              </div>

            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => { validate(); }}
            >
              Validete
            </Button>

            {/* <Button
              color="primary"
              onClick={() => { saveReceipLines(); }}
            >
              Save
            </Button> */}

            <Button onClick={() => SetIsOpen(!isOpen)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}

export default ReceiptDetailsModal;
