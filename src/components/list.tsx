import React, {
  useState, useCallback,
} from 'react';
import {
  Table, Alert, UncontrolledAlert,
} from 'reactstrap';

import '../App.css';

import Filters from './filters';
import ReceiptDetailsModal from './receiptDetailsModal';
import type IReceipt from '../interfaces/IReceipt';

function List() {
  const [receipts, setReceipts] = useState<IReceipt[]>([]);
  const [network, setNetwork] = useState('');
  const [validateMsg, setValidateMsg] = useState('');

  // Send to filters to initialiaze data
  const getReceipts = useCallback((receiptList : IReceipt[], networkName : string) => {
    setReceipts(receiptList);
    setNetwork(networkName);
  }, []);

  // Send to receiptDetails to get validate message if exist
  const getValidateMsg = useCallback((msg) => {
    setValidateMsg(msg);
  }, []);

  return (
    <div>
      <Filters getReceiptsFromFiltersCB={getReceipts} />

      {(() => {
        if (validateMsg) {
          return (
            <UncontrolledAlert color="success" className="alert">
              {validateMsg}
            </UncontrolledAlert>
          );
        }
        return <> </>;
      })()}

      {(() => {
        if (receipts.length === 0) {
          return (
            <Alert
              className="alert"
              color="secondary"
            >
              Opps! No receipts match your selected filters. Please try again ...
            </Alert>
          );
        }

        return (
          <div className="receiptList">
            <div>
              <h3 className="itemHeader">Receipts</h3>

              <div className="valiedatedFilter">
                <h5 className="count receiptCount">
                  {`Found ${receipts.length} rceipets`}
                </h5>
                {(() => {
                  if (receipts.length && receipts[0].shop.receiptLinePattern) {
                    return (
                      <h5 className="usedPattern success">
                        {`Used Pattern : ${receipts[0].shop.receiptLinePattern} `}
                      </h5>
                    );
                  }
                  return (
                    <h5 className="usedPattern danger">No Pattern Applied</h5>
                  );
                })()}
              </div>

              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>Receipt Id</th>
                    <th>Creation Date</th>
                    <th>Files</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.map((receipt: IReceipt) => (
                    <tr key={receipt.id}>
                      <td>{receipt.id}</td>
                      <td>{receipt.dateCreation}</td>
                      <td>{receipt.originalFiles}</td>
                      <td>
                        <ReceiptDetailsModal
                          receipt={receipt}
                          shopNetwork={network}
                          getValidateMsgCB={getValidateMsg}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        );
      })()}

    </div>
  );
}

export default List;
